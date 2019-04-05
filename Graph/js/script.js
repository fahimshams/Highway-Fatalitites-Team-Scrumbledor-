d3.json('js/data/forecast.json', function(d){
        //return d.Letter;
    
        var temperatures = [];
        var dates = [];

    for (var i = 0; i < d.list.length; i++)
    {
      temperatures.push(d.list[i].main.temp);
      dates.push( new Date(d.list[i].dt_txt) );
    }


var margin = {top: 0, right: 0, bottom: -20, left: 20},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



/*for(var i = 0; i < 50; i++)
{

    temperatures.push(Math.random() * 30);
}*/
    //height = 400,
    //width = 600, 
    //barWidth = 50,
    //barOffset = 5;
    
var tempColor,
    yScale,
    xScale,
    colors,
    tooltip,
    myChart,
    yAxisValue,
    yAxisTicks,
    yGuide;




    // Rearranging values to fit the page
     yScale = d3.scaleLinear()
                .domain([0, d3.max(temperatures)])
                .range([0, height])

     xScale = d3.scaleBand()
                .domain(temperatures)
                .paddingInner(.3)
                .paddingOuter(.1)
                .range([0, width])


     colors = d3.scaleLinear()
                .domain([0, 65, d3.max(temperatures)])
                .range(['#FFFFFF', 
                        '#2D8BCF', 
                        '#DA3637'])

    yAxisValue = d3.scaleLinear()
                .domain([0, d3.max(temperatures)])
                .range([height, 0])

    xAxisValue = d3.scaleTime()
                .domain([dates[0], dates[(dates.length-1)]])
                .range([0,width])

    xAxisTicks = d3.axisBottom(xAxisValue)
                .ticks(d3.timeDay.every(1))

    yAxisTicks = d3.axisLeft(yAxisValue)
                .ticks(10)
    /*d3.json('js/data/data.json', function(error, data){

            xScale.domain(data.map(function(d){

                return d.year;


            }));

            yScale.domain([0, d3.max(data, function(d){
                return d.State;

            })]);
    });*/

    
                
    tooltip = d3.select("body")//Mouse over transition
                .append('div')
                .style('position', 'absolute')
                .style('background', '#fff')
                .style('padding', '5px-15px')
                .style('border', '1px-#fff-solid')
                .style('opacity', 0);

                d3.select('#viz').append('svg')
                .attr('width', width +  margin.left + margin.right )
                .attr('height', height + margin.top - margin.bottom )

                .append('g')
                .attr('transform', 
                      'translate('+ margin.left +',' + margin.right +')')
            
                .selectAll('rect').data(temperatures)
                    .enter().append('rect')
                    .attr('fill', colors)
                  .attr('width', function(d){

                    return xScale.bandwidth();
                  })

                  .attr('height', function(d) {
                    return yScale(d);
                  })

                  .attr('x', function(d) {
                    return xScale(d);
                  })

                  .attr('y', function(d) {
                    return height - yScale(d);
                

                }).on('mouseover', function(d){ //Mouseover transition

                    tooltip.transition().duration(200)
                    .style('opacity', 1);
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

                yGuide = d3.select('#viz svg')
                        .append('g')
                        .attr('transform', 'translate(20,0)' )
                        .call(yAxisTicks)

                xGuide =d3.select('#viz svg')
                        .append('g')
                        .attr('transform', 'translate(20, '+ height + ')' )
                        .call(xAxisTicks)

                
           });//json import

        // set the dimensions of the canvas
