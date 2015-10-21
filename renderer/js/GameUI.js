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
        this.playersUI       = []
        this.setUI()
        this.initialize()
    },

    initialize: function(){
        this.listenToEvents()
        this.showCountry()
    },

    setUI: function(){
        this.UI = {
            reset            : $('#reset-button'),
            hint             : $('#hint-button'),
            countryName      : $('#h-country'),
            finalPanel       : $('#final-indicator'),
            countryNamePanel : $('#country-indicator'),
            containerGame    : $('#container-game')
        }
    },

    listenToEvents: function(){
        this.UI.reset.click( _.bind( this.resetGame,             this));
        this.UI.hint.click(  _.bind( this.colorHintsCountries,   this));

        GameModel.vent.on('player:mode:set',        this.setPlayersUI,           this);
        GameModel.vent.on('game:mode:set',          this.onModeSelected,         this);
        GameModel.vent.on('points:added',           this.setPoints,              this);
        GameModel.vent.on('next:turn',              this.showNextCountry,        this);
        GameModel.vent.on('current:player:changed', this.onCurrentPlayerChanged, this);
    },

    onModeSelected: function(mode){
        this.UI.countryNamePanel.fadeIn();
        this.UI.containerGame.css({ //esta funcion pone el fondo celeste y hace el cuadriculado
            'background-color': '#1D6C8F',
            'background-size': '28px 28px, 28px 28px'
        });
    },

    setPlayersUI: function(mode){
        this.playersUI.push(new PlayerUI(1))
        if(mode == 'multi'){
            this.playersUI.push(new PlayerUI(2))
            $('#player2-div').show()
        }

    },

    colorHintsCountries: function(){
        GameModel.showHint();
    },

    //Este método puede ir en el GameModel
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
        this.showCountry()
        GameModel.currentPlayer.countClicks = 0;
        d3.selectAll('path').classed('hint-country',false)
    },

    showCountry: function(){
        this.UI.countryName.empty();
        this.UI.countryName.append(GameModel.getCurrentCountryName());
    },

    setPoints: function(){
        current = this.playersUI[GameModel.currentPlayer.playerIndex]
        current.UI.panelPoints.html(GameModel.currentPlayer.points)
        current.UI.panelGuessed.html(GameModel.currentPlayer.countriesGuessed)
        current.UI.panelMissed.html(GameModel.currentPlayer.countriesMissed)
    },

    resetColors: function(){
        d3.selectAll('path').classed('ctry-fine ctry-wrong',false);
    },

    resetGame: function(){
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

    onCurrentPlayerChanged: function(player){
        if(GameModel.playersMode == 'multi'){
            this.playersUI[0].UI.turnIndicator.hide();
            this.playersUI[1].UI.turnIndicator.hide();
            this.playersUI[player.playerIndex].UI.turnIndicator.show();
        }
    }
}
