window.MainMenu = function(){
    this.setUI();
    this.setEvents();
}

MainMenu.prototype = {
    setUI : function(){
        this.UI = {
            menuContainer         : $('#menu-container'),
            menuPlay              : $('#menu-single-multi'),
            menuPlayers           : $('.menu-buttons'),
            singleButton          : $('#single-button'),
            multiButton           : $('#multi-button'),
            menuDifficultyModes   : $('#menu-difficulty-modes'),
            difficultyModeButtons : $('.difficulty-mode-buttons'),
            menuContainer         : $('#menu-container'),
            containerGame         : $('#container-game'),
            finalPanel            : $('#final-panel'),
            panelWinners          : $('#multi-panel-winner'),
            panelTie              : $('#multi-panel-tie'),
            panelSingle           : $('#single-panel'),
            winnerMessage         : $('#winner-h1'),
            winnerPercent         : $('#winner-percent'),
            loserMessage          : $('#loser-h1'),
            loserPercent          : $('#loser-percent'),
            tiePercent            : $('#tie-percent'),
            singlePercent         : $('#single-percent')
        }
    },

    setEvents : function(){
        this.UI.difficultyModeButtons.click( _.bind( this.setDifficultyMode, this)); //what the deal with bind?
        this.UI.menuPlayers.click(           _.bind( this.moveDiv,           this));
        this.UI.menuPlayers.click(           _.bind( this.setPlayersMode,    this));

        GameModel.vent.on('finish-game', this.showFinalPanel, this);
        GameModel.vent.on('winner:message', this.putNamesPodium, this);
    },

    moveDiv : function(){
        var self = this;
        this.UI.singleButton.css('border-bottom', '2px solid #616E73');
        this.UI.singleButton.animate({bottom:'+=6.8em'},function(){
            self.UI.menuPlayers.fadeOut()
        });
        this.UI.multiButton.animate({top:'+=12.7em'});
        this.UI.menuDifficultyModes.fadeIn('slow')
    },

    setPlayersMode: function(evt){ // que hace el evt?
        var mode = $(evt.currentTarget).data('mode');
        GameModel.setPlayersMode(mode);
    },

    setDifficultyMode: function(evt){
        var mode = $(evt.currentTarget).data('mode');
        GameModel.setDifficultyMode(mode);
        this.getOutModeMenuFrontBackground();
    },

    getOutModeMenuFrontBackground : function(){
        this.UI.menuContainer.fadeOut();
        this.UI.containerGame.css('-webkit-filter','none');
        this.UI.containerGame.css('pointer-events','all');
        this.UI.containerGame.css('fill-opacity','inherit');
    },

    showFinalPanel: function(options){
        this.UI.finalPanel.css({'height':'70%','width':'33.3%'});
        if (GameModel.playersMode === 'multi') {
            if (options.winner) {
                this.UI.panelWinners.show()
            } else {
                this.UI.tiePercent.html(options.points + ' of points')
                this.UI.panelTie.show()
            }
        } else {
            this.UI.singlePercent.html(options.points + ' of points')
            this.UI.panelSingle.show()
        }
    },

    putNamesPodium: function(position){
        this.UI.winnerMessage.html(position.winner + ' winner!');
        this.UI.winnerPercent.html(position.winnerPercent + ' of points');
        this.UI.loserMessage.html(position.loser + ' Loser');
        this.UI.loserPercent.html(position.loserPercent + ' of points');
    },

}
