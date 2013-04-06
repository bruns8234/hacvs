/*************************************************************************************************************************************************************/
/**                                                                                                                                                         **/
/** DataManager-Klasse                                                                                                                                      **/
/**                                                                                                                                                         **/
/*************************************************************************************************************************************************************/
function DataManager() {
    var self = this;


    /*********************************************************************************************************************************************************/
    /** Private Eigenschaften von DataManager                                                                                                               **/
    /*********************************************************************************************************************************************************/

    ws              = null;     // Nimmt das WebSocket-Objekt auf, über das mit der Bridge kommuniziert wird
    wsReady         = false;    // Status derWebSocket-Verbindung (True = Verbindung bereit zur Datenübertragung)
    terminalReady   = false;    // Status des Terminals (True = Terminal bereit für Updates usw., wird bei Seitenwechsel auf Fale gesetzt)
    processImage    = {};       // In dieser Struktur werden alle benötigten Variablen hinterlegt
                                // Jedes Element in processImage ist ein Objekt mit den folgenden Elementen:
                                //   varID        integer            Die IPS-ID der Variable
                                //   elements    array(string)    Die ID aller Elemente, die diese Variable anzeigen (1 oder mehr)
                                //   value        mixed            Der aktuelle Wert dieser Variable
                                // Die Elemente werden in Eigenschaften mit dem Wert von varID, mit vorangestelltem 'VAR_' abgelegt.
    mainObject      = null;     // Ref. auf das HACVS-Objekt

    /*********************************************************************************************************************************************************/
    /** Private Methoden von DataManager                                                                                                                    **/
    /*********************************************************************************************************************************************************/

    /**
    @description    Sendet einen cmdBlock an den BridgeServer
    @param          {object}            message             CMD-Objekt das an den BridgeServer gesendet werden soll {type, parameter}

    @return         {boolean}           True wenn die Nachricht abgeschickt wurde, sonst False
    **/
    function sendMessage (message) {
        var returnValue = false;

        // Prüfen ob die Verbindung bereit ist...
        if (wsReady && ws.readyState == 1) {
            ws.send(message);
            returnValue = true;
        }

        return returnValue;
    }


    /*********************************************************************************************************************************************************/
    /** Öffentliche Methoden von PictureManager                                                                                                             **/
    /*********************************************************************************************************************************************************/

    /**
    @description    Initialisiert die WebSocket-Verbindung zum BridgeServer. Nach dem Herstellen der Verbindung wird wsReady gesetzt und
                    das onConnect-Event ausgelöst. Wird die Verbindung getrennt, wird das onDisconnect-Event ausgelöst.
    @param          {object}            hacvsInstance       Referenz auf die HACVS-Instanz, für die dieses Prozessabbild geführt wird.
    @param          {string}            server              Hostname oder IP-Adresse des BridgeServers.
    @param          {number}            [port=1337]         Portnummer des BridgeServers.
    @param          {function}          [onConnect]         Funktion die bei Verbindungsaufbau aufgerufen wird.
    @param          {function}          [onDisconnect]      Funktion die bei Verlust einer bestehenden Verbindung aufgerufen wird.
    @param          {function}          [onError]           Funktion die bei Fehler während des Verbindungsaufbaus aufgerufen wird.
    @param          {function}          [onClose]           Funktion die bei Beendigung der Verbindung aufgerufen wird.
    **/
    this.init = function (hacvsInstance, server, port, onConnect, onDisconnect, onError, onClose) {

        console.log('Initialising DataManager...');

        // Verbindungsaufbau zum Server initialisieren und Eventhandler installieren
        var serverAddress = 'ws://' + server + ':' + port;
        ws = new WebSocket(serverAddress);
        console.log('Opening WebSocket-Connection...');

        // hacvsInstance im DataManager speichern
        mainObject = hacvsInstance;

        // Eventhandler für Verbindungsbereitschaft einrichten
        ws.onopen = function(e) {
            console.log('WebSocket-Connection ready to use...');
            wsReady = true;
            if (onConnect) {
                console.log('  Fire onConnect-Event');
                onConnect();
            }
        };

        // Eventhandler für Verbindungsfehler einrichten
        ws.onerror = function(e) {
            // Abhängig von wsReady entweder auf Fehler bei Herstellung der Verbindung (102) oder
            // auf Abbruch der Verbindung (103) springen.
            if (wsReady) {
                console.log('Error: Connection to WebSocket-Server lost!');
                wsReady = false;
                if (onDisconnect !== undefined) {
                    onDisconnect();
                }
            } else {
                console.log('Error: Could not establish connection to WebSocket-Server!');
                wsReady = false;
                if (onError !== undefined) {
                    onError(e);
                }
            }
        };

        // Eventhandler für Verbindungsende einrichten
        ws.onclose = function(e) {
            console.log('Connection to WebSocket-Server closed.');
            wsReady = false;
            if (onClose) {
                onClose();
            }
        };

        // Eventhandler für Datenempfang einrichten
        ws.onmessage = function(e) {
            console.log('RECEIVED MESSAGE FROM WEBSOCKET-SERVER: ' + e.data);

            // Die Ankommende Nachricht parsen
            var message = JSON.parse(e.data)

            // Je nach Nachrichtentyp entsprechende Aktion aufrufen:
            switch (message.type.toLowerCase()) {
            case 'update': // Data enthält ein Array aus Objekten mit den Eigenschaften varID (IPS-ID der Variablen) und varValue (dem neuen Wert)
                // Das Array mit allen Updates durchlaufen und diese Variable für Variable abarbeiten
                for (var index in message.data) {
                    var newValue = message.data[index].varValue;
                    var paKey    = 'var_' + message.data[index].varID;

                    // Den neuen Wert im Prozessabbild speichern
                    self.processImage[paKey].varValue = newValue;

                    // und dann die Abonenten mit dem neuen Wert versorgen
                    for (var key in processImage[paKey].elements) {
                        self.processImage[paKey].elements[key](newValue, self.mainObject.addAction);
                    }
                }
                break;
            default:
                console.log('UNKNOWN MESSAGE-TYPE RECEIVED: ' + message.type.toUpperCase());
                break;
            }
        };
    };


    /**
    @description    Registriert die Update-Funktion eines Elements als Abonnent einer Variable.
    @param          {number}            varID               Die IP-Symcon-ID der benötigten Variable
    @param          {function}          doUpdate            Ref. auf die Funktion, die ein Wert-Update durchführt. Bei einer Änderung der Variable wird diese
                                                            Funktion mit dem neuen Wert als Parameter aufgerufen "doUpdate(newValue)".
    **/
    this.registerVariable = function (varID, doUpdate) {

        var paKey = 'var_' + varID;

        if (_.contains(processImage, paKey)) {
            // Diese Variable wurde bereits aboniert, neuen Abonenten hinzufügen
            processImage[paKey].elements.push(doUpdate);

        } else {
            // Eine neue Variable wurde angefordert

            // Schritt 1: Neuen Eintrag in processImage anlegen
            processImage[paKey] = {
                varID:        varID,            // Die IPS-ID der Variablen
                elements:    [doUpdate],        // Diese Variable hat bisher einen Abonenten
                varValue:    null               // Der aktuelle Wert ist noch nicht bekannt
            };
            // Schritt 2: Die Variable beim Bridge-Server abonieren

            // command-Block erzeugen
            var cmd = JSON.stringify({
                type:    'start',
                data:    varID
            });

            // und an den BridgeServer senden
            sendMessage(cmd);
        }
    };


    /**
    @description    Liefert den Wert einer bestimmten Variable aus dem Prozessabbild
    @param          {number}            varID               Die IP-Symcon-ID der benötigten Variable

    @return         {mixed}             Der Inhalt der angeforderten Variable aus dem Prozessabbild.
    **/
    this.getValue = function (varID) {

        return processImage['var_' + varID].varValue;

    };


    /**
    @description    Lösche ALLE Einträge im processImage und storniert ALLE Abo's beim BridgeServer. Wird im Regelfall beim Laden eines neuen Terminal
                    aufgerufen
    **/
    this.clearImage = function () {

        if (processImage.length > 0) {

            // Das interne Prozessabbild des DataManagers löschen
            processImage =  {};

            // command-Block zur Stornierung aller Abo's beim BridgeServer erzeugen
            var cmd = JSON.stringify({
                type:        'stop',
                parameter:    '*'
            });

            // und an den BridgeServer senden
            sendMessage(cmd);
        }
    };


    /**
    @description    Sendet die Anforderung zum Starten eines Skripts an den BridgeServer
    @param          {number}            scriptID            Die IP-Symcon-ID des auszuführenden Scripts
    @param          {object}            parameter           Die Script-Parameter in Objekt-Form (key:value Paare)
    **/
    this.executeScript = function (scriptID, parameter) {

        // command-Block erzeugen
        var cmd = JSON.stringify({
            type:        'exec',
            parameter:    parameter
        });

        // und an den BridgeServer senden
        sendMessage(cmd);
    };
}

/* EOF */