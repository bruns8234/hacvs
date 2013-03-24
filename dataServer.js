/**
 * dataServer.js
 *
 * Ein Bridge-Server zur Anbindung von Browser-Visualisierungen an IP-Symcon.
 *
 */


// JS-Engine in den STRICT-Mode schalten (siehe http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
"use strict";

// Ben�tigte Module laden
var config = require('config.js');
var websocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var url = require('url');

// globales Verwaltungsobjekt f�r den Server
var serverData = {
	"clients":    [],			// Liste der verbundenen Clients. Jeder Client wird durch ein clientData-Objekt repr�sentiert.
	"variables":  [],			// Liste der Variablen des ProzessAbbilds der Bridge. Jede Variable wird durch ein VariableData-Objekt repr�sentiert.
};

/*
var variableData = {
	"varID":		0,			// ID der Variable
	"value":		null,		// Wert der Variable
	"lastUpdate":	0,			// UNIX-Zeitstempel des letzten Updates dieser Variable
	"aboClients":	[]			// Liste der Clients, die diese Variable aboniert haben (Index aus dem serverData.clients[]-Array)
};
*/

/*
var clientData = {
	"connection":	null,		// Das connection-Objekt, das die Verbindung zu diesem Client repr�sentiert.
	"variables":	[],			// Liste der Variablen, die dieser Client aboniert hat (Index aus dem serverData.variables[]-Array)
};
*/


/**
 * HTTP und WEBSOCKET server
 */


// HTTP-Server-Instanz erstellen
var httpServer = http.createServer(onHttpRequest).listen(httpServerPort);
    logMessage('HTTP', 'Server is listening on port ' + httpServerPort);


// HTTP-Server um webSocket erweitern
var wsServer = new websocketServer({
    // WebSocket-Server ist an einen HTTP-Server gebunden. WebSocket request ist nur
    // ein spezieller HTTP request. 
	// F�r mehr Informationen: http://tools.ietf.org/html/rfc6455#page-6
    httpServer: httpServer
});

function onHttpRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
	logMessage('HTTP', 'Request for ' + pathname + ' received.');

	// Request for a "sign of life"
	if (pathname === '/knockknock') {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write('Follow the white rabbit...');
		response.end();
	}
	
	if (pathname === '/
	if (request.url === '/statistics') {
		var body = 
			'<!DOCTYPE html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8">' +
			'        <title>DataServer - Statistics</title>' +
			'	</head>' +
			'	<body>' +
			'		<h1>Sorry, derzeit keine Statistik verf&uuml;gbar.</h1>'+
			'	</body>' +
			'</html>';
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();
	}
	
	if (request.url === '/frontend.js') {
		fs.readFile("./frontend.js", "binary", function(error, file) {
			if(error) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(error + "\n");
				response.end();
			} else {
				response.writeHead(200, {"Content-Type": "text/javascript"});
				response.write(file, "binary");
				response.end();
			}
		});
	} else if (request.url === '/start') {
		fs.readFile("./frontend.html", "binary", function(error, file) {
			if(error) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write('Error while opening file frontend.html.' + '\nErrormessage: ' + error + "\n");
				response.end();
			} else {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write(file, "binary");
				response.end();
			}
		});
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
		response.write('404  not found');
        response.end();
    }
}

// onWebsocketRequest:
// Diese Callback-Funktion wird immer dann aufgerufen, wenn ein Websocket ge�ffnet werden soll
wsServer.on('request', function(request) {
    console.log(getTS(new Date()) + '  Connection from origin ' + request.origin + '.');

    // Verbindung akzeptieren - Sie sollten die'request.origin' pr�fen um sicher zu sein, das
    // sich der Client wirklich auf ihrer Webseite befindet.
	// F�r mehr Informationen: http://en.wikipedia.org/wiki/Same_origin_policy
    var connection = request.accept(null, request.origin); 
	
    // Wir brauchen die ClientID (=Index im clients-Array) um beim Schlie�en der Verbindung den
	// richtigen Datensatz aus dem clients-Array zu entfernen
    var clientID = lcarsServerData.clients.push([]) - 1;
	
    console.log(getTS(new Date()) + '  Connection accepted. Known at clientID ' + clientID);

    // FrontEnd sendet ein Request
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
			// Request z�hlen
			lcarsServerData.stats.RequestsTotal++;
			// JSON-Request in Objekt umwandlen
			var request = JSON.parse(message.utf8Data);
			console.log(getTS(new Date()) + '  Request ' + request.type + ' received from client ' + clientID);
			console.log(request);
			
			// Request verarbeiten
			switch (request.type) {
				case 'reqRegisterVariable':
					// Request z�hlen
					lcarsServerData.stats.reqRegisterVariable++;
					// Request verarbeiten:
					
					// Liste der Variablen durchlaufen und clientVars sowie variables aktualsieren
					for(var i = 0; i < request.data.length; i++) {
						var varID = request.data[i];
						//registerVariable(varID);	// Die VarID ins Prozessabbild des DataServers �bernehmen
					}		
				break;
				
				case 'reqUnregisterVariable':
					// Request z�hlen
					lcarsServerData.stats.reqRegisterVariable++;
				break;
				
				case 'reqGeneralInterrogation':
					// Request z�hlen
					lcarsServerData.stats.reqGeneralInterrogation++;
				break;
				
				case 'reqAction':
					// Request z�hlen
					lcarsServerData.stats.reqAction++;
				break;
				
				case 'reqPage':
					// Request z�hlen
					lcarsServerData.stats.reqPage++;
				break;
			}
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
		console.log(getTS(new Date()) + '  Client ' + clientID + '(' + connection.remoteAddress + ') disconnected.');
        // remove user from the list of connected clients
		lcarsServerData.clients.splice(clientID, 1);
    });

});


/*

IPS LCARS-Terminals
�bersicht Datenflu�


Von Browser-FrontEnd zum DataServer (JSON, Feld "Type" = Requestcode), per Websocket:
reqRegisterVariable		- Anmelden einer oder mehrerer Variablen f�r Updates
reqUnregisterVariable	- Abmelden einer oder mehrerer Variablen vom Update
reqGeneralInterrogation	- �bertragen alle angemeldeten Variablen sofort
reqAction				- Ausf�hren einer Schalt- bzw. Bedienhandlung
reqPage					- Anfordern einer LCARS-Terminal Seitenbeschreibung

Vom DataServer zum Browser-FrontEnd (JSON, Feld "Type" = Answercode), per Websocket:
updVariable				- Aktualisierung einer angemeldeten Variablen
newPage					- Neue LCARS-Terminal Seitenbeschreibung

Vom DataServer zum IPS-BackEnd (JSON, Feld "Type" = Requestcode), URL = {Server-Adresse}/LCARS_BackEnd.php?{JSON-String}
reqRegisterVariable		- Anmelden einer oder mehrerer Variablen f�r Updates
reqUnregisterVariable	- Abmelden einer oder mehrerer Variablen vom Update
reqAction				- Ausf�hren einer Schalt- bzw. Bedienhandlung
reqPage					- Anfordern einer LCARS-Terminal Seitenbeschreibung

Vom IPS-BackEnd zum DataServer (JSON, Feld "Type" = Answercode), URL = {Server-Adresse}/LCARS_DataServer?{JSON-String}
updVariable				- Aktualsierung einer angemeldeten Variable
newPage					- Neue LCARS-Terminal Seitenbeschreibung


Insgesamt gibt es zum Datenaustausch die folgenden 7 JSON-Objekte:

reqRegisterVariable:
request = {
	"type": "reqRegisterVariable",
	"data": [#VarID, ...]
}
Ein Variablenrequest kann eine oder mehrere Variablen anfordern.
Dazu werden alle VarID's in einem Array zusammengefasst und im Feld
"VarID" �bergeben. Zuk�nftig erh�lt der Client jedes Update einer
dieser Variablenwerte. Es erfolgt KEINE SOFORTIGE �BERTRAGUNG des
aktuellen Wertes. Dies kann der Client �ber eine GA veranlassen,
wenn er alle Vorbereitungen abgeschlossen hat.
----------------------------------------------
reqUnregisterVariable:
request = {
	"type": "reqUnregisterVariable",
	"data": [#VarID, ...]
}
Eine Abbestellung von Variablen kann f�r eine einzele oder mehrere
Variablen erfolgen, in dem alle nicht mehr gew�nschten Variablen
in einem Array aufgelistet werden. Es k�nnen alternativ auch ALLE
Variablen des Clients gel�scht werden in dem als VarID eine
0 (Wert: null) �bergeben wird. Ab sofort erfolgen keine weiteren
Updates mehr an diesen Client.
----------------------------------------------
reqGeneralInterrogation:
request = {
	"type": "reqGeneralInterrogation",
	"data": ""
}
Mit diesem Request werden f�r ALLE VARIABLEN, die diese Client
aboniert, ein sofortiges Update ausgel�st.
�bermittelt dabei die in seinem Prozessabbild zwischengespeicherten
Werte der Variablen. Sollten im Prozessabbild noch Werte fehlen, so
verz�gert der Server die GA und holt alle noch ben�tigten Daten erst
vom BackEnd-Server ab.
----------------------------------------------
reqAction:
request = {
    "type": "reqAction",
	"data": {
		"mode": "runScript|setVarValue",
		"parameter": ["Parameter", ...]
	}
}
Fordert die Ausf�hrung eines Scriptes bzw. die �nderung eines
Variablenwertes an. Der DataServer reicht dieses Anforderung direkt
an den BackEnd-Server weiter, welcher sich dann um die entspechende
Aktion k�mmert. Scripte werden per IPS_RunScriptEx mit den gegebenen
Parametern aufgerufen, Variablen werden sofort geschrieben. Es gibt
keine R�ckmeldung �ber den Ausf�hrungsstatus, dies muss ggf. �ber
entsprechende Variablen erfolgen.
----------------------------------------------
reqPage:
request = {
	"type": "reqPage",
	"data": #pageID
}
Ein PageRequest wird vom DataServer mit der Client-ID erg�nzt und 
dann direkt an den BackEnd-Server weitergeleitet. Dieser liest die
geforderte Seitenbeschreibung aus der entsprechenden Datei aus und
liefert die Daten inkl. der Client-ID an den DataServer aus. Dieser
reicht die Daten, nach entfernung der Client-ID, an den anfragenden
Client weiter. Die Daten werden vom DATASERVER NICHT GECACHED.
----------------------------------------------
updVariable:
request = {
	  "type": "updVariable",
	  "data": {NewVarValue}
}
Bei jeder Variablen�nderung schickt der BackEnd-Server eine
Meldung an den DataServer, welcher seinerseits diese Nachricht
an alle Clients sendet, die die entsprechende Variable aboniert
haben.
----------------------------------------------
newPage:
request = {
	"type": "newPage",
	"data": {"pageID": #PageID,
			 "data": {PageDescriptionObject }
	}
}
Dies ist das Antwort-Telegram eines Page-Request. Es enth�lt neben der PageID nur noch ein
PageDescriptionObject. Das PDO hat die folgende Struktur:
PDO = {
	"gridSize": {"rows": #numRows, "cols": #numCols},
	"staticObjects": [{StaticObjectDescriptors}, ...],
	"dynamicObjects": [{DynamicObjectDescriptors}, ...]
}

Ein StaticObjectDesriptor beschreibt Position, Farbe und Art eines statischen LCARS-Terminal-Elements.
Es gibt insgesamt 13 statische Objekte, welche zur Strukturierung einer Terminalseite dienen:
CornerUL, WinkelUR, WinkelDL, WinkelDR:
	�berg�nge von waagerecht nach senkrecht zur Rahmenbildung in Verbindung mit Bar- und End-Elementen
	Typspezifische Parameter sind:
	"sizeU": #width		Breite des oberen �bergangs		(nur bei CornerUL, CornerUR)
	"sizeD": #width		Breite des unteten �bergangs 	(nur bei CornerDL, CornerDR)
	"sizeL": #width		Breite des linken �bergangs		(nur bei CornerUL, CornerDL)
	"sizeR": #width		Breite des rechten �bergangs	(nur bei CornerUR, CornerDR)
	
BarH, BarV: 
	Waagerechte bzw. senkrechte Balkenelemente zur Verl�ngerung von Winkel-Elementen, schlie�en
	ohne Abstand an Winkel an.
	Typspezifische Parameter sind:
	- keine -
	
EndHL, EndHR, EndVO, EndVU:
	Abschluss-Elemente, zum Optischen Abschlus von Winkel- und Bar-Elementen.
	Typspezifische Parameter sind:
	- keine -
	
TextH, TextV:
	Statische Text-Elemente, sind zur Beschriftung von Bar-Elementen und zur Ausgabe von statischen Texten
	(Hinweise, Erkl�rungen, usw.)
	Typspezifische Parameter sind:
	"size": "Header|SubHeader|Text",	// Legt die Schriftgr��e fest
	"text": "<Text>",					// Der anzuzeigene Text
	"wrap": true|false,					// Ist wrap TRUE, wird der Text umgebrochen und mehrzeilig angezeigt
	"onTop": true|false					// Ist onTop TRUE, ist #colorID Hintergrundfarbe und schwarz Schriftfarbe, bei FALSE genau umgekehrt
Image:
	Statische Bildanzeige f�r Dekozwecke.
	Typspezifische Parameter sind:
	"source": "URL"		URL des anzuzeigenden Bildes
	
Jeder SOD besitzt die folgende Stuktur:
SOD = {
	"position": {"col": #posX, "row": #posY},
	"size": {"width": #breite, "height": #h�he},
	"color": #colorIndex,
	"type": "CornerUL|CornerUR|CornerDL|CornerDR|BarH|BarV|EndHL|EndHR|EndVU|EndVD|TextH|TextV",
	"data": {<Typspezifische Parameter>}
}

Ein DynamicObjectDescriptor beschreibt Position, Farbe und Art eines interaktiven LCARS-Terminal-Elements.
Es gibt insgesamt 7 dynamische Objekte, welche Funktion und R�ckmeldung der LCARS-Terminals bilden:
Button
	Ein Waagerechter Balken mit Endkappen auf beiden Seiten, Platz f�r Beschriftung ist in der Mitte.
	Beim Anklicken erfolgt eine akustische R�ckmeldung an den User und ein ActionRequest an den DataServer.
	Als optisches Feedback leuchtet der Button bei Ber�hrung auf. Ein Button kann Enabeld oder Disabled sein,
	dieser Status kann per Variable (boolean oder integer) gesteuert werden.
Key
	Ein Key ist funktionell identisch mit einem Button, aber er besitzt keine Endkappen und ist zur Integration
	in die Rahmenstukturen gedacht.
Switch
	Ein Switch ist optisch identisch mit einem Button. Funktional jedoch kennt er zwei Zust�nde, Ein und Aus,
	welche durch aufleuchten bzw. abdimmen des Button signalisiert werden und von einer bool- oder int-Variable
	gesteuert werden. Bei Ber�hrung des Switches wird ein entsprechender ActionRequest erzeugt, d.h. ist der
	Button Aus wird ein EIN-Request erzeugt und umgekehrt. Die Bedienfunktion kann per Parameter oder Variable
	(boolean oder integer) freigegeben oder gesperrt werden.
Value
	Ein Value ist eine Anzeigeobjekt f�r Texte, Messwerte usw. Es wird mit einer Variable verkn�pft und zeigt
	deren Wert an. Dabei kann eine Formatvorlage zur Aufbereitung des Variablenwertes programmiert werden.
List
	Eine List zeigt mehrere Datens�tze untereinander an. Sie erm�glicht das automatische und das manuelle
	Scrollen durch die Liste (beides per Parameter ein- und ausschaltbar). Als Datenquelle dient eine Variable,
	welche entweder alle Listenwerte als JSON-Array enth�lt oder immer einen aktuellen Wert liefert, wobei dann
	die Liste automatisch eine parametrierbare Anzahl von Eintr�gen vorh�lt. Eine Liste hat (au�er der Scroll-
	Funktion) keine interaktiven Funktionen.
Select
	Ein Select sieht optisch einer Liste sehr �hnlich. Ein Select stellt eine fest vorgegebene Menge von Werten
	in einer Liste dar und l�sst den User ein oder mehrere (wird per Parameter festgelegt) Eintr�ge aussuchen.
	Zum Senden der Auswahl muss ein Button oder ein Key programmiert werden, welcher die Auswahl dann als
	Parameter im ActionRequest versendet.
Map
	Eine Map ist eine Grafik, welche ber�hrungssentitive Bereiche besitzt. Auf Grund der Rasterstucktur des
	LCARS-Terminals ist die Aufl�sung der Sensitiven Bereiche auf diese Rasterfl�chen begrenzt. Es k�nnen maximal
	99 unterschiedliche sensitive Zonen definiert werden (per RasterMatrix). Bei Ber�hrung einer dieser Fl�chen
	leuchtet die gesamte Fl�che auf und ein ActionRequest mit entsprechendem Parameterwert wird abgeschickt.
	
Ein DOD besitzt die folgende Stuktur:
DOD = {
	"position": {"col": #posX, "row": #posY},
	"size": {"width": #breite, "height": #h�he},
	"color": #colorIndex,
	"type": "Button|Key|Switch|Value|List|Select|Map",
	"data": {<Typspezifische Parameter>},
	"source": {<Typspezifische Quellparameter (VarID usw.)>},
	"action": {<Typspezifische Actionparameter>}
}

*/