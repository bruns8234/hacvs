﻿var page = {
	columns:		84,				// 127 Die Anzahl der von dieser Terminalseite gewünschten Spalten.
	rows:			67,				// 102 Die Anzahl der von dieser Terminalseite gewünschten Zeilen.
	centerTerminal: false,			// True wenn das Terminal im Fenster zentriert werden soll. Bei False wird es oben links angezeigt.
	showGrid:		true,			// Das Hilfsraster im Terminal anzeigen (=true) oder nicht (=false).
	
	images: [						// Ein Array mit allen vom Terminal benötigten Bildern.
		'led2rt_off:led_2x2_rt_off.png', 'led2rt_on:led_2x2_rt_on.png',
		'led2ge_off:led_2x2_ge_off.png', 'led2ge_on:led_2x2_ge_on.png',
		'led2gn_off:led_2x2_gn_off.png', 'led2gn_on:led_2x2_gn_on.png',
		'sound-on:speaker_on.png',       'sound-off:speaker_off2.png'

	],

	elements: [
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col:  1, row:  1, width:  2, height:  4, mode: 'REGULAR', color: 'ORANGE',     type: 'RD' }},			// Obere linke Ecke vom rechten Bereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col:  3, row:  1, width: 80, height:  3, mode: 'REGULAR', color: 'ORANGE',     direction: 'HOR' }},		// Oberer Rand vom rechten Bereich
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  4, row:  1, width: 78, height:  3, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 3, invers: true, text: 'Aktueller Status der Rollos: Gesamtansicht', textAlign: 'center' }},
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col: 83, row:  1, width:  2, height:  4, mode: 'REGULAR', color: 'ORANGE',     type: 'LD' }},			// Obere rechte Ecke vom rechten Bereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col:  1, row:  5, width:  1, height: 44, mode: 'REGULAR', color: 'ORANGE',     direction: 'VERT' }},		// Linker Rand vom rechten Bereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col: 84, row:  5, width:  1, height: 44, mode: 'REGULAR', color: 'ORANGE',     direction: 'VERT' }},		// Rechter Rand vom rechten Bereich
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col:  1, row: 49, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',     type: 'RU' }},			// Untere linke Ecke vom rechten Bereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col:  3, row: 50, width: 80, height:  2, mode: 'REGULAR', color: 'ORANGE',     direction: 'HOR' }},		// Unterer Rand vom rechten Bereich
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col: 83, row: 49, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',     type: 'LU' }},			// Untere rechte Ecke vom rechten Bereich

		// Bedientasten Hauptfunktionen: ROLLOS  LICHT  HEIZUNG  SYSTEM
		{ element: 'BUTTON',      id: 'ROLLO',    zindex: 0, config: { col:  1, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'ROLLOS',    textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
		{ element: 'BUTTON',      id: 'LIGHT',    zindex: 0, config: { col: 12, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'LICHT',     textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
		{ element: 'BUTTON',      id: 'HEATING',  zindex: 0, config: { col: 23, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'HEIZUNG',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
		{ element: 'BUTTON',      id: 'PROGRAMS', zindex: 0, config: { col: 34, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'PROGRAMME', textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
		{ element: 'BUTTON',      id: 'SYSTEM',   zindex: 0, config: { col: 45, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'SYSTEM',    textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
//		{ element: 'BUTTON',      id: 'SPARE1',   zindex: 0, config: { col: 56, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'SPARE 1',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
//		{ element: 'BUTTON',      id: 'SPARE2',   zindex: 0, config: { col: 67, row: 52, width: 11, height:  2, mode: 'REGULAR', color: 'LEUCHTBLAU', textFont: 'Terminal', text: 'SPARE 2',   textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
		{ element: 'BUTTON',      id: 'LOCK',     zindex: 0, config: { col: 79, row: 52, width:  6, height:  2, mode: 'REGULAR', color: 'ROTBRAUN',   textFont: 'Terminal', text: 'LOCK',      textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_START' }},

		// Übersicht Rollopos. Räume Erdgeschoss: Schlafzimmer links, Schlafzimmer rechts, Flur Strasse, Flur 1/2 Treppe, Wohnzimmer links, Wohnzimmer rechts, Kaminzimmer, Esszimmer, Küche, Badezimer gross, Badezimmer klein
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row:  5, width: 39, height:  2, mode: 'REGULAR', color: 'FLIEDER',    textFont: 'Terminal', textSize: 2, text: 'Erdgeschoss',         textAlign: 'center', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row:  7, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Schlafzimmer links',  textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row:  7, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row:  7, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row:  9, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Schlafzimmer rechts', textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row:  9, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row:  9, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 11, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Flur Strasse',        textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 11, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 11, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 13, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Flur 1/2 Treppe',     textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 13, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 13, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 15, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Wohnzimmer links',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 15, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 15, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 17, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Wohnzimmer rechts',   textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 17, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 17, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 19, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Kaminzimmer',         textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 19, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 19, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 21, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Esszimmer',           textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 21, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 21, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 23, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Küche',               textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 23, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 23, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 25, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Badezimmer gross',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 25, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 25, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 27, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Badezimmer klein',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 20, row: 27, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                   textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 27, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                textAlign: 'right' }},

		// Übersicht Rollopos. Räume Obergeschoss: Lounge Blumenfenster, Lounge Sitzecke, Gästezimmer Hof Dachfenster, Gästezimmer Hof Giebelfenster, Thorsten Giebelfenster gross, Thorsten Giebelfenster klein, Thorsten Dachfenster,
		// Gästezimmer Strasse, Modellbahnzimmer Strasse links, Modellbahnzimmer Strasse rechts, Modellbahnzimmer Hof, Badezimmer
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row:  5, width: 39, height:  2, mode: 'REGULAR', color: 'FLIEDER',    textFont: 'Terminal', textSize: 2, text: 'Obergeschoss',          textAlign: 'center', invers: true, transparent: false }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row:  7, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Lounge Blumenfenster',  textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row:  7, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row:  7, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},
		
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row:  9, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Lounge Sitzecke',       textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row:  9, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row:  9, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},
		
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 11, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Gäste Hof Dachf.', textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 11, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 11, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 13, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Gäste Hof klein',     textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 13, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 13, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 15, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Thorsten gross',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 15, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 15, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 17, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Thorsten klein',   textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 17, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 17, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 19, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Thorsten Dachfenster',         textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 19, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 19, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 21, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Gäste Strasse',           textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 21, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 21, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 23, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Modellbahn Str. links',               textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 23, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 23, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 25, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Modellbahn Str. rechts',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 25, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 25, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 27, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Modellbahn Hof',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 27, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 27, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},

		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 44, row: 29, width: 16, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Badezimmer',    textAlign: 'left'  }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 61, row: 29, width: 18, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' ',                     textAlign: 'left', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 79, row: 29, width:  4, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '100%',                  textAlign: 'right' }},
		
		
//		Erdgeschoss																				Obergeschoss
//		xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx
//		Schlaf-	Schlaf-	Flur	Flur	Wohn-	Wohn-	Kamin-	Ess-	Küche	Bade-	Bade-	Lounge	Lounge	Gäste-	Gäste-	ThorstenThorstenThorsten
//		zimmer	zimmer	Strasse	Treppe	zimmer	zimmer	zimmer	zimmer			zimmer	zimmer	Blumen-	Sitz-	z. Hof	z. Hof	Giebelf.Giebelf.Dach-
//		links	rechts					links	rechts							gross	klein	fenster	breich	Dachf.	klein	gross	klein	fenster

		// Statusbereich unten: Anzeige des aktuellen Systemstatus (CCU, IPS-Server, WHS, usw.)
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col:  1, row: 54, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',     type: 'RD' }},			// Obere linke Ecke vom Statusbereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col:  3, row: 54, width: 80, height:  2, mode: 'REGULAR', color: 'ORANGE',     direction: 'HOR' }},		// Oberer Rand vom Statusbereich
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col: 83, row: 54, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',     type: 'LD' }},			// Obere rechte Ecke vom Statusbereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col:  1, row: 57, width:  1, height:  8, mode: 'REGULAR', color: 'ORANGE',     direction: 'VERT' }},		// Linker Rahmen vom Statusbereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col: 84, row: 57, width:  1, height:  8, mode: 'REGULAR', color: 'ORANGE',     direction: 'VERT' }},		// Rechter Rahmen vom Statusbereich
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col:  1, row: 65, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',     type: 'RU' }},			// Obere linke Ecke vom Statusbereich
		{ element: 'BAR',         id: 'auto',     zindex: 0, config: { col:  3, row: 66, width: 80, height:  2, mode: 'REGULAR', color: 'ORANGE',     direction: 'HOR' }},		// Oberer Rand vom Statusbereich
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  4, row: 66, width: 17, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, invers: true, text: 'Gutengermendorf 34', textAlign: 'left' }},
		{ element: 'SOUNDTOGGLE', id: 'SNDTGL',   zindex: 0, config: { col: 65, row: 66, width:  2, height:  2, mode: 'REGULAR', color: 'ORANGE',     pictureOff: 'sound-off', pictureOn: 'sound-on' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 68, row: 66, width: 13, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, invers: true, text: 'HACVS-Terminal V1', textAlign: 'right' }},
		{ element: 'EDGE',        id: 'auto',     zindex: 0, config: { col: 83, row: 65, width:  2, height:  3, mode: 'REGULAR', color: 'ORANGE',     type: 'LU' }},			// Obere rechte Ecke vom Statusbereich

		// Tabelle 1: Die HomeMatic-CCU
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 57, width: 22, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'HomeMatic CCU:', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 59, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Systemmeldungen' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 61, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Alarmmeldungen' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col:  3, row: 63, width: 15, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Batterie-Status' }},
		{ element: 'IMGVALUE',    id: 'CCU_GE',   zindex: 0, config: { col: 22, row: 57, width:  2, height:  2, mode: 'REGULAR', color: 'ORANGE',     varID: 43916, varType: 0, frame: false, resource: '0=led2ge_off:1=led2ge_on' }},
		{ element: 'IMGVALUE',    id: 'CCU_RT',   zindex: 0, config: { col: 22, row: 57, width:  2, height:  2, mode: 'REGULAR', color: 'ORANGE',     varID: 43916, varType: 0, frame: false, resource: '0=led2rt_off:1=led2rt_on' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 18, row: 59, width:  7, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '0',    textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 18, row: 61, width:  7, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '0',    textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 18, row: 63, width:  7, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'LEER', textAlign: 'right' }},

		// Tabelle 2: Der Window-Home-Server:
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 26, row: 57, width: 22, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Windows Home Server:', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 26, row: 59, width: 12, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'CPU Auslastung' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 26, row: 61, width: 12, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Phys.Sp. frei' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 26, row: 63, width: 12, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Pagefile frei' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 59, width: 10, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '12%',           textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 61, width: 10, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '1.264.364 KiB', textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 38, row: 63, width: 10, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '3.186.860 KiB', textAlign: 'right' }},

		// Tabelle 3: IP-Symocn-Service:
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 49, row: 57, width: 22, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'IP-Symcon Service:', invers: true, transparent: false }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 49, row: 59, width: 14, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Prozessspeicher' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 49, row: 61, width: 14, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Anzahl Subprozesse' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 49, row: 63, width: 14, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: 'Virtueller Speicher' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 63, row: 59, width:  8, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: ' 85.748 KiB', textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 63, row: 61, width:  8, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '48',          textAlign: 'right' }},
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 63, row: 63, width:  8, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '249.012 KiB', textAlign: 'right' }},

		//
		{ element: 'TEXT',        id: 'auto',     zindex: 0, config: { col: 72, row: 57, width: 11, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', textSize: 2, text: '>> Statusseiten', textAlign: 'center' }},
		// Bedientasten Statusdisplays: BATTERIEN, HM-FUNK
		{ element: 'BUTTON',      id: 'BATSTAT',  zindex: 0, config: { col: 72, row: 60, width: 11, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', text: 'BATTERIE', textAlign: 'center', buttonType: 'button', sClick: 'kay_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
		{ element: 'BUTTON',      id: 'RADSTAT',  zindex: 0, config: { col: 72, row: 63, width: 11, height:  2, mode: 'REGULAR', color: 'ORANGE',     textFont: 'Terminal', text: 'HM-FUNK',  textAlign: 'center', buttonType: 'button', sClick: 'key_pressed1', condition: false, actionType: 'page', pageID: 'EFL_MAIN' }},
	]
};
