// OPTIONS //
// playerName - playerColorFine - playerColorWrong

window.Player = function(options){
    this.setProperties(options);
}

Player.prototype = {
    setProperties: function(options){
        this.points           = 0;
        this.playerName       = options.playerName; // why I can't use the 'name'and 'color' words?
        this.playerColorFine  = options.playerColorFine;
        this.playerColorWrong = options.playerColorWrong;
    },

    addPoints: function(points){
        this.points += points;
    }
}
