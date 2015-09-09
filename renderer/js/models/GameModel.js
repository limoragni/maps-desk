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
            var copy = this.randomizedCountries.slice(0,this.randomizedCountries.length);
            return copy.mix().slice(0, number)
            // return this.randomizedCountries.mix().splice(0,number);
            //ESTO TIENE DOS PROBLEMAS, UNO ES QUE this.randomizedCountries.mix() TE VUELVE A DESORDENAR EL ARRAY ORIGINAL
            // Y OTRO QUE .splice(0,number) TE BORRA LOS PAISES DEL ARRAY
            // VOS A ESTE ARRAY NO LO QUERES MODIFICAR PORQUE ES EL ARRAY QUE DETERMINA QUE VA A SER PREGUNTADO
            // Y LOS PAISES QUE USAS PARA DAR UNA PISTA VAN A SER USADOS COMO PREGUNTA MAS ADELANTE
            //POR ESO TE LO CAMBIE
            // LO QUE HACE AHORA ES, PRIMERO HACER UNA COPIA DEL ARRAY RANDOMIZADO PARA NO CAGARLA
            // DESPUES USA EL MIX SOBRE LA COPIA, PORQUE SINO VA A USAR COMO PISTA SIEMPRE LOS PRIMEROS 4 DEL ARRAY
            // HACIENDO UN NUEVO MIX NOS ASEGURAMOS QUE SEA RANDOM
            // Y DESPUES CORTA EL ARRAY Y DEVUELVE SOLO LOS PAISES NECESRIOS
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
