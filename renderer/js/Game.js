var Game = function(){
    this.setProperties()
}

Game.prototype = {
    setProperties: function(){
        this.countClicks     = 0;
        this.wrongPoints     = 0;
        this.canClick        = true;
        this.countryClicked  = null
        this.UI              = {}
        this.setUI()
    },

    start: function(){
        this.setEvents()
        this.gameModes();
        this.showCountry()
    },

    setUI: function(){
        this.UI = {
            points        : $('#player-points'),
            reset         : $('#reset-button'),
            hint          : $('#hint-button'),
            countryName   : $('#h-country'),
            finalPanel    : $('#final-indicator'),
            easyButton    : $('#easy-mode-button'),
            mediumButton  : $('#medium-mode-button'),
            hardButton    : $('#hard-mode-button'),
            modeButtons   : $('.game-mode-button')
        }
    },

    setEvents: function(){
        this.UI.reset.click(       _.bind( this.resetGame,           this));
        this.UI.hint.click(        _.bind( this.colorHintsCountries, this));
        this.UI.modeButtons.click( _.bind( this.onModeSelected,      this));
    },

    onModeSelected: function(evt){
        var mode = $(evt.target).data('mode')
        GameModel.setMode(mode);
        this.activateCountries(GameModel.getCurrentCountries());
        this.getOutTheMenu();
    },

    colorHintsCountries: function(){
        var x = GameModel.getHintCountries();
        d3.selectAll('path').each(function(d){
            for (var i in x ){
                if (x[i] === d.key) {
                    var self = this;
                    d3.select(this).classed('hint-country',true);
                    setTimeout(function(){
                        d3.select(self).classed('hint-country',false);
                    },600)
                }
            }
        })
    },

    //what the fuck the options parameters?
    onCountryClicked: function(options){
        if(this.canClick){
            this.countryClicked = options.data.key;
            if (!this.isThisTheRightCountry()){
                this.onWrongCountry(options.country);
            } else  {
                this.onGuessedCountry(options.country);
            };

            if (this.isThisTheLastCountry()) {
                this.gameOver();
            };
        }
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
        d3.select(country).classed('ctry-fine', true);
    },

    onWrongCountry: function(country){
        var self = this;
        this.canClick = false;
        d3.select(country).classed('stroke-country',true);
        setTimeout(function(){
            d3.select(country).classed('stroke-country',false);
            if(self.countClicks === GameModel.amountOfTries){
                self.onLoseTurn();
            };
            self.canClick = true;
        }, 400);
        this.countClicks++;
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
                d3.select(this).classed('ctry-wrong',true);
            }
        })
    },

    showNextCountry: function(){
        GameModel.nextCountry()
        this.showCountry()
        this.countClicks = 0;
    },

    showCountry: function(){
        this.UI.countryName.empty();
        this.UI.countryName.append(GameModel.getCurrentCountryName());
    },

    setPoints: function(){
        GameModel.addPoints(1);
        this.UI.points.html(GameModel.points);
    },

    resetColors: function(){
        d3.selectAll('path').classed('ctry-fine ctry-wrong',false);
    },

    resetGame: function(){
        this.getInMenu();
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

    gameModes: function(){
        var self = this;

    },

    getOutTheMenu: function(){
        $("#menu-buttons").fadeOut('slow', function() {
            $('#container-game').css('pointer-events','all');
            $('#h-country').fadeIn("fast", function() {
                $('#container-game').css('fill-opacity','inherit');
                $('#h-country').css('display', 'auto');
            });
        });
    },

    getInMenu: function(){
        $('#container-game').css('fill-opacity','30%');
        $('#h-country').css('display', 'none');
        $("#menu-buttons").fadeIn('slow', function() {
            $('#container-game').css('pointer-events','none');
            $('#h-country').fadeOut("fast");
        });
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
