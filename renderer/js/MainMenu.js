window.MainMenu = function(){
    this.setUI();
    this.setEvents();
}

MainMenu.prototype = {
    setUI : function(){
        this.UI = {
            menuContainer         : $('#menu-container'),
            menuPlay              : $('#menu-single-multi'),
            menuPlayers           : $('.players-menu-buttons'),
            singleButton          : $('#single-button'),
            multiButton           : $('#multi-button'),
            menuDifficultyModes   : $('#menu-difficulty-modes'),
            difficultyModeButtons : $('.difficulty-mode-buttons'),
            menuContainer         : $('#menu-container'),
            containerGame         : $('#container-game'),
        }
    },

    setEvents : function(){
        this.UI.difficultyModeButtons.click( _.bind( this.setDifficultyMode, this));
        this.UI.menuPlayers.click(           _.bind( this.moveDiv,           this));
        this.UI.menuPlayers.click(           _.bind( this.setPlayersMode,    this));
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
}
