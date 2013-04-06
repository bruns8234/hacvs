/*************************************************************************************************************************************************************/
/** HACVS BridgeServer                                                                                                                                      **/
/**                                                                                                                                                         **/
/** Prozess-Abbild-Manager                                                                                                                                  **/
/*************************************************************************************************************************************************************/


var utils = require('./utils');
var util = require('util');


/**
 * getPAIndexOf
 *
 * Liefert zu einer bestimmten Variable den Index im Prozessabbild des Servers
 */
function getIndexOf(haystack, field, needle) {
    var result = -1;
    for(var index in haystack) {
        if (haystack[index][field] == needle) {
            result = index;
            break;
        }
    }
    return result;
}


/**
 * updatePA
 *
 * Verarbeitet die vom IPS-Server gesendeten Variablenupdates und baut damit ein eigenes Prozessabbild
 * auf, welches vom IPS-Server synchron gehalten wird. Diese Updates laufen idR. alle 2 Sekunden und
 * umfassen ein oder mehrere Variablenupdates.
 */
function updatePA(serverData, config, updateMessageList) {

    var PAsize  = serverData.variables.length;
    var updates = [];
    //utils.logMessage('PA-Manager', 'Processing ' + updateMessageList.length + ' messages');

    // Die Liste der Updates durchlaufen. Jede Update-Message ist ein Objekt mit SenderID, Value und Timestamp
    // Der Timestamp wird ignoriert und durch einen Servereigenen Zeitstempel ersetzt.
    var varTS = (new Date()).getTime();

    for(var index in updateMessageList) {
        var message = updateMessageList[index];

        //utils.logMessage('PA-Manager', 'Processing DataObject: ' + util.inspect(message));

        // Index der Variable im Prozessabbild ermitteln
        var paIndex = getIndexOf(serverData.variables, 'varID', message.SenderID);

        // Prüfen, ob diese Variable bereits im Abbild existiert
        if (paIndex == -1) {
            // Neue Variable für das Prozessabbild, Eintrag in variables anlegen
            serverData.variables.push({
                varID:      message.SenderID,
                varValue:   message.NewValue,
                lastUpdate: varTS,
                listeners:  []
            }) - 1;
        } else {
            // Variable existiert bereits im Prozessabbild
            serverData.variables[paIndex].lastUpdate = varTS;
            serverData.variables[paIndex].varValue   = message.NewValue;
            if (serverData.variables[paIndex].listeners.length > 0) {
                // paIndex in updates eintragen um anschließend alle clients in listeners über dieses Update zu informieren.
                updates.push(paIndex);
            }
        }
    }

    /**********************************************************************************************
    // Ageing des Prozessabbilds durchführen
    var now = new Date();
    var maxAge = Math.round(now.(new Date()) / 1000) - config.paMaxAge;
    for(var index in serverData.variables) {
        // Ageing nur für nicht abonierte Variablen
        if (serverData.variables[index].lastUpdate < maxAge && serverData.variables[index].listeners.length == 0) {
            serverData.variables.splice(index, 1);
        }
    }
     **********************************************************************************************/

    // Alle Clients über die durchgeführten Updates informieren
    if (updates.length > 0 ) {

        // Liste aller Update vorbereiten
        var clientUpdates = {};

        // Alle durchgeführten Updates durchlaufen und überprüfen
        for (var index in updates) {
            var paIndex = updates[index];

            if (serverData.variables[paIndex].listeners.length > 0) {
                // Diese Variable wurde aktualisiert und ist aboniert. Alle Abonenten durchlaufen und in die Updateliste übertragen
                for (var key in serverData.variables[paIndex].listeners) {

                    // Prüfen ob für diese clientID schon updates vorhanden sind. Wenn ja, dieses
                    // Update hinzufügen ansonsten diesen Client in die UpdateListe aufnehmen
                    var clientID = serverData.variables[paIndex].listeners[key];
                    var ipsID    = serverData.variables[paIndex].varID;
                    var newValue = serverData.variables[paIndex].varValue;

                    if (clientUpdates[clientID]) {
                        clientUpdates[clientID].push({varID: ipsID, varValue: newValue});
                    } else {
                        clientUpdates[clientID] = [{varID: ipsID, varValue: newValue}];
                    }
                }
            }
        }

        // Und jetzt die Updates an die Clients verteilen
        if (clientUpdates.length > 0) {
            for (var clientID in clientUpdates) {

                // Den cmdBlock 'update' erzeugen (enthält ein Array aus Objekten mit varID und varValue).
                var cmdBlock = JSON.stringify({
                    type: 'update',
                    data: clientUpdates[clientID]
                });

                // und an den Client senden
                serverData.clients[clientID].connection.send(cmdBlock);
            }
        }
    }
}


/**
 * Diese Funktion trägt einen client als Abonent der Variable varID ein
 */
function registerVariable(serverData, config, varID, clientID) {

   var paIndex = getIndexOf(serverData.variables, 'varID', varID);

    if (paIndex == -1) {
        // Variable existiert leider nicht...
        return false;
    } else {
        // Prüfen ob der client die varID evtl. bereits im Abo hat...
        if (getIndexOf(serverData.variables[paIndex], 'listeners', clientID) == -1) {
            // ClientID in das listeners-Array übernehmen
            serverData.variables[paIndex].listeners.push(clientID);
            // varID in des varlist des clients eintragen
            serverData.clients[clientID].varlist.push(varID);

            // Jetzt noch ein Update der Variable schicken
            var cmdBlock = JSON.stringify({
                type: 'update',
                data: {
                    varID:    varID,
                    varValue: serverData.variables[paIndex].varValue
                }
            });
            serverData.clients[clientID].connection.send(cmdBlock);
        }

        // Variable erfolgreich eingetragen
        return true;
    }
}


/**
 * Diese Funktion trägt einen client als Abonent der Variable varID aus
 */
function removeVariable(serverData, config, varID, clientID) {

    if (varID == '*') {
        // Sonderfall: ALLE VARIABLEN DES CLIENTS entfernen

        // Die Variablenliste aus serverData.clients.varlist durchlaufen und den Client
        // aus der jeweiligen Aboliste entfernen.
        for (var index in serverData.clients[clientID].varlist) {
            // Die varID der zu löschenden Variable holen
            var removeID = serverData.clients[clientID].varlist[index];
            // Den index des Client-Eintrags in listeners ermitteln
            var clIndex = getIndexOf(serverData.variables[removeID], 'listeners', clientID);
            // und den client aus listeners entfernen
            serverData.variables[removeID].listeners.splice(clIndex, 1);
        }
        // Nun noch die Liste der abonierten Variablen des Clients löschen und der Job ist erledigt
        serverData.clients[clientID].varlist = [];

    } else {

        // Index der Variablen im Prozessabbild besorgen
        var paIndex = getIndexOf(serverData.variables, 'varID', varID);

        // Index des Clients in listeners ermitteln
        var clIndex = getIndexOf(serverData.variables[paIndex], 'listeners', clientID);

        // Index der Variablen in varlist ermitteln
        var vaIndex = getIndexOf(serverData.clients[clientID], 'varlist', varID);

        // 1. Variable aus varlist des Clients entfernen
        serverData.clients[clientID].varlist.splice(vaIndex, 1);
        // 2. Client aus listeners der Variable entfernen
        serverData.variables[paIndex].listeners.splice(clIndex, 1);
    }
}


exports.registerVariable = registerVariable;
exports.removeVariable   = removeVariable;
exports.updatePA         = updatePA;
