var url			= require('url'),
	querystring	= require('querystring'),
	fs			= require('fs'),
	mime		= require('mime'),
    hash_file   = require('hash_file'),
	util		= require('util');
	utils		= require('./utils');

// Liefert eine Pagebeschreibung aus dem pagepool des Servers an den Aufrufer zurück
function getPage(requestID, serverData, config, clientIP, response, request, postData) {

	// Isolate page number url (page number must follow the questionmark in url as: http://bridgeserver/getPage?1058 which calls for page 1058)
	var pageName      = url.parse(request.url).query;
	var sourceFile    = config.pagePool + '/' + pageName + '.js';
	var sourceExist   = false;
	var sourceStats   = null;
	var compiledFile  = config.pagePool + '/' + pageName + '.json';
	var compiledExist = false;
	var compiledStats = null;

	utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + ' for Page "' + pageName + '" received.\nSource file is...: ' + sourceFile + '\nCompiled file is.: ' + compiledFile);
	// Prüfen ob Quelldatei (.js) und/oder Kompilat (.json) existieren
	sourceExist   = fs.existsSync(sourceFile);
	compiledExist = fs.existsSync(compiledFile);
	
	// Für existierende Dateien das Änderungsdatum ermitteln
	if (sourceExist)   { sourceStats   = fs.statSync(sourceFile); }
	if (compiledExist) { compiledStats = fs.statSync(compiledFile); }
	
	// Weiteres Vorgehen hängt je nach dem welche Dateien vorhanden / wie alt sind...
	if (sourceExist && !compiledExist) {		// Fall 1: Quelle vorhanden, Kompilat nicht...

		// Quelle kompilieren:
		utils.logMessage('HTTP', '[' + clientIP + '] No compiled version found. Compiling source and sending...');
		// Inhalt der Datei laden und dann via eval ausführen. Wir erhalten eine Variable 'page' welche die komplette Seitenbescheibung beinhaltet.
		var content = fs.readFileSync(sourceFile, 'utf8');
		eval(content);
		
		// Jetzt das in 'page' liegende Objekt in einen JSON-string umwandlen und in 'resultFile' speichern... fertig.
		var JSONpage = JSON.stringify(page);
		fs.writeFileSync(compiledFile, JSONpage);
		
		// Kompilat an Client übertragen
		utils.logMessage('HTTP', '[' + clientIP + '] Sending description file for page "' + pageName + '" upon request ' + requestID + ' to client...');
		fs.readFile(compiledFile, 'binary', function(error, file) {
			if (error) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(error + '\n');
				response.end();
				utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '", request ' + requestID + ', not send to client - internal error 500 encountered');
				utils.logMessage('HTTP', 'Error 500 Messge: ' + error);
			} else {
				response.writeHead(200, {"Content-Type": "application/json"});
				response.write(file, 'binary');
				response.end();
				//utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '" send');
			}
		});
	}
	if (!sourceExist && compiledExist) {		// Fall 2: Quelle nicht vorhanden, Kompilat ist vorhanden...
		utils.logMessage('HTTP', '[' + clientIP + '] No source found. Sending existing compiled version...');
		// Kompilat an Client übertragen
		//utils.logMessage('HTTP', '[' + clientIP + '] Sending description file for page "' + pageName + '" to client...');
		fs.readFile(compiledFile, 'binary', function(error, file) {
			if (error) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(error + '\n');
				response.end();
				utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '", request ' + requestID + ', not send to client - internal error 500 encountered');
				utils.logMessage('HTTP', 'Error 500 Messge: ' + error);
			} else {
				response.writeHead(200, {"Content-Type": "application/json"});
				response.write(file, 'binary');
				response.end();
				//utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '" send');
			}
		});
	}
	if (sourceExist && compiledExist) {			// Fall 3: Quelle und Kompilat vorhanden
		var modSource   = sourceStats.mtime.getTime();
		var modCompiled = compiledStats.mtime.getTime();
		if (modSource > modCompiled) {			// Fall 3a: Quelle neuer als Kompilat
			// Quelle kompilieren
			utils.logMessage('HTTP', '[' + clientIP + '] Compiled version is out of date. Compiling source and sending...');
			// Inhalt der Datei laden und dann via eval ausführen. Wir erhalten eine Variable 'page' welche die komplette Seitenbescheibung beinhaltet.
			var content = fs.readFileSync(sourceFile, 'utf8');
			eval(content);
			
			// Jetzt das in 'page' liegende Objekt in einen JSON-string umwandlen und in 'resultFile' speichern... fertig.
			var JSONpage = JSON.stringify(page);
			fs.writeFileSync(compiledFile, JSONpage);
			
			// Kompilat an Client übertragen
			//utils.logMessage('HTTP', '[' + clientIP + '] Sending description file for page "' + pageName + '" to client...');
			fs.readFile(compiledFile, 'binary', function(error, file) {
				if (error) {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(error + '\n');
					response.end();
                    utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '", request ' + requestID + ', not send to client - internal error 500 encountered');
					utils.logMessage('HTTP', 'Error 500 Messge: ' + error);
				} else {
					response.writeHead(200, {"Content-Type": "application/json"});
					response.write(file, 'binary');
					response.end();
					//utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '" send');
				}
			});
		} else {								// Fall 3b: Quelle gleich alt oder älter als Kompilat
			//utils.logMessage('HTTP', '[' + clientIP + '] Compiled version is up to date...');
			// Kompilat an Client übertragen
			//utils.logMessage('HTTP', '[' + clientIP + '] Sending description file for page "' + pageName + '" to client...');
			fs.readFile(compiledFile, 'binary', function(error, file) {
				if (error) {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(error + '\n');
					response.end();
                    utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '", request ' + requestID + ', not send to client - internal error 500 encountered');
					utils.logMessage('HTTP', 'Error 500 Messge: ' + error);
				} else {
					response.writeHead(200, {"Content-Type": "application/json"});
					response.write(file, 'binary');
					response.end();
					utils.logMessage('HTTP', '[' + clientIP + '] Page "' + pageName + '" send');
				}
			});
		}
	}
	if (!(sourceExist || compiledExist)) {		// Fall 4: Weder Quelle noch Kompilat existieren
		// Fehler 404 an Client melden
		utils.logMessage('HTTP', '[' + clientIP + '] No source or compiled version for request ' + requestID + ' found - page "' + pageName + '" does not exist');
		fs.exists('error404.html', function(result) {
			if (result) {
				// File 'error404.html' exist. Read and send to client as error-page
				fs.readFile('error404.html', 'binary', function(error, file) {
					if (error) {
						// Error reading the file, send simple plaintext 404-error-message
						response.writeHead(404, {"Content-Type": "text/plain"});
						response.write('\nFailure 404: File ' + sourceFile + ' not found');
						response.end();
					} else {
						response.writeHead(404, {"Content-Type": "text/html"});
						response.write(file, 'binary');
						response.end();
					}
				});
			} else {
				// No 'error404.html' exist. Send simple plaintext 404-error-message
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write('\nFailure 404: File ' + sourceFile + ' not found');
				response.end();
			}
		});
	}
}

// Liefert eine Datei aus dem filepool des Servers an den Aufrufer zurück
function getFile(requestID, serverData, config, clientIP, pathname, response, request, postData) {

	var filePath = pathname;
	if (filePath == '/')
		filePath = config.startFile;
		
	var fullFilePath = config.filePool + filePath;
	
	fs.exists(fullFilePath, function(result) {
	
		if (result) {
			// File exists, check if cached version can be used. Than act accordingly.
            var fsStat             = (fs.statSync(fullFilePath));
            var serverChangeString = fsStat.mtime.toUTCString();
            var serverChangeTime   = fsStat.mtime.getTime();
            var clientCacheTime    = null;
            var clientAgeLimit     = null;
            var clientETagValue    = null;
            var resendCheckMethod  = 'NONE';
            var now                = (new Date()).getTime();
                
            // Check for "if-none-match" header
            if (request.headers['if-none-match']) {
                clientETagValue = request.headers['if-none-match'];
            }
            // Check for "if-modified-since" header
            if (request.headers['if-modified-since']) {
                clientCacheTime = Date.parse(request.headers['if-modified-since']);
            }
            
            // Check for "cache-control" header
            if (request.headers['cache-control']) {
                var parts = request.headers['cache-control'].split('=');
                switch (parts[0]) {
                case 'max-age': // Client limit max age to {parts[1]} seconds.
                    clientAgeLimit = now - (parseInt(parts[1]) * 1000);
                    break;
                }
            }

            utils.logMessage('HTTP', '[' + clientIP + '] Request: ' + requestID + '  ETag: ' + clientETagValue + '  Cache: ' + clientCacheTime + '  Age: ' + clientAgeLimit);

            if (clientETagValue) {
                resendCheckMethod = 'ETAG';
            } else {
                if (clientCacheTime) {
                    resendCheckMethod = 'TIMESTAMP';
                } else {
                    if (clientAgeLimit) {
                        resendCheckMethod = 'AGE';
                    }
                }
            }
            utils.logMessage('HTTP', '[' + clientIP + '] Request: ' + requestID + '  Using method ' + resendCheckMethod + ' to check...');

            // Ident mimetype and send file...
            var mimetype = mime.lookup(fullFilePath);
            // Calculate sha1-hash for ETag header
            hash_file(fullFilePath, 'sha1', function(error, hash) {
                if (error) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(error + '\n');
                    response.end();
                    utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + ' File ' + fullFilePath + ' (mimetype: ' + mimetype + ') not send to client - internal error 500 encountered');
                    utils.logMessage('HTTP', 'Error 500 Messge: ' + error);
                } else {
                    var resendFile = true;
                    switch (resendCheckMethod) {
                    case 'ETAG':
                        utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + ' Check: file=' + fullFilePath + ' client-ETag=' + clientETagValue + ' === server-ETag=' + ('"' + hash + '"'));
                        if (clientETagValue === ('"' + hash + '"')) {
                            resendFile = false;
                        }
                        break;
                    case 'TIMESTAMP':
                        utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + ' Check: file=' + fullFilePath + ' client-CacheTime=' + clientCacheTime + ' <= server-ChangeTime=' + serverChangeTime);
                        if (serverChangeTime <= clientCacheTime) {
                            resendFile = false;
                        }
                        break;
                    case 'AGE':
                        utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + ' Check: file=' + fullFilePath + ' server-ChangeTime=' + clientCacheTime + ' >= client-AgeLimit=' + clientAgeLimit);
                        if (serverChangeTime >= clientAgeLimit) {
                            resendFile = false;
                        }
                        break;
                    }
                    if (!resendFile) {
                        // Send a 304-response and finished.
                        response.writeHead(304, {"Etag": '"' + hash + '"'});
                        response.end();
                        utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + '  File ' + fullFilePath + ' (mimetype: ' + mimetype + ') not send - not modified');
                    } else {
                        fs.readFile(fullFilePath, 'binary', function(error, file) {
                            if (error) {
                                response.writeHead(500, {"Content-Type": "text/plain"});
                                response.write(error + '\n');
                                response.end();
                                utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + '  File ' + fullFilePath + ' (mimetype: ' + mimetype + ') not send to client - internal error 500 encountered');
                                utils.logMessage('HTTP', 'Error 500 Messge: ' + error);
                            } else {
                                response.writeHead(200, {"Content-Type": mimetype, "Etag": '"' + hash + '"', "Last-Modified": serverChangeString});
                                response.write(file, 'binary');
                                response.end();
                                utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + '  File ' + fullFilePath + ' (mimetype: ' + mimetype + ') send');
                            }
                        });
                    }
                }
            });
        } else {
			// File does not exists, send file error404.html or a simple message if file not exists
			utils.logMessage('HTTP', '[' + clientIP + '] Request ' + requestID + ' for file ' + fullFilePath + ' failed - file not found');
			fs.exists('error404.html', function(result) {
				if (result) {
					// File 'error404.html' exist. Read and send to client as error-page
					fs.readFile('error404.html', 'binary', function(error, file) {
						if (error) {
							// Error reading the file, send simple plaintext 404-error-message
							response.writeHead(404, {"Content-Type": "text/plain"});
							response.write('\nFailure 404: File ' + fullFilePath + ' not found');
							response.end();
						} else {
							response.writeHead(404, {"Content-Type": "text/html"});
							response.write(file, 'binary');
							response.end();
						}
					});
				} else {
					// No 'error404.html' exist. Send simple plaintext 404-error-message
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.write('\nFailure 404: File ' + fullFilePath + ' not found');
					response.end();
				}
			});
		}
	});
}

// Empfängt ein oder mehrere json-kodierte Update-Messages, filtert Variablen-Updates
// aus dem Datenstrom herraus und liefert diese an den PA-Manager zur weiteren Verwendung.
function update(requestID, serverData, config, clientIP, response, request, postData) {
	var messages = JSON.parse(postData);
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write('OK');
	response.end();

	var hits = 0;
	// Alle Variablenupdates aus den Messages holen und in varlist ablegen,
	// als Index die SenderID (entspricht ja der IPS varID) verwenden
	var varlist = [];
	for(var index in messages) {
		if (messages[index]['Message'] == '10603') {
			// Message ist ein Variablen-Update. In die Varlist übernehmen wenn varID ungleich config.updateVarID ist
			if (messages[index].SenderID != config.updateVarID) {
				varlist.push({
					'SenderID':  messages[index].SenderID,
					'NewValue':  messages[index].Data[0],
					'TimeStamp': utils.TDateTimeToTimestamp(messages[index].Data[3])
				});
			}
		}
	}
	if (hits > 0) {
		//utils.logMessage('req:update', 'Processing ' + messages.length + ' messages from IPS-Server...have ' + hits + ' new updates for paManager.'); 
		// Die Updates an den Prozessabbild-Manager weiterleiten
		serverData.paManager.updatePA(serverData, config, varlist);
	} else {
		//utils.logMessage('req:update', 'Processing ' + messages.length + ' messages from IPS-Server...found no new updates for paManager.');
	}
}


/**
 * Diese Funktion verarbeitet von die Clients kommende Request. Ein Request besteht aus einem cmdBlock,
 * der die folgenden Daten enthält:
 * type		string		Die Art des cmdBlocks. Zulässige Werte sind:
 *						START		Anmelden einer oder mehrerer Variablen am BridgeServer
 *						STOP		Abmelden einer, mehrerer oder aller Variablen vom BridgeServer
 *						EXECUTE		Anforderung auf Ausführung eines Scripts auf dem IPS-Server
 * data		mixed		Die Parameter zum cmdBlock. Je nach type sind das:
 *						START		Eine varID (als INT oder STRING) oder ein Array von varID's (als INT oder STRING)
 *						STOP		Eine varID (als INT oder STRING), ein Array von varID's (als INT oder STRING oder ein STERN "*" für ALLE
 *						EXECUTE		Ein JSON-Kodiertes Objekt mit den Eigenschaften:
 *									scriptID	Die ID des auszuführenden Scripts
 *									parameter	Ein Objekt mit Key:Wert-Paaren, welche als Parameter dem Script zur verfügung gestellt werden.
 */
function wsHandle(serverData, config, clientID, request) {

	switch (request.type.toUpperCase()) {
		case 'START':		// Anforderung einer oder mehrerer Variablen für einen Client
			
			// Prüfen ob eine Variable oder eine Liste von Variablen im cmd-Block eingetragen ist
			// typeof: boolean = "boolean",  integer = "number",  float = "number",  string = "string",  array = "object",  object = "object"
			if (typeof request.data !== 'object' ) {
				// Parameter ist kein Array, in ein Array mit einem Eintrag umwandlen
				request.data = [request.data];
			}
			
			// Die Liste der angeforderten Variablen durchlaufen und den neuen Abonenten eintragen
			for(var i = 0; i < request.data.length; i++) {
				var varID = request.data[i];
				serverData.paManager.registerVariable(serverData, config, varID, clientID);	// Die VarID ins Prozessabbild des DataServers übernehmen
			}		
		break;
		
		case 'STOP':		// Anforderung einer, mehrerer oder aller Variablen eines Clients löschen
			// Prüfen ob eine Variable oder eine Liste von Variablen im cmd-Block eingetragen ist
			// typeof: boolean = "boolean",  integer = "number",  float = "number",  string = "string",  array = "object",  object = "object"
			if (typeof request.data !== 'object' ) {
				// Parameter ist kein Array, in ein Array mit einem Eintrag umwandlen
				request.data = [request.data];
			}
			
			// Die Liste der angeforderten Variablen durchlaufen und den Abonenten löschen
			for(var i = 0; i < request.data.length; i++) {
				var varID = request.data[i];
				serverData.paManager.removeVariable(serverData, config, varID, clientID);	// Die VarID ins Prozessabbild des DataServers übernehmen
			}		
			
		break;
		
		case 'EXECUTE':		// Scriptausführung auf dem IPS-Server anfordern
			// CommandInterface des IPS-Server (config.useSSL?https:http)://config.IPSAddress/config.execScript:IPSPort
		break;
	}
}


exports.wsHandle = wsHandle;
exports.getFile  = getFile;
exports.getPage  = getPage;
exports.update   = update;
