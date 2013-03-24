/******************************************************************************************************************************/
/**                                                                                                                          **/
/** PictureManager-Klasse                                                                                                    **/
/**                                                                                                                          **/
/******************************************************************************************************************************/
function PictureManager() {
    var self = this;

    
    /********************************************/
    /** Private Eigenschaften von SoundManager **/
    /********************************************/
    
    
    var isReady = false;        // True wenn der PictureManager initialisiert ist und alle Resourcen geladen hat.
    var images  = {};           // Array mit den geladenen Image-Resourcen


    /***************************************/
    /** Private Methoden von SoundManager **/
    /***************************************/
    
    
    /**
    @description    Lädt ein durch Pfad und Dateiname spezifiziertes Imagefile und legt es in images ab.
    @param          {string}        basePath            Pfad zum Speicherort der Soundfiles (Angabe mit abschl. Backslash!)
    @param          {string}        name                Name des Imagefiles (mit Extension!)
    @param          {function}      loaded_callback     Funktion die Aufgerufen werden soll wenn das Imagefile geladen wurde.
    **/
    function load(basePath, name, loaded_callback) {
    
        // name enthält sowohl die kennung (=name) als auch den Dateinamen, welche nicht gleich sein müssen! Getrennt sind beide
        // Komponenten durch einen Doppelpunkt (:)
        
        // Als erstes name und Dateiname voneinander trennen
        var dateiname = (name.split(':'))[1];
        var name      = ((name.split(':'))[0]).toLowerCase();	// Image-Namen sind NICHT case-sensitiv!
        
        // Jetz den vollständigen Dateinamen aus basePath und Dateiname erzeugen
        var path  = basePath + dateiname,
            image = new Image();

        image.onload = function() {
            this.onload = null;
            console.log('Image ' + path + ' is ready for use.');
            if (loaded_callback) {
                loaded_callback();
            }
        }

        image.onerror = function(e) {
            this.onerror = null;
            console.log('Error: Image ' + path + ' could not be loaded.');
            images[name] = null;
        }

        console.log('Loading imagefile ' + path + ' from Server...');
        image.src = path;

        images[name] = image;
    }


    /**
    @description    Ein Wrapper für die load-Funktion. Fügt den Speicherpfad hinzu und ruft damit load auf.
    @param          {string}        name                Name des Soundsfiles (ohne Extension!)
    @param          {function}      handleLoaded        Funktion die Aufgerufen werden soll wenn das Soundfile bereit ist.
    **/
    function loadImage(name, handleLoaded) {
        load("images/", name, handleLoaded);
    }


    /*********************************************/
    /** Öffentliche Methoden von PictureManager **/
    /*********************************************/


    /**
    @description    Lädt alle Image-Files, die in der übergebenen Liste aufgeführten sind, in den PictureManager.
    @param          {array[string]} resources           Liste aller Pictures, die geladen werden sollen (ohne Pfad, mit Ext.)
    @param          {function}      handleLoadDone      Funktion die Aufgerufen wird, wenn alle Soundfiles geladen wurden und
                                                        der SoundManager "funktionsbereit" ist.
    **/
    this.loadImageFiles = function (resources, handleLoadDone) {
    
        // interne Ready-Kennung löschen
        isReady = false;
        
        // Evtl. vorhandene Images löschen
        images = {};
        
        // Anzahl der zu ladenen Imagefiles ermitteln
        var counter = _.size(resources);
        
        console.log('Loading image files...');
        
        // Iterate over the complete list and load all image resources
        _.each(resources, function f(name) {
            loadImage(name, function g() {
                counter -= 1;
                if (counter === 0) {
                    console.log('PictureManager ready - all resources loaded');
                    self.isReady = true;
                    if (handleLoadDone) {
                        handleLoadDone();
                    }
                }
            });
        });
    }

    
    /**
    @description    Liefert die Referenz auf ein im PictureManager gespeichertes Bild zur weiteren Verwendung.
    @parameter      {string}            name            Name des Images, dessen Referenz benötigt wird.
    
    @return         {boolean|object}    Referenz auf das gewünschte Bild oder NULL, falls kein entsprechendes Bild existiert.
    **/
    this.getPicture = function (name) {
        var returnValue = NULL;
        name = name.toLowerCase();	// Imagenamen sind nicht case-sensitiv!
		
        if (name !== 'none') {
            if (images[name] !== undefined) {
                returnValue = images[name];
            }
        }
        return returnValue;
    }


	/**
	@description	Liefert ein True wenn die angegebene Image-Resource existiert, sonst ein False
	@parameter		{string}			name			Name des Iamges, das geprüft werden soll.
	
	@return			{boolean}			True wenn eine Resource mit der ID 'name' existiert, sonst false.
	**/
	this.pictureExist = function (name) {
		var returnValue = false;

		if (images[name.toLowerCase()] !== undefined) {
			returnValue = true;
		}
		return returnValue;
	}
	
	
    /** KONSTRUKTOR **/
    isReady = false;
    images = {};
};


/** EOF **/