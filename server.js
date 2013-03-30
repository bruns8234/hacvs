/*************************************************************************************************************************************************************/
/** HACVS BridgeServer                                                                                                                                      **/
/**                                                                                                                                                         **/
/** BridgeServer                                                                                                                                            **/
/*************************************************************************************************************************************************************/


var utils           = require('./utils');
var http            = require('http');
var websocketServer = require('websocket').server;
var url             = require('url');
var util            = require('util');
requestID = 1;

function start(serverData, config, route, handle, wsHandle) {

    function onHttpRequest(request, response) {
        var requestID = serverData.requestID++;
        var postData  = '';
        var pathname  = url.parse(request.url).pathname;
        var clientIP  = request.connection.remoteAddress;
        utils.logMessage('HTTP', 'Request ' + requestID + ' from ' + request.connection.remoteAddress + ' for ' + pathname + ' received.');

        request.setEncoding('utf8');
        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
        });
    
        request.addListener('end', function() {
            route(requestID, serverData, config, handle, clientIP, pathname, response, request, postData);
        });
    }

    function originIsAllowed(origin) {
        // Hier Logig zur prüfung der Anfragequelle einfügen
        return true;
    }
    
    function onWsRequest(request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            utils.logMessage('WEBSOCKET', 'Connection request from origin ' + request.origin + ' rejected.');
            return;
        }
        
        var connection = request.accept(null, request.origin);
        var clientID   = serverData.clients.push({connection: connection, varlist: []}) - 1;
        utils.logMessage('WEBSOCKET', 'Connection accepted. ClientID: ' + clientID);
        
        connection.addListener('message', function(message) {
            if (message.type === 'utf8') {
                var request = JSON.parse(message.utf8Data);
                wsHandle(serverData, config, clientID, request);
            }
        });
        
        connection.addListener('close', function(connection) {
            utils.logMessage('WEBSOCKET', 'Client ' + clientID + '(' + connection.remoteAddress + ') disconnected.');
            // remove user from the list of connected clients
            serverData.clients.splice(clientID, 1);
        });
    }
    
    var httpServer = http.createServer(onHttpRequest).listen(config.serverPort);
    utils.logMessage('HTTP', 'HTTP-Server has started and is listening on port ' + config.serverPort);
  
    // HTTP-Server mit einem WebSocket-Interface erweitern
    var wsServer = new websocketServer({ httpServer: httpServer, disableNagleAlgorithm: false }).on('request', onWsRequest);
    utils.logMessage('WEBSOCKET', 'HTTP-Server mit WebSocket-Interface erweitert.');
}

exports.start = start;