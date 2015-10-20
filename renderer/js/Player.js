// OPTIONS //
// playerName - playerColorFine - playerColorWrong

window.Player = function(options){
    this.setProperties(options);
}

Player.prototype = {
    setProperties: function(options){
        this.points              = 0;
        this.countriesGuessed    = 0;
        this.countriesMissed     = 0;
        this.countClicks         = 0;
        this.playerName          = options.playerName; // why I can't use the 'name'and 'color' words?
        this.playerColor         = options.playerColor;
        this.playerPanelPoints   = options.playerPanelPoints
        this.playerPanelGuessed  = options.playerPanelGuessed
        this.playerPanelMissed   = options.playerPanelMissed
        this.playerTurnIndicator = options.playerTurnIndicator
    },

    addPoints: function(points){
        this.points += points;
    },

}
