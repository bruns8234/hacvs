/**
 * logMessage
 *
 * Erzeugt eine Log-Message mit Zeitstempel
 */

function logMessage(part, message) {

    // Zeitstempel erzeugen
    var dt = new Date();
    var TSstring =
        (dt.getDate()<10?'0':'') + dt.getDate() + '.' + ((dt.getMonth()+1)<10?'0':'') + (dt.getMonth()+1) + '.' + dt.getFullYear() + ' ' +
        (dt.getHours()<10?'0':'') + dt.getHours() + ':' + (dt.getMinutes()<10?'0':'') + dt.getMinutes() + ':' +
        (dt.getSeconds()<10?'0':'') + dt.getSeconds();

    // Nachricht auf der console ausgeben
    console.log(TSstring + ' [' + part + '] ' + message);
}

function TDateTimeToTimestamp(ts) {

    return Math.round( (ts - 25569) * 86400);
}

// Export modul functions
exports.logMessage            = logMessage;
exports.TDateTimeToTimestamp  = TDateTimeToTimestamp;