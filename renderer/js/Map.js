var Map = function(shapes, selector){
    this.messages  = {};
    this.shapes    = shapes;
    this.container = {}
    this.zoom      = {}
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
            .data(d3.entries(this.shapes))
            .enter()
            .append('path')
            .attr('d', function(data){return data.value})
            .classed('country', true)
            .on('mouseover', function(){
                $(this).attr('fill', '#987D7D')
            })
            .on('mouseout', function(){
                $(this).attr('fill', '#000000')
            })
            .on('click', function(d){
                self.trigger('countryClicked', {data: d, country: this});
            });
    },

    zoomed: function(a){
        console.log(this.container);
        this.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
}
