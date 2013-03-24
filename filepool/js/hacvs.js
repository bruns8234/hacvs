/*************************************************************************************************************************************************************/
/**																																							**/
/**										      HOME         AUTOMATION        CONTROL      VISUALISATION      SYSTEM     									**/
/**										                                                                                									**/
/**										###         ###     #######       ###########   ###         ###   ###########   									**/
/**										 ###       ###     #########     #############   ###       ###   #############  									**/
/**										 ###       ###    ###     ###   ###         ###  ###       ###  ###         ### 									**/
/**										 ###       ###   ###       ###  ###              ###       ###  ###             									**/
/**										 ###       ###   ###       ###  ###              ###       ###  ###             									**/
/**										 #############   #############  ###              ###       ###   ############   									**/
/**										 #############   #############  ###              ###       ###    ############  									**/
/**										 ###       ###   ###       ###  ###              ###       ###              ### 									**/
/**										 ###       ###   ###       ###  ###              ###       ###              ### 									**/
/**										 ###       ###   ###       ###  ###         ###   ###     ###   ###         ### 									**/
/**										 ###       ###   ###       ###   #############     #########     #############  									**/
/**										###         ### ###         ###   ###########       #######       ###########   									**/
/**										                                                                                									**/
/**										                                                                                									**/
/**																																							**/
/**									#     #    #      ###   #     #          #####  ######  ####### ######   #####  ####### 								**/
/**									### ###   # #      #    ##    #         #     # #     #       # #    ## #    ## #  #  # 								**/
/**									#  #  #  #   #     #    # #   #         #     # #     #       # #  #    #          #    								**/
/**									#     # #     #    #    #  #  # ####### #     # ######        # ####    #          #    								**/
/**									#     # #######    #    #   # #         #     # #     #       # #  #    #          #    								**/
/**									#     # #     #    #    #    ##         #     # #     # ##   #  #    ## #    ##    #    								**/
/**									#     # #     #   ###   #     #          #####  ######   ####   ######   #####    ###   								**/
/**									                                                                                        								**/
/**																																							**/
/*************************************************************************************************************************************************************/


/**
	@description	Die HAVCS-Basisklasse. Sie umfasst alle Funktionen zur Drastellung und Steuerung des Terminals.
	@param	        {number}		    [pConfig.cycleTime=100]		    Zykluszeit der Mainloop (=Reaktionsgeschwindigkeit des Terminal).
	@param	        {number}		    [pConfig.gridWidth=15]		    Gewünschte Breite einer Rasterspalte in Pixel.
	@param	        {number}		    [pConfig.gridHeight=15]		    Gewünschte Höhe einer Rasterzeile in Pixel.
	@param	        {boolean}		    [pConfig.useFading=false]	    TRUE wenn Seitenwechsel animiert werden sollen (Achtung! Sehr hohe CPU-Last).
	@param	        {number}		    [pConfig.fadingTime=500]	    Die Zeit (in ms) die eine Animation dauert.
	@param	        {string}		    [pConfig.target='content']	    ID des DIV-Elements, in welchem das Terminal-Canvas eingefügt werden soll.
	@param	        {string}		    [pConfig.startPage='error']	    ID der Terminalpage, die als Startseite geladen werden soll.
**/
function HACVS(pConfig) { 'use strict';
	var self = this;


	/*********************************************************************************************************************************************************/
	/** Eigenschaften der HACVS-Klasse						                                                                                                **/
	/*********************************************************************************************************************************************************/
	this.pageID				= '';									    // ID der aktuell anzuzeigenden Terminalseite
	this.pageConfig	        = {};									    // Konfigurationsobjekt welches die aktuelle Terminalseite beschreibt
	this.terminalElements	= {};									    // Enthält alle Elementobjekte, die zur Darstellung der Terminalseite benötigt werden.
	this.hitMask	        = null;									    // imageData-Array, das die Hitmask des Terminals enthält. Durch Auslesen der Pixel-
																		//     farbe kann über das hitList-Array ermittelt werden, welches Element an dieser
																		//     Position liegt, da jedes Element eine zufällige RGB-Farbe hat.
	this.hitList	        = {};									    // Liste (key:value) mit Zuordnung  colorKey:elementID
	this.cycleTime	        = 0;									    // Aufrufzyklus der run-loop (Angabe in ms)
	this.runState	        = 1;									    // Aktueller Zustand der State-Machine, welche die Basisaktionen kontrolliert.
	this.restartState	    = 0;									    // runState der pageLoad-Aktion, wird von run selber gesetzt.
	this.runWait	        = false;									// Ist True solange auf den Abschluss des aktuellen States gewartet wird
	this.waitFlag	        = false;									// Ist True sobald die RUN-Loop für min. 1 Zyklus im WAIT-Modus steht.
	this.stopFlag	        = false;									// Ist True wenn der Wait-Modus zum STOP-Modus wird (z.B. bei einem Fehler)
	this.target	            = '';									    // ID-Selector des Canvas-Objekts für spätere Manipulationen des HTML-Objekts
	this.useFading	        = false;									// True wenn das Terminal per fading ein- und ausgeblendet werden soll (Hohe CPU-Last!)
	this.fadingTime	        = 500;									    // Dauer (in Millisekunden) eines Fading-Vorgangs, wenn useFading auf True gestellt ist
	this.canvas	            = null;									    // Referenz auf das CANVAS Element
	this.context	        = null;									    // Referenz auf den 2D Context des CANVAS Elements
	this.canvasWidth	    = 0;									    // Breite des Canvas
	this.canvasHeight	    = 0;									    // Höhe des Canvas
	this.canvasOffsetTop	= 0;									    // Offset oberer Rand des Canvas zum Bildschirm
	this.canvasOffsetLeft	= 0;									    // Offset linker Rand des Canvas zum Bildschirm
	this.gridCols	        = 0;									    // Anzahl der zur Darstellung verfügbaren Spalten
	this.gridRows	        = 0;									    // Anzahl der zur Darstellung verfügbaren Zeilen
	this.gridWidth	        = 0;									    // Breite einer Rasterspalte in Pixel
	this.gridHeight	        = 0;									    // Breite einer Rasterzeile in Pixel
	this.xOffset	        = 0;									    // Rasterspalten-Offset um die gewünschte Terminalgröße zentriert abzubilden
	this.yOffset	        = 0;									    // Rasterzeilen-Offset um die gewünschte Terminalgröße zentriert abzubilden
	this.showServiceGrid	= false;									// Legt fest, ob das Hilfsraster angezeigt werden soll (=true) oder nicht (=false).
	this.terminalStorage	= {};									    // Der interne Speicher des Terminals für einfache Passwort- und Formularfunktionen.
	this.mouseData	        = {};									    // Die aktuelle und die letzte Mausposition im Canvas als Rasterpositionsangabe.
	this.redraw	            = false;									// True wenn die MainLoop die Anzeige komplett neu aufbauen muss, sonst False
	this.eventQueue	        = [];									    // Warteschlange zum Zwischenspeichern von Benutzeraktionen
	this.actionQueue	    = [];									    // Warteschlange für auszuführende Aktionen
	this.wsServerAddress	= '';									    // Adresse des WebSock-Servers, der Anfragen verarbeitet und Updates liefert.
	this.wsServerPort	    = 1337;									    // Portnummer des WebSock-Servers.
	this.loopTimer	        = null;									    // Referenz auf den Timer der die mainLoop antreibt
	this.extraDelay	        = 0;									    // Einmalige zus. Wartezeit, die in den Zyklus der mainloop eingefügt werden kann.
	this.mySoundManager	    = null;									    // Instanz des SoundManager-Objekts.
	this.myDataManager	    = null;										// Instanz des DataManager-Objekts.
	this.myPictureManager	= null;										// Instanz des PictureManager-Objekts.

	this.stopperID	        = '';
	this.stopperState	    = 0;
	this.holderID	        = '';
	this.loopState	        = 0;


	/*********************************************************************************************************************************************************/
	/** Methoden der HACVS-Klasse						                                                                                                    **/
	/*********************************************************************************************************************************************************/


	/**
	@description	Fügt die übergebene Aktion in die Aktions-Warteschlange ein.
	@param	        {number}	        runDelay	        			Zeit (in Millisekunden) nach der die Aktion auszuführen ist.
	@param	        {object}	        actionList.ID	    			Die ID des Elements, das von dieser Aktion betroffen ist ODER Leerstring, wenn
																			actionList.action eine Funktionsrefernz ist.
	@param	        {string}	        actionList.action				Die Auszuführende Aktion. Sie muss dem Namen einer Funktion des Element-Objekts
																			entsprechen. Diese Funktion wird dann aufgerufen und ausgeführt.
	@param	        {array[mixed]}	    actionList.parameter			Array mit den Parametern für den Aktionsaufruf. Sie werden in identischer
																			Reihenfolge als Parameter an den Funktionsaufruf gehängt.
	**/
	this.addAction = function (runDelay, actionList) {

		var runTime = (new Date()).getTime() + runDelay;				// Delay in Zeitpunkt umrechnen
		
		if (_.isArray(actionList)) {									// Die Action-List als einzelne Einträge in die die Warteschlange einfügen
			_.each(actionList, function(element, index, list) { self.actionQueue.push({ timer: runTime, actionList: element }); }
		} else {
			self.actionQueue.push({ timer: runTime, actionList: actionList });
		}

		self.actionQueue = _.sortBy(self.actionQueue, 'timer');			// und Aktionswarteschlange nach Ausführungszeitpunkten sortieren
	}


	/**
	@description	Aktiviert den Wartestatus der zentralen Statemachine, so das der nächste Prozessschritt erst nach Beendigung des Wartezustands (siehe 
						runContinue()) ausgeführt wird.
	**/
	this.runHold = function (callerID) {
		console.log('SWITCHING TO WAIT-MODE (' + callerID + ')');
		self.runWait = true;
		self.waitFlag = true;
		self.stopperID = callerID;
		self.stopperState = self.runState;
	}


	/**
	@description	Stopped die Ausführung der zentralen Statemachine entgültig. Ein Neustart (=neu laden) nach Behebung des Fehlers ist notwendig um diesen
						Zustand wieder aufzulösen.
	**/
	this.runStop = function (callerID) {
		console.log('SWITCHING TO STOP-MODE (' + callerID + ')');
		self.runWait = true;
		self.waitFlag = true;
		self.stopFlag = true;
		self.holderID = callerID;
		self.stopperState = self.runState;
	}


	/**
	@description	Beendet den Wartestatus der zentralen Statemachine, so das der nächste Prozessschritt ausgeführt werden kann.
	**/
	this.runContinue = function () {

		console.log('SWITCHING TO RUN-MODE (Initiator was ' + self.stopperID + ')');
		if (self.stopFlag) {
			console.log('==> SWITCHING TO RUN-MODE NOT POSSIBLE - STOP-MODE WAS ACTIVATED BY ' + self.holderID + '!');
		} else {

			if (self.runState !== self.stopperState) {
				console.log('ATTENTION! SOMEONE HAS CHANGED runState DURING WAIT-MODE! was: ' + self.stopperState + '  is now: ' + self.runState);
			}
			
			self.runWait = false;										// Den wait-State aufheben
			
			self.runState++;											// Den nächsten Prozessschritt anwählen
			
			setTimeout(self.run, self.cycleTime);						// und die Statemachine nach Ablauf einer Zykluspause wieder starten
		}
	}


	/**
	@description	Tragt die übergebenen Texte in die Meldebox ein und zeigt diese dann an
	@param	        {string}	        title				            Text für die Titelzeile. Textjustierung(en) bleibt/bleiben erhalten.
	@param	        {string}	        body			                Text für den Meldetextbody. Textjustierung(en) bleibt/bleiben erhalten.
																			Linefeed (\n) bricht den Text auf eine neue Zeile um.
	@param	        {string}	        footer				            Text für die Fußzeile. Textjustierung(en) bleibt/bleiben erhalten.
	**/
	this.errorPopup = function(title, body, footer) {

		this.runHold('errorPopup');										// Die Statemachine stoppen
		
		var bodyText = body.replace(/\n/g, '<br>');						// Bodytext bearbeiten

		$('#msgBoxTitle').empty().append(title);						// Texte zuweisen
		$('#msgBoxBodyText').empty().append(bodyText);
		$('#msgBoxFooter').empty().append(footer);


		if (self.useFading) {											// Messagebox sichtbar machen
			$('#msgBox').fadeIn(self.fadingTime);
		} else {
			$('#msgBox').show();
		}
	}


	/**
	@description	Paddet eine numerischen Wert auf x Stellen mit führenden Nullen. Ist der Wert größer als die Padding-Länge so wird der Wert direkt als
						String zurückgeliefert.
	@param	        {number}	        num			                    Der Wert, welcher zu padden ist.
	@param	        {number}	        len			                    Gewünschte Ziellänge.

	@return	        {string}	        Der gepaddete Wert.
	**/
	this.formatNumber = function (num, len) {
		var result = '' + num;
		while (result.length < len) {
			result = '0' + result;
		}
		return result;
	}


	/**
	@description	Erzeugt einen zufälligen CSS-Farbwert.

	@return	        {string}	        Farbwert, bestehend aus drei 2-stelligen Hexadezimalzahlen.
	**/
	this.getRandomColor = function () {

		return															// HEX-Farbwert erzeugen und an den Aufrufer zurückgeben
			('0' + (Math.floor(Math.random() * 255)).toString(16)).substr(-2) +
			('0' + (Math.floor(Math.random() * 255)).toString(16)).substr(-2) +
			('0' + (Math.floor(Math.random() * 255)).toString(16)).substr(-2);
	}


	/**
	@description	Ermittelt aus den gegebenen clientX- und clientY-Koordinaten die zugehörige Rasterposition. Liegen die Koordinaten außerhalb des Canvas
						liefert die Funktion x:0, y:0 als Ergebnis.
	@param	        {number}	        clientX				            Die umzurechnende X-Position
	@param	        {number}	        clientY				            Die umzurechnende Y-Position

	@return	        {object}	        Ergebnis enthält 2 Eigenschaften, col und row, die die Position enthalten.
	**/
	this.getPositionFromClientPosition = function (clientX, clientY) {

		var cX, cY;														// Berechnungsvariablen anlegen

		cX =															// Aktuelle Position im canvas ermitteln, Position zu 0 wenn außerhalb vom Canvas
			(Math.max(0, clientX - self.canvasOffsetLeft) > self.canvasWidth  ? 0 : Math.max(0, clientX - self.canvasOffsetLeft));
		cY =
			(Math.max(0, clientY - self.canvasOffsetTop)  > self.canvasHeight ? 0 : Math.max(0, clientY - self.canvasOffsetTop));

		return {x: cX, y: cY};
	}


	/**
	@description	Diese Funktion löscht den kompletten Terminalspeicher (z.B. bei Seitenwechsel)
	**/
	this.resetTerminalStorage = function () {
		self.terminalStorage = {};
	}


	/**
	@description	Speichert einen Wert in einem Terminalspeicher ab.
	@param			{string}			stroageID						ID des zu beschreibenden Speicherplatzes. Nicht vorhandene Speicher werden angelegt.
	@param			{any}				storageValue					Wert der in den Terminalspeicher geschrieben werden soll.
	@param			{string}			[storeType='append']			Legt fest, wie der Wert dem Speicher hinzugefügt werden soll. Zulässige Werte sind:
																		- replace	Ersetzt den aktuellen Inhalt komplett durch "storageValue"
																		- append	Fügt "storageValue" am Ende des Terminalspeichers hinzu
																		- insert	Fügt "storageValue" am Anfang des Terminalspeichers hinzu
																		Standardverhalten ist append.
	**/
	this.setTerminalStorage = function(storageID, storageValue, storageType) {

		if (storageType === undefined) { storageType = 'append'; }		// Defaultvalue für storageType setzen falls undefiniert
		
		switch (storageType.toLowerCase()) {							// Speicher gemäß storageType schreiben
		case 'replace':
			self.terminalStorage[storageID] = storageValue;
			break;

		case 'append':
			if (self.terminalStorage[storageID] === undefined) {
				self.terminalStorage[storageID] = storageValue;
			} else {
				self.terminalStorage[storageID] += storageValue;
			}
			break;

		case 'insert':
			if (self.terminalStorage[storageID] === undefined) {
				self.terminalStorage[storageID] = storageValue;
			} else {
				self.terminalStorage[storageID] = storageValue + self.terminalStorage[storageID];
			}
			break;

		}
		console.log('Neuer Wert im Terminalspeicher: [' + storageID + '] = "' + self.terminalStorage[storageID] + '"');
	}


	/**
	@description	Liefert den aktuellen Wert eines Terminalspeichers zurück.
	@param			{string}			stroageID						ID des zu liefernden Speicherplatzes
	
	@return			{any}				Liefert den Wert des Speicherplatzes oder null, falls der Speicherplatz nicht existiert
	**/
	this.getTerminalStorage = function(storageID) {
		var returnValue = null;
	
		if (self.terminalStorage[storageID] !== undefined) {
			returnValue = self.terminalStorage[storageID];
		}
		
		return returnValue;
	}

	
	/**
	@description	Löscht den angegebenen Terminalspeicher aus dem Terminal
	@param			{string}			stroageID						ID des zu löschenden Speicherplatzes
	**/
	this.clearTerminalStorage = function(storageID) {
	
		var tempObject = {};
		for(var key in self.terminalStorage) {
		
			if (key !== storageID) {									// Speicherplatz kopieren wenn es nicht der zu löschende Speicher ist
				tempObject[key] = self.terminalStorage[key];
			} else {
				console.log('Terminalspeicher "' + storageID + '" gelöscht.');
			}
		}
		
		self.terminalStorage = tempObject;								// Das neue Objekt wieder in self.terminalStorage ablegen
	}

	
	/**
	@description	Generiert das imageData-Array für die Kollisionserkennung und speichert diese in self.hitMask
	@param	        {function}	        [ready]				            Funktion die aufgerufen werden soll, wenn die hitMask fertig generiert ist
	**/
	this.createHitMask = function (ready) {

		var hitCanvas = document.createElement('canvas');				// Step 1: Create a canvas (with identical dimension as the visible one)
		
		hitCanvas.width  = self.canvasWidth;
		hitCanvas.height = self.canvasHeight;
		var hitContext   = hitCanvas.getContext('2d');
		
		_.each(self.terminalElements, function(element, id, list) {		// Step 2: Iterate through terminalElements and call the draw method of each object

			var color = self.getRandomColor();							// Create a random color key

			self.hitList[color] = id;									// Add colorKey and elementID to the hitList
			element.draw(color, hitContext);							// Call the draw function with colorkey
		});

		self.hitMask =													// Step 3: Get the imageData from the Canvas and copy them to hitMask
			hitContext.getImageData(0, 0, self.canvasWidth, self.canvasHeight);


		if (ready !== undefined) {										// Run the ready-callback, if declared
			ready();
		}
	}


	/**
	@description	Liefert den colorKey des gesuchten Pixels.
	@param	        {number}	        x				                Die X-Koordinate des gesuchten Pixels (Zählung beginnt bei 0)
	@param	        {number}	        y				                Die Y-Koordinate des gesuchten Pixels (Zählung beginnt bei 0)

	@return	        {string}	        Der gesuchte Farbwert als 6-stelliger Hex-Wert (RRGGBB)
	**/
	this.getPixelColor = function (x, y) {

		return ('0' + (self.hitMask.data[((y * (self.canvasWidth * 4)) + (x * 4)) + 0]).toString(16)).substr(-2) +
			   ('0' + (self.hitMask.data[((y * (self.canvasWidth * 4)) + (x * 4)) + 1]).toString(16)).substr(-2) +
			   ('0' + (self.hitMask.data[((y * (self.canvasWidth * 4)) + (x * 4)) + 2]).toString(16)).substr(-2);
	}


	/**
	@description	Die zentrale State-Machine des HACVS-Terminals. Sie steuert alle Abläufe und koordiniert das Laden, Anzeigen und die Bedienung.
	**/
	this.run = function () {

		if (!self.runWait) {											// Wenn wir uns nicht im Wartemodus befinden...
		
			switch (self.runState) {									// ...sind wir im Aktionsmodus. Gemäß runState die entsprechende Aktion durchführen
			case 1:														// Initialisieren des SoundManagers
				console.log('[' + self.runState + ']: Running soundManager.isReady()');
				self.runHold('run:case 1');
				self.mySoundManager.isReady(self.runContinue());
				break;

			case 2:														// Initialisieren des dataManagers
				console.log('[' + self.runState + ']: Running dataManager.init()');
				self.runHold('run:case 2');
				self.myDataManager.init(self, self.wsServerAddress, self.wsServerPort, self.runContinue, 
					function onDisconnet () {
						self.errorPopup(
							'VERBINDUNGSFEHLER:',
							'\nVerbindung zum BrideServer verloren!\n\n\nBitte Terminal neu starten!\n',
							'L C A R S   F R O N T E N D   G E S T O P P T'
						);
					},
					function onError (state, error) {
						self.errorPopup(
							'VERBINDUNGSFEHLER:',
							'\nVerbindung zum BrideServer konnte nicht\naufgebaut werden!\n\nBitte Terminal neu starten!\n',
							'L C A R S   F R O N T E N D   G E S T O P P T'
						);
					}
				);
				break;

			case 3:														// Terminal initialisieren
				console.log('[' + self.runState + ']: Running initTerminal()');
				self.restartState = self.runState;						// Aktuellen runState in restartState sichern um später den richtigen Einsprung zum 
				self.initTerminal();									//     neu laden der Terminaldaten zu haben (für einen Wechsel der Terminalseite)
				break;

			case 4:														// Laden der Terminalbeschreibung
				console.log('[' + self.runState + ']: Running loadPage()');
				self.runHold('run:case 4');
				self.loadPage(self.pageID, self.runContinue, function error (status, message) {
					self.errorPopup('SERVERFEHLER:', '\nDie Seitenbeschreibung für "' + self.pageID + '" konnte\n nicht geladen werden!\n' +
									'Server meldet:\n' + status + '/' + message, 'L C A R S   K E R N E L   G E S T O P P E D');
					
				});
				break;

			case 5:														// Alle Image-Resources für das Terminal laden
				console.log('[' + self.runState + ']: Running myPictureManager.load()');
				self.runHold('run:case 5');
				self.myPictureManager.loadImageFiles(self.pageConfig.images, self.runContinue);
				break;
				
			case 6:														// Ein Terminalgrid anzeigen, falls der entsprechende Parameter gesetzt ist
				console.log('[' + self.runState + ']: Running showTerminalGrid()');
				if (self.showServiceGrid) {
					self.showTerminalGrid();
				}
				break;
				
			case 7:														// Alle Element-Objekte für dieses Terminal erzeugen
				console.log('[' + self.runState + ']: Creating Element-Objects...');
				
				var terminalGrid = {									// Rasterobjekt für die ElementKonstruktoren erzeugen
					gridWidth:  self.gridWidth,
					gridHeight: self.gridHeight,
					maxWidth:   self.gridCols,
					maxHeight:  self.gridRows
				};
				
				var autoID = 1;			                                // AUTO-ID-Zähler für Elemente initialisieren
				for (var key in self.pageConfig.elements) {			    // Liste ALLER Elemente durchlaufen
					var record = self.pageConfig.elements[key];			// Config aus der pageConfig (mit element, id, zindex, config)
					var id = record.id;			                        // Die ElementID in die Variable ID übertragen
					if (id.toLowerCase() == 'auto') {			        // Ist ID=AUTO, eine ID erzeugen und dem Element zuweisen
						id = 'obj' + self.formatNumber(autoID, 5);
						autoID++;
					}
					record.config['myID'] = id;							// Die vordefinierte bzw. automatisch vergebene ID in das config-Objekt eintragen
					switch (record.element.toLowerCase()) {
					case 'bar':
						console.log('Creating element BAR with ID ' + id + '...');
						self.terminalElements[id] = new ElementBAR(terminalGrid, record.config, self);
						break;
						
					case 'edge':
						console.log('Creating element EDGE with ID ' + id + '...');
						self.terminalElements[id] = new ElementEDGE(terminalGrid, record.config, self);
						break;
						
					case 'cap':
						console.log('Creating element CAP with ID ' + id + '...');
						self.terminalElements[id] = new ElementCAP(terminalGrid, record.config, self);
						break;

					case 'text':
						console.log('Creating element TEXT with ID ' + id + '...');
						self.terminalElements[id] = new ElementTEXT(terminalGrid, record.config, self);
						break;
						
					case 'picture':
						console.log('Creating element PICTURE with ID ' + id + '...');
						self.terminalElements[id] = new ElementPICTURE(terminalGrid, record.config, self);
						break;
						
					case 'button':
						console.log('Creating element BUTTON with ID ' + id + '...');
						self.terminalElements[id] = new ElementBUTTON(terminalGrid, record.config, self);
						//console.log('Element BUTTON is not supported now!');
						break;
						
					case 'switch':
						console.log('Creating element SWITCH with ID ' + id + '...');
						//self.terminalElements[id] = new ElementSWITCH(terminalGrid, record.config, self);
						console.log('Element SWITCH is not supported now!');
						break;
						
					case 'value':
						console.log('Creating element VALUE with ID ' + id + '...');
						//self.terminalElements[id] = new ElementVALUE(terminalGrid, record.config, self);
						console.log('Element VALUE is not supported now!');
						break;
						
					case 'imgvalue':
						console.log('Creating element IMGVALUE with ID ' + id + '...');
						self.terminalElements[id] = new ElementIMGVALUE(terminalGrid, record.config, self);
						//console.log('Element IMGVALUE is not supported now!');
						break;
						
					case 'bargraph':
						console.log('Creating element BARGRAPH with ID ' + id + '...');
						//self.terminalElements[id] = new ElementBARGRAPH(terminalGrid, record.config, self);
						console.log('Element BARGRAPH is not supported now!');
						break;
					case 'soundtoggle':
						console.log('Creating element SOUNDTOGGLE with ID ' + id + '...');
						self.terminalElements[id] = new ElementSOUNDTOGGLE(terminalGrid, record.config, self);
						//console.log('Element SOUNDTOGGLE is not supported now!');
						break;
					}
					
					if (self.terminalElements[id] !== undefined) {		// Prüfen ob Elements erfolgreich angelegt wurde. Wenn nicht, ErrorPopup anzeigen
						if (!self.terminalElements[id].configValid) {
							self.errorPopup('PARAMETERFEHLER:', 
											'Seitenbeschreibungsdatei «' + self.pageID + '» ist fehlerhaft! "' + id + '" ' +
											'meldet:\n' + self.terminalElements[id].configError, 'L C A R S   I N I T   S T O P P E D');
							self.runStop('CreateElements');
						}
					}
				}
				break;

			case 8:														// Hitmask für das Terminal generieren
				console.log('[' + self.runState + ']: Aquiring active areas of all elements...');
				self.createHitMask();
				break;

			case 9:														// Die Mainloop des Terminals starten
				console.log('[' + self.runState + ']: Starting main loop with ' + (1000 / self.cycleTime) + ' loop/sec.');
				self.runHold('run:case 8');
				
				self.drawTerminal();									// Das CANVAS erstmalig ausgeben
				
				if (self.useFading) {									// Das CANVAS sichtbar machen: mit oder ohne Fading, je nach Wunsch...
					$(self.target).fadeIn(self.fadingTime);
				} else {
					$(self.target).show();
				}

				self.loopTimer =										// Den Interval-Timer für die MainLoop erzeugen
					setInterval(self.mainLoop, self.cycleTime);
				break;

			case 10:													// Die Mainloop stoppen und zum PageLoad zurück kehren
				console.log('[' + self.runState + ']: Stopping main loop and load new Page');
				
				window.clearInterval(self.loopTimer);					// Zyklischen Timer der mainLoop löschen
				
				if (self.useFading) {									// Das CANVAS ausblenden
					$(self.target).fadeOut(self.fadingTime);
				} else {
					$(self.target).hide();
				}
				self.runState = self.restartState - 1;					// RestartState - 1 da die Timeraufruffunktion den Runstate autom. weiterschaltet.
				if (self.useFading) {
				
					self.extraDelay = self.fadingTime;					// Zykluszeit um fadingTime verlängern, damit der fadeOut fertig vor dem Neustart
				}
				break;
			}
			
			// Wenn die Statemachine durchgelaufen ist und wir NICHT im Wartemodus sind, dann muss runState um 1 erhöht werden und ein um Zykluszeit+extraDelay
			// verzögerter nächster Ausführungszyklus programmiert werden.
			if (!self.runWait) {
				self.runState++;

				var zTime = self.cycleTime + self.extraDelay;			// Die gesamte Verzögerungszeit für diesen Zyklus berechnen.
				self.extraDelay = 0;									// Evtl. einkalkuliertes extraDelay auf 0 setzen,
				setTimeout(self.run, zTime);							// und den Timer zum Start des nächsten Ausführungszyklus programmieren
			}
		}
	}


	/**
	@description	Die Hauptaktionsschleife des Terminals. Diese Schleife wird permanent durchlaufen während das Terminal aktiv ist. Sie kümmert sich darum
						bei Bedarf das Canvas neu zu zeichnen, die Benutzerinteraktion zu kontrollieren und die Warteschlangen zu verarbeiten.
	**/
	this.mainLoop = function () {

		if (self.redraw) {
			console.log('Redrawing terminal page...');
			self.redraw = false;
			self.drawTerminal();
		}

		if (self.eventQueue.length > 0) {								// Auf Eingabeereignisse prüfen und ggf. entsprechende Aktion ausführen
			var myEvent = self.eventQueue.shift();						// Erstes Element aus der  Warteschlange holen und nach myEvent verschieben

			var hitKey = self.getPixelColor(myEvent.x, myEvent.y);		// Prüfen ob ein Element angeklickt wurde
			if (hitKey !== '000000') {
				var elementID = self.hitList[hitKey];					// Klick auf Element-Fläche. ElementID aus hitList holen
				
				if (_.has(self.terminalElements[elementID], 'click')) {	// Wenn dieses Element eine click-Methode hat, dann wird diese aufgerufen.
					self.terminalElements[elementID].click(elementID, self);
				}
			}
		}

		if (self.actionQueue.length > 0) {								// Auf auszuführende Aktion prüfen und ggf. entsprechende Aktion ausführen
			var now = (new Date()).getTime();
			for (var key in self.actionQueue) {
				if (now >= self.actionQueue[key].timer) {				// Zeitpunkt für Ausführung ist erreicht
				
					var action = self.actionQueue[key].actionList;		// Aktion aus der Queue holen
					
					self.actionQueue.splice(key, 1);					// und den Eintrag aus der Queue entfernen

0					// Referenz auf die auszuführende Funktion besorgen. Dazu gibt es 2 Möglichkeiten:
					// 1.) ID ist ein Leerstring  ==> action ist die gesuchte Funktionsreferenz
					// 2.) ID ist kein Leerstring ==> Eine Funktion mit namen 'action' in terminalElements[ID] ist die gesuchte Funktionsreferenz
					
					var runFunction = null;
					if (_.isFunction(action.action)) {
						runFunction = action.action;
					} else {
						if (_.has(self.terminalElements, action.id)) {
							if (_.has(self.terminalElements[action.id], action.action)) {
								runFunction = self.terminalElements[action.id][action.action];
							}
						}
					}
					
					if (runFunction !== null) {
						var ePa = action.parameter;
					}
					
					// runFunction mit entsprechender Anzahl von Parametern aufrufen (max. 14 Parameter werden berücksichtigt)
					switch (ePa.length) {
					case  0:
						runFunction();
						break;
					case  1:
						runFunction(ePa[0]);
						break;
					case  2:
						runFunction(ePa[0],ePa[1]);
						break;
					case  3:
						runFunction(ePa[0],ePa[1],ePa[2]);
						break;
					case  4:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3]);
						break;
					case  5:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4]);
						break;
					case  6:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5]);
						break;
					case  7:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6]);
						break;
					case  8:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7]);
						break;
					case  9:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7],ePa[8]);
						break;
					case 10:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7],ePa[8],ePa[9]);
						break;
					case 11:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7],ePa[8],ePa[9],ePa[10]);
						break;
					case 12:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7],ePa[8],ePa[9],ePa[10],ePa[11]);
						break;
					case 13:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7],ePa[8],ePa[9],ePa[10],ePa[11],ePa[12]);
						break;
					case 14:
						runFunction(ePa[0],ePa[1],ePa[2],ePa[3],ePa[4],ePa[5],ePa[6],ePa[7],ePa[8],ePa[9],ePa[10],ePa[11],ePa[12],ePa[13]);
						break;
					}
				}
			}
		}
	}


	/**
	@description    Zeichnet alle Elemente der aktuellen Terminalseite auf das Canvas
	**/
	this.drawTerminal = function () {

		for(var id in self.terminalElements) {
			var element = self.terminalElements[id];
			
			element.draw();
			
		}
	}


	/**
	@description    Initialisiert alle Komponenten des Terminals (löscht Canvas und Terminalspeicher, leert die Queue's,
					zeichnet das Hilfsraster wenn aktiviert und resettet den dataManager.
	**/
	this.initTerminal = function () {

		// Canvas löschen
		self.context.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

		// Das Prozessabbild löschen
		self.myDataManager.clearImage();
		
		// Den Datenspeicher des Terminals löschen
		self.resetTerminalStorage();
		
		// Die Element-Kollektion löschen
		self.terminalElements = {};
		
		// Die hitMask-Daten löschen
		self.hitMask = [];
		
		// Die colorKey-Kollektion löschen
		self.hitList = {};
		
		// Die Ereigniswarteschlange leeren
		self.eventQueue = [];
		
		// Die Aktionswarteschlange leeren
		self.actionQueue = [];
	}


	/**
	@description    Lädt die geforderte Seitenbeschreibung vom Server und legt das Bescheibungobjekt in 
					self.pageConfig ab.
	@param          {string}            pageName            Name der Seitenbeschreibungsdatei die geladen werden soll.
	@param          {function}          loaded              Funktion die aufgerufen wird, wenn die Seitenbeschreibung geladen wurde.
	@param          {function}          error               Funktion die aufgerufen wird, wenn das Laden der mit einem Fehler abbricht.
															Die Funktion erhält 2 Parameter, den Status- und den Fehlerbeschreibungstext.
	**/
	this.loadPage = function (pageName, loaded, error) {

		console.log('Initiating AJAX-Operation to load new page description file from server...');
		// Die benötigte pageConfig vom Server holen und im HACVS-Objekt ablegen
		$.ajax({
			url:        'getPage',
			dataType:   'json',
			data:       pageName,
			error:      function(jqXHR, textStatus, errorThrown) {
				// Die gewünschte Terminalpage konnte nicht geladen werden, darum das ERROR-Popup öffnen und die Fehlermeldung anzeigen
				console.log('HACVS.loadPage: ' + pageName + ' konnte nicht geladen werden!');
				console.log('Meldung: ' + textStatus + '/' + errorThrown);
				
				// Callback für Fehler beim Laden aufrufen
				error(textStatus, errorThrown);
			},
			success:    function(data, textStatus, jqXHR) {
				// Ergebnis in actualPageConfig ablegen
				self.pageConfig = data;
				
				self.showServiceGrid = data.showGrid;
				
				// Callback für erfolgreiches Laden aufrufen
				if (loaded !== undefined) {
					loaded();
				}
			}
		});
	}


	/**
	@description    Zeichnet ein Hilfsraster auf das Terminal-Canvas (z.B. zur Positionierungsprüfung o.ä.), wenn der entsprechende
					Konfigurationsparameter (showGrid) gesetzt ist.
	**/
	this.showTerminalGrid = function () {
		var rMax = Math.max(self.gridCols, self.gridRows);
		var lCol = self.gridCols * self.gridWidth;
		var lRow = self.gridRows * self.gridHeight;
		self.context.save();
		self.context.beginPath();
		self.context.strokeStyle = 'red';
		self.context.lineWidth = 1;
		for (var z = 1; z < rMax; z++) {
			if (z < self.gridCols) {
				self.context.moveTo(z * self.gridWidth, 0);
				self.context.lineTo(z * self.gridWidth, lRow);
			}
			if (z < self.gridRows) {
				self.context.moveTo(0,    z * self.gridHeight);
				self.context.lineTo(lCol, z * self.gridHeight);
			}
		}
		self.context.stroke();
		self.context.restore();
	}


	/**
	@description    KONSTRUKTOR DER HACVS-KLASSE
					Diese Funktion initialisiert das Terminal-Basis. Es wird der vorhandene Platz ermittelt, die Grundparameter einge-
					stellt, das Canvas-Element erzeugt und mittig im Browser ausgerichtet. Anschließed werden noch Event-Handler für Maus-
					aktionen installiert und dann die run-Funktion aufgerufen.
	**/

	// Aufruf-Konfiguration mit Default-Werten ergänzen
	var defaultSettings = {
		cycleTime:      100,            // Default Zykluszeit 100ms
		gridWidth:      15,             // Breite in Pixel einer Rasterspalte
		gridHeight:     15,             // Breite in Pixel einer Rasterzeile
		useFading:      true,           // TRUE = Terminalseiten weich ein- und ausgeblenden (Achtung: Hohe CPU-Last !!)
		fadingTime:     1000,           // Die Zeit (in ms) die das Ein- bzw. Ausblenden dauern soll.
		target:         'content',      // ID des DIV-Elements, in welchem das Canvas eingefügt werden soll
		startPage:      'error',        // ID des Terminals, welches als Startseite zu laden ist (Default: Eine Fehlerseite)
		bridgePort:     1337
	};
	for (var key in defaultSettings) {
		if (pConfig[key] === undefined) {
			pConfig[key] = defaultSettings[key];
		}
	}

	// Zykluszeit übernehmen
	self.cycleTime = pConfig.cycleTime;

	// Fading-Parameter übernehmen
	self.useFading  = pConfig.useFading;
	self.fadingTime = pConfig.fadingTime;

	// ID-Selector erzeugen
	self.target = '#' + pConfig.target;

	// DIV mit canvas unsichtbar machen
	//$(self.target).hide();

	// Nutzfläche ermitteln, verfügbare Rasterzeilen berechnen, Canvas-Element anlegen
	// und ausrichten.
	var screenWidth  = $(document).width();
	var screenHeight = $(document).height();

	// Breite und Höhe auf den nächsten vollen Rasterwert abrunden
	self.canvasWidth  = screenWidth - (screenWidth % pConfig.gridWidth) - pConfig.gridWidth;
	self.canvasHeight = screenHeight - (screenHeight % pConfig.gridHeight) - pConfig.gridHeight;

	// Ein Canvas-Element mit den entsprechenden Eigenschaften anlegen und in das target-Element einfügen
	self.canvas = document.createElement('canvas');
	$(self.target).append(self.canvas);
	self.canvas.width  = self.canvasWidth;
	self.canvas.height = self.canvasHeight;
	self.context = self.canvas.getContext('2d');

	// Das Padding des umliegenden DIV-Elements so anpassen, das das canvas-Element zentriert auf dem Monitor steht
	var paddingLeft = ((screenWidth - self.canvasWidth) / 2) + 'px';
	var paddingTop  = ((screenHeight - self.canvasHeight) / 2)  + 'px';
	$(self.target).css({padding: paddingTop + ' ' + paddingLeft});

	// Die ermittelten bzw. berechneten Parameter in die HACVS Eigenschaften übernehmen
	self.canvasOffsetTop  = self.canvas.offsetTop;
	self.canvasOffsetLeft = self.canvas.offsetLeft;
	self.gridCols         = self.canvasWidth / pConfig.gridWidth;
	self.gridRows         = self.canvasHeight / pConfig.gridHeight;
	self.gridWidth        = pConfig.gridWidth;
	self.gridHeight       = pConfig.gridHeight;
	self.pageID           = pConfig.startPage;

	// Adresse und Portnummer des WebSocket-Servers (BridgeServer) übernehmen
	if (pConfig.bridgeServer === undefined) {
		// FATAL: Adresse des WS-Servers ist nicht angegeben!
		console.log('STOPPING INIT, Missing address of BridgeServer');
		errorPopup('FATALER PROGRAMMFEHLER:', '\nIP-Adresse des Bridge-Servers fehlt!\n\n\nSystemadministrator informieren', 'L C A R S   K E R N E L   G E S T O P P T');
		return;
	} else {
		self.wsServerAddress = pConfig.bridgeServer;
		self.wsServerPort    = pConfig.bridgePort;
	}

	// Instanzen von DataManager, SoundManager und PictureManager anlegen
	self.myDataManager    = new DataManager();
	self.mySoundManager   = new SoundManager();
	self.myPictureManager = new PictureManager();

	// mouseData-Objekt erzeugen
	self.mousePosition = { x: 0, y: 0 };

	// Event-Handler zur Ermittlung von Mausclicks erstellen
	console.log('Installing Handler for click-events from canvas');
	$(self.canvas).bind('click contextmenu', function(e) {
		
		// Die aktuelle Mausposition in mouseData ablegen
		self.mousePosition = self.getPositionFromClientPosition(e.clientX, e.clientY);

		// Das click-Event in die Event-Warteschlange einfügen
		if (self.mousePosition.x > 0 && self.mousePosition.y > 0) {
			self.eventQueue.push({ type: 'mouse', key: e.which, x: self.mousePosition.x, y: self.mousePosition.y });
		}

		return false;
	});

	// Event-Handler zur Ermittlung Mausposition erstellen
	console.log('Installing Handler for mousemove-events from document...');
	$(document).bind('mousemove', function(e) {
		
		// Die aktuelle Mausposition in mouseData ablegen
		self.mousePosition = self.getPositionFromClientPosition(e.clientX, e.clientY);

		return false;
	});

	// Konstruktor ist fertig, die Statemachine anwerfen.
	console.log('Constructor finished, starting terminal...');
	self.run();
}

/** EOF **/