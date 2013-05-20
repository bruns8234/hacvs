/*************************************************************************************************************************************************************/
/** HACVS BridgeServer                                                                                                                                      **/
/**                                                                                                                                                         **/
/** Router                                                                                                                                                  **/
/*************************************************************************************************************************************************************/


var utils  = require('./utils');                        // Utility-Funktionen und Helpers
var util   = require('util');

function route(requestID, serverData, config, handle, clientIP, pathname, response, request, postData) {
    
    if (typeof handle[pathname] === 'function') {
        // Functional request
        //utils.logMessage('ROUTER', 'Using handler ' + pathname + ' to process request #' + requestID);
        handle[pathname](requestID, serverData, config, clientIP, response, request, postData);
    } else {
        // Request for file of filepool...
        //utils.logMessage('ROUTER', 'Using file handler to process request #' + requestID);
        handle['/*'](requestID, serverData, config, clientIP, pathname, response, request, postData);
    }
}

exports.route = route;