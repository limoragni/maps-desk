// WINDOW es el objeto global en los browsers. Cualquier propiedad de este objeto es una variable global
// que puede ser utilizada desde cualquier parte de la aplicación
// OJO! también puede ser sobrescrita. Por eso, para prevenir en cierta medida esto, se usa la
// convención de que las variables globales comiencen con Mayúsculas

// TAREA: cambiar nombre a GameUI porque a partir de ahora este objeto debería manejar
// solamente la interfaz gráfica con la que interactua el usuario (Puntos, botón de hint, nombre del país, etc.)
// Todo lo que es mostrar cosas en el mapa ahora va a pasar al Map
window.Game = function(){
    this.setProperties();
}

Game.prototype = {
    setProperties: function(){
        this.countClicks     = 0;
        this.wrongPoints     = 0;
        this.countryClicked  = null
        this.UI              = {}
        this.setUI()
    },

    start: function(){
        this.setEvents()
        this.showCountry()
    },

    setUI: function(){
        this.UI = {
            points           : $('#player-points'),
            reset            : $('#reset-button'),
            hint             : $('#hint-button'),
            countryName      : $('#h-country'),
            finalPanel       : $('#final-indicator'),
            countryNamePanel : $('#country-indicator'),
            containerGame    : $('#container-game')

        }
    },

    setEvents: function(){
        this.UI.reset.click( _.bind( this.resetGame,           this));
        this.UI.hint.click(  _.bind( this.colorHintsCountries, this));
        GameModel.vent.on('game:mode:set', this.onModeSelected, this);
        // Acá es donde se van a escuchar todos los nuevos mensajes
        // por ej GameModel.vent.on('country:guessed', this.onGuessedCountry, this)
        // una posibilidad sería tener un mensaje que sea show:country que mande como parametro
        // el couentry que hay que mostrar.
    },

    onModeSelected: function(mode){
        this.activateCountries(GameModel.getCurrentCountries());
        this.UI.countryNamePanel.fadeIn();
        this.UI.containerGame.css({ //esta funcion pone el fondo celeste y hace el cuadriculado
            'background-color': '#1D6C8F',
            'background-size': '28px 28px, 28px 28px'
        });
        console.log(GameModel.players)
    },

    colorHintsCountries: function(){
        // Se lamará el método GameModel.showHint() -> El game model manda mensaje (ver comment [1] en Game Model)
        // usando this.trigger('show:hint', countries)
        // Lo que sigue acá abajo, debería de no estar más
        var x = GameModel.getHintCountries(); // Este método ahora se va a usar dentro del GameModel
        // Este de acá abajo se va a usar dentro de Map ver comment [2] en Map
        d3.selectAll('path').each(function(d){
            for (var i in x ){
                if (x[i] === d.key) {
                    var self = this;
                    d3.select(this).classed('hint-country',true);
                }
            }
        })
    },

    //what the fuck the options parameters?
    onCountryClicked: function(options){
        this.countClicks++
        this.countryClicked = options.data.key;
        if (!this.isThisTheRightCountry()){
            this.onWrongCountry(options.country); // Estos métodos que se llamana acá van a ser reemplazados por los mensajes que manda GameModel
        } else  {
            this.onGuessedCountry(options.country);
        };

        if (this.isThisTheLastCountry()) {
            this.gameOver(); // Esto puede ser otro mensaje que envía el GameModel
        };
        console.log(GameModel.currentPlayer)
    },

    isThisTheRightCountry: function(){
        if(GameModel.isThisCountryCorrect(this.countryClicked))
            return true
        if(this.countClicks < GameModel.amountOfTries && !GameModel.isThisCountryCorrect(this.countryClicked))
            return false
    },

    onGuessedCountry: function(country){
        this.setPoints(); // Con los nuevos cambios esto se va a hacer directamente dentro del gameModel
        this.showNextCountry();
        d3.select(country).classed(GameModel.currentPlayer.playerColorFine, true);
    },

    onWrongCountry: function(country){
        d3.select(country).classed('stroke-country',true);
        setTimeout(function(){
            d3.select(country).classed('stroke-country',false);
        }, 400);
        if(this.countClicks === GameModel.amountOfTries){
            this.onLoseTurn();
        };
    },

    onLoseTurn: function(){
        this.colorWrongCountry();
        this.showNextCountry();
        this.wrongPoints++
    },

    isThisTheLastCountry: function(){
        var oneCountryLeft = GameModel.getNumberOfCountriesLeft() === 1;
        var triedAllTimes = this.countClicks === GameModel.amountOfTries;
        var rightCountry = this.countryClicked === GameModel.currentCountry;
        if (( oneCountryLeft && triedAllTimes)||(oneCountryLeft && rightCountry)) {
            return true;
        };
    },

    colorWrongCountry: function(){
        var self = this;
        d3.selectAll('path').each(function(d){
            if (GameModel.currentCountry === d.key) {
                d3.select(this).classed(GameModel.currentPlayer.playerColorWrong,true);
            }
        })
    },

    showNextCountry: function(){
        GameModel.nextCountry()
        GameModel.changePlayer()
        this.showCountry()
        this.countClicks = 0;
        d3.selectAll('path').classed('hint-country',false)
    },

    showCountry: function(){
        this.UI.countryName.empty();
        this.UI.countryName.append(GameModel.getCurrentCountryName());
    },

    setPoints: function(){
        //Como esto ahora se hace en el GameModel, el GameModel debería de mandar un mensaje
        // diciendo que se sumaron puntos a X player y que hay que mostrarlos
        GameModel.addPoints(1);
        this.UI.points.html(GameModel.currentPlayer.points);
    },

    resetColors: function(){
        d3.selectAll('path').classed('ctry-fine ctry-wrong',false);
    },

    resetGame: function(){
        // this.getInMenu();
        GameModel.reset();
        this.setProperties();
        this.start();
        this.resetColors()
        this.UI.finalPanel.animate({left:'-340px'}, 1000);
        this.UI.finalPanel.empty();
        this.UI.finalPanel.append('<span id="reset-button" class="label label-default">Reset</span>');
        this.UI.points.empty();
    },

    gameOver: function(){
        var percent = Math.floor(GameModel.points * 100 / GameModel.getNumberOfCountries()) + '%';
        this.UI.finalPanel.append('<strong>Acertaste el ' +percent+ ' de los paises</strong>');
        this.UI.finalPanel.animate({left:'0px'}, 1000);
    },

    activateCountries: function(countries){
        if(countries){
            d3.selectAll('path').each(function(d){
                d3.select(this).classed('disable-country',true);
                for (var i in countries ){
                    if (countries[i] === d.key) {
                        d3.select(this).classed('disable-country',false);
                    }
                }
            })
        }
    }
}
