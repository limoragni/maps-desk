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
            this.easyCountries         = null
            this.easyCountriesNumber   = 15
            this.mediumCountries       = null
            this.mediumCountriesNumber = 50
            this.hintCountries         = null
            this.hintCountriesNumber   = 4 // Variable que indica cuantos paises constituyen una HINT, así es configurable
            this.setHintCountries() // Praparamos la hint para el primer pais
            this.numberOfCountries     = null
        },

        setEasyMode: function(){
            this.randomizedCountries = this.randomizedCountries.slice(0,this.easyCountriesNumber);
            this.easyCountries = this.randomizedCountries.slice();
            this.numberOfCountries = this.easyCountries.length;
            this.setHintCountries() // Praparamos la hint para el primer pais
        },

        getEasyModeCountries: function(){
            return this.easyCountries
        },

        setMediumMode: function(){
            this.randomizedCountries = this.randomizedCountries.slice(0,this.mediumCountriesNumber);
            this.mediumCountries = this.randomizedCountries.slice();
            this.numberOfCountries = this.mediumCountries.length;
            this.setHintCountries() // Praparamos la hint para el primer pais
        },

        getMediumModeCountries: function(){
            return this.mediumCountries
        },

        setHardMode: function(){
            this.randomizedCountries = this.countriesKeys.slice().mix();
            this.numberOfCountries = this.randomizedCountries.length;
            this.setHintCountries();
        },

        //Esto setea la hint
        setHintCountries: function(){
            var copy = this.randomizedCountries.slice(0,this.randomizedCountries.length);
            this.hintCountries = copy.mix().slice(0, this.hintCountriesNumber); // Usa la variable con la cantidad de paises de hint
            this.hintCountries.push(this.currentCountry);
        },

        //Con esto agarras la hint para el pais actual
        getHintCountries: function(){
            if (this.randomizedCountries.length > this.hintCountriesNumber + 1){
                return this.hintCountries;
            }else {
                return [];
            }
        },
        // getSubSetOfCountries: function(number){
        //     var copy = this.randomizedCountries.slice(0,this.randomizedCountries.length);
        //     return copy.mix().slice(0, number)
        //     // return this.randomizedCountries.mix().splice(0,number);
        //     //ESTO TIENE DOS PROBLEMAS, UNO ES QUE this.randomizedCountries.mix() TE VUELVE A DESORDENAR EL ARRAY ORIGINAL
        //     // Y OTRO QUE .splice(0,number) TE BORRA LOS PAISES DEL ARRAY
        //     // VOS A ESTE ARRAY NO LO QUERES MODIFICAR PORQUE ES EL ARRAY QUE DETERMINA QUE VA A SER PREGUNTADO
        //     // Y LOS PAISES QUE USAS PARA DAR UNA PISTA VAN A SER USADOS COMO PREGUNTA MAS ADELANTE
        //     //POR ESO TE LO CAMBIE
        //     // LO QUE HACE AHORA ES, PRIMERO HACER UNA COPIA DEL ARRAY RANDOMIZADO PARA NO CAGARLA
        //     // DESPUES USA EL MIX SOBRE LA COPIA, PORQUE SINO VA A USAR COMO PISTA SIEMPRE LOS PRIMEROS 4 DEL ARRAY
        //     // HACIENDO UN NUEVO MIX NOS ASEGURAMOS QUE SEA RANDOM
        //     // Y DESPUES CORTA EL ARRAY Y DEVUELVE SOLO LOS PAISES NECESRIOS
        // },

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
