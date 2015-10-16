// WINDOW es el objeto global en los browsers. Cualquier propiedad de este objeto es una variable global
// que puede ser utilizada desde cualquier parte de la aplicación
// OJO! también puede ser sobrescrita. Por eso, para prevenir en cierta medida esto, se usa la
// convención de que las variables globales comiencen con Mayúsculas

window.GameUI = function(){
    this.setProperties();
}

GameUI.prototype = {
    setProperties: function(){
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
            points           : [$('#player-points'),$('#player2-points')],
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
        GameModel.vent.on('multi:mode'   , this.displayPlayer2 , this)
        GameModel.vent.on('game:mode:set', this.onModeSelected , this);
        GameModel.vent.on('points:added' , this.setPoints      , this)
        GameModel.vent.on('next:turn'    , this.showNextCountry, this);
    },

    onModeSelected: function(mode){
        this.activateCountries(GameModel.getCurrentCountries());
        this.UI.countryNamePanel.fadeIn();
        this.UI.containerGame.css({ //esta funcion pone el fondo celeste y hace el cuadriculado
            'background-color': '#1D6C8F',
            'background-size': '28px 28px, 28px 28px'
        });
    },

    displayPlayer2: function(){
        $('#player2-div').show()
    },

    colorHintsCountries: function(){
        GameModel.showHint();
    },
                                    // ??????????????????
    isThisTheLastCountry: function(){
        var oneCountryLeft = GameModel.getNumberOfCountriesLeft() === 1;
        var triedAllTimes = this.countClicks === GameModel.amountOfTries;
        var rightCountry = this.countryClicked === GameModel.currentCountry;
        if (( oneCountryLeft && triedAllTimes)||(oneCountryLeft && rightCountry)) {
            return true;
        };
    },

    showNextCountry: function(){
        GameModel.nextCountry()
        GameModel.changePlayer()
        this.showCountry()
        GameModel.currentPlayer.countClicks = 0;
        d3.selectAll('path').classed('hint-country',false)
    },

    showCountry: function(){
        this.UI.countryName.empty();
        this.UI.countryName.append(GameModel.getCurrentCountryName());
    },

    setPoints: function(){
        GameModel.currentPlayer.playerPanelPoints.html( GameModel.currentPlayer.points);
        GameModel.currentPlayer.playerPanelGuessed.html(GameModel.currentPlayer.countriesGuessed);
        GameModel.currentPlayer.playerPanelMissed.html( GameModel.currentPlayer.countriesMissed);
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
