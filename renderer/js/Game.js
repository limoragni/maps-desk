var Game = function(){
    this.setProperties()
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
        var x = GameModel.getHintCountries();
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
            this.onWrongCountry(options.country);
        } else  {
            this.onGuessedCountry(options.country);
        };

        if (this.isThisTheLastCountry()) {
            this.gameOver();
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
        this.setPoints();
        this.showNextCountry();
        d3.select(country).classed(GameModel.currentPlayer.userColorFine, true);
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
        var oneCountryLeft = GameModel.getNumberOfCountriesLeft() === 1
        var triedAllTimes = this.countClicks === GameModel.amountOfTries
        var rightCountry = this.countryClicked === GameModel.currentCountry
        if (( oneCountryLeft && triedAllTimes)||(oneCountryLeft && rightCountry)) {
            return true;
        };
    },


    colorWrongCountry: function(){
        var self = this;
        d3.selectAll('path').each(function(d){
            if (GameModel.currentCountry === d.key) {
                d3.select(this).classed(GameModel.currentPlayer.userColorWrong,true);
            }
        })
    },

    showNextCountry: function(){
        GameModel.nextCountry()
        GameModel.vent.on('multi:mode', GameModel.changePlayer());
        this.showCountry()
        this.countClicks = 0;
        d3.selectAll('path').classed('hint-country',false)
    },

    showCountry: function(){
        this.UI.countryName.empty();
        this.UI.countryName.append(GameModel.getCurrentCountryName());
    },

    setPoints: function(){
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
