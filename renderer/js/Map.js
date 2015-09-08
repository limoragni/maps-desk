var Map = function(shapes, selector){
    this.messages = {};
    this.shapes = shapes;
    this.container = this.setContainer(selector);
    this.drawMap();
}

Map.prototype = {
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
        return d3.select(selector)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
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
    }
}
