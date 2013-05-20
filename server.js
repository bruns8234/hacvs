/*************************************************************************************************************************************************************/
/** HACVS BridgeServer                                                                                                                                      **/
/**                                                                                                                                                         **/
/** BridgeServer                                                                                                                                            **/
/*************************************************************************************************************************************************************/


var utils           = require('./utils');
var http            = require('http');
var https           = require('https');
var websocketServer = require('websocket').server;
var url             = require('url');
var util            = require('util');
    requestID       = 1;

function start(serverData, config, route, handle, wsHandle) {

    function onHttpRequest(request, response) {
        var requestID = serverData.requestID++;
        var postData  = '';
        var pathname  = url.parse(request.url).pathname;
        var clientIP  = request.connection.remoteAddress;
        //utils.logMessage('HTTP', 'Request ' + requestID + ' from ' + request.connection.remoteAddress + ' for ' + pathname + ' received.');

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
        utils.logMessage('WEBSOCKET', 'Connection request from origin ' + request.origin + ' accepted. Assigned ClientID: ' + clientID);

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

    // HTTP oder HTTPS-Server starten und Websocket-Interface hinzufügen
    if (config.server.SSL) {
        var theServer = https.createServer(onHttpRequest).listen(config.server.port);
        utils.logMessage('WEBSERVER', 'HTTPS-Server has started and is listening on port ' + config.server.port);
    } else {     
        var theServer = http.createServer(onHttpRequest).listen(config.server.port);
        utils.logMessage('WEBSERVER', 'HTTP-Server has started and is listening on port ' + config.server.port);
    }
    
    // Webserver mit einem WebSocket-Interface erweitern
    var wsServer = new websocketServer({ httpServer: theServer, disableNagleAlgorithm: false }).on('request', onWsRequest);
    utils.logMessage('WEBSOCKET', 'Webserver extended with WebSocket-Interface.');
    
    utils.logMessage('WEBSERVER', 'Registering BridgeServer at BridgeLink...');

    // Und zum Schluss noch die Bridge beim IPS-Server registriere.
    var data = JSON.stringify({
        'action':   'registerBridge',
        'host':     config.server.address,
        'port':     config.server.port,
        'ssl':      config.server.SSL,
        'userAuth': config.server.userAuth,
        'user':     config.server.username,
        'pass':     config.server.password
    });
    var options = {
        hostname:   config.link.address,
        port:       config.link.port,
        path:       '/BridgeLink.ips.php?' + data,
        method:     'GET'
    };
       
    if (config.server.SSL) {
        var request = https.get(options, function(result) {
            if (res.statusCode === 200) {
                utils.logMessage('WEBSERVER', '  Registration successfull.');
            } else {
                utils.logMessage('WEBSERVER', '  Registration failed. BridgeLink status: ' + res.statusCode);
            }
        }).on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
    } else {
        var request = http.get(options, function(res) {
            if (res.statusCode === 200) {
                utils.logMessage('WEBSERVER', '  Registration successfull.');
            } else {
                utils.logMessage('WEBSERVER', '  Registration failed. BridgeLink status: ' + res.statusCode);
            }
        }).on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
    }
}

exports.start = start;