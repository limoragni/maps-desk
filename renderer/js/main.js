
$(document).ready(function(){
    var map  = new Map(WorldMap.shapes, '#container-game');
    var game = new Game();
    var menu = new MainMenu();
    map.on('countryClicked', function(options){
        game.onCountryClicked(options)
    });

    game.start()
});
