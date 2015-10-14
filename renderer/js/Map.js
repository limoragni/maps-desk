var Map = function(shapes, selector){
    this.messages   = {};
    this.shapes     = shapes;
    this.container  = {}
    this.zoom       = {}
    this.mouseMoved = false
    this.listenZoom();
    this.setContainer(selector)
    this.drawMap();
    this.setEvents()
}

Map.prototype = {
    setEvents: function(){           // this.drawHint(countriesHint) esto nunca, por que la funcion se pasa para que se ejecute y no ya ejecutada. el parametro que manda trigger se recibe internamente   
        GameModel.vent.on('show:hint', this.drawHint, this)
        GameModel.vent.on('stroke:wrong:country', this.strokeWrongCountry, this)
        GameModel.vent.on('next:turn', this.colorCountry, this)
        // Acá escuchamos el mensaje del HINT
        // GameModel.vent.on('show:hint', this.drawHint, this)
        // Acá también vamos a escuchar los mensajes del GameModel que dirán si
        // se adivinó o se erró un país, para colorearlo como corresponda
        // GameModel.vent.on('country:guessed', this.colorCountry, this)
    },

    listenZoom: function(){
        this.zoom = d3.behavior.zoom()
           .scaleExtent([1, 10])
           .on("zoom", _.bind(this.zoomed, this));
    },

    // Borrar métodos on y trigger, se va a usar GameModel.vent para remplazar esta funcionalidad
    // on: function(message, fn){
    //     if(!this.messages[message]){
    //         this.messages[message] = [];
    //     }
    //     this.messages[message].push(fn);
    // },

    // trigger: function(message, parameter){
    //     for(var index in this.messages[message]){
    //         this.messages[message][index](parameter)
    //     }
    // },

    setContainer: function(selector){
        this.container = d3.select(selector)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .call(this.zoom)
            .append('g')
    },

    drawMap: function(){
        var self = this;
        this.countries = this.container.selectAll('path');
        // Acá vamos a guardar en una propiedad la selección de todos los paises
        // this.countries = this.container.selectAll('path')
        // entonces abajo en vez de usar this.container.selectAll('path') ya lo podemos reemplazar por
        // this.countries
        //     .data(d3.entries(this.shapes)), etc...
        this.countries
            .data(d3.entries(this.shapes)) // Set data to be used by D3
            .enter() //Start looping trhough the data creating an element for each item
            .append('path')
            .attr('d', function(data){return data.value}) // Draw the path using the data binded to this item
            .classed('country', true)
            .on('mouseover', function(){
                d3.select(this).classed('on-mouse-over-the-country',true);
            })
            .on('mouseout', function(d){
                d3.select(this).classed('on-mouse-over-the-country',false);
            })
            .on('mousedown', function(){
                self.mouseMoved = false;
            })
            .on('mousemove', function(){
                self.mouseMoved = true;
            })
            .on('mouseup', function(elementData){
                // [4] Ya no se va a usar el trigger de map que va a volar.
                // se va a llamar a GameModel.onCountryClicked({data: elementData, country: this})
                // donde se van a hacer los chequeos de si es el país correcto o no
                // y se van a mandar los mensajes que corresponde para cada caso
                if (!self.mouseMoved) {
                    // self.trigger('countryClicked', {data: elementData, country: this});
                    GameModel.onCountryClicked({data: elementData, country:this})
                    console.log(elementData.key)
                }
            })
    },

     zoomed: function(a){
        this.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    },
    // Este método se va a llamar cuando se dispare el mensaje show:hint ver Arriba
    // [2] drawHints: function() ...
    // this.countries.each(function(d){blah})

    drawHint: function(countriesHint){
        // no me estaria funcionando el this.countries
        d3.selectAll('path').each(function(d){
            for (var i in countriesHint ){
                if (countriesHint[i] === d.key) {
                    var self = this;
                    d3.select(this).classed('hint-country',true);
                }
            }
        })
    },

    strokeWrongCountry: function(country){
        d3.select(country).classed('stroke-country',true);
        setTimeout(function(){
        d3.select(country).classed('stroke-country',false);
        }, 400);
    },

    colorCountry:function(options){
        if (!options.guessed) {
            var self = this; // buscar alguna mejor forma de colorear
            d3.selectAll('path').each(function(d){
                if (GameModel.currentCountry === d.key) {
                    d3.select(this).classed('ctry-wrong',true);
                }
            })
        } else {
            d3.select(options.country).classed(GameModel.currentPlayer.playerColor, true);
        }
    }
}
