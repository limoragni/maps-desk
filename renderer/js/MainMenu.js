var MainMenu = function(){
    this.setUI();
    this.setEvents();
}

MainMenu.prototype = {

    setUI : function(){
        this.UI = {
            menuContainer         : $('#menu-container'),
            menuPlay              : $('#menu-single-multi'),
            singleButton          : $('#single-button'),
            multiButton           : $('#multi-button'),
            menuDifficultyModes   : $('#menu-difficulty-modes'),
            // aqui tuve que volver a definir modeButtons, igual que en Game
            difficultyModeButtons : $('.difficulty-mode-buttons'),
            menuContainer         : $('#menu-container'),
            containerGame         : $('#container-game'),
        }
    },

    setEvents : function(){
        this.UI.difficultyModeButtons.click( _.bind( this.setDifficultyMode, this));
        this.UI.menuPlay.click(              _.bind( this.moveDiv, this));
    },

    moveDiv : function(){
        var self = this;
        this.UI.singleButton.css('border-bottom', '2px solid #616E73');
        this.UI.singleButton.animate({bottom:'+=32.5%'},function(){
            self.UI.menuPlay.fadeOut()
        });
        this.UI.multiButton.animate({top:'+=65.5%'});
        this.UI.menuDifficultyModes.fadeIn('slow')
    },

    setDifficultyMode: function(evt){
        var mode = $(evt.target).data('mode');
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
