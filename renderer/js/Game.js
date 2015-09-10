var Game = function(){
    this.setProperties()
}

Game.prototype = {
    setProperties: function(){
        this.countClicks     = 0;
        this.wrongPoints     = 0;
        this.canClick        = true;
        this.countryClicked  = null
    },

    start: function(){
        this.gameModes();
        var self = this;
        $('#pointero').empty();
        $("#h-country").empty();
        $('#h-country').append(GameModel.getCurrentCountryName());
        $('#reset-button').click(_.bind(this.resetGame, this));

        $('#hint-button').click(function() {
            self.colorHintsCountries();
        });
    },

    colorHintsCountries: function(){
        var x = GameModel.getHintCountries(); // ESTA NUEVA FUCION LA PODES LLAMAR CUANTAS VECES QUIERAS, PORQUE NO GENERA NADA NUEVO
        //SIMPEMENTE TE DA LOS PAISES DE HINT
        d3.selectAll('path').each(function(d){
            //var x = GameModel.getSubSetOfCountries(4); ESTO SE ETABA LLAMANDO 168 VECES
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
        var self = this;
        this.setPoints();
        this.canClick = false;
        $('#h-country').addClass('fine-indicator');
        setTimeout(function(){
            $('#h-country').toggleClass('fine-indicator');
            self.showNextCountry();
            self.canClick = true;
        },700);
        d3.select(country).classed('ctry-fine',true);
    },

    onWrongCountry: function(country){
        var self = this;
        this.canClick = false;
        $('#h-country').addClass('wrong-indicator');
        d3.select(country).classed('stroke-country',true);
        setTimeout(function(){
            $('#h-country').toggleClass('wrong-indicator');
            d3.select(country).classed('stroke-country',false);
            if(self.countClicks === GameModel.amountOfTries){
                self.colorWrongCountry();
                self.showNextCountry();
                self.wrongPoints++
            };
            self.canClick = true;
        },400);
        this.countClicks++;
    },

    isThisTheLastCountry: function(){
        if ((GameModel.getNumberOfCountriesLeft() === 1 && this.countClicks === GameModel.amountOfTries)||(GameModel.getNumberOfCountriesLeft() === 1 && this.countryClicked === GameModel.currentCountry)) {
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
        $("#h-country").empty();
        $('#h-country').append(GameModel.getCurrentCountryName());
        this.countClicks = 0;
    },

    setPoints: function(){
        $('#pointero').empty();
        GameModel.addPoints(1);
        $('#pointero').append("<span class='badge'>" + GameModel.points + "</span>");
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
        $('#final-indicator').animate({left:'-340px'}, 1000);
        $('#final-indicator').empty();
        $('#final-indicator').append('<span id="reset-button" class="label label-default">Reset</span>');
    },

    gameOver: function(){
        var self = this;
        var percent = Math.floor(GameModel.points * 100 / GameModel.getNumberOfCountries()) + '%';
        $('#final-indicator').append('<strong>Acertaste el ' +percent+ ' de los paises</strong>');
        $('#final-indicator').animate({left:'0px'}, 1000);
    },

    gameModes: function(){
        var self = this;
        $('#btn1').click(function(event) {
            GameModel.setEasyMode();
            self.activeCountries(GameModel.getEasyModeCountries());
            self.getOutTheMenu();
        });
        $('#btn2').click(function(event) {
            GameModel.setMediumMode();
            self.activeCountries(GameModel.getMediumModeCountries());
            self.getOutTheMenu();
        });
        $('#btn3').click(function(event) {
            GameModel.setHardMode();
            self.getOutTheMenu();
            d3.selectAll('path').each(function(d){
                d3.select(this).classed('disable-country',false);
            })
        });
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

    activeCountries: function(fn){
        var x = fn;
            d3.selectAll('path').each(function(d){
                d3.select(this).classed('disable-country',true);
                for (var i in x ){
                    if (x[i] === d.key) {
                        d3.select(this).classed('disable-country',false);
                    }
                }
            })
    }
}
