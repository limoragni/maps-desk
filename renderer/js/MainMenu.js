var MainMenu = function(){
    this.setUI();
    this.setEvents();
}

MainMenu.prototype = {

    setUI : function(){
        this.UI = {
            menuContainer : $('#menu-container'),
            menuPlay      : $('#menu-single-multi'),
            singleButton  : $('#single-button'),
            multiButton   : $('#multi-button'),
            menuModes     : $('#menu-modes'),
            easyButton    : $('#easy-mode-button'),
            mediumButton  : $('#medium-mode-button'),
            hardButton    : $('#hard-mode-button'),
            // aqui tuve que volver a definir modeButtons, igual que en Game
            modeButtons   : $('.mode-buttons'),

            menuContainer : $('#menu-container'),
            containerGame : $('#container-game'),
        }
    },

    setEvents : function(){
        this.UI.modeButtons.click( _.bind( this.getOutModeMenuFrontBackground, this));
        this.UI.menuPlay.click(    _.bind( this.moveDiv                      , this));
    },

    moveDiv : function(){
        var self = this;
        this.UI.singleButton.css('border-bottom', '2px solid #616E73');
        this.UI.singleButton.animate({bottom:'+=138px'},function(){
            self.UI.menuPlay.fadeOut()
        });
        this.UI.multiButton.animate({top:'+=158px'});
        this.UI.menuModes.fadeIn()
    },

    getOutModeMenuFrontBackground : function(){
        this.UI.menuContainer.fadeOut();
        this.UI.containerGame.css('-webkit-filter','none');
        this.UI.containerGame.css('pointer-events','all');
        this.UI.containerGame.css('fill-opacity','inherit');             
    },
}

