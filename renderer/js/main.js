
$(document).ready(function(){
    var map = new Map(WorldMap.shapes, 'body');
    var game = new Game();
    map.on('countryClicked', function(options){
        game.onCountryClicked(options)
    });
    game.start()

});
