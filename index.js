/*************************************************************************************************************************************************************/
/** HACVS BridgeServer                                                                                                                                      **/
/**                                                                                                                                                         **/
/** BridgeServer startup file                                                                                                                               **/
/*************************************************************************************************************************************************************/


var utils  = require('./utils');                        // Utility-Funktionen und Helpers
var server = require('./server');                       // Das Server-Modul
var router = require('./router');                       // Das Router-Modul
var requestHandlers = require('./requestHandlers');     // Die Response-Handler
var paManager = require('./paManager');                 // Prozessabbild-Manager
var config = require('./settings.json');                // Einstellparameter des BridgeServers

// Requesthandler an die URL-Pfade koppeln
var handle = {
    '/ping':    requestHandlers.ping,                   // Empfängt ein PING und antwortet mit PONG als Life-Signal
    '/update':  requestHandlers.update,                 // Empfängt JSON-kodierte Variablenupdates vom IPS-Backend
    '/getPage': requestHandlers.getPage,                // Liefert eine Terminalbescheibung aus dem PagePool des Servers
    '/*':       requestHandlers.getFile                 // Liefert beliebige Dateien aus dem filePool des Servers
};

// Objekt mit Laufzeitparametern des Servers
var serverData = {
    'clients':      [],                                 // Abonenten-Liste. Jeder Abonnent fürt eine Liste aller Variablen, die er aboniert hat.
    'variables':    [],                                 // Prozessabbild: Ein Array, welches für jede Variable ein Datenobjekt hält. Zugriff erfolgt via VARID
                                                        //   als Eigenschaft
    'paManager':    paManager,                          // Prozessabbild-Manager
    'requestID':    0                                   // Fortlaufender Zähler zum Tracen des Prozessablaufs
};

// Server starten.
server.start(serverData, config, router.route, handle, requestHandlers.wsHandle);
