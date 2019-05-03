class Graph
{
  constructor(svg, div)
  {
    this.mainSVG = svg;
    this.graphSVG = null;
    this.graphGroup = null;
    this.div = div;

    // To get current dimensions...
    // this.div.clientWidth;
    // this.div.clientHeight;

    this.fatalityDeaths = [];
    this.fatalityYears = [];
    this.margin = {top: 50, right: 0, bottom: 5, left: 40};
    //this.width = 600 - this.margin.left - this.margin.right;
    //this.height = 400 - this.margin.top - this.margin.bottom;
    this.heightScalar = 1;
    this.xAxisHeight = 20;
    this.width = this.div.clientWidth - this.margin.left - this.margin.right;
    this.height = this.div.clientHeight - this.margin.top - this.margin.bottom;
    this.tooltip = d3.select("body")//Mouse over transition
                .append('div')
                .style('position', 'absolute')
                .style('background', '#fff')
                .style('padding', '5px-15px')
                .style('border', '1px-#fff-solid')
                .style('opacity', 0);

    // Initialized in InitializeScales function.
    this.yScale =  d3.scaleLinear();
    this.xScale = d3.scaleBand();
    this.xScale1 = d3.scaleBand();
    this.colors = d3.scaleLinear();
    this.yAxisValue = d3.scaleLinear();
    this.xAxisValue =  d3.scaleTime();
    this.xAxisTicks = d3.axisBottom(this.xAxisValue);
    this.yAxisTicks = d3.axisLeft(this.yAxisValue);
    this.xGuide = null;
    this.yGuide = null;
    this.filteredCounty = "";

    
    //d3.json('../Graph/js/data/forecast.json', function(d){
      
      this.ParseFatalityData();
      this.InitializeScales();
      this.InitializeGraph();
  
  
   // })
    //EventSystem.Instance.AddListener("OnWindowResize", this, this.HandleResize);
    //Calling the listener function from the event system for a particular event
    EventSystem.Instance.AddListener("OnCountyClicked", this, this.CountyClickedCallback);
    EventSystem.Instance.AddListener("OnFatalityDataUpdated", this, this.FatalityDataUpdatedCallback);
    EventSystem.Instance.AddListener("OnWindowResize", this, this.HandleResize);
  }

  CountyClickedCallback(args)
  {
    console.log("Graph saw a selection for county: " + args.County);
    this.filteredCounty = args.County;
    for (let i = 0; i < GeoData.Instance.FatalityData.length; i++)
    {

    }
  }

 

  /*TempParseJSONData(d)
  {
    for (var i = 0; i < d.list.length; i++)
    {
      this.fatalityDeaths.push();
      this.fatalityYears.push( new Date(d.list[i].dt_txt) );
    }
  }*/

  CountyClickedCallback(args)
  {
    console.log("Graph saw a selection for county: " + args.County);
    this.filteredCounty = args.County;
    for (let i = 0; i < GeoData.Instance.FatalityData.length; i++)
    {

    }
  }

  FatalityDataUpdatedCallback()
  {
      
    this.ParseFatalityData();
    this.InitializeScales();
    this.UpdateGuides();
    this.RepaintGraph();

  }


  RepaintGraph()
  {
    
        let sThis = this;
      this.graphSVG
        .selectAll('rect').data(this.fatalityDeaths)
        .attr('fill', this.colors)
        .attr('width', function(d){

          return sThis.xScale.bandwidth();
        })

        .attr('height', function(d) {
          return sThis.yScale(d);
        })

        .attr('x', function(d) {
          return sThis.xScale(d);
        })

        .attr('y', function(d) {
          return sThis.height - sThis.GetXAxisHeight() - sThis.yScale(d);
      

      })

  }


  GetXAxisHeight()
  {
    //console.log(this.xAxisHeight)

    return this.xAxisHeight + this.margin.bottom;
  }

  GetIndexForYear(year)
  {
  	for (let i = 0; i < this.fatalityYears.length; i++)
    {
      if (year == this.fatalityYears[i])
      {
        return i;
      }
    }
    
    return -1;
  }
  
  ParseFatalityData()
  {
  // Year on x-axis, number of fatalities on y axis.
  	this.fatalityYears  = [];
    this.fatalityDeaths = [];
    
  	let fatalityData = FatalityData.Instance.FatalityData;
    for (let i = 0; i < fatalityData.length; i++)
    {
      let accident = fatalityData[i];
      //console.log(accident);
      
      let year = accident.YEAR;
      //console.log(year);
      
      let yearIndex = this.GetIndexForYear(year);
      
      // if yearIndex is >= 0, we have data already.
      // if yearIndex is -1, we don't and we need to add data.
      if (yearIndex >= 0)
      {
      	// We have data already
        this.fatalityDeaths[yearIndex] += accident.FATALS;
        
      }
      else
      {
        // We don't have data.
        yearIndex = this.fatalityYears.length;
        for (let j = 0; j < this.fatalityYears.length; j++)
        {
        	let checkingYear = this.fatalityYears[j];
          if (checkingYear <= year)
          {
          	yearIndex = j;
            break;
          }
        }
        
        // We know what index to place things at.
        this.fatalityYears.splice(yearIndex, 0, year);
        this.fatalityDeaths.splice(yearIndex, 0, accident.FATALS);
      }
    }
    console.log(this.fatalityYears);
    console.log(this.fatalityDeaths);
  }
  
  UpdateGuides()
  {
    this.yGuide 
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')' )
    .call(this.yAxisTicks);

    this.xGuide 
    .attr('transform', 'translate(' + this.margin.left + ',' + (this.height - this.GetXAxisHeight() + this.margin.top)  + ')' )
    .call(this.xAxisTicks);
  }

  HandleResize()
  {
    this.width = this.div.clientWidth - this.margin.left - this.margin.right;
    this.height = this.div.clientHeight - this.margin.top - this.margin.bottom;

    this.graphSVG
      .attr('width', this.width +  this.margin.left + this.margin.right )
      .attr('height', this.height + this.margin.top - this.margin.bottom )

    this.InitializeScales();

    this.UpdateGuides();

    this.RepaintGraph();
  }

  InitializeScales()
  {
    this.yScale
      .domain([0, d3.max(this.fatalityDeaths)])
      .range([0, (this.height * this.heightScalar) - this.GetXAxisHeight()]);

    this.xScale
      .domain(this.fatalityDeaths)
      .paddingInner(.3)
      .paddingOuter(.1)
      .range([0, this.width]);

    this.xScale1  
      .domain(this.fatalityYears)
      .paddingInner(.3)
      .paddingOuter(.1)
      .range([0, this.width]);

    this.colors  
      .domain([0, 65, d3.max(this.fatalityDeaths)])
      .range(['#FFFFFF', 
              '#2D8BCF', 
              '#DA3637']);

    this.yAxisValue  
      .domain([0, d3.max(this.fatalityDeaths)])
      .range([(this.height * this.heightScalar) - this.GetXAxisHeight(), 0]);
      
    this.xAxisValue 
      .domain([this.fatalityYears[0], this.fatalityYears[(this.fatalityYears.length-1)]])
      .range([0,this.width]);

    // Might not need to re-call this.
    this.xAxisTicks  
      .scale(this.xScale1);

    this.yAxisTicks 
      .ticks(10)
  }

  InitializeGraph(d)
  { 

    let sThis = this;
    //d3.select('#viz').append('svg')
    this.graphSVG = this.mainSVG.append('svg');
    console.log("4");
    this.ParseFatalityData();
    //this.GetXAxisHeight();
    this.graphSVG
      .attr('width', this.width +  this.margin.left + this.margin.right )
      .attr('height', this.height + this.margin.top - this.margin.bottom )

      .append('g')
      .attr('transform', 
            'translate('+ this.margin.left +',' + this.margin.top +')')
  
      .selectAll('rect').data(this.fatalityDeaths)
        .enter().append('rect')
        .attr('fill', this.colors)
        .attr('width', function(d){

          return sThis.xScale.bandwidth();
        })

        .attr('height', function(d) {
          return sThis.yScale(d);
        })

        .attr('x', function(d) {
          return sThis.xScale(d);
        })

        .attr('y', function(d) {
          return sThis.height - sThis.GetXAxisHeight() - sThis.yScale(d);
      

      }).on('mouseover', function(d){ //Mouseover transition

          sThis.tooltip.transition().duration(200)
          .style('opacity', 1);
          sThis.tooltip.html(d)
          .style('left', (d3.event.pageX)+"px")
          .style('top', (d3.event.pageY)+"px");

          d3.select(this).style('opacity', 0.5);

      }).on('mouseout', function(d){
          sThis.tooltip.transition().style('opacity', 0);
          sThis.tooltip.html(d)
          .style('left', (d3.event.pageX)+"px")
          .style('top', (d3.event.pageY)+"px");
          d3.select(this).style('opacity', 1);
      });
 
      // this.graphSVG.append("rect")
      //   .attr('width', this.width +  this.margin.left + this.margin.right )
      //   .attr('height', this.height + this.margin.top - this.margin.bottom )
      //   .attr("fill", "red");
      this.yGuide = this.graphSVG
              .append('g')
              .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')' )
              .call(this.yAxisTicks);

      this.xGuide =this.graphSVG
              .append('g')
              .attr('transform', 'translate(' + this.margin.left + ',' + (this.height - this.GetXAxisHeight() + this.margin.top)  + ')' )
              .call(this.xAxisTicks);

                
  }//json import
    
  
}

/*
[
  {
    properties: {
      STATE: "TX",
      COUNTY: "Denton"
    },
    geometry: {
      ...
    },
    fatalityData: {
      ...      
    }
  },
  {
    properties: {
      STATE: "TX",
      COUNTY: "Tarrant"
    },
    geometry: {
      ...
    },
    fatalityData:{ 

    }
  }
]
*/
