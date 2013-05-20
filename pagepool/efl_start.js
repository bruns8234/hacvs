﻿var page = {
	columns:		84,				// 127 Die Anzahl der von dieser Terminalseite gewünschten Spalten.
	rows:			67,				// 102 Die Anzahl der von dieser Terminalseite gewünschten Zeilen.
	centerTerminal: false,			// True wenn das Terminal im Fenster zentriert werden soll. Bei False wird es oben links angezeigt.
	showGrid:		false,			// Das Hilfsraster im Terminal anzeigen (=true) oder nicht (=false).
	
	images: [						// Ein Array mit allen vom Terminal benötigten Bildern. Jeder Eintrag besteht aus "name:dateiname"
        'ips-logo:ip-symcon.png', 'sound-on:speaker_on.png', 'sound-off:speaker_off2.png'
	],

	elements: [						// Ein Array mit allen Elementen die auf dem Terminal angezeigt werden.
		// Rahmen, Grundbeschriftung und Soundumschalter:
		{ element: 'EDGE',        id: 'auto',    zindex: 0, config: { col:  1, row:  1, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',   type: 'RD' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col:  3, row:  1, width: 80, height:  2, mode: 'REGULAR', color: 'ORANGE',   direction: 'HOR' }},
		{ element: 'EDGE',        id: 'auto',    zindex: 0, config: { col: 83, row:  1, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',   type: 'LD' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col:  1, row:  4, width:  1, height: 52, mode: 'REGULAR', color: 'ORANGE',   direction: 'VERT' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col: 84, row:  4, width:  1, height: 52, mode: 'REGULAR', color: 'ORANGE',   direction: 'VERT' }},
		{ element: 'EDGE',        id: 'auto',    zindex: 0, config: { col:  1, row: 56, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',   type: 'RU' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col:  3, row: 57, width: 22, height:  2, mode: 'REGULAR', color: 'ORANGE',   direction: 'HOR' }},
		{ element: 'EDGE',        id: 'auto',    zindex: 0, config: { col: 25, row: 57, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',   type: 'LD' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col: 26, row: 60, width:  1, height:  8, mode: 'REGULAR', color: 'ORANGE',   direction: 'VERT' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col: 27, row: 60, width:  1, height:  8, mode: 'REGULAR', color: 'ORANGE',   direction: 'VERT' }},
		{ element: 'EDGE',        id: 'auto',    zindex: 0, config: { col: 27, row: 57, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',   type: 'RD' }},
		{ element: 'BAR',         id: 'auto',    zindex: 0, config: { col: 29, row: 57, width: 54, height:  2, mode: 'REGULAR', color: 'ORANGE',   direction: 'HOR' }},
		{ element: 'EDGE',        id: 'auto',    zindex: 0, config: { col: 83, row: 56, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',   type: 'LU' }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col:  4, row:  1, width: 17, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, invers: true, text: 'Gutengermendorf 34' }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 69, row:  1, width: 13, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, invers: true, text: 'HACVS-Terminal V1', textAlign: 'right' }},
		{ element: 'SOUNDTOGGLE', id: 'SNDTGL',  zindex: 0, config: { col: 66, row:  1, width:  2, height:  2, mode: 'REGULAR', color: 'ORANGE',   pictureOff: 'sound-off', pictureOn: 'sound-on' }},

		// Interne Sensoren:
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col:  4, row: 57, width: 17, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, invers: true, text: 'Status interne Sensoren' }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col:  2, row: 60, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, text: 'Optische   Sensoren', textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 18, row: 60, width:  6, height:  2, mode: 'REGULAR', color: 'ROTBRAUN', textFont: 'myTerminal', textSize: 2, text: 'OFFLINE', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col:  2, row: 62, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, text: 'Akustische Sensoren', textAlign: 'right' }}, 
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 18, row: 62, width:  6, height:  2, mode: 'REGULAR', color: 'ROTBRAUN', textFont: 'myTerminal', textSize: 2, text: 'OFFLINE', invers: true, transparent: false }}, 
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col:  2, row: 64, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, text: 'Bewegungs Sensoren', textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 18, row: 64, width:  6, height:  2, mode: 'REGULAR', color: 'ROTBRAUN', textFont: 'myTerminal', textSize: 2, text: 'OFFLINE', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col:  2, row: 66, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, text: 'Haptische  Sensoren', textAlign: 'right' }}, 
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 18, row: 66, width:  6, height:  2, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 2, text: 'ONLINE', invers: true, transparent: false }},

		// IPS-Logo und Begrüßungstext:
		{ element: 'PICTURE',	  id: 'auto',    zindex: 0, config: { col:  4, row:  5, width: 20, height: 20, mode: 'REGULAR', color: 'ORANGE',   name:     'ips-logo', }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 30, row: 10, width: 24, height:  5, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 5, text: 'Herzlich Willkommen' }},
		{ element: 'TEXT',        id: 'auto',    zindex: 0, config: { col: 30, row: 21, width: 40, height: 12, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', textSize: 3, text: 'Terminal authorisieren   :', wordWrap: true }},

		// Eingabetastatur für ACCESS-Code:
		{ element: 'BUTTON',      id: 'KEY1',    zindex: 0, config: { col: 30, row: 29, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '1',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '1', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY2',    zindex: 0, config: { col: 37, row: 29, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '2',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '2', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY3',    zindex: 0, config: { col: 44, row: 29, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '3',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '3', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY4',    zindex: 0, config: { col: 30, row: 33, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '4',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '4', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY5',    zindex: 0, config: { col: 37, row: 33, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '5',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '5', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY6',    zindex: 0, config: { col: 44, row: 33, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '6',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '6', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY7',    zindex: 0, config: { col: 30, row: 37, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '7',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '7', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY8',    zindex: 0, config: { col: 37, row: 37, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '8',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '8', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY9',    zindex: 0, config: { col: 44, row: 37, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '9',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '9', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY_CLR', zindex: 0, config: { col: 30, row: 41, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: 'CLR', textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'clear', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEY0',    zindex: 0, config: { col: 37, row: 41, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: '0',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'store', actionValue: '0', storageID: 'passCode' }},
		{ element: 'BUTTON',      id: 'KEYHASH', zindex: 0, config: { col: 44, row: 41, width:  7, height:  3, mode: 'REGULAR', color: 'ORANGE',   textFont: 'myTerminal', text: 'ACC', textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: 'storage', conditionID: 'passCode', conditionValue: '16775', sGo: 'access_permitted', sError: 'access_denied', actionType: 'page', pageID: 'EFL_MAIN' }},
	]
};