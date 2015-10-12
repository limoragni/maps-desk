
$(document).ready(function(){
    var map  = new Map(WorldMap.shapes, '#container-game');
    var game = new Game();
    var menu = new MainMenu();

    // Esto vuela de acá
    // Ahora se va a llamar GameModel.onCountryClicked() desde MAP ver [4]
    // Y desde el GameModel se va chequear si es el país correcto a o no
    // y se va a mandar el correspondiente mensaje
    // por ejemplo GameModel.trigger('country:guessed', country)
    // o GameModel.trigger('country:failed', country)
    // Y estos mensajes deben ser escuchados desde Map, para colorear el país correspondiente.
    // Para enviar el mensaje de que se cliqueó un país.
    map.on('countryClicked', function(options){
        game.onCountryClicked(options)
    });

    game.start()
});
