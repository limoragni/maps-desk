//Singleton Pattern
(function(){

    var GameModel = function(){
        this.setProperties();
    }

    GameModel.prototype = {
        setProperties: function(){
            this.points              = 0;
            this.amountOfTries       = 3;
            this.countriesKeys       = Object.keys(WorldMap.names);
            this.randomizedCountries = this.countriesKeys.slice().mix();
            this.currentCountry      = this.randomizedCountries[0]
        },

        getSubSetOfCountries: function(number){
            return this.randomizedCountries.mix().splice(0,number);
        },

        addPoints: function(points){
            this.points += points;
        },

        getNumberOfCountries: function(){
            return this.countriesKeys.length;
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
