/******************************************************************************************************************************/
/**                                                                                                                          **/
/** soundManager-Klasse                                                                                                      **/
/**                                                                                                                          **/
/******************************************************************************************************************************/
function SoundManager(handleReady) { 'use strict';
    var self = this;


    /********************************************/
    /** Private Eigenschaften von SoundManager **/
    /********************************************/


    var enabled     = true;
    var isReady     = false;
    var extension   = Detect.canPlayMP3() ? "mp3" : "ogg";
    var sounds      = {};
    var resources   = ['access_denied', 'access_permitted', 'alarm_general', 'alarm_mainsystem', 'alarm_techsystem',
                       'alarm_warpsystem', 'key_pressed1', 'key_pressed2', 'list_scrolling1', 'list_scrolling2', 'processing1',
                       'processing2', 'processing3', 'system_ready1', 'system_ready2', 'system_search', 'system_shutdown',
                       'system_startup', 'terminal_hide', 'terminal_show'];


    /***************************************/
    /** Private Methoden von SoundManager **/
    /***************************************/


    /**
    @description    Lädt ein durch Pfad und Dateiname spezifiziertes Soundfile und legt es in sounds ab. Für parallele
                    Wiedergabe werden mehrere Kopien des Sounds angelegt
    @param          {string}        basePath            Pfad zum Speicherort der Soundfiles (Angabe mit abschl. Backslash!)
    @param          {string}        name                Name des Soundsfiles (ohne Extension!)
    @param          {function}      loaded_callback     Funktion die Aufgerufen werden soll wenn das Soundfile bereit ist.
    @param          {number}        [channels=1]        Anzahl der kopien für paralelle Wiedergabe.
    **/
    function load(basePath, name, loaded_callback, channels) {

        if (channels === undefined) { channels = 1; }

        var path  = basePath + name + "." + extension,
            sound = document.createElement('audio');

        sound.addEventListener('canplaythrough', function f(e) {
            this.removeEventListener('canplaythrough', f, false);
            console.log(path + " is ready to play.");
            if (loaded_callback) {
                loaded_callback();
            }
        }, false);
        sound.addEventListener('error', function f(e) {
            this.removeEventListener('error', f, false);
            console.log("Error: " + path + "could not be loaded.");
            sounds[name] = null;
        }, false);

        sound.preload = "auto";
        sound.autobuffer = true;
        sound.src = path;
        sound.load();

        sounds[name] = [sound];
        _.times(channels - 1, function f() {
            sounds[name].push(sound.cloneNode(true));
        });
    }


    /**
    @description    Ein Wrapper für die load-Funktion. Fügt den Speicherpfad und die channels-Angabe hinzu und ruft damit
                    load auf.
    @param          {string}        name                Name des Soundsfiles (ohne Extension!)
    @param          {function}      handleLoaded        Funktion die Aufgerufen werden soll wenn das Soundfile bereit ist.
    **/
    function loadSound(name, handleLoaded) {
        load("sounds/", name, handleLoaded, 4);
    }


    /**
    @description    Lädt alle Sound-Files, die in der Liste resources aufgeführten sind, in den SoundManager.
    @param          {function}      handleLoaded        Funktion die Aufgerufen wird, wenn alle Soundfiles geladen wurden und
                                                        der SoundManager "funktionsbereit" ist.
    **/
    function loadSoundFiles(handleLoadDone) {

        // Anzahl der zu ladenen Soundfiles ermitteln
        var counter = _.size(resources);

        console.log("Loading sound files...");

        // Iterate over the complete resource-list and load all sound resources
        _.each(resources, function f(name) {
            loadSound(name, function g() {
                counter -= 1;
                if (counter === 0) {
                    console.log('SoundManager ready - all resources loaded');
                    isReady = true;
                    if (handleLoadDone) {
                        handleLoadDone();
                    }
                }
            });
        });
    }


    /**
    @description    Liefert eine freie (nicht mit wiedergabe beschäftigte) Instanz des gewünschten Sounds
    @param          {string}        name            Name der gewünschten Soundkonserve

    @return         {object}        Referenz auf eine Audio-Instanz, die bereit zur wiedergabe ist - bzw. auf die erste,
                                    wenn keine freie Instanz gefunden werden kann.
    **/
    function getSound(name) {
        if (!sounds[name]) {
            return null;
        }
        var sound = _.find(sounds[name], function (sound) {
            return sound.ended || sound.paused;
        });
        if (sound && (sound.ended || sound.paused)) {
            sound.currentTime = 0;
        } else {
            sound = sounds[name][0];
        }
        return sound;
    }


    /*******************************************/
    /** Öffentliche Methoden von SoundManager **/
    /*******************************************/


    /**
    @description    Prüft ob der SoundManager bereit ist. Der Status wird an den Aufrufer zurückgegeben. Auf Wunsch (waitUntilReady) kann
                    ein Event abgefeuert werden sobald der SoundManager alle Files geladen hat.
    @param
    **/
    this.isReady = function (onReady) {
        if (onReady !== undefined) {
            // Caller möchte ein Event haben. Aktuellen Status von isReady prüfen
            if (isReady) {
                // SoundManager ist bereit, das Event sofort auslösen
                    onReady();
            } else {
                // SoundManager braucht noch... setTimeout programmieren und isReady zyklisch prüfen
                window.setTimeout(function f () {
                    if (self.isReady) {
                        // Jetzt ist der SoundManager bereit, onReady ausführen
                        onReady();
                    } else {
                        // Immer noch beschäftigt mit sich selber, in 100ms erneut prüfen
                        window.setTimeout(onReady, 100);
                    }
                });
            }
        }
        // Aktuellen Status des SoundManagers an Aufrufer liefern
        return isReady;
    }

	
	/**
	@description	Liefert den aktuellen Status des SoundManagers
	
	@return			{boolean}		True wenn das Soundsystem aktiviert ist, sonst False
	**/
	this.getEnabled = function () {
		
		return enabled;
	}
	

    /**
    @description    Schaltet Soundausgabe ein oder aus, ja nach aktuellem Zustand.

    @return         {boolean}       True wenn das Soundsystem aktiviert ist, sonst False
    **/
    this.toggleSound = function () {
        if (enabled) {
            console.log('Sounds switched OFF');
            enabled = false;
        } else {
            console.log('Sounds switched ON');
            enabled = true;
        }
        return enabled;
    };


    /**
    @description    Schaltet die Soundausgabe ein, falls sie ausgeschaltet ist.
    **/
    this.activateSound = function () {
        if (!enabled) {
            console.log('Sounds switched ON');
            enabled = true;
        }
    };


    /**
    @description    Schaltet die Soundausgabe ein, falls sie ausgeschaltet ist.
    **/
    this.deactivateSound = function () {
        if (enabled) {
            console.log('Sounds switched OFF');
            enabled = false;
        }
    };


    /**
    @description    Startet die Wiedergabe des gewünschten Sounds.
    @param          {string}        soundName	Name des Soundfiles, das wiedergegeben werden soll.
    **/
    this.playSound = function (soundName) {
		var name = soundName.toLowerCase();
        var sound = enabled && getSound(name);
        if (sound) {
			console.log('Now playing sound ' + soundName + '...');
            sound.play();
        }
    };


    /**
    @description    Startet eine zeitlich begrenzte Wiedergabeschleife mit einstellbarer Pausenzeit.
    @param          {string}        soundName   Name des Soundfiles, das wiedergegeben werden soll.
    @param          {number}        duration    Dauer (in Sekunden) für die die Wiedergabeschleife laufen soll.
    @param          {number}        delay       Pausenzeit zwischen 2 Wiedergabestarts (in Millisekunden). Achtung: Die Spiel-
                                                zeit des Sounds bleibt unberücksichtigt. Achten Sie darauf delay größer als die
                                                Wiedergabedauer des Sounds zu setzen.
    **/
    this.repeatSound = function (soundName, duration, delay) {
		var name = soundName.toLowerCase();
        var sound = enabled && getSound(name);
        if (sound) {
            sound.play();
            if (duration > 0 ) {
                // Start der Schleife. Endzeitpunkt berechnen
                var stopTime = (new Date()).getTime() + duration * 1000;
                duration = (-1) * stopTime;
            }
            if ((duration*(-1)) > (new Date().getTime())) {
                window.setTimeout(function () { self.repeatSound(name, duration, delay); }, delay);
            }
        }
    };


    /** SoundManager KONSTRUKTOR **/
    loadSoundFiles(handleReady);

}

/* EOF */