var bardata = [20, 30, 45, 15, 35, 50, 50, 25, 20, 30, 45, 15, 35, 50, 50, 25];
var height = 700,
    width = 700, 
    //barWidth = 50,
    barOffset = 5;


    var svg = d3.select('body')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background", "white");
    var tooltip = d3.select("body")//Mouse over transition
                .append('div')
                .style('position', 'absolute')
                .style('background', '#fff')
                .style('padding', '5px-15px')
                .style('border', '1px-#fff-solid')
                .style('opacity', 0);

                svg.selectAll()
                .data(bardata)
                .enter()
                .append("rect")
                .attr("height", function(d, i){
                    return d * 100;

                })
                .attr("width", "20px")
                .style("fill", "#B22222")
                .attr('y', function(d, i){
                    return height - (d) * 10;
                })
                .attr('x', function(d, i){
                    return i*40
                }).on('mouseover', function(d){ //Mouseover transition

                    tooltip.transition().style('opacity', 1);
                    tooltip.html(d)
                    .style('left', (d3.event.pageX)+"px")
                    .style('top', (d3.event.pageY)+"px");

                    d3.select(this).style('opacity', 0.5);

                }).on('mouseout', function(d){
                    tooltip.transition().style('opacity', 0);
                    tooltip.html(d)
                    .style('left', (d3.event.pageX)+"px")
                    .style('top', (d3.event.pageY)+"px");
                    d3.select(this).style('opacity', 1);
                });

                


//Setting the bar height according to the data    
/*var yScale = d3.scaleLinear()
    .domain([0, d3.max(bardata)])
    .range([0, height])

d3.select('#viz').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#C9D7D6')
.selectAll('rect').data(bardata)
    .enter().append('rect')
        .style('fill', '#C61C6F')
        .attr('width', barWidth)
        .attr('height', function(d){
            return yScale(d);
        })
        .attr('x', function(d, i){
            return i*(barWidth + barOffset)
        })
        .attr('y', function(d){
            return height - yScale(d);
        });*/