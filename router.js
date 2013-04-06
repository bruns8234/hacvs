/*************************************************************************************************************************************************************/
/** HACVS BridgeServer                                                                                                                                      **/
/**                                                                                                                                                         **/
/** Router                                                                                                                                                  **/
/*************************************************************************************************************************************************************/


var utils  = require("./utils");                        // Utility-Funktionen und Helpers

function route(requestID, serverData, config, handle, clientIP, pathname, response, request, postData) {

  if (typeof handle[pathname] === 'function') {
    utils.logMessage('ROUTER', 'Handler for request ' + requestID + ' found.');
    handle[pathname](requestID, serverData, config, clientIP, response, request, postData);
  } else {
    // Request for file of filepool...
    utils.logMessage('ROUTER', 'Handling request ' + requestID + ' as file request.');
    handle['/*'](requestID, serverData, config, clientIP, pathname, response, request, postData);
  }
}

exports.route = route;