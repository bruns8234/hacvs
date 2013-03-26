var utils  = require("./utils");						// Utility-Funktionen und Helpers
var server = require("./server");						// Das Server-Modul
var router = require("./router");						// Das Router-Modul
var requestHandlers = require("./requestHandlers");		// Die Response-Handler
var paManager = require("./paManager");					// Prozessabbild-Manager

// Requesthandler an die URL-Pfade koppeln
var handle = {
	'/ping':	requestHandlers.ping,					// Empfängt ein PING und antwortet mit PONG als Life-Signal
	'/update':	requestHandlers.update,					// Empfängt JSON-kodierte Variablenupdates vom IPS-Backend
	'/getPage':	requestHandlers.getPage,				// Liefert eine Terminalbescheibung aus dem PagePool des Servers
	'/*':		requestHandlers.getFile					// Liefert beliebige Dateien aus dem filePool des Servers
};

// Objekt mit Parametern des Servers
var config = {
	'processName':	'dataServer',		// Name des node-Prozesses
	'serverPort':	1337,				// Port auf dem alle Verbindungen des Bridge-Servers laufen
	'filePool':		'./filepool',		// Pfad zum Dateipool des Servers
	'pagePool':		'./pagepool',		// Pfad zum Pagepool des Servers
	'startFile':	'/start.html',		// Name der Datei, die ein / oder ein /start-Request liefert.
	'paMaxAge':		345600,				// Maximal zulässiges Alter (96h) eines Variablenwert im Prozessabbild. Ältere Werte werden gelöscht
	'updateVarID':	39859,				// VarID der Variable, die das VarUpdate-Script zur speicherung des Zeitstempels verwendet.
										// Sie wird automatisch im Prozessabbild gefiltert.
	'execScript':	'HVACCommand',		// Name des Execution-Scripts auf dem IPS-Server 
	'IPSAddress':	'',					// Name oder IP-Adresse des IPS-Webservers
	'IPSPort':		0,					// Portnummer des IPS-Webservers
	'useSSL':		false				// True wenn der IPS-Webserver per HTTPS angesprochen wird
};

// Objekt mit Laufzeitparametern des Servers
var serverData = {
	'clients':		[],					// Abonenten-Liste. Jeder Abonnent fürt eine Liste aller Variablen, die er aboniert hat.
	'variables':	[],					// Prozessabbild: Ein Array, welches für jede Variable ein Datenobjekt hält. Zugriff erfolgt via VARID als Eigenschaft
	'paManager':	paManager,			// Prozessabbild-Manager
    'requestID':    0                   // Fortlaufender Zähler zum Tracen des Prozessablaufs
};

// Server starten.
server.start(serverData, config, router.route, handle, requestHandlers.wsHandle);
