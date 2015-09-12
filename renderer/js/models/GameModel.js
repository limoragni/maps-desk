//Singleton Pattern
(function(){

    var GameModel = function(){
        this.setProperties();
    }

    GameModel.prototype = {
        setProperties: function(){
            this.points                = 0;
            this.amountOfTries         = 3;
            this.countriesKeys         = Object.keys(WorldMap.names);
            this.randomizedCountries   = this.countriesKeys.slice().mix();
            this.currentCountry        = this.randomizedCountries[0]
            this.modesConfig           = {
                easy: 15,
                medium: 50
            }

            this.hintCountries         = null
            this.hintCountriesNumber   = 4 // Variable que indica cuantos paises constituyen una HINT, así es configurable
            this.setHintCountries() // Praparamos la hint para el primer pais
            this.numberOfCountries     = null
        },

        setMode: function(mode){
            if(mode !== 'hard')
                this.randomizedCountries = this.randomizedCountries.slice(0,this.modesConfig[mode]);
            this.numberOfCountries = this.randomizedCountries.length
            this.setHintCountries()
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
            this.points += points;
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
