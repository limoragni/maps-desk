var Map = function(shapes, selector){
    this.messages   = {};
    this.shapes     = shapes;
    this.container  = {}
    this.zoom       = {}
    this.mouseMoved = false
    this.listenZoom();
    this.setContainer(selector)
    this.drawMap();
}

Map.prototype = {
    listenZoom: function(){
        this.zoom = d3.behavior.zoom()
           .scaleExtent([1, 10])
           .on("zoom", _.bind(this.zoomed, this));
    },

    on: function(message, fn){
        if(!this.messages[message]){
            this.messages[message] = [];
        }
        this.messages[message].push(fn);
    },

    trigger: function(message, parameter){
        for(var index in this.messages[message]){
            this.messages[message][index](parameter)
        }
    },

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
        this.container.selectAll('path')
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
                if (!self.mouseMoved) {
                    self.trigger('countryClicked', {data: elementData, country: this});
                }
            })
            // .on('click', function(elementData){ // Parameter passed by D3 with the data binded to the clicked element
            //     self.trigger('countryClicked', {data: elementData, country: this});
            // });
    },

    zoomed: function(a){
        this.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
}
