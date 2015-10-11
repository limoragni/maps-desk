//Singleton Pattern
(function(){

    var GameModel = function(){
        this.setProperties();
    }
//por que usabamos mayusculas en algunas cosas?
    GameModel.prototype = {
        setProperties: function(){
            this.points                 = 0;
            this.amountOfTries          = 3;
            this.countriesKeys          = Object.keys(WorldMap.names);
            this.randomizedCountries    = this.countriesKeys.slice().mix();
            this.currentCountry         = this.randomizedCountries[0]
            this.difficultyModesConfig  = {
                easy: 15,
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

        player: function(userName,userColorFine,userColorWrong){
            this.points         = 0;
            this.amountOfTries  = 3;
            this.userName       = userName; // why I can't use the 'name'and 'color' words?
            this.userColorFine  = userColorFine;
            this.userColorWrong = userColorWrong
        },

        setPlayersMode: function(mode){
            this.players.push(new this.player('player 1','ctry-fine','ctry-wrong'));
            this.currentPlayer = this.players[0]
            if (mode == 'multi') {
                this.players.push(new this.player('player 2','ctry-fine-player2','ctry-wrong-player2'));
                this.vent.trigger('multi:mode')
            }
        },

        changePlayer: function(){
            this.players.reverse()
            this.currentPlayer = this.players[0]
        },
        // setPlayers: function(numberOfPLayers){
        //     if(numberOfPLayers == 1)
        //         this.players.push(new Player())
        //     if(numberOfPLayers == 2)
        //         this.players.push(new Player())
        //         this.players.push(new Player()) //MUY TRUCHO
        //     this.currentPlayer = this.players[0]
        //         // this.players[0] PLAYER UNO
        //         // this.players[1] PLAYER DOS
        //         // this.currentPlayer.getPoints() --> da los puntos
        //         // this.currentPlayer.setPoints() --> setea puntos
        //
        // },
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
            this.currentPlayer.points += points;
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
