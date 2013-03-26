/*************************************************************************************************************************************************************/
/**                                                                                                                                                         **/
/**                                           HOME         AUTOMATION        CONTROL      VISUALISATION      SYSTEM                                         **/
/**                                                                                                                                                         **/
/**                                     ###         ###     #######       ###########   ###         ###   ###########                                       **/
/**                                      ###       ###     #########     #############   ###       ###   #############                                      **/
/**                                      ###       ###    ###     ###   ###         ###  ###       ###  ###         ###                                     **/
/**                                      ###       ###   ###       ###  ###              ###       ###  ###                                                 **/
/**                                      ###       ###   ###       ###  ###              ###       ###  ###                                                 **/
/**                                      #############   #############  ###              ###       ###   ############                                       **/
/**                                      #############   #############  ###              ###       ###    ############                                      **/
/**                                      ###       ###   ###       ###  ###              ###       ###              ###                                     **/
/**                                      ###       ###   ###       ###  ###              ###       ###              ###                                     **/
/**                                      ###       ###   ###       ###  ###         ###   ###     ###   ###         ###                                     **/
/**                                      ###       ###   ###       ###   #############     #########     #############                                      **/
/**                                     ###         ### ###         ###   ###########       #######       ###########                                       **/
/**                                                                                                                                                         **/
/**                                                                                                                                                         **/
/**                                                                                                                                                         **/
/**                 ######  ###     ######  #     # ######  #     # #######          #####  ######  ####### ######   #####  #######  #####                  **/
/**                 #    ##  #      #    ## ### ### #    ## ##    # #  #  #         #     # #     #       # #    ## #    ## #  #  # #    ##                 **/
/**                 #  #     #      #  #    #  #  # #  #    # #   #    #            #     # #     #       # #  #    #          #    #                       **/
/**                 ####     #      ####    #     # ####    #  #  #    #    ####### #     # ######        # ####    #          #     #####                  **/
/**                 #  #     #      #  #    #     # #  #    #   # #    #            #     # #     #       # #  #    #          #          #                 **/
/**                 #    ##  #   ## #    ## #     # #    ## #    ##    #            #     # #     # ##   #  #    ## #    ##    #    ##    #                 **/
/**                 ######   #####  ######  ##   ## ######  #     #   ###            #####  ######   ####   ######   #####    ###    #####                  **/
/**                                                                                                                                                         **/
/**                                                                                                                                                         **/
/*************************************************************************************************************************************************************/


/**
    @description    Element: BAR
                    Dieses Element dient zur horizontalen oder vertikalen Trennung von Bereichen auf dem LCARS-Terminal. Zusammen mit dem EDGE-Element bildet
                        sie die Grundstruktur der Bedienoberfläche.
    @param          {number}            pRaster.gridWidth               Breite einer Rasterspalte in Pixel.
    @param          {number}            pRaster.gridHeight              Höhe einer Rasterzeile in Pixel.
    @param          {number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten.
    @param          {number}            pRaster.maxHeight               Anzahl der verfügbaren Rasterzeilen.
    @param          {number}            pConfig.col                     Linke Rasterspalte der Elementfläche.
    @param          {number}            pConfig.row                     Obere Rasterzeile der Elementfläche.
    @param          {number}            pConfig.width                   Breite des Elements in Rasterspalten.
    @param          {number}            pConfig.height                  Höhe des Elements in Rasterzeilen.
    @param          {string}            [pConfig.color='orange']        Zu verwendene Farbpalette.
    @param          {string}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled      Abgedunkelt und ausgegraut.
                                                                        - regular       Normale Farbgebung.
                                                                        - highlight     Hervorgehoben (z.B. bei Bedienung).
                                                                        - alarm         In Rot gefärbt (z.B. bei Systemalarm).
    @param          {string}            pConfig.direction                Die Ausrichtung der BAR. Zulässige Werte sind:
                                                                        - hor           Eine waagerechte BAR.
                                                                        - vert          Eine senkrechte BAR.
    @param          {object}            pMainObject                     Ref. auf die zentrale HACVS-Instanz dieses Terminals.
**/
function ElementBAR(pRaster, pConfig, pMainObject) {

    /*********************************************************************************************************************************************************/
    /** Private Eigenschaften von BAR                                                                                                                       **/
    /*********************************************************************************************************************************************************/
    var raster          = null;                                         // Rasterdefinition
    var config          = null;                                         // Elementkonfiguration
    var mainObject      = null;                                         // Ref. auf die zentrale HACVS-Instanz des Terminals
    var drawSet         = null;                                         // Zeichekoordinaten (berechnet der Konstruktor)
    var elementMode     = '';                                           // Aktueller Zustand des Elements
    var lastMode        = '';                                           // Der letzte Zustand des Elements
    var x               = 0;                                            // Der linke Rand des Elements (in Pixel)
    var y               = 0;                                            // Der obere Rand des Elements (in Pixel)
    var width           = 0;                                            // Die Beite des Elements (in Pixel)
    var height          = 0;                                            // Die Höhe des Elements (in Pixel)
    var defaultConfig   = {                                             // Standard- und Grenzwerte der Elementeigenschaften
        col:        { valueType: 'number', valueMin: 1 },
        row:        { valueType: 'number', valueMin: 1 },
        width:      { valueType: 'number', valueMin: 1 },
        height:     { valueType: 'number', valueMin: 1 },
        color:      { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:       { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        direction:  { valueType: 'string', valueList: 'hor|vert' }
    };

    /*********************************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von BAR                                                                                                                   **/
    /*********************************************************************************************************************************************************/
    this.configValid    = true;                                         // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                                           // Textbeschreibung aller config-Fehler


    /*********************************************************************************************************************************************************/
    /** Öffentliche Methoden von BAR                                                                                                                        **/
    /*********************************************************************************************************************************************************/

    /**
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas.
    @param          {string}            [colorKey]                      Eine Farbangabe in CSS-Notation. Ist dieser Parameter gesetzt, erzeugt die draw-Funk-
                                                                            tion eine Farbfläche über den gesamten Element-Bereich.
    @param          {object}            [hitContext]                    Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse oder NULL falls die Element-Konfiguration fehlerhaft ist.
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        if (this.configValid) {                                         // Zeichnen können wir nur wenn wir valide sind...

            if (colorKey !== undefined) {                               // Farbfläche oder Objektdarstellung?

                hitContext.save();                                      // Einfache Farbfläche erzeugen.
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {

                var eColor = getColorValue(config.color, elementMode);  // Eine BAR in der Farbe gemäß config.color:elementMode ausgeben.
                mainObject.context.save();
                mainObject.context.translate(x, y);
                mainObject.context.fillStyle   = eColor;
                mainObject.context.fillRect(drawSet.x, drawSet.y, drawSet.width, drawSet.height);
                mainObject.context.restore();
            }

            returnValue = this;                                         // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
        }
        return returnValue;
    };


    /**
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche auf dem Canvas gelöscht und dann ein Neu-
                        zeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}            Referenz auf die Klasse oder NULL falls die Element-Konfiguration fehlerhaft ist.
    **/
    this.update = function () {
        var returnValue = null;

        if (this.configValid) {                                         // Updaten können wir nur wen wir valide sind...

            // Aktualisierung der Anzeige: Die Fläche löschen
            mainObject.context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Ändert den Funktionsmodus des Elements.
    @param          {string}            newMode                         Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                                                        - *     versetzt das Element wieder in den vorherigen Mode
                                                                        - .     versetzt das Element in den Default-Farbmode

    @return         {object}                Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                elementMode = lastMode;
            } else {
                if (newMode === '.') {
                    lastMode    = config.mode;
                    elementMode = config.mode;
                } else {

                    // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
                    if (elementMode !== newMode.toUpperCase()) {

                        // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                        lastMode = elementMode;
                        elementMode = newMode.toUpperCase();
                    }
                }
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /*********************************************************************************************************************************************************/
    /** BAR Objekt-Konstruktor                                                                                                                              **/
    /*********************************************************************************************************************************************************/

    // Rückgabewert initialisieren
    var returnValue = false;

    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {

        // Fehler in der Element-Konfiguration. Meldung und Fehlerstatus im Objekt ablegen
        this.configValid = false;
        this.configError = result.error;

    } else {

        // Die vollständige Konfiguration in die config-Eigenschaft des Objekts kopieren
        config = clone(result.config);

        // Die Daten zum Terminalraster in die raster-Eigenschaft des Objekts kopieren
        raster = clone(pRaster);

        // Die mainObject-Referenz im Object abspeichern
        mainObject = pMainObject;
        
        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Das drawSet erzeugen und im Objekt speichern
        drawSet = {
            x: (config.direction.toLowerCase() === 'hor' ? 0 : 1),
            y: (config.direction.toLowerCase() === 'hor' ? 1 : 0),
            width:  (config.direction.toLowerCase() === 'hor' ? width : (width - 2)),
            height: (config.direction.toLowerCase() === 'hor' ? (height - 2) : height)
        };

        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}


/**
    @description    Element: EDGE
                    Dieses Element dient zur Verbindung von horizontalen und vertikalen BAR's auf dem Terminal. Zusammen mit dem BAR-Element bildet sie die
                        Grundstruktur der Bedienoberfläche
                        
    @param          {Number}            pRaster.gridWidth               Breite einer Rasterspalte in Pixel
    @param          {Number}            pRaster.gridHeight              Höhe einer Rasterzeile in Pixel
    @param          {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param          {Number}            pRaster.maxHeight               Anzahl der verfügbaren Rasterzeilen
    @param          {Number}            pConfig.col                     Linke Rasterspalte der Elementfläche
    @param          {Number}            pConfig.row                     Obere Rasterzeile der Elementfläche
    @param          {Number}            pConfig.width                   Breite des Elements in Rasterspalten
    @param          {Number}            pConfig.height                  Höhe des Elements in Rasterzeilen
    @param          {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param          {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled      Abgedunkelt und ausgegraut
                                                                        - regular       Normale Farbgebung
                                                                        - highlight     Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm         In Rot gefärbt (z.B. bei Systemalarm)
    @param          {String}            pConfig.type                    Ausrichtung der EDGE. Zulässige Werte sind:
                                                                        - rd            Obere linke Ecke
                                                                        - ld            Obere rechte Ecke
                                                                        - ru            Untere linke Ecke
                                                                        - lu            Untere rechte Ecke
    @param          {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param          {object}            pMainObject                     Ref. auf die zentrale HACVS-Instanz dieses Terminals

**/
function ElementEDGE(pRaster, pConfig, pContext, pMainObject) {

    /*********************************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von EDGE                                                                                                                  **/
    /*********************************************************************************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /*********************************************************************************************************************************************************/
    /** Private Eigenschaften von EDGE                                                                                                                      **/
    /*********************************************************************************************************************************************************/
    var raster          = null;                 // Rasterdefinition
    var config          = null;                 // Elementkonfiguration
    var context         = null;                 // Ref. auf 2D-Context für die Darstellung
    var drawSet         = null;                 // Zeichekoordinaten (berechnet der Konstruktor)
    var mainObject      = null;                 // Ref. auf die zentrale HACVS-Instanz des Terminals
    var elementMode     = '';                   // Aktueller Zustand des Elements
    var lastMode        = '';                   // Der letzte Zustand des Elements
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var defaultConfig   = {                     // Standard- und Grenzwerte der Elementeigenschaften
        col:        { valueType: 'number', valueMin: 1 },
        row:        { valueType: 'number', valueMin: 1 },
        width:      { valueType: 'number', valueMin: 1 },
        height:     { valueType: 'number', valueMin: 1 },
        color:      { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:       { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        type:       { valueType: 'string', valueList: 'rd|ld|ru|lu' }
    };


    /*********************************************************************************************************************************************************/
    /** Öffentliche Methoden von EDGE                                                                                                                       **/
    /*********************************************************************************************************************************************************/

    /**
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param          {string}            [colorKey]                      Eine Farbangabe in CSS2.1-Notation. Ist dieser Parameter vorhanden, erzeugt
                                                                            die draw-Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param          {object}            [hitContext]                    Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {
                // Eine EDGE in der Farbe gemäß config.color:elementMode ausgeben
                var eColor = getColorValue(config.color, elementMode);
                context.save();
                context.translate(x, y);
                context.fillStyle   = eColor;
                context.strokeStyle = eColor;
                context.lineWidth   = 1;
                context.beginPath();
                context.moveTo(drawSet.p1.x, drawSet.p1.y);
                context.lineTo(drawSet.p2.x, drawSet.p2.y);
                context.bezierCurveTo(drawSet.a1.x, drawSet.a1.y, drawSet.a1.x, drawSet.a1.y,
                                      drawSet.p3.x, drawSet.p3.y);
                context.lineTo(drawSet.p4.x, drawSet.p4.y);
                context.lineTo(drawSet.p5.x, drawSet.p5.y);
                context.bezierCurveTo(drawSet.a2.x, drawSet.a2.y, drawSet.a2.x, drawSet.a2.y,
                                      drawSet.p6.x, drawSet.p6.y);
                //context.lineTo(drawSet.p1.x, drawSet.p1.y);
                context.closePath();
                context.fill();
                //context.stroke();
                context.restore();
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche auf dem Canvas gelöscht und dann ein
                        Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}            Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche löschen
            context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Ändert den Funktionsmodus des Elements.
    @param          {string}            newMode                         Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                                                        - *             versetzt das Element wieder in den vorherigen Mode
                                                                        - .             versetzt das Element in den Default-Farbmode

    @return         {object}            Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                elementMode = lastMode;
            } else {
                if (newMode === '.') {
                    lastMode    = config.mode;
                    elementMode = config.mode;
                } else {
                    // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
                    if (elementMode !== newMode.toUpperCase()) {
                        // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                        lastMode = elementMode;
                        elementMode = newMode.toUpperCase();
                    }
                }
            }
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /*********************************************************************************************************************************************************/
    /** EDGE Objekt-Konstruktor                                                                                                                             **/
    /*********************************************************************************************************************************************************/

    var returnValue = false;

    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);

    if (!result.valid) {
        // Ups, config ist unvollständig oder fehlerhaft - Meldung übernehmen und mit FALSE beenden
        this.configValid = false;
        this.configError = result.error;
    } else {
        config = clone(result.config);

        // Das raster-Objekt in pRaster übernehmen
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die mainObject-Referenz im Objekt abspeichern
        mainObject = pMainObject;
        
        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Das drawSet erzeugen und im Objekt ablegen
        switch (config.type.toUpperCase()) {
        case 'RD':
            // Koordinaten der Punkte ermitteln und im drawSet speichern
            drawSet = {
                p1: { x: width,                        y: 1                              },
                p2: { x: width,                        y: height - raster.gridHeight - 1 },
                p3: { x: width - raster.gridWidth - 1, y: height                         },
                p4: { x: 1,                            y: height                         },
                p5: { x: 1,                            y: height - raster.gridHeight - 1 },
                p6: { x: raster.gridWidth,             y: 1                              },
                a1: { x: width - raster.gridWidth - 1, y: height - raster.gridHeight - 1 },
                a2: { x: 1,                            y: 1                              }
            };
            break;
        case 'LD':
            // Koordinaten der Punkte ermitteln und im drawSet speichern
            drawSet = {
                p1: { x: 0,                            y: 1                              },
                p2: { x: 0,                            y: height - raster.gridHeight - 1 },
                p3: { x: raster.gridWidth + 1,         y: height                         },
                p4: { x: width - 1,                    y: height                         },
                p5: { x: width - 1,                    y: height - raster.gridHeight - 1 },
                p6: { x: width - raster.gridWidth,     y: 1                              },
                a1: { x: raster.gridWidth + 1,         y: height - raster.gridHeight - 1 },
                a2: { x: width - 1,                    y: 1                              }
            };
            break;
        case 'RU':
            // Koordinaten der Punkte ermitteln und im drawSet speichern
            drawSet = {
                p1: { x: width,                        y: height - 1                     },
                p2: { x: width,                        y: raster.gridHeight + 1          },
                p3: { x: width - raster.gridWidth - 1, y: 0                              },
                p4: { x: 1,                            y: 0                              },
                p5: { x: 1,                            y: raster.gridHeight + 1          },
                p6: { x: raster.gridWidth,             y: height - 1                     },
                a1: { x: width - raster.gridWidth - 1, y: raster.gridHeight + 1          },
                a2: { x: 1,                            y: height - 1                     }
            };
            break;
        case 'LU':
            // Koordinaten der Punkte ermitteln und im drawSet speichern
            drawSet = {
                p1: { x: 0,                            y: height - 1                     },
                p2: { x: 0,                            y: raster.gridHeight + 1          },
                p3: { x: raster.gridWidth + 1,         y: 0                              },
                p4: { x: width - 1,                    y: 0                              },
                p5: { x: width - 1,                    y: raster.gridHeight + 1          },
                p6: { x: width - raster.gridWidth,     y: height - 1                     },
                a1: { x: raster.gridWidth + 1,         y: raster.gridHeight + 1          },
                a2: { x: width - 1,                    y: height - 1                     }
            };
            break;
        }

        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}


/**
    @description    Element: CAP
                    Dieses Element dient zum Abschluss eines BAR- oder TEXT-Elements. Sie dienen hauptsächlich zur Einfassung von BUTTON-Elementen, können aber
                        auch z.B. am Ende einer BAR platziert werden.
    @param          {Number}            pRaster.gridWidth               Breite einer Rasterspalte in Pixel
    @param          {Number}            pRaster.gridHeight              Höhe einer Rasterzeile in Pixel
    @param          {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param          {Number}            pRaster.maxHeight               Anzahl der verfügbaren Rasterzeilen
    @param          {Number}            pConfig.col                     Linke Rasterspalte der Elementfläche
    @param          {Number}            pConfig.row                     Obere Rasterzeile der Elementfläche
    @param          {Number}            pConfig.width                   Breite des Elements in Rasterspalten
    @param          {Number}            pConfig.height                  Höhe des Elements in Rasterzeilen
    @param          {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param          {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled      Abgedunkelt und ausgegraut
                                                                        - regular       Normale Farbgebung
                                                                        - highlight     Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm         In Rot gefärbt (z.B. bei Systemalarm)
    @param          {String}            pConfig.direction               Ausrichtung der CAP. Zulässige Werte sind:
                                                                        - r             Linker Abschluss
                                                                        - l             Rechter Abschluss
    @param          {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param          {object}            pMainObject                     Ref. auf die zentrale HACVS-Instanz dieses Terminals
**/
function ElementCAP(pRaster, pConfig, pContext) {

    /*********************************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von CAP                                                                                                                   **/
    /*********************************************************************************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /*********************************************************************************************************************************************************/
    /** Private Eigenschaften von CAP                                                                                                                       **/
    /*********************************************************************************************************************************************************/
    var raster          = null;                 // Rasterdefinition
    var config          = null;                 // Elementkonfiguration
    var context         = null;                 // Ref. auf 2D-Context für die Darstellung
    var drawSet         = null;                 // Zeichekoordinaten (berechnet der Konstruktor)
    var elementMode     = '';                   // Aktueller Zustand des Elements
    var lastMode        = '';                   // Der letzte Zustand des Elements
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var defaultConfig   = {                     // Standard- und Grenzwerte der Elementeigenschaften
        col:        { valueType: 'number', valueMin: 1 },
        row:        { valueType: 'number', valueMin: 1 },
        width:      { valueType: 'number', valueMin: 1 },
        height:     { valueType: 'number', valueMin: 1 },
        color:      { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:       { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        direction:  { valueType: 'string', valueList: 'r|l' }
    };


    /*********************************************************************************************************************************************************/
    /** Öffentliche Methoden von CAP                                                                                                                        **/
    /*********************************************************************************************************************************************************/

    /**
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param          {string}            [colorKey]                      Eine Farbangabe in CSS2.1-Notation. Ist dieser Parameter vorhanden, erzeugt die draw-
                                                                            Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param          {object}            [hitContext]                    Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {
                // Eine EDGE in der Farbe gemäß config.color:elementMode ausgeben
                var eColor = getColorValue(config.color, elementMode);
                context.save();
                context.translate(x, y);
                context.fillStyle   = eColor;
                context.strokeStyle = eColor;
                context.lineWidth   = 1;
                context.beginPath();
                context.moveTo(drawSet.p1.x, drawSet.p1.y);
                context.lineTo(drawSet.p2.x, drawSet.p2.y);
                context.lineTo(drawSet.p3.x, drawSet.p3.y);
                context.bezierCurveTo(drawSet.a1.x, drawSet.a1.y, drawSet.a2.x, drawSet.a2.y,
                                      drawSet.p4.x, drawSet.p4.y);
                context.closePath();
                context.fill();
                context.stroke();
                context.restore();
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche
                    auf dem Canvas gelöscht und dann ein Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}            Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche löschen
            context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Ändert den Funktionsmodus des Elements.
    @param          {string}            newMode                         Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                                                        - *             versetzt das Element wieder in den vorherigen Mode
                                                                        - .             versetzt das Element in den Default-Farbmode

    @return         {object}            Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                elementMode = lastMode;
            } else {
                if (newMode === '.') {
                    lastMode    = config.mode;
                    elementMode = config.mode;
                } else {
                    // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
                    if (elementMode !== newMode.toUpperCase()) {
                        // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                        lastMode = elementMode;
                        elementMode = newMode.toUpperCase();
                    }
                }
            }
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /*********************************************************************************************************************************************************/
    /** CAP Objekt-Konstruktor                                                                                                                              **/
    /*********************************************************************************************************************************************************/

    var returnValue = false;
    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {
        // Ups, config ist unvollständig oder fehlerhaft - Meldung übernehmen und mit FALSE beenden
        this.configValid = false;
        this.configError = result.error;
    } else {
        config = clone(result.config);

        // Das raster-Objekt in pRaster übernehmen
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Das drawSet erzeugen und im Objekt ablegen
        switch (config.direction.toUpperCase()) {
        case 'R':
            // Rasterkoordinaten der Punkte ermitteln und in Pixelwerte umrechnen
            drawSet = {
                p1: { x: width - 1,            y: 1 },
                p2: { x: width - 1,            y: height - 1 },
                p3: { x: raster.gridWidth - 1, y: height - 1 },
                p4: { x: raster.gridWidth - 1, y: 1 },
                a1: { x: raster.gridWidth / 2, y: height - 1 },
                a2: { x: raster.gridWidth / 2, y: 1 }
            };
            break;
        case 'L':
            // Rasterkoordinaten der Punkte ermitteln und in Pixelwerte umrechnen
            drawSet = {
                p1: { x: 1,                            y : 1 },
                p2: { x: 1,                            y : height - 1 },
                p3: { x: width - raster.gridWidth + 1, y: height - 1 },
                p4: { x: width - raster.gridWidth + 1, y: 1 },
                a1: { x: width - raster.gridWidth / 2, y: height - 1 },
                a2: { x: width - raster.gridWidth / 2, y: 1 }
            };
            break;
        }

        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}


/**
    @description    Element: TEXT
                    Ein in Größe, Ausrichtung und Schriftart frei konfigurierbares Textelement. Es beherscht mehrzeilige Anzeige, autoSizing und automatischen
                        Zeilenumbruch.
    @param          {Number}            pRaster.gridWidth               Breite einer Rasterspalte in Pixel
    @param          {Number}            pRaster.gridHeight              Höhe einer Rasterzeile in Pixel
    @param          {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param          {Number}            pRaster.maxHeight               Anzahl der verfügbaren Rasterzeilen
    @param          {Number}            pConfig.col                     Linke Rasterspalte der Elementfläche
    @param          {Number}            pConfig.row                     Obere Rasterzeile der Elementfläche
    @param          {Number|String}     [pConfig.width='auto']          Breite des Elements in Rasterspalten
    @param          {Number|String}     [pConfig.height='auto']         Höhe des Elements in Rasterzeilen
    @param          {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param          {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled      Abgedunkelt und ausgegraut
                                                                        - regular       Normale Farbgebung
                                                                        - highlight     Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm         In Rot gefärbt (z.B. bei Systemalarm)
    @param          {Boolean}           [pConfig.transparent=true]      Bei TRUE wird der Text transparent zum Untergrund angezeigt
    @param          {Boolean}           [pConfig.invers=false]          Bei TRUE wird Vorder- und Hintergrundfarbe getauscht
    @param          {String}            pConfig.text                    Der anzuzeigene Text. \n erzwingt einen Zeilenumbruch.
    @param          {String}            [pConfig.textAlign='left']      Hor. Ausrichtung des Textes (nur bei width != auto)
    @param          {Number}            [pConfig.textSize=2]            Größe des Textes in Rasterzeilen
    @param          {String}            [pConfig.textFont='Terminal']   Schriftart für die Textanzeige. Zulässige Werte sind:
                                                                        - Terminal      Schriftart (nur Großbuchst.) ähnlich StarTrek
                                                                        - GTJ3          Schrfitart ähnlich Terminal, mit extra Zeichen
                                                                        - Original      Die originale StarTrek Schrift, Groß- u. Kleinb.
    @param          {String}            [pConfig.textStyle='normal']    Zu verwendener Schriftstiel. Zulässige Werte sind:
                                                                        - normal        Einfache, reguläre Schrift
                                                                        - italic        Kursive Schrift
                                                                        - bold          Fettschrift
    @param          {Boolean}           [pConfig.wordWrap=false]        Wenn TRUE wird der Text bei erreichen der Elementbreite automatisch an der letzten
                                                                            möglichen Wortgrenze umgebrochen (nur bei width != auto). Manuelle Zeilenumbrüche
                                                                            werden unverändert übernommen.
    @param          {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param          {object}            pMainObject                     Ref. auf die zentrale HACVS-Instanz dieses Terminals
**/
function ElementTEXT(pRaster, pConfig, pContext) {

    /*********************************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von TEXT                                                                                                                  **/
    /*********************************************************************************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /*********************************************************************************************************************************************************/
    /** Private Eigenschaften von TEXT                                                                                                                      **/
    /*********************************************************************************************************************************************************/
    var raster          = null;                 // Rasterdefinition
    var config          = null;                 // Elementkonfiguration
    var context         = null;                 // Ref. auf 2D-Context für die Darstellung
    var drawSet         = null;                 // Zeichekoordinaten (berechnet der Konstruktor)
    var backBarElement  = null;                 // Ein BAR-Element, wenn transparent = FALSE ist
    var elementMode     = '';                   // Aktueller Zustand des Elements
    var lastMode        = '';                   // Der letzte Zustand des Elements
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var defaultConfig = {
        col:         { valueType: 'number', valueMin: 1 },
        row:         { valueType: 'number', valueMin: 1 },
        width:       { valueType: 'number|string', valueMin: 1, valueList: 'auto', valueDefault: 'auto' },
        height:      { valueType: 'number|string', valueMin: 1, valueList: 'auto', valueDefault: 'auto' },
        color:       { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:        { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        transparent: { valueType: 'boolean', valueDefault: true },
        invers:      { valueType: 'boolean', valueDefault: false },
        text:        { valueType: 'string' },
        textAlign:   { valueType: 'string', valueList: 'left|center|right', valueDefault: 'left' },
        textSize:    { valueType: 'number', valueMin: 1, valueMax: 10, valueDefault: 2 },
        textFont:    { valueType: 'string', valueList: 'terminal|gtj3|original', valueDefault: 'terminal' },
        textStyle:   { valueType: 'string', valueList: 'normal|italic|bold', valueDefault: 'normal' },
        wordWrap:    { valueType: 'boolean', valueDefault: false }
    };


    /*********************************************************************************************************************************************************/
    /** Öffentliche Methoden von TEXT                                                                                                                       **/
    /*********************************************************************************************************************************************************/

    /**
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param          {string}            [colorKey]                      Eine Farbangabe in CSS2.1-Notation. Ist dieser Parameter vorhanden, erzeugt die draw-
                                                                            Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param          {object}            [hitContext]                    Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {
                // Ein TEXT in der Farbe gemäß config und elementMode ausgeben
                var textMode    = (config.invers ? 'background' : elementMode.toLowerCase());
                var backBarMode = (!config.transparent && config.invers ? elementMode.toLowerCase() : 'background');
                backBarElement.setMode(backBarMode);

                // Hintergrundelement ausgeben wenn Text-Element nicht transparent ist
                if (!config.transparent) {
                    backBarElement.draw();
                }

                context.save();

                context.font         = drawSet.style + ' ' + drawSet.textFontSize + 'pt ' + drawSet.fontFamily;
                context.textAlign    = drawSet.align;
                context.textBaseline = drawSet.textBaseline;
                context.fillStyle    = getColorValue(config.color, textMode);
                // Als erstes den Text in seine Textzeilen aufteilen
                var zeilen = drawSet.text.split('\n');
                var zIndex, yPos, zeile;
                // Je nach dem ob wordWrap aktiv ist oder nicht wird unterschiedlich verfahren
                if (drawSet.wordWrap) {
                    // y-Position in Merkervariable übernehmen
                    yPos = drawSet.tpos.y;
                    // wordWrap aktiv, jede Textzeile verarbeiten und zur Ausgabe bringen
                    for (zIndex in zeilen) {
                        zeile = zeilen[zIndex];
                        yPos = wordWrap(context, zeile, drawSet.tpos.x, yPos,
                                        width - 4, drawSet.textLineSize);
                    }
                } else {
                    // Textausgabe ohne wordWrap, jede Zeile ausgeben, im Y-Abstand von drawSet.textHeight
                    yPos = drawSet.tpos.y;
                    for (zIndex in zeilen) {
                        zeile = zeilen[zIndex];
                        context.fillText(zeile, drawSet.tpos.x, yPos);
                        yPos += drawSet.textLineSize;
                    }
                }

                context.restore();
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche
                    auf dem Canvas gelöscht und dann ein Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}            Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche löschen
            context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Ändert den Funktionsmodus des Elements.
    @param          {string}            newMode                         Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                                                        - *             versetzt das Element wieder in den vorherigen Mode
                                                                        - .             versetzt das Element in den Default-Farbmode

    @return         {object}            Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                elementMode = lastMode;
            } else {
                if (newMode === '.') {
                    lastMode    = config.mode;
                    elementMode = config.mode;
                } else {
                    // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
                    if (elementMode !== newMode.toUpperCase()) {
                        // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                        lastMode = elementMode;
                        elementMode = newMode.toUpperCase();
                    }
                }
            }
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Ändert den anzuzeigenen Text im Element.
    @param          {string}            newText                         Der neue Text für das Element. \n erzwingt einen Zeilenumbrucht.

    @return         {object}            Referenz auf die Klasse
    **/
    this.setText = function (newText) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ab sich der neuer Text vom aktuellen unterscheidet.
            if (drawSet.text !== newText) {
                // Wir haben eine Text-Änderung --> neuen Text in das drawSet eintragen
                drawSet.text = newText;
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
    @description    Ändert den Transparent-Status des Elements.
    @param          {boolean}           newState                        Der neue Transparent-Status.

    @return         {object}            Referenz auf die Klasse
    **/
    this.setTransparent = function (newState) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Den neuen Transparent-Modus speichern
            drawSet.transparent = newState;

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /*********************************************************************************************************************************************************/
    /** TEXT Objekt-Konstruktor                                                                                                                             **/
    /*********************************************************************************************************************************************************/

    var returnValue = false;
    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {
        // Ups, config ist unvollständig oder fehlerhaft - Meldung übernehmen und mit FALSE beenden
        this.configValid = false;
        this.configError = result.error;
    } else {
        // Das config-Objekt in Element-Objekt übernehmen
        config = clone(result.config);

        // Das raster-Objekt in das Element-Objekt kopieren
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Das drawSet erzeugen und im Objekt ablegen
        var ml             = false;     // Flag für Multiline-Texte
        var lineWidth      = 0;         // Variable für die maximale Zeilenlänge
        var zeilen         = 0;         // Variable für die Anzahl der Textzeilen


        // Das richtige fontData-Objekt holen und in fontSetup hinterlegen,
        // außerdem gridWidth und gridHeight aus dem lcars-Objekt ermitteln
        var fontSetup  = fontData[config.textFont.toLowerCase()];
        var rowHeight  = raster.gridHeight;
        var colWidth   = raster.gridWidth;

        // Die reale Schriftgröße für den Text ermitteln und in fontHeight ablegen
        var fontHeight = rowHeight * fontSetup.fontSize[config.textSize];
        var usedFont   = fontHeight + 'pt ' + fontSetup.fontName;

        var lIndex, textXpos;

        // Prüfen auf 'auto'-modus. Wenn ja, Texthöhe und -breite ermitteln und config entsprechend anpassen
        if (typeof config.width === 'string' || typeof config.height === 'string') {

            // Als erstes evtl. aktives wordWrap abschalten, da dieses im Auto-Modus nicht zugelassen ist.
            config.wordWrap = false;

            // Zunächst den Text in seine Zeilen zerlegen. Als Trennzeichen dient \n
            zeilen = config.text.split('\n');

            // Prüfen wie viele Zeilen vorhanden sind. Wenn es mehr als 1 Zeile ist muss das ml-Flag gesetzt werden
            ml = (zeilen.length > 1);

            // Die Gesamthöhe des Textelements berechnen. Sie ergibt sich aus der Anzahl der Zeilen mal der Zeilenhöhe
            // config.textHeight (textHeight ist die Höhe in Rasterzeilen).
            config.height = zeilen.length * config.textSize;

            // Jetzt alle Zeilen durchlaufen und die Textbreite ermitteln. Der größte Wert wird zur Berechnung der
            // Breite in Rasterspalten verwendet.
            for (lIndex in zeilen) {
                lineWidth = Math.max(lineWidth, getTextWidth(zeilen[lIndex], usedFont));
            }

            // Die Gesamtbreite des Textelements berechnen. Sie ergibt sich aus der max. Textbreite dividiert durch die
            // Rasterspaltenbreite (Aufgerundet auf den nächsten vollen Wert)
            config.width = Math.floor(lineWidth / colWidth + 0.9);

            // Die X-Position des Textankers berechnen. Je nach Ausrichtung ist der Textanker links, mittig oder rechts.
            switch (config.textAlign.toLowerCase()) {
            case 'left':
                textXpos = x + 1;
                break;
            case 'center':
                textXpos = x + (width / 2);
                break;
            case 'right':
                textXpos = x + width - 2;
                break;
            }

            // Jetzt alle benötigten und berechneten Parameter im drawSet abspeichern.
            /**
            *style, *fontSize, *fontFamily, *align, *textBaseline, *text, wordWrap, tpos.y, tpos.x
            **/
            drawSet = {
                tpos: {                                                                 // Startposition des Text-Bereichs
                    x:                textXpos,
                    y:                y + (fontSetup.yOffset[config.textSize] * rowHeight)
                },
                text:           config.text,                                            // Der Text
                align:          config.textAlign,                                       // Textausrichtung
                style:          config.textStyle,                                       // Textstil
                fontFamily:     fontSetup.fontName,                                     // Name der zu verwendenen Schriftart
                textBaseline:   fontSetup.baselineMode,                                 // Der Baseline-Mode für die Textausgabe
                textFontSize:   fontSetup.fontSize[config.textSize] * rowHeight,        // Die zu verwendene Schriftgöße
                textLineSize:   fontSetup.lineHeight[config.textSize] * rowHeight,      // Die zu verwendene Zeilenhöhe
                invers:         config.invers,                                          // Text- und Backgroundfarbe tauschen (=TRUE)
                transparent:    config.transparent,                                     // Text ohne Hintergrund anzeigen (=TRUE)
                wordWrap:       config.wordWrap                                         // Automatischer Textumbruch (=TRUE)
            };
        } else {

            // X-Position des Textankers berechnen. Je nach Ausrichtung liegt der Textanker links, mittig oder rechts.
            switch (config.textAlign.toLowerCase()) {
            case 'left':
                textXpos = x + 1;
                break;
            case 'center':
                textXpos = x + (width / 2);
                break;
            case 'right':
                textXpos = x + width - 2;
                break;

            default:    // Sollte eigentlich NIE vorkommen...
                textXpos = x + 1;
                break;
            }

            // Alle benötigten Daten im drawSet ablegen.
            drawSet = {
                tpos: {
                    x:                textXpos,
                    y:                y + (fontSetup.yOffset[config.textSize] * rowHeight)
                },
                text:           config.text,                                        // Der Text
                align:          config.textAlign,                                   // Textausrichtung
                style:          config.textStyle,                                   // Textstil
                fontFamily:     fontSetup.fontName,                                 // Name der zu verwendenen Schriftart
                textBaseline:   fontSetup.baselineMode,                             // Der Baseline-Mode für die Textausgabe
                textFontSize:   fontSetup.fontSize[config.textSize] * rowHeight,    // Die zu verwendene Schriftgöße
                textLineSize:   fontSetup.lineHeight[config.textSize] * rowHeight,  // Die zu verwendene Zeilenhöhe
                invers:         config.invers,                                      // Text- und Backgroundfarbe tauschen (=TRUE)
                transparent:    config.transparent,                                 // Text ohne Hintergrund anzeigen (=TRUE)
                wordWrap:       config.wordWrap                                     // Automatischer Textumbruch (=TRUE)
            };
        }

        // Zum Schluss das für eine nicht-transparente Darstellung notwendige BAR-Element erzeugen und in backBarElement ablegen.
        backBarElement = new ElementBAR(raster, {col: config.col, row: config.row, width: config.width, height:
                                        config.height, color: config.color, mode: config.mode, direction: 'hor'}, context);

        returnValue = true;
    }

    // Ende Konstruktor
    return returnValue;
}


/**
//  !               !                   !                               !               !
    @description    Element: PICTURE
                    Dieses Element dient zur Anzeige eines statischen Bildes, welches vom PictureManager zur verfügung gestellt wird.
    @param            {Number}            pRaster.gridWidth                Breite einer Rasterspalte in Pixel
    @param            {Number}            pRaster.gridHeight                Höhe einer Rasterzeile in Pixel
    @param            {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param            {Number}            pRaster.maxHeight                Anzahl der verfügbaren Rasterzeilen
    @param            {Number}            pConfig.col                        Linke Rasterspalte der Elementfläche
    @param            {Number}            pConfig.row                        Obere Rasterzeile der Elementfläche
    @param            {Number|String}        [pConfig.width='auto']            Breite des Elements in Rasterspalten oder 'auto' für autom. Anpassung
    @param            {Number|String}        [pConfig.height='auto']            Höhe des Elements in Rasterzeilen oder 'auto' für autom. Anpassung
    @param            {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param            {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled    Abgedunkelt und ausgegraut
                                                                        - regular    Normale Farbgebung
                                                                        - highlight    Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm        In Rot gefärbt (z.B. bei Systemalarm)
    @param            {String}            [pConfig.scaling='opt']            Der Modus der Bildanpassung. Zulässige Werte sind:
                                                                        - fix        Das Bild wird an den Anzeigebereich angepasst. Dabei werden
                                                                                    Höhe und Breite individuell (also nicht proportional) ge-
                                                                                    streckt oder gestaucht.
                                                                        - opt        Das Bild wird proportional an den Anzeigebereich angepasst.
                                                                                    Dabei wird das Seitenverhältnis NICHT verändert und das
                                                                                    Bild abschließend zentriert im Anzeigebereich dargestellt.
                                                                        - cut        Das Bild wird unverändert im Anzeigebereich dargestellt.
                                                                                    Ist das Bild größer als der Anzeigebereich, so werden über-
                                                                                    stehende Bereiche abgeschnitten.
    @param            {boolean}            [pConfig.frame=false]            True wenn 4 Eckelemente das Bild einfassen sollen, sonst False
    @param            {string}            [pConfig.name='none']            Name der Image-Resource, wie im PictureManager definiert. Eine Sonder-
                                                                        option ist 'none'. Wird pConfig.name auf 'none' gesetzt, so stellt das
                                                                        Element eine "Kein-Bild-vorhanden"-Markierung (Umlaufender Außenrahmen
                                                                        mit über Eck gekreuzten Linien) dar, das selbe passiert wenn die
                                                                        Resource nicht im PictureManager vorhanden ist (z.B. Ladeproblem o.ä.)
    @param            {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param            {object}            pMainObject                        Ref. auf die zentrale HACVS-Instanz dieses Terminals
**/
function ElementPICTURE(pRaster, pConfig, pContext) {

    /*************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von PICTURE                                                                                                               **/
    /*************************************************************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /*************************************************************************************************************************************/
    /** Private Eigenschaften von PICTURE                                                                                                                   **/
    /*************************************************************************************************************************************/
    var raster          = null;                 // Rasterdefinition
    var config          = null;                 // Elementkonfiguration
    var context         = null;                 // Ref. auf 2D-Context für die Darstellung
    var pictureManager  = null;                    // Ref. auf den PictureManager
    var drawSet         = null;                 // Zeichekoordinaten (berechnet der Konstruktor)
    var elementMode     = '';                   // Aktueller Zustand des Elements
    var lastMode        = '';                   // Der letzte Zustand des Elements
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var imageObject     = null;                 // Speicher für die Image-Referenz vom PictureManager
    var frameElements   = [
        null,                                   // Speicher für das Eck-Element oben links
        null,                                   // Speicher für das Eck-Element oben rechts
        null,                                   // Speicher für das Eck-Element unten links
        null                                    // Speicher für das Eck-Element unten rechts
    ];
    var drawFrame       = false;                // True wenn die 4 Eckelemente (Rahmen) dargestellt werden sollen.
    var defaultConfig   = {                     // Standard- und Grenzwerte der Elementeigenschaften
        col:         { valueType: 'number',  valueMin: 1 },
        row:         { valueType: 'number',  valueMin: 1 },
        width:       { valueType: 'number|string',  valueMin: 1, valueList: 'auto', valueDefault: 'auto' },
        height:      { valueType: 'number|string',  valueMin: 1, valueList: 'auto', valueDefault: 'auto' },
        color:       { valueType: 'string',  valueList: colorTableList, valueDefault: 'orange' },
        mode:        { valueType: 'string',  valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        scaling:     { valueType: 'string',  valueList: 'fit|opt|cut', valueDefault: 'opt'},
        frame:       { valueType: 'boolean', valueDefault: false },
        transparent: { valueType: 'boolean', valueDefault: false },
        name:        { valueType: 'string',  valueDefault: 'none' }
    };


    /*************************************************************************************************************************************/
    /** Private Methoden von PICTURE                                                                                                                        **/
    /*************************************************************************************************************************************/

    /**
//  !               !                   !                               !               !
    @description    Berechnet aus Breite und Höhe des Bildes sowie einiger anderer Parameter aus der config alle notwendigen Werte für die Darstellung
                    des Bildes. Berücksichtigt auch den auto-mode für Höhe/Breite.
    @param            {number}            imageWidth                    Die Breite des anzuzeigenden Bildes (in Pixel)
    @param            {number}            imageHeight                    Die Höhe des anzuzeigenden Bildes (in Pixel)

    @return            {object}            Ein Object mit allen Parametern (sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight) für die Bilddarstellung
    **/
    function calculateImageParameter(imageWidth, imageHeight) {

        var sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight;

        // auto- oder scaling-mode, das ist hier die Frage
        if (typeof config.width === 'string' || typeof config.height === 'string') {
            // Wir sind im auto-Modus.  width und height mit Hilfe der Bildabmessungen auf das nächste Rastgermaß bringen
            // dann noch xoffset und yoffset berechnen um die Grafik wirklich in die Mitte der Anzeigefläche zu setzen
            width   = Math.floor(imageWidth / raster.gridWidth + 0.9999) * raster.gridWidth;
            height  = Math.floor(imageHeight / raster.gridHeight + 0.9999) * raster.gridHeight;

            // Jetzt die Source- und Destinationparameter für die I
            sX      = 0;
            sY      = 0;
            sWidth  = imageWidth;
            sHeight = imageHeight;
            dX      = Math.floor((width - imageWidth) / 2);
            dY      = Math.floor((height - imageHeight) / 2);
            dWidth  = imageWidth;
            dHeight = imageHeight;
        } else {
            // Kein auto-modus, je nach scaling nun verschiedene Berechnungen durchführen...
            switch (config.scaling.toLowerCase()) {
                case 'fit':    // Der einfachste Fall, Bild in Anzeigebereich hineinpressen und fertig...
                    sX      = 0;
                    sY      = 0;
                    sWidth  = imageWidth;
                    sHeight = imageHeight;
                    dX      = 0;
                    dY      = 0;
                    dWidth  = width;
                    dHeight = height;
                break;
                case 'opt':     // Unter Beibehaltung der Bildproportion das Bild auf die benötigte Größe skalieren
                    var sFactor    = Math.max((imageWidth / width), (imageHeight / height));
                    var newWidth   = imageWidth / sFactor;
                    var newHeight  = imageHeight / sFactor;
                    var offsetX    = Math.max(0, Math.floor((width - newWidth) / 2 + 0.9));
                    var offsetY    = Math.max(0, Math.floor((height - newHeight) / 2 + 0.9));
                    sX      = 0;
                    sY      = 0;
                    sWidth  = imageWidth;
                    sHeight = imageHeight;
                    dX      = offsetX;
                    dY      = offsetY;
                    dWidth  = newWidth;
                    dHeight = newHeight;
                break;
                case 'cut':    // Bild passend zuschneiden, so das es zentriert im Anzeigebereich liegt

                    // Prüfen, ob ein CUT notwendig ist oder nicht...
                    if ((width >= imageWidth) && (height >= imageHeight)) {
                        // Kein CUT notwendig, Bild ist kleiner als Anzeigebereich. dX und dY so setzen das das Bild zentriert im
                        // Anzeigebereich zum liegen kommt.
                        sX      = 0;
                        sY      = 0;
                        sWidth  = imageWidth;
                        sHeight = imageHeight;
                        dX      = Math.max(0, Math.floor((width - imageWidth) / 2 + 0.9));
                        dY      = Math.max(0, Math.floor((height - imageHeight) / 2 + 0.9));
                        dWidth  = imageWidth;
                        dHeight = imageHeight;
                    } else {
                        // Hier müssen wir cutten, das Bild ist größer als der Anzeigebereich...
                        sX       = Math.max(0, Math.floor((imageWidth - width) / 2 + 0.9));
                        sY       = Math.max(0, Math.floor((imageHeight - height) / 2 + 0.9));
                        sWidth   = Math.min(imageWidth, width);
                        sHeight  = Math.min(imageHeight, height);
                        dX       = Math.max(0, Math.floor((width - imageWidth) / 2 + 0.9));
                        dY       = Math.max(0, Math.floor((height - imageHeight) / 2 + 0.9));
                        dWidth   = width;
                        dHeight  = height;
                    }
                break;
            }
        }

        // drawSet (sX,sY,sWidth, sHeight, dX, dY, dWidth, dHeight) an den Aufrufer zurück liefern
        return { sX: sX, sY: sY, sWidth: sWidth, sHeight: sHeight, dX: dX, dY: dY, dWidth: dWidth, dHeight: dHeight };
    }


    /*************************************************************************************************************************************/
    /** Öffentliche Methoden von PICTURE                                                                                                                    **/
    /*************************************************************************************************************************************/

    /**
//  !               !                   !                               !               !
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param            {string}               [colorKey]                    Eine Farbangabe in CSS2.1-Notation. Ist dieser Parameter vorhanden, erzeugt
                                                                    die draw-Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param            {object}            [hitContext]                Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {
                var eColor = getColorValue(config.color, elementMode);

                // Zuerst den aktuellen Canvas-Context sichern und den Koordinatenursprung setzen
                context.save();
                context.translate(x, y);

                // Nun einen Hintergrund mit der im colorset definierten Hintergrundfarbe zeichnen - aber nur wenn transparent = false ist!
                if (!config.transparent) {
                    context.fillStyle = getColorValue(config.color, 'background');
                    context.fillRect(0, 0, width, height);
                }

                // Wenn keine Bildobjekt vorhanden ist wir eine Ersatzzeichnung "no-image" angezeigt
                if (imageObject === null) {

                    // Keine Bild-Resource, Ersatzzeichnung ausgeben
                    context.strokeStyle = eColor;
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(width, 0);
                    context.lineTo(width, height);
                    context.lineTo(0, height);
                    context.lineTo(0, 0);
                    context.lineTo(width, height);
                    context.moveTo(0, height);
                    context.lineTo(width, 0);
                    context.stroke();
                } else {

                    // Das Bild ggf. zuschneiden und dann auf der PICTURE-Fläche darstellen
                    context.drawImage(imageObject,
                                      drawSet.sX, drawSet.sY, drawSet.sWidth, drawSet.sHeight,
                                      drawSet.dX, drawSet.dY, drawSet.dWidth, drawSet.dHeight);
                }
                context.restore();

                // Jetzt noch einen Rahmen ausgeben, wenn gewünscht und imageObject vorhanden...
                if (drawFrame && (imageObject !== null)) {
                    frameElements[0].draw();
                    frameElements[1].draw();
                    frameElements[2].draw();
                    frameElements[3].draw();
                }
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche
                    auf dem Canvas gelöscht und dann ein Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}                Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche löschen
            context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Ändert den Funktionsmodus des Elements.
    @param            {string}    newMode     Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                            - *     versetzt das Element wieder in den vorherigen Mode
                                            - .     versetzt das Element in den Default-Farbmode

    @return         {object}                Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                elementMode = lastMode;
            } else {
                if (newMode === '.') {
                    lastMode    = config.mode;
                    elementMode = config.mode;
                } else {
                    // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
                    if (elementMode !== newMode.toUpperCase()) {
                        // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                        lastMode = elementMode;
                        elementMode = newMode.toUpperCase();
                        // Jetzt noch den Modus in den Rahmenelementen anpassen
                        frameElements[0].setMode(newMode);
                        frameElements[1].setMode(newMode);
                        frameElements[2].setMode(newMode);
                        frameElements[3].setMode(newMode);
                    }
                }
            }
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Ändert das angezeigte Image des Pictures
    @param            {string}            name                        Name der anzuzeigenden PictureManager-Resource

    @return         {object}            Referenz auf die Klasse
    **/
    this.setPicture = function (name) {
        var returnValue = null;

        // Image anzeigen können wir nur wenn wir valide sind
        if (this.configValid) {

            // Prüfen ob sich die Image-Resouce wirklich ändert...
            if (config.name !== name) {

                // Als erstes den Namen der neuen Resource in config.name speichern
                config.name = name;

                // Jetzt das neue Image vom PictureManager anfordern
                imageObject = pictureManager.getPicture(name);

                // Wenn der PictureManager nicht NULL geliefert hat (=keine entsprechende Resource vorhanden ist)
                if (imageObject !== null) {

                    // Die Abmessungen ermitteln
                    var imageWidth  = imageObject.width;
                    var imageHeight = imageObject.height;

                    // Jetzt alle Darstellungsparameter errechnen und im drawSet speichern
                    drawSet = calculateImageParameter(imageWidth, imageHeight);

                } else {
                    drawSet = { sX: 0, sY: 0, sWidth: 0, sHeight: 0, dX: 0, dY: 0, dWidth: 0, dHeight: 0 };
                }
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /*************************************************************************************************************************************/
    /** PICTURE Objekt-Konstruktor                                                                                                                          **/
    /*************************************************************************************************************************************/

    var returnValue = false;

    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {

        // Ups, config ist unvollständig oder fehlerhaft - Meldung übernehmen und mit FALSE beenden
        this.configValid = false;
        this.configError = result.error;
    } else {
        config = clone(result.config);

        // Das vollständige config-Objekt in pRaster übernehmen
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die pictureManager-Referenz im Objekt speichern
        pictureManager = pPictureManager;

        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Jetzt das neue Image vom PictureManager anfordern
        imageObject = pictureManager.getPicture(config.name);

        // Wenn der PictureManager nicht NULL geliefert hat (=keine entsprechende Resource vorhanden ist)
        if (imageObject !== null) {

            // Die Abmessungen ermitteln
            var imageWidth  = imageObject.width;
            var imageHeight = imageObject.height;

            // Jetzt alle Darstellungsparameter errechnen und im drawSet speichern
            drawSet = calculateImageParameter(imageWidth, imageHeight);

        } else {
            drawSet = { sX: 0, sY: 0, sWidth: 0, sHeight: 0, dX: 0, dY: 0, dWidth: 0, dHeight: 0 };
        }
        // Noch den Transparenz-Parameter zum drawSet hinzufügen
        drawSet.transparent = config.transparent;

        // Jetzt noch die 4 Eckelemente erzeugen
        frameElements[0] = new ElementEDGE(raster, { col: config.col, row: config.row,
                                                        width: 2, height: 2, color: config.color, mode: config.mode, type: 'rd' }, context);
        frameElements[1] = new ElementEDGE(raster, { col: config.col + config.width - 2, row: config.row,
                                                        width: 2, height: 2, color: config.color, mode: config.mode, type: 'ld' }, context);
        frameElements[2] = new ElementEDGE(raster, { col: config.col, row: config.row + config.height - 2,
                                                        width: 2, height: 2, color: config.color, mode: config.mode, type: 'ru' }, context);
        frameElements[3] = new ElementEDGE(raster, { col: config.col + config.width - 2, row: config.row + config.height - 2,
                                                        width: 2, height: 2, color: config.color, mode: config.mode, type: 'lu' }, context);
        drawFrame = config.frame;

        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}


/**
//  !               !                   !                               !               !
    @description    Element: BUTTON
                    Der Button ist ein interaktives Element, das bei betätigung eine vorgegebene Aktion ausführt. Als Aktion stehen ver-
                    schiedene Funktionen zur verfügung, vom Eintrag eines Strings in einen Terminalspeicher über Seitenwechsel bis hin zum
                    Aufruf eines Skripts auf dem IP-Symcon-Server.
    @param            {Number}            pRaster.gridWidth                Breite einer Rasterspalte in Pixel
    @param            {Number}            pRaster.gridHeight                Höhe einer Rasterzeile in Pixel
    @param            {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param            {Number}            pRaster.maxHeight                Anzahl der verfügbaren Rasterzeilen
    @param            {Number}            pConfig.col                        Linke Rasterspalte der Elementfläche
    @param            {Number}            pConfig.row                        Obere Rasterzeile der Elementfläche
    @param            {Number|String}        [pConfig.width='auto']            Breite des Elements in Rasterspalten
    @param            {Number|String}        [pConfig.height='auto']            Höhe des Elements in Rasterzeilen
    @param            {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param            {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled    Abgedunkelt und ausgegraut
                                                                        - regular    Normale Farbgebung
                                                                        - highlight    Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm        In Rot gefärbt (z.B. bei Systemalarm)
    @param            {String}            pConfig.text                    Der auf dem Button anzuzeigene Text.
    @param            {String}            [pConfig.textAlign='center']    Hor. Ausrichtung des Textes (nur bei width != auto)
    @param            {String}            [pConfig.textFont='Terminal']    Schriftart für die Textanzeige. Zulässige Werte sind:
                                                                        - Terminal    Schriftart (nur Großbuchst.) ähnlich StarTrek
                                                                        - GTJ3        Schrfitart ähnlich Terminal, mit extra Zeichen
                                                                        - Original    Die originale StarTrek Schrift, Groß- u. Kleinb.
    @param            {String}            [pConfig.textStyle='normal']    Zu verwendener Schriftstiel. Zulässige Werte sind:
                                                                        - normal    Einfache, reguläre Schrift
                                                                        - italic    Kursive Schrift
                                                                        - bold        Fettschrift
    @param            {string}            [pConfig.buttonType='button']    Die Art des Buttons. Zulässige Werte sind:
                                                                        - button    Ein normaler Button, mit CAP's an beiden Enden
                                                                        - key        Ein integrierbarer Button ohne CAP's
    @param            {string}            [pConfig.sClick=key1]            Der Sound, der bei einem Click-Event gespielt werden soll.
    @param            {boolean|string}    [pConfig.condition=false]        Setzt eine Ausführungsbeschränkung für diesen Button. Zul. Werte sind:
                                                                        - False        Keine Ausführungsbeschränkung
                                                                        - storage    Abhängig vom Wert eines Terminalspeichers
                                                                        - Variable    Abhängig vom Wert einer IPS-Variable
    @param            {number|string}        [pConfig.conditionID='']        Legt die zu prüfende Quelle fest. Ist condition=storage muss dieser Para-
                                                                        meter ein String sein und einen Terminalspeicher bezeichnen. Ist
                                                                        condition=variable muss dieser Parameter ein Integer sein und eine IPS-
                                                                        Variable bezeichnen.
    @param            {mixed}                [pConfig.conditionValue='']        Legt den Vergleichswert für die Prüfung fest.
    @param            {string}            [pConfig.sGo=access_permitted]    Der Sound, der bei condition=true und erfolgreicher Prüfung gespielt wird
    @param            {string}            [pConfig.sError=access_denied]    Der Sound, der bei condition=true und fehlerhafter Prüfung gespielt wird
    @param            {string}            pConfig.actionType                Legt die auszuführende Aktion fest. Zulässige Werte sind:
                                                                        - store     Speichert einen Wert im Terminalspeicher. Benötigte Parameter:
                                                                                    - actionValue    Der zu speichernde Wert
                                                                                    - storageID        Der zu verwendene Terminalspeicher
                                                                        - clear        Löscht einen Terminalspeicher. Benötigte Parameter:
                                                                                    - storageID        Der zu löschende Terminalspeicher
                                                                        - page        Lädt eine neue Terminalseite. Benötigte Parameter:
                                                                                    - pageID        Der Name der zu ladenen Terminalbeschreibung
                                                                        - execute    Führt ein Script auf dem IPS-Server aus. Benötigte Parameter:
                                                                                    - scriptID        Die IPS-ID des zu startenden Skripts
                                                                                    - parameter        Die zur Ausführung notwendigen Parameter
                                                                        - set        Setzt eine IPS-Variable auf einen Wert. Benötigte Parameter:
                                                                                    - variableID    Die IPS-ID der zu schreibenden Variable
                                                                                    - actionValue    Der zu speichernde Wert
    @paran            {mixed}                [pConfig.actionValue='']        Der im Terminalspeicher abzulegende Wert
    @paran            {string}            [pConfig.storageID='']            Die ID des Termianlspeichers (ein String, beginnend mit einem Buchstaben)
    @paran            {string}            [pConfig.pageID='']                Name einer Terminalbeschreibungsdatei
    @paran            {number}            [pConfig.scriptID=0]            IPS-ID des auszuführenden Skripts
    @paran            {array[object]}        [pConfig.parameter=[]]            Array von Parameterobjekten. Jedes Parameterobjekt besteht
    @paran            {number}            [pConfig.variableID=0]            IPE-ID der zu ändernen Variable
    @param            {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param            {object}            pMainObject                        Ref. auf die zentrale HACVS-Instanz dieses Terminals
**/
function ElementBUTTON(pRaster, pConfig, pContext, pMainObject) {

    /*************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von BUTTON                                                                                                                **/
    /*************************************************************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /*************************************************************************************************************************************/
    /** Private Eigenschaften von BUTTON                                                                                                                    **/
    /*************************************************************************************************************************************/
    var raster          = null;                 // Rasterdefinition
    var config          = null;                 // Elementkonfiguration
    var context         = null;                 // Ref. auf 2D-Context für die Darstellung
    var soundManager    = null;                    // Ref. auf die zu verwendene SoundManager-Instanz
    var dataManager     = null;                    // Ref. auf die zu verwendene DataManager-Instanz
    var capElements     = null;                 // Speicher für 2 CAP-Elemente, welche bei Buttons zur anzeige kommen (nicht bei Key's)
    var textElement     = null;                 // Speicher für ein Text-Element, welches den Kern des Buttons darstellt.
    var elementMode     = '';                   // Aktueller Zustand des Elements
    var lastMode        = '';                   // Der letzte Zustand des Elements
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var defaultConfig   = {                     // Standard- und Grenzwerte der Elementeigenschaften
        col:            { valueType: 'number', valueMin: 1 },
        row:            { valueType: 'number', valueMin: 1 },
        width:          { valueType: 'number', valueMin: 1 },
        height:         { valueType: 'number', valueMin: 1 },
        color:          { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:           { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        text:           { valueType: 'string' },
        textAlign:      { valueType: 'string', valueList: 'left|center|right', valueDefault: 'center' },
        textFont:       { valueType: 'string', valueList: 'terminal|gtj3|original', valueDefault: 'terminal' },
        textStyle:      { valueType: 'string', valueList: 'normal|italic|bold', valueDefault: 'normal' },
        buttonType:     { valueType: 'string', valueList: 'button|key', valueDefault: 'button' },
        sClick:         { valueType: 'string', valueDefault: 'key1' },
        condition:      { valueType: 'boolean|string', valueList: 'storage|variable', valueDefault: false },
        conditionID:    { valueType: 'number|string', valueDefault: '' },
        conditionValue: { valueType: 'boolean|number|string', valueDefault: '' },
        sGo:            { valueType: 'string', valueDefault: 'access_permitted' },
        sError:         { valueType: 'string', valueDefault: 'access_denied' },
        actionType:     { valueType: 'string', valueList: 'store|clear|page|execute|set' },
        actionValue:    { valueType: 'boolean|number|string', valueDefault: '' },
        storageID:      { valueType: 'string', valueDefault: '' },
        pageID:         { valueType: 'string', valueDefault: '' },
        scriptID:       { valueType: 'number', valueDefault: 0 },
        parameter:      { valueType: 'array[object]', valueDefault: [{}] },
        variableID:     { valueType: 'number', valueDefault: 0 }
    };


    /*************************************************************************************************************************************/
    /** Öffentliche Methoden von BUTTON                                                                                                                     **/
    /*************************************************************************************************************************************/

    /**
//  !               !                   !                               !               !
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param            {string}            [colorKey]                  Eine Farbangabe in CSS-Notation. Ist dieser Parameter gesetzt, erzeugt
                                                                    die draw-Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param            {object}            [hitContext]                Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {

                // Zeichnen ist ganz einfach... hehehe... nur CAP's (wenn benötigt) und TEXT ausgeben... fertig
                if (config.buttonType.toLowerCase() === 'button') {
                    capElements[0].draw();
                    capElements[1].draw();
                }
                textElement.draw();
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche
                    auf dem Canvas gelöscht und dann ein Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}            Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche löschen
            context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Ändert den Funktionsmodus des Elements.
    @param            {string}    newMode     Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                            - *     versetzt das Element wieder in den vorherigen Mode
                                            - .     versetzt das Element in den Default-Farbmode

    @return         {object}                Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                newMode = lastMode;
            }
            if (newMode === '.') {
                newMode = config.mode;
            }

            // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
            if (elementMode !== newMode.toUpperCase()) {

                // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                lastMode = elementMode;
                elementMode = newMode.toUpperCase();

                // Auch die CAPs und den TEXT darüber informieren
                capElements[0].setMode(newMode);
                capElements[1].setMode(newMode);
                textElement.setMode(newMode);
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };

    /**
//  !               !                   !                               !               !
    @description    Ändert den Anzeigetext des Buttons.
    @param            {string}    newText     Der neue Beschriftungstext für den Button

    @return         {object}                Referenz auf die Klasse
    **/
    this.setText = function (newText) {
        var returnValue = null;

        // Text ändern können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob sich der Text wirklich ändert
            if (newText !== config.text) {
                config.text = newText;
                textElement.setText(newText);
            }
            
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Verarbeitet eine Klick-Aktion auf den Button. Dabei wird die Condition-Prüfung ausgeführt und die entsprechende Aktion veranlasst.
    @param            {object}            myID                        Die ID des Buttons (für addAction-Aufrufe).
    @param            {object}            mainObject                    Hauptobjekt (HACVS-Instanz) des Terminals für Funktionsaufrufe usw.
    **/
    this.click = function (myID, mainObject) {
        var returnValue = null;

        // Klick geht nur wenn wir valide sind...
        if (this.configValid) {
            var condition_ok = false;
            
            // Sofortiges Event programmieren welches den Button auf Highlight setzt
            mainObject.addAction(0, [ { id: myID, action: 'setMode', parameter: ['highlight'] },
                                      { id: myID, action: 'update',  parameter: [] } ]);
            // Event in 500ms programmieren welches Button wieder auf vorherigen Modus ('*') schaltet und die Anzeige aktualisiert
            mainObject.addAction(150, [ { id: myID, action: 'setMode', parameter: ['*'] },
                                        { id: myID, action: 'update',  parameter: [] } ]);
            // Prüfen ob condition aktiv ist
            if (!config.condition) {
                // Klicksound ausgeben
                soundManager.playSound(config.sClick);
                condition_ok = true;
            } else {
                console.log('Bedingungsprüfung:  Vergleiche [' + config.conditionID + '] (' + mainObject.getTerminalStorage(config.conditionID) + ') mit "' +
                            config.conditionValue + '"');
                if (mainObject.getTerminalStorage(config.conditionID) === config.conditionValue) {
                    // Permit-Sound ausgeben
                    soundManager.playSound(config.sGo);
                    condition_ok = true;
                } else {
                    soundManager.playSound(config.sError);
                }

                // Nach Abschluss der Prüfung noch den Terminalspeicher löschen
                mainObject.clearTerminalStorage(config.conditionID);
            }
            
            // Bei Freigabe programmierte Aktion ausführen
            if (condition_ok) {
                switch (config.actionType.toLowerCase()) {
                case 'store':
                    console.log('Aktion STORE ausführen: Zeichen "' + config.actionValue + '" in Terminalspeicher "' + config.storageID + '" speichern.');
                    mainObject.setTerminalStorage(config.storageID, config.actionValue);
                    break;

                case 'clear':
                    console.log('Aktion CLEAR ausführen: Terminalspeicher "' + config.storageID + '" löschen.');
                    mainObject.clearTerminalStorage(config.storageID);
                    break;

                case 'page':
                    console.log('Aktion PAGE ausführen: Terminalseite "' + config.pageID + '" öffnen.');
                    mainObject.pageID = config.pageID;    // Die neue PageID setzen
                    mainObject.runContinue();            // und die Statemachine wieder freigeben.
                    break;

                case 'execute':
                    console.log('Aktion EXECUTE ausführen: Script "' + config.scriptID + '" mit Parameter "' + config.parameter + '" auf IPS-Server starten.');
                    break;

                case 'set':
                    console.log('Aktion SET ausführen: Variable "' + config.variableID + '" auf Wert "' + config.actionValue + '" setzen.');
                    break;

                }
            }
        }
    };


    /*********************************************************************************************************************************************************/
    /**    BUTTON Objekt-Konstruktor                                                                                                                        **/
    /*********************************************************************************************************************************************************/

    // Rückgabewert initialisieren
    var returnValue = false;

    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {

        // Fehler in der Element-Konfiguration. Meldung und Fehlerstatus im Objekt ablegen
        this.configValid = false;
        this.configError = result.error;
    } else {

        // Die vollständige Konfiguration in die config-Eigenschaft des Objekts kopieren
        config = clone(result.config);

        // Die Daten zum Terminalraster in die raster-Eigenschaft des Objekts kopieren
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die SoundManager-Referenz im Objekt speichern
        soundManager = pSoundManager;

        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Die CAPs und das TEXT-Element anlegen
        capElements = [ new ElementCAP(raster, {col: config.col, row: config.row, width: 1, height: config.height, color: config.color,
                                                mode: elementMode, direction: 'r'}, context),
                        new ElementCAP(raster, {col: config.col + config.width - 1, row: config.row, width: 1 ,height: config.height, color: config.color,
                                                mode: elementMode, direction: 'l'}, context) ];
        textElement =  new ElementTEXT(raster, {col: config.col + 1, row: config.row, width: config.width - 2, height: config.height, color: config.color,
                                                mode: elementMode, transparent: false, invers: true, text: config.text, textAlign: config.textAlign,
                                                textFont: config.textFont, textStyle: config.textStyle, textSize: config.height
                                                }, context);
        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}

/**
 * Element: SWITCH
 *
 * x:               null
 * y:               null
 * width:           null
 * height:          null
 * color:           'ORANGE'
 * text:            null
 * textFont:        'Terminal'
 * textAlign:       'center'
 * condition:       false
 * keyValue:        ''
 * storageID:       'A'
 * feedbackVarID:   0
 * scriptID:        0
 * scriptParameter: []
 */


/**
 * Element: VALUE
 *
 * x:               null
 * y:               null
 * width:           null
 * height:          null
 * color:           'ORANGE'
 * varID:           null
 * preFix:          ''
 * postFix:         ''
 */


 /**
//  !               !                   !                               !               !
    @description    Element: IMGVALUE
                    Dieses Element stellt je nach Variablenwert verschiedene Images dar.
    @param            {Number}            pRaster.gridWidth                Breite einer Rasterspalte in Pixel
    @param            {Number}            pRaster.gridHeight                Höhe einer Rasterzeile in Pixel
    @param            {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param            {Number}            pRaster.maxHeight                Anzahl der verfügbaren Rasterzeilen
    @param            {Number}            pConfig.col                        Linke Rasterspalte der Elementfläche
    @param            {Number}            pConfig.row                        Obere Rasterzeile der Elementfläche
    @param            {Number}            pConfig.width                    Breite des Elements in Rasterspalten
    @param            {Number}            pConfig.height                    Höhe des Elements in Rasterzeilen
    @param            {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param            {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled    Abgedunkelt und ausgegraut
                                                                        - regular    Normale Farbgebung
                                                                        - highlight    Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm        In Rot gefärbt (z.B. bei Systemalarm)
    @param            {Number}            pConfig.varID                    IPS-ID der Datenquelle (Variable)
    @param            {string}            pConfig.varType                    Typ der Datenquelle. Zulässige Werte sind: 'boolean', 'integer', 'float' und 'string'
    @param            {string}            pConfig.resourceConfig            Zuordnung Werte <--> Bilder. Je nach VarType sind die folgenden Angaben zulässig:
                                                                        BOOLEAN:    0='{imageID}':1='{imageID bei TRUE}'
                                                                            0 ist das Image wenn der Wert FALSCH ist, 1 das Image für den Wert WAHR
                                                                            
                                                                        INTEGER:    i1='{imageID}':i2='{imageID}'...
                                                                            ix legt den Grenzwert fest (inklusive), bis zu dem das entsprechende Image ange-
                                                                            zeigt wird. Jeder folgende Wert MUSS größer sein als sein Vorgänger.
                                                                            Beispielt: 0='ZU':99='TEIL':100='AUF':
                                                                                Image ZU wird angezeigt wenn der Wert kleiner oder gleich 0 ist
                                                                                Image TEIL wird angezeigt wenn der Wert zw. 1 und 99
                                                                                Image AUF wird angezeigt wenn der Wert 100 oder größer ist
                                                                        FLOAT:        f1='{imageID}':f2='{imageID}'...
                                                                            Identische Definition wie bei INTEGER, Dezimaltrennzeichen ist IMMER der PUNKT!
                                                                        STRING:        's1'='{imageID}':'s2'='{imageID}'...:'~DEFAULT'='{imageID}'
                                                                            Entweder eine Auflistung von Strings und den dazu anzuzeigenden Images, oder
                                                                            Der String 'INDIREKT', dabei wird der Wert direkt als ImageID verwendet.
                                                                            Als letztes Element MUSS ein Default-Image angegeben werden, welches angezeigt wird
                                                                            wenn keine Treffer vorhanden ist.
    @param            {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param            {object}            pMainObject                        Ref. auf die zentrale HACVS-Instanz dieses Terminals
**/
function ElementIMGVALUE(pRaster, pConfig, pContext, pMainObject) {

    /*********************************************************************************************************************************************************/
    /** Öffentliche Eigenschaften von IMGVALUE                                                                                                              **/
    /*********************************************************************************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /*********************************************************************************************************************************************************/
    /** Private Eigenschaften von IMGVALUE                                                                                                                  **/
    /*********************************************************************************************************************************************************/
    var raster          = null;                 // Rasterdefinition
    var config          = null;                 // Elementkonfiguration
    var context         = null;                 // Ref. auf 2D-Context für die Darstellung
    var mainObject        = null;                    // Ref. auf die zu verwendene HACVS-Instanz
    var elementMode     = '';                   // Aktueller Zustand des Elements
    var lastMode        = '';                   // Der letzte Zustand des Elements
    var imageObject     = null;                    // Das Image-Objekt, welches das entsprechende Bild ausgibt (eine PICTURE-Instanz)
    var referenceList   = [];                    // Liste aller Vergleichswerte für boolean, integer, float und string
    var defaultImage    = '';                    // Defaultimage für Stringlistenvergleiche
    var variableType    = 0;                    // Typ der Variable (0=boolean, 1=integer, 2=float, 3=string)
    var variableValue   = 0;                    // Der aktuelle Wert der Variable (um Updates ohne Wertänderung zu unterdrücken)
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var defaultConfig   = {                     // Standard- und Grenzwerte der Elementeigenschaften
        col:            { valueType: 'number', valueMin: 1 },
        row:            { valueType: 'number', valueMin: 1 },
        width:          { valueType: 'number', valueMin: 1 },
        height:         { valueType: 'number', valueMin: 1 },
        color:          { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:           { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        varID:          { valueType: 'number', valueMin: 1 },
        varType:        { valueType: 'string', valueList: 'boolean|integer|float|string' },
        resourceConfig: { valueType: 'string' }
    };


    /*********************************************************************************************************************************************************/
    /** Öffentliche Methoden von IMGVALUE                                                                                                                   **/
    /*********************************************************************************************************************************************************/

    /**
//  !               !                   !                               !               !
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param            {string}            [colorKey]                  Eine Farbangabe in CSS2.1-Notation. Ist dieser Parameter vorhanden, erzeugt
                                                                    die draw-Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param            {object}            [hitContext]                Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {
            
                // Die draw-Funktion des PictureElements aufrufen
                imageObject.draw();
            }

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche
                    auf dem Canvas gelöscht und dann ein Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}                Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche löschen
            context.clearRect(x, y, width, height);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Ändert den Funktionsmodus des Elements.
    @param            {string}    newMode     Definiert den neuen Elementmodus. Zwei spezielle Modi stehen zur Verfügung:
                                            - *     versetzt das Element wieder in den vorherigen Mode
                                            - .     versetzt das Element in den Default-Farbmode

    @return         {object}                Referenz auf die Klasse
    **/
    this.setMode = function (newMode) {
        var returnValue = null;

        // Modus wechseln können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Prüfen ob eine der Sonderfunktionen gefordert ist. Wenn ja entsprechenden Modus setzen
            if (newMode === '*') {
                elementMode = lastMode;
            } else {
                if (newMode === '.') {
                    lastMode    = config.mode;
                    elementMode = config.mode;
                } else {
                    // Prüfen ab neuer Modus abweichend vom aktuellen Modus ist
                    if (elementMode !== newMode.toUpperCase()) {
                        // Wir haben eine Modus-Änderung --> aktuellen Modus sichern und neuen Modus setzen
                        lastMode = elementMode;
                        elementMode = newMode.toUpperCase();
                    }
                }
            }
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Verarbeitung eines neuen Wertes und Aktualisierung der Anzeige
    @param            {any}        newValue            Der neue Wert
    **/
    this.valueUpdate = function (newValue) {
        var index = 0;
        var newImageName = '';
        var selectedImage = '';
        
        // Nur wenn wirklich der Wert geändert ist müssen wir etwas tun...
        if (newValue !== variableValue) {
            
            // Gemäß variableType die entsprechende Auswahlprüfung durchlaufen und den namen des anzuzeigenden Images ermitteln
            newImageName = referenceList[0].image;    // Zunächst das Default-Image setzen
            
            switch (variableType) {
            case 0:    // Boolean
                for(index in referenceList) {
                    if (typeof referenceList[index].key === 'boolean') {
                        if (referenceList[index].key === newValue) {
                            newImageName = referenceList[index].image;
                            break;
                        }
                    }
                }
                break;
                
            case 1:
            case 2:
                for(index = 1; index < referenceList.length; index++) {
                    selectedImage = referenceList[index].image;
                    if (newValue <= referenceList[index].key) {
                        break;    // Das passt, die Schleife verlassen
                    }
                }
                newImageName = selectedImage;
                break;
                
            case 3:
                selectedImage = referenceList[0].image;        // Wir starten mit dem Default-Bild...
                for(index in referenceList) {
                    if (newValue === referenceList[index].key) {
                        // Treffer! Auswählen und Schleife beenden
                        selectedImage = referenceList[index].image;
                        break;
                    }
                }
                newImageName = selectedImage;
                break;
            }
            
            
            imageObject.setPicture(newImageName);        // Das entsprechende Bild im PICTURE-Element setzen und die Anzeige aktualsieren
            mainObject.addAction(0, [ { id: config.id, action: 'update',  parameter: [] } ]);
        }
    }
    
    /*********************************************************************************************************************************************************/
    /** IMGVALUE Objekt-Konstruktor                                                                                                                         **/
    /*********************************************************************************************************************************************************/

    var returnValue = false;
    
    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {
    
        // Ups, config ist unvollständig oder fehlerhaft - Meldung übernehmen und mit FALSE beenden
        this.configValid = false;
        this.configError = result.error;
    } else {
    
        // Die Konfiguration ins Objekt kopieren
        config = clone(result.config);

        // Das raster-Objekt aus pRaster übernehmen
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die mainObjekt-Instanz (HACVS-Instanz) im Objekt ablegen
        mainObject = pMainObject
        
        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Die resourceConfig analysieren und verarbeiten
        var pairList = [];
        var refList  = [{key: '~DEFAULT', image: 'none'}];        // Eine Objektlist mit allen Schlüsselwert-Image Paaren, inkl. dem Default-Wert mit Index 0

        // Den Resourcenstring in einzelne Paare zerlegen
        pairList = config.resourceConfig.split(":");
        for (var key in pairList) {
            // Das Paar in Schlüssel und Wert zerlegen
            var pair = pairList[key].split("=");
            switch (config.varType) {
                case 0: pair[0] = (pair[0] == '1' ? true : false); break;
                case 1: pair[0] = parseInt(pair[0]); break;
                case 2: pair[0] = parseFloat(pair[0]); break;
            }

            // Wenn das das Default-Pair ist, dann den DEFAULT-Eintrag in refList anpassen,
            if (typeof pair[0] === 'string' && pair[0].toUpperCase() === '~DEFAULT') {
                refList[0].image = pair[1];
            } else {
                // sonst den Eintrag zur refList hinzufügen.
                refList.push({key: pair[0], image: pair[1]});
            }
        }

        // Die fertige Reference-List im Objekt speichern
        referenceList = refList;
        
        // Ein PICTURE-Element erzeugen und in imageObject speichern
        imageObject = new ElementPICTURE(pRaster, 
                                         { col: config.col, row: config.row, width: config.width, height: config.height, color: config.color,
                                           name: referenceList[0].image },
                                         pContext,
                                         pPictureManager);

        // Die benötigte Variable beim dataManager anmelden
        mainObject.myDataManager.registerVariable(config.varID, this.valueUpdate);

        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}


/**
 * Element: BARGRAPH
 *
 * x:               null
 * y:               null
 * width:           null
 * height:          null
 * color:           'ORANGE'
 * varID:           null
 * orientation:     'VERT'
 * minValue:        0
 * maxValue:        100
 * lowLimit:        0
 * highLimit:       0
 * scaleFactor:     1
 * showTicks:       true
 * showValues:      true
 * showIntervall:   10
 */


/**
//  !               !                   !                               !               !
    @description    Element: SOUNDTOGGLE
                    Dieses Element dient zum Ein- und Ausschalten des Soundsystems. Bei jedem Klick auf das Element wird der Status umgeschaltet und die
                    Anzeige entpsrechend aktualisiert.
    @param            {Number}            pRaster.gridWidth                Breite einer Rasterspalte in Pixel
    @param            {Number}            pRaster.gridHeight                Höhe einer Rasterzeile in Pixel
    @param            {Number}            pRaster.maxWidth                Anzahl der verfügbaren Rasterspalten
    @param            {Number}            pRaster.maxHeight                Anzahl der verfügbaren Rasterzeilen
    @param            {Number}            pConfig.col                        Linke Rasterspalte der Elementfläche
    @param            {Number}            pConfig.row                        Obere Rasterzeile der Elementfläche
    @param            {Number}            pConfig.width                    Breite des Elements in Rasterspalten
    @param            {Number}            pConfig.height                    Höhe des Elements in Rasterzeilen
    @param            {String}            [pConfig.color='orange']        Zu verwendene Farbpalette
    @param            {String}            [pConfig.mode='regular']        Der Default-Farbmodus des Elements. Zulässige Werte sind:
                                                                        - disabled    Abgedunkelt und ausgegraut
                                                                        - regular    Normale Farbgebung
                                                                        - highlight    Hervorgehoben (z.B. bei Bedienung)
                                                                        - alarm        In Rot gefärbt (z.B. bei Systemalarm)
    @param            {String}            pConfig.pictureOff                Die Image-Resource, die bei abgeschaltetem Sound angezeigt werden soll
    @param            {string}            pConfig.pictureOn                Die Image-Resource, die bei eingeschaltetem Sound angezeigt werden soll
    @param            {object}            pContext                        Ref. auf einen Canvas-2D-Context zur Darstellung des Elements
    @param            {object}            pMainObject                        Ref. auf die zentrale HACVS-Instanz dieses Terminals
**/
function ElementSOUNDTOGGLE(pRaster, pConfig, pContext, pMainObject) {

    /**********************************************************************************************/
    /** Öffentliche Eigenschaften von SOUNDTOGGLE                                                **/
    /**********************************************************************************************/
    this.configValid    = true;                 // Wird bei config-Fehlern auf FALSE gesetzt
    this.configError    = '';                   // Textbeschreibung aller config-Fehler


    /**********************************************************************************************/
    /** Private Eigenschaften von SOUNDTOGGLE                                                    **/
    /**********************************************************************************************/
    var raster          = null;                    // Rasterdefinition
    var config          = null;                    // Elementkonfiguration
    var context         = null;                    // Ref. auf 2D-Context für die Darstellung
    var mainObject        = null;                    // Ref. auf die zentrale HACVS-Instanz des Terminals
    var drawSet         = null;                    // Zeichekoordinaten (berechnet der Konstruktor)
    var elementMode     = '';                    // Aktueller Zustand des Elements
    var lastMode        = '';                    // der letzte Zustand des Elements
    var x               = 0;                    // Der linke Rand des Elements (in Pixel)
    var y               = 0;                    // Der obere Rand des Elements (in Pixel)
    var width           = 0;                    // Die Beite des Elements (in Pixel)
    var height          = 0;                    // Die Höhe des Elements (in Pixel)
    var imageObject     = null;                    // Speicher für die Image-Referenz vom PictureManager
    var defaultConfig   = {                        // Standard- und Grenzwerte der Elementeigenschaften
        col:        { valueType: 'number', valueMin: 1 },
        row:        { valueType: 'number', valueMin: 1 },
        width:      { valueType: 'number', valueMin: 1 },
        height:     { valueType: 'number', valueMin: 1 },
        color:      { valueType: 'string', valueList: colorTableList, valueDefault: 'orange' },
        mode:       { valueType: 'string', valueList: 'disabled|regular|highlight|alarm', valueDefault: 'regular' },
        pictureOff: { valueType: 'string' },
        pictureOn:  { valueType: 'string' }
    };


    /**********************************************************************************************/
    /** Öffentliche Methoden von SOUNDTOGGLE                                                     **/
    /**********************************************************************************************/

    /**
//  !               !                   !                               !               !
    @description    Erzeugt eine Darstellung des Elements oder eine Farbfläche auf einem Canvas
    @param            {string}            [colorKey]                  Eine Farbangabe in CSS2.1-Notation. Ist dieser Parameter vorhanden, erzeugt
                                                                    die draw-Funktion eine Farbfläche über den gesamten Element-Bereich.
    @param            {object}            [hitContext]                Der context, auf den die hitMask-Fläche des Elements gezeichnet werden soll.

    @return         {object}            Referenz auf die Klasse
    **/
    this.draw = function (colorKey, hitContext) {
        var returnValue = null;

        // Zeichnen können wir nur wenn wir valide sind...
        if (this.configValid) {

            // Farbfläche oder Objektdarstellung?
            if (colorKey !== undefined) {

                // Einfache Farbfläche erzeugen
                hitContext.save();
                hitContext.fillStyle   = '#' + colorKey;
                hitContext.fillRect(x, y, width, height);
                hitContext.restore();
            } else {

                var eColor = getColorValue(config.color, elementMode);
                context.save();
                context.translate(x, y);
                
                if (imageObject === null) {
                
                    // Keine Bild-Resource, Ersatzzeichnung ausgeben
                    context.strokeStyle = eColor;
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(1, 1);
                    context.lineTo(width - 2, 1);
                    context.lineTo(width - 2, height - 2);
                    context.lineTo(1, height - 2);
                    context.lineTo(1, 1);
                    context.lineTo(width, height - 2);
                    context.moveTo(1, height - 2);
                    context.lineTo(width - 2, 1);
                    context.stroke();
                    context.restore();
                } else {

                    // Eine Farbfläche als Hintergrund erzeugen
                    context.fillStyle = eColor;
                    context.fillRect(1, 1, width - 2, height - 2);
                    
                    // Und jetzt das Bild (Icon) auf der Fläche darstellen
                    if (typeof imageObject === 'object') {
                        context.drawImage(imageObject,
                                          drawSet.sX, drawSet.sY, drawSet.sWidth, drawSet.sHeight,
                                          drawSet.dX, drawSet.dY, drawSet.dWidth, drawSet.dHeight);
                    }
                }
                context.restore();
            }
            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Aktualisiert die Darstellung des Elements auf dem Canvas. Dazu wird erst die entsprechende Fläche
                    auf dem Canvas gelöscht und dann ein Neuzeichnen durch den Aufruf von this.draw veranlasst.

    @return         {object}                Referenz auf die Klasse
    **/
    this.update = function () {
        var returnValue = null;

        // Updaten können wir nur wen wir valide sind...
        if (this.configValid) {

            // Aktualisierung der Anzeige: Die Fläche bis auf einen 1 pixel breiten RAND löschen
            context.clearRect(x + 1, y + 1, width - 2, height - 2);

            // und this.draw aufrufen um das Objekt neu darzustellen
            this.draw();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /**
//  !               !                   !                               !               !
    @description    Verarbeitet eine Klick-Aktion auf den Button. Dabei wird die Condition-Prüfung ausgeführt und die entsprechende Aktion veranlasst.
    @param            {object}            myID                        Die ID des Buttons (für addAction-Aufrufe).
    
    @return         {object}            Eigenreferenz oder null, falls Ausführung fehlerhaft.
    **/
    this.click = function (myID) {
        var returnValue = null;

        // Klick geht nur wenn wir valide sind...
        if (this.configValid) {

            // Status des Soundsystems umschalten
            var status = mainObject.mySoundManager.toggleSound();

            // Zum neuen Status passendes Icon holen und im drawSet ablegen
            drawSet.name = status ? config.pictureOn : config.pictureOff;

            // Das Image-Objekt neu vom PictureManager holen
            imageObject = mainObject.myPictureManager.getPicture(drawSet.name);
            
            // Jetzt noch ein Update und fertig.
            this.update();

            // Eigenreferenz zurückliefern damit Aufrufe kaskadiert werden können.
            returnValue = this;
        }
        return returnValue;
    };


    /*********************************************************************************************************************************************************/
    /** SOUNDTOGGLE Objekt-Konstruktor                                                                                                                        **/
    /*********************************************************************************************************************************************************/

    var returnValue = false;
    // Prüfen des config-Objekts auf vollständigkeit und validität der Werte
    var result = checkParameter(pConfig, defaultConfig);
    if (!result.valid) {
        // Ups, config ist unvollständig oder fehlerhaft - Meldung übernehmen und mit FALSE beenden
        this.configValid = false;
        this.configError = result.error;
    } else {
        config = clone(result.config);

        // Das raster-Objekt in pRaster übernehmen
        raster = clone(pRaster);

        // Die context-Referenz im Objekt abspeichern
        context = pContext;

        // Die mainObject-Referezn im Objekt abspeichern
        mainObject = pMainObject;

        // Die Außenkoordinaten (x, y, width, height) in Pixelwerte umrechnen und im Objekt ablegen
        x       = (config.col - 1) * raster.gridWidth;
        y       = (config.row - 1) * raster.gridHeight;
        width   = config.width * raster.gridWidth;
        height  = config.height * raster.gridHeight;

        // Den Standardmodus des Objekts in elementMode und lastMode übertragen
        elementMode = config.mode;
        lastMode    = config.mode;

        // Den aktuellen Status des SoundManagers abfragen und das entsprechendes Symbol auswählen
        var name = mainObject.mySoundManager.getEnabled() ? config.pictureOn : config.pictureOff;

        // Das ImageObject vom PictureManager holen
        imageObject = mainObject.myPictureManager.getPicture(name);
        
        // Die Abmessungen des Image-Objekts ermitteln
        var imageWidth  = imageObject.width;
        var imageHeight = imageObject.height;
        
        // Jetzt noch die restlichen Koordinaten für die Darstellung berechnen und im drawSet speichern
        
        // sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight
        drawSet = {
            name:        name,
            sX:            0,
            sY:            0,
            sWidth:        imageWidth,
            sHeight:    imageHeight,
            dX:            1,                // Das Bild mit einem 1 pixel breiten Abstand
            dY:            1,                // anlegen, damit es bei Darstellung auf einem
            dWidth:        width - 2,        // BAR dann NICHT über die BAR hinaus ragt.
            dHeight:    height - 2
        };
        
        // Ende Konstruktor
        returnValue = true;
    }
    return returnValue;
}

/* EOF */