//Singleton Pattern
(function(){

    var GameModel = function(){
        this.setProperties();
    }
//por que usabamos mayusculas en algunas cosas? porque son objetos globales entonces no hay que confundirlos
// para no pisarlos en cualquier parte de la plicación.
    GameModel.prototype = {
        setProperties: function(){
            this.amountOfTries          = 3;
            this.relativePoints         = 10;
            this.countriesKeys          = Object.keys(WorldMap.names);
            this.randomizedCountries    = this.countriesKeys.slice().mix();
            this.currentCountry         = this.randomizedCountries[0]
            this.difficultyModesConfig  = {
                easy: 16,
                medium: 50
            }

            this.hintCountries          = null
            this.hintCountriesNumber    = 4 // Variable que indica cuantos paises constituyen una HINT, así es configurable
            this.setHintCountries() // Praparamos la hint para el primer pais
            this.numberOfCountries      = null

            this.playersModeConfig      = {
                single: 1,
                multi : 2
            }
            this.numberOfPLayers        = null
            this.players                = []
            this.currentPlayer          = null
            this.vent                   = _.extend({}, Backbone.Events);
        },

        setPlayersMode: function(mode){
            var playerOne = {
                playerName         : 'player 1',
                playerColor        : 'player1-color',
                playerPanelPoints  : $('#player-points'),
                playerPanelGuessed : $('#player-countries-guessed'),
                playerPanelMissed  : $('#player-countries-missed')
            }
            this.players.push(new Player(playerOne));
            this.currentPlayer = this.players[0]
            if (mode == 'multi') {
                this.vent.trigger('multi:mode');
                var playerTwo = {
                    playerName         : 'player 2',
                    playerColor        : 'player2-color',
                    playerPanelPoints  : $('#player2-points'),
                    playerPanelGuessed : $('#player2-countries-guessed'),
                    playerPanelMissed  : $('#player2-countries-missed')
                }
                this.players.push(new Player(playerTwo));
            }
        },

        changePlayer: function(){
            this.players.reverse()
            this.currentPlayer = this.players[0]
        },

        setDifficultyMode: function(mode){
            if(mode !== 'hard')
                this.randomizedCountries = this.randomizedCountries.slice(0,this.difficultyModesConfig[mode]);
                this.numberOfCountries   = this.randomizedCountries.length
                this.setHintCountries()
            this.vent.trigger('game:mode:set', mode);
        },

        getCurrentCountries: function(){
            return this.randomizedCountries
        },

        showHint: function(){
            var countriesHint = this.getHintCountries();
            this.vent.trigger('show:hint', countriesHint)
            this.relativePoints -= 3;
        },

        onCountryClicked: function(options){
            this.currentPlayer.countClicks++ 
            this.countryClicked = options.data.key;
            this.checkElection(options);
        },

        checkElection: function(options){
            if (!this.isThisCountryCorrect(this.countryClicked)){
                this.relativePoints -= 2;
                this.vent.trigger('stroke:wrong:country', options.country)
                if (this.currentPlayer.countClicks === this.amountOfTries) {
                    this.missedCountry(options)
                };
            } else  {
                this.guessedCountry(options);
            };
        },

        missedCountry: function(options){
            this.relativePoints = 10;
            this.currentPlayer.countriesMissed += 1;
            this.addPoints(0);
            this.vent.trigger('next:turn',{country: options.country, guessed:false})
        },

        guessedCountry: function(options){
            this.currentPlayer.countriesGuessed += 1;
            this.addPoints(this.relativePoints)
            this.relativePoints = 10;
            this.vent.trigger('next:turn',{country: options.country, guessed:true})
        },

        setHintCountries: function(){
            var copy = this.randomizedCountries.slice(0,this.randomizedCountries.length);
            this.hintCountries = copy.mix().slice(0, this.hintCountriesNumber); // Usa la variable con la cantidad de paises de hint
            this.hintCountries.push(this.currentCountry);
        },

        getHintCountries: function(){
            if (this.randomizedCountries.length > this.hintCountriesNumber + 1){
                return this.hintCountries;
            }else {
                return [];
            }
        },
        
        addPoints: function(points){
            this.currentPlayer.addPoints(points);
            this.vent.trigger('points:added')
        },

        getNumberOfCountries: function(){
            return this.numberOfCountries
        },

        getNumberOfCountriesLeft: function(){
            return this.randomizedCountries.length;
        },

        getCurrentCountryName: function(){
            return WorldMap.names[this.currentCountry];
        },

        nextCountry: function(){
            this.randomizedCountries = this.randomizedCountries.splice(1,this.randomizedCountries.length);
            this.currentCountry = this.randomizedCountries[0];
            this.setHintCountries() //Siempre que se muestra un nuevo pais preparamos la hint que corresponde
        },

        isThisCountryCorrect: function(country){
            return this.currentCountry === country;
        },

        reset: function(){
            this.setProperties();
        }
    }

    window.GameModel = new GameModel();
})()