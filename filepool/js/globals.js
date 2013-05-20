/******************************************************************************************************************************/
/**                                                                                                                          **/
/**  GLOBALE VARIABLEN                                                                                                       **/
/**                                                                                                                          **/
/******************************************************************************************************************************/


/**
    @description    Die globalen Farbtabellen für die Terminalpage-Darstellung.
**/
var colorTables = {
    orange:         { disabled:   'rgb(155, 53,  0)', regular:    'rgb(255, 152,   0)', highlight:  'rgb(255, 227,  75)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    flieder:        { disabled:   'rgb(104, 53,104)', regular:    'rgb(204, 153, 204)', highlight:  'rgb(255, 228, 255)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    blaugrau:       { disabled:   'rgb( 53, 53,104)', regular:    'rgb(153, 153, 204)', highlight:  'rgb(228, 228, 255)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    rotbraun:       { disabled:   'rgb(104,  2,  2)', regular:    'rgb(204, 102, 102)', highlight:  'rgb(255, 177, 177)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    beige:          { disabled:   'rgb(155,104, 53)', regular:    'rgb(255, 204, 153)', highlight:  'rgb(255, 255, 218)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    leuchtblau:     { disabled:   'rgb( 53, 53,155)', regular:    'rgb(153, 153, 255)', highlight:  'rgb(228, 228, 255)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    apricot:        { disabled:   'rgb(155, 53,  2)', regular:    'rgb(255, 153, 102)', highlight:  'rgb(255, 228, 177)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
    pink:           { disabled:   'rgb(104,  2, 53)', regular:    'rgb(204, 102, 153)', highlight:  'rgb(255, 177, 228)',
                      alarm:      'rgb(255,  0,  0)', background: 'rgb(  0,   0,   0)' },
};
var colorTableList = 'orange|flieder|blaugrau|rotbraun|beige|leuchtblau|apricot|pink';


/**
    @description    Vorgabewerte für Schriftgröße, Zeilenhöhe und vertikalem Offset für alle verfügbaren Schriftarten,
                    individuell für jede Schriftgröße von 1 bis 10 Rasterzeilen.
**/
var fontData = {
    myterminal: {
        fontName:      'myTerminal',
        baselineMode: 'top',
        fontSize:     [0, +0.65, +1.45, +2.25, +3.00, +3.85, +4.60, +5.50, +6.30, +7.25, +8.00],
        yOffset:      [0, +0.15, +0.20, +0.30, +0.40, +0.45, +0.50, +0.60, +0.70, +0.75, +0.80],
        lineHeight:   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    mygtj3:     {
        fontName:      'myGTJ3',
        baselineMode: 'top',
        fontSize:     [0, +0.65, +1.45, +2.50, +3.60, +4.40, +5.50, +6.50, +7.40, +8.25, +9.50],
        yOffset:      [0, +0.15, +0.20, +0.15, -0.10, -0.10, -0.15, -0.20, -0.30, -0.35, -0.40],
        lineHeight:   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    myoriginal: {
        fontName:      'myOriginal',
        baselineMode: 'top',
        fontSize:     [0, +0.60, +1.40, +2.20, +3.05, +3.95, +4.70, +5.50, +6.25, +7.00, +8.05],
        yOffset:      [0, +0.10, +0.10, +0.20, +0.10, +0.10, +0.20, +0.20, +0.20, +0.20, -0.10],
        lineHeight:   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
};


/******************************************************************************************************************************/
/**                                                                                                                          **/
/**  GLOBALE FUNKTIONEN                                                                                                      **/
/**                                                                                                                          **/
/******************************************************************************************************************************/


/**
    @description    Liefert den dem Modus entsprechenden Farbwert einer bestimmten Farbtabelle.
    @param          {string}    colorTable      Die gewünschte Farbpalette
    @param          {string}    colorMode       Der gewünschte Farbmodus
    
    @return         {string}    Der gewünschte Farbwert als CSS rgb-Funktionsstring
**/
function getColorValue(colorTable, colorMode) {

        return colorTables[colorTable.toLowerCase()][colorMode.toLowerCase()];
}


/**
    @description    Erzeugt einen clone des übergebenen Objekts.
    @param          {object}    source              Das zu kopierende Objekt

    @return         {object}                        Die aus dem übergebenen Objekt erzeugte Kopie.
 */
function clone(source) {

    return Object.create(source);

}


/**
    @description    Zerlegt einen übergebene Definitionsstring für Parametertypen in Einzelangaben
    @param          {string}    typeDefinition      Die Typdefinition. Arrays werden mit array[ eingeleitet und mit ]
                                                    abgeschlossen, alternative Typen mit | getrennt.
    @param          {boolean}   [isArray = false]   Gibt an, ob es sich bei der Definition um eine Arrayinterne Angabe
                                                    handelt oder nicht - Nur für internen Gebrauch!

    @return         {object}                        Ein Objekt welches zwei Listen enthält: 
                                                    - valueType     Enthält die Liste möglicher Typen für Parameter
                                                    - fieldType     Enthält die Liste möglicher Typen für Arrayfelder
 */
function getValueTypes(typeDefinition, isArray) {

    var parts = typeDefinition.split('|');
    var group = '';
    var valueTypeList = [];
    var fieldTypeList = [];
    var arrayFlag = isArray || false;
    var index, key;

    for (index in parts) {
        group += parts[index];

        if (group.indexOf('[') === -1) {
            if (!arrayFlag) {
                valueTypeList.push(group);
            } else {
                fieldTypeList.push(group);
            }
            group = '';
        } else {
            if (group.indexOf(']') === -1) {
                group += '|';
            } else {
                // Array-Hülle entfernen und result erneut durch den Parser schicken
                var newValue = group.substring(group.indexOf('[') + 1, group.indexOf(']'));
                group = getValueTypes(newValue, true);
                if (group.valueType.length > 0) {
                    for (key in group.valueType) {
                        valueTypeList.push(group.valueType[key]);
                    }
                }
                if (group.fieldType.length > 0) {
                    for (key in group.fieldType) {
                        fieldTypeList.push(group.fieldType[key]);
                    }
                }
                group = '';
            }
        }
    }
    return {valueType: valueTypeList, fieldType: fieldTypeList};
}


/**
    @description    Überprüft, ob alle muss-Parameter im config-objekt vorhanden sind und ergänzt alle
                    optionalen Parameter, so das die Funktion einen kompletten Parametersatz erhält.
    @param          {object}    pConfig             Das zu überprüfende config-Objekt
    @param          {object}    pPreset             Beschreibung aller Parameter des config-Objekts

    @return         {object}                        Das Ergebnis der Parameterprüfung (config, valid, error)
 */
function checkParameter(pConfig, pPreset) {

    var result      = {};
    var configValid = true;
    var configError = '';
    var key;

    // Alle Eigenschaften von pPreset in result kopieren
    result = clone(pPreset);

    // Alle Eigenschaften aus pConfig in result übertragen
    for (key in pConfig) {
        // Prüfen ob der Schlüssel aus pConfig in result vorhanden ist.
        // Wenn nicht handelt es sich um einen unbekannten Parameter, dann Fehler auslösen
        if (result[key] === undefined) {
            configValid  = false;
            configError += '«' + key + '» ist kein gültiger Parameter!\r\n';
        } else {
            result[key] = pConfig[key];
        }
    }
    
    // Das result-Objekt durchlaufen und alle Default-Werte übernehmen
    for (key in result) {
        // Existiert eine valueDefault-Eigenschaft so haben wir einen undefinierten Parameter mit Defaultwert
        if (result[key].valueDefault !== undefined) {
            // Den Defaultwert in den Parameter übernehmen
            result[key] = result[key].valueDefault;
        }
    }

    // Prüfen ob muss-Eigenschaften nicht definiert sind und ggf. Fehlermeldung(en) erzeugen
    for (key in result) {

        // result[key] ist 'object' UND hat Eigenschaft 'valueType' - MUSS-Eigenschaft fehlt
        if (typeof result[key] === 'object' && result[key].valueType !== undefined) {
            configValid  = false;
            configError += 'Parameter «' + key + '» ist nicht optional!\r\n';
            continue;
        }

        // result[key] ist kein 'object' UND pPreset[key] ist 'object' - Eigenschaft validieren
        if (typeof result[key] !== 'object' && typeof pPreset[key] === 'object') {

            // Die Typevorgaben zerlegen und speichern, anschließend den Eigenschaftswert prüfen
            var splitResult     = getValueTypes(pPreset[key].valueType);
            var valueTypeList   = splitResult.valueType;
            var validValueTypes = valueTypeList.toString();
            var fieldTypeList   = splitResult.fieldType;
            var validFieldTypes = fieldTypeList.toString();
            var vIndex, configValue, varType;


            // Prüfen ob der Eigenschaftswert ein Array ist oder nicht
            if (typeof result[key] === 'object' && result[key] instanceof Array) {
                // Der zu prüfende Wert ist ein Array, gegen validFieldTypes prüfen
                if (fieldTypeList.length > 0) {
                    // Jeden Feldwert im result-Array prüfen, ob er einen zulässigen Datentyp hat...
                    for (vIndex in result[key]) {
                        varType = typeof result[key][vIndex];
                        if (_.find(fieldTypeList, function(validType) { return varType === validType; }) === undefined) {
                            configValid  = false;
                            configError += 'Parameter «' + key + '[' + vIndex + ']» ist kein ' +
                                            validFieldTypes + '!\r\n';
                        }
                    }
                } else {
                    // FeldWert ist in Array, aber Array ist nicht zulässig! configValid = false
                    configValid  = false;
                    configError += 'Parameter «' + key + '» darf kein Array sein!\r\n';
                }
            } else {
                // Der zu prüfende Wert ist kein Array, gegen validValueTypes prüfen
                if (valueTypeList.length > 0) {
                    varType = typeof result[key];
                    if (_.find(valueTypeList, function(validType) { return varType === validType; }) === undefined) {
                        configValid  = false;
                        configError += 'Parameter «' + key + '» ist kein ' + validValueTypes + '!\r\n';
                    }
                } else {
                    configValid  = false;
                    configError += 'Parameter «' + key + '» muss ein Array sein!\r\n';
                }
            }
            if (!configValid) {
                continue;
            }

            // 2. Prüfung der Grenzwerte. Geprüft werden minValue, maxValue, valueList
            // Bei Datentyp Array wird jedes Element gegen diese Grenzwerte geprüft.
            if (pPreset[key] === 'array') {
                configValue = result[key];
            } else {
                configValue = [result[key]];
            }

            // Alle Elemente des Arrays durchlaufen
            for (index in configValue) {
                var checkValue = configValue[index];
                var keyIndex   = (pPreset[key] === 'array' ? ('[' + index + ']') : '');
                if (typeof checkValue === 'number') {
                    if ((pPreset[key].valueMin !== undefined
                        && (checkValue < pPreset[key].valueMin))) {
                        configValid  = false;
                        configError += 'Parameter «' + key + keyIndex + '» ist zu klein! ' +
                                            'Kleinster zul. Wert ist ' + pPreset[key].valueMin;
                    }
                    if ((pPreset[key].valueMax !== undefined
                        && (checkValue > pPreset[key].valueMax))) {
                        configValid  = false;
                        configError += 'Parameter «' + key + keyIndex + '» ist zu groß! ' +
                                            'Größter zul. Wert ist ' + pPreset[key].valueMax;
                    }
                }
                if (typeof checkValue === 'string' && pPreset[key].valueList !== undefined) {
                    var refList = pPreset[key].valueList.toLowerCase();
                    if (refList.indexOf(checkValue.toLowerCase()) === -1) {
                        configValid  = false;
                        configError += 'Parameter «' + key + keyIndex + '» unzulässig! ' +
                                       'Zulässig sind ' + pPreset[key].valueList.replace('|', ', ');
                    }
                }
            }
        }
    }

    // result an den Aufrufer übergeben
    return {config: result, valid: configValid, error: configError};
}


/**
    @description    Gibt einen Text mit automatischen Zeilenumbruch an Wortgrenzen aus.
    @param          {object}    context             Referenz auf das CANVAS-Objekt auf dem der Text ausgegeben wird.
    @param          {string}    text                Der auszugebene Text. Steuerzeichen werden NICHT berücksichtigt.
    @param          {integer}   x                   X-Position für die Textausgabe
    @param          {integer}   y                   Y-Position für die Textausgabe
    @param          {integer}   maxWidth            Maximal Breite einer Textzeile in pt (Einheit von measureText)
    @param          {integer}   lineHeight          Zeilenhöhe (=Y-Offset zwischen 2 Textzeilen)
    
    @return         {integer}                       Die Y-Position der nächsten Zeile (für weitere Textausgaben)
 */
function wordWrap(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var n;

    for (n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);

    y += lineHeight;

    return y;
}


/**
    @description    Ermittelt für einen Text mit gegebenen Schriftarteigenschaften die erforderliche Darstellungsbreite.
    @param          {string}    theText             Text dessen Darstellungsbreite ermittelt werden soll
    @param          {string}    usedFont            Die Schriftarteigenschaften die zur Darstellung angewendet werdern
    
    @return         {integer}                       Die notwendige Textbreite in Pixel
 */
function getTextWidth(theText, usedFont) {

    var canvas      = document.createElement('canvas');
    var context     = canvas.getContext('2d');
    context.font    = usedFont;
    var metric      = context.measureText(theText);

    return metric.width;
}

/* EOF */