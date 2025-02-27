class Graph
{
  constructor(svg, div)
  {
    this.mainSVG = svg;
    this.graphSVG = null;
    this.div = div;

    // To get current dimensions...
    // this.div.clientWidth;
    // this.div.clientHeight;

    this.temperatures = [];
    this.dates = [];
    this.margin = {top: 0, right: 0, bottom: -20, left: 20};
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.tooltip = d3.select("body")//Mouse over transition
                .append('div')
                .style('position', 'absolute')
                .style('background', '#fff')
                .style('padding', '5px-15px')
                .style('border', '1px-#fff-solid')
                .style('opacity', 0);

    // Initialized in InitializeScales function.
    this.yScale =  d3.scaleLinear();
    this.xScale = null;
    this.colors = null;
    this.yAxisValue = null;
    this.xAxisValue = null;
    this.xAxisTicks = null;
    this.yAxisTicks = null;

    let d = this.GetTempForecastData();
    //d3.json('../Graph/js/data/forecast.json', function(d){
      
      this.TempParseJSONData(d);
      this.InitializeScales();
      this.InitializeGraph();
   // })
    EventSystem.Instance.AddListener("OnWindowResize", this, this.HandleResize);
  }

  TempParseJSONData(d)
  {
    for (var i = 0; i < d.list.length; i++)
    {
      this.temperatures.push(d.list[i].main.temp);
      this.dates.push( new Date(d.list[i].dt_txt) );
    }
  }

  HandleResize()
  {
    
  }

  InitializeScales()
  {
    this.yScale
      .domain([0, d3.max(this.temperatures)])
      .range([0, this.height]);

    this.xScale = d3.scaleBand()
      .domain(this.temperatures)
      .paddingInner(.3)
      .paddingOuter(.1)
      .range([0, this.width]);

    this.colors = d3.scaleLinear()
      .domain([0, 65, d3.max(this.temperatures)])
      .range(['#FFFFFF', 
              '#2D8BCF', 
              '#DA3637']);

    this.yAxisValue = d3.scaleLinear()
      .domain([0, d3.max(this.temperatures)])
      .range([this.height, 0]);

    this.xAxisValue = d3.scaleTime()
      .domain([this.dates[0], this.dates[(this.dates.length-1)]])
      .range([0,this.width]);

    // Might not need to re-call this.
    this.xAxisTicks = d3.axisBottom(this.xAxisValue)
      .ticks(d3.timeDay.every(1));

    this.yAxisTicks = d3.axisLeft(this.yAxisValue)
      .ticks(10)
  }

  InitializeGraph(d)
  { 
    var myChart,
      xGuide,
      yGuide;

    let sThis = this;
    //d3.select('#viz').append('svg')
    this.graphSVG = this.mainSVG.append('svg');
    this.graphSVG
      .attr('width', this.width +  this.margin.left + this.margin.right )
      .attr('height', this.height + this.margin.top - this.margin.bottom )

      .append('g')
      .attr('transform', 
            'translate('+ this.margin.left +',' + this.margin.right +')')
  
      .selectAll('rect').data(this.temperatures)
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
          return sThis.height - sThis.yScale(d);
      

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

      yGuide = this.graphSVG
              .append('g')
              .attr('transform', 'translate(20,0)' )
              .call(this.yAxisTicks);

      xGuide =this.graphSVG
              .append('g')
              .attr('transform', 'translate(20, '+ this.height + ')' )
              .call(this.xAxisTicks);

                
  }//json import
    
  GetTempForecastData()
  {
    return {"cod":"200","message":0.0077,"cnt":40,"list":[{"dt":1490994000,"main":{"temp":93.58,"temp_min":80.82,"temp_max":93.58,"pressure":1021.6,"sea_level":1024.42,"grnd_level":1021.6,"humidity":59,"temp_kf":7.09},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":0},"wind":{"speed":9.28,"deg":238.501},"rain":{"3h":0.21},"sys":{"pod":"d"},"dt_txt":"2017-03-31 21:00:00"},{"dt":1491004800,"main":{"temp":86.72,"temp_min":77.15,"temp_max":86.72,"pressure":1022.46,"sea_level":1025.25,"grnd_level":1022.46,"humidity":55,"temp_kf":5.32},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":9.55,"deg":263.001},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-01 00:00:00"},{"dt":1491015600,"main":{"temp":75.65,"temp_min":69.26,"temp_max":75.65,"pressure":1024.72,"sea_level":1027.56,"grnd_level":1024.72,"humidity":74,"temp_kf":3.54},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":9.13,"deg":269.001},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-01 03:00:00"},{"dt":1491026400,"main":{"temp":67.26,"temp_min":64.07,"temp_max":67.26,"pressure":1025.34,"sea_level":1028.19,"grnd_level":1025.34,"humidity":96,"temp_kf":1.77},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":7.25,"deg":265.003},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-01 06:00:00"},{"dt":1491037200,"main":{"temp":61.69,"temp_min":61.69,"temp_max":61.69,"pressure":1025.46,"sea_level":1028.3,"grnd_level":1025.46,"humidity":99,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":0},"wind":{"speed":5.77,"deg":265.002},"rain":{"3h":0.0025000000000002},"sys":{"pod":"n"},"dt_txt":"2017-04-01 09:00:00"},{"dt":1491048000,"main":{"temp":61.14,"temp_min":61.14,"temp_max":61.14,"pressure":1027.23,"sea_level":1030.17,"grnd_level":1027.23,"humidity":96,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":4.27,"deg":268.502},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-01 12:00:00"},{"dt":1491058800,"main":{"temp":76.58,"temp_min":76.58,"temp_max":76.58,"pressure":1028.59,"sea_level":1031.49,"grnd_level":1028.59,"humidity":57,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":4.88,"deg":319.508},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-01 15:00:00"},{"dt":1491069600,"main":{"temp":82.18,"temp_min":82.18,"temp_max":82.18,"pressure":1027.72,"sea_level":1030.5,"grnd_level":1027.72,"humidity":45,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":4.09,"deg":335.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-01 18:00:00"},{"dt":1491080400,"main":{"temp":84.27,"temp_min":84.27,"temp_max":84.27,"pressure":1026.08,"sea_level":1028.9,"grnd_level":1026.08,"humidity":36,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":4.05,"deg":307.502},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-01 21:00:00"},{"dt":1491091200,"main":{"temp":76.11,"temp_min":76.11,"temp_max":76.11,"pressure":1026.5,"sea_level":1029.37,"grnd_level":1026.5,"humidity":45,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.75,"deg":301.5},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-02 00:00:00"},{"dt":1491102000,"main":{"temp":65.76,"temp_min":65.76,"temp_max":65.76,"pressure":1028.19,"sea_level":1031.1,"grnd_level":1028.19,"humidity":63,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.47,"deg":49.0031},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-02 03:00:00"},{"dt":1491112800,"main":{"temp":61.21,"temp_min":61.21,"temp_max":61.21,"pressure":1028.62,"sea_level":1031.45,"grnd_level":1028.62,"humidity":91,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02n"}],"clouds":{"all":8},"wind":{"speed":3.2,"deg":129.502},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-02 06:00:00"},{"dt":1491123600,"main":{"temp":58.28,"temp_min":58.28,"temp_max":58.28,"pressure":1028.13,"sea_level":1031.04,"grnd_level":1028.13,"humidity":93,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":36},"wind":{"speed":2.06,"deg":167},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-02 09:00:00"},{"dt":1491134400,"main":{"temp":59.4,"temp_min":59.4,"temp_max":59.4,"pressure":1028.7,"sea_level":1031.67,"grnd_level":1028.7,"humidity":90,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":20},"wind":{"speed":2.62,"deg":109.501},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-02 12:00:00"},{"dt":1491145200,"main":{"temp":79.93,"temp_min":79.93,"temp_max":79.93,"pressure":1029.78,"sea_level":1032.57,"grnd_level":1029.78,"humidity":49,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":24},"wind":{"speed":4.61,"deg":141.507},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-02 15:00:00"},{"dt":1491156000,"main":{"temp":86.2,"temp_min":86.2,"temp_max":86.2,"pressure":1028.19,"sea_level":1031.1,"grnd_level":1028.19,"humidity":40,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":68},"wind":{"speed":6.06,"deg":136},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-02 18:00:00"},{"dt":1491166800,"main":{"temp":87.83,"temp_min":87.83,"temp_max":87.83,"pressure":1026.42,"sea_level":1029.29,"grnd_level":1026.42,"humidity":35,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":7.74,"deg":128.005},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-02 21:00:00"},{"dt":1491177600,"main":{"temp":81.06,"temp_min":81.06,"temp_max":81.06,"pressure":1026.64,"sea_level":1029.49,"grnd_level":1026.64,"humidity":36,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":20},"wind":{"speed":10.54,"deg":116.5},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-03 00:00:00"},{"dt":1491188400,"main":{"temp":72.4,"temp_min":72.4,"temp_max":72.4,"pressure":1027.98,"sea_level":1030.8,"grnd_level":1027.98,"humidity":56,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02n"}],"clouds":{"all":8},"wind":{"speed":11.1,"deg":118},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-03 03:00:00"},{"dt":1491199200,"main":{"temp":67.39,"temp_min":67.39,"temp_max":67.39,"pressure":1027.15,"sea_level":1030.06,"grnd_level":1027.15,"humidity":78,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":12},"wind":{"speed":9.17,"deg":126.003},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-03 06:00:00"},{"dt":1491210000,"main":{"temp":64.18,"temp_min":64.18,"temp_max":64.18,"pressure":1026.96,"sea_level":1029.77,"grnd_level":1026.96,"humidity":92,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":20},"wind":{"speed":6.93,"deg":135.501},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-03 09:00:00"},{"dt":1491220800,"main":{"temp":64.85,"temp_min":64.85,"temp_max":64.85,"pressure":1026.78,"sea_level":1029.6,"grnd_level":1026.78,"humidity":91,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02d"}],"clouds":{"all":8},"wind":{"speed":8.66,"deg":133.503},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-03 12:00:00"},{"dt":1491231600,"main":{"temp":79.1,"temp_min":79.1,"temp_max":79.1,"pressure":1026.76,"sea_level":1029.57,"grnd_level":1026.76,"humidity":57,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":12},"wind":{"speed":13,"deg":144.51},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-03 15:00:00"},{"dt":1491242400,"main":{"temp":87.6,"temp_min":87.6,"temp_max":87.6,"pressure":1024.57,"sea_level":1027.38,"grnd_level":1024.57,"humidity":40,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":12.97,"deg":155.503},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-03 18:00:00"},{"dt":1491253200,"main":{"temp":90.2,"temp_min":90.2,"temp_max":90.2,"pressure":1021.73,"sea_level":1024.4,"grnd_level":1021.73,"humidity":33,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":12},"wind":{"speed":12.33,"deg":180.501},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-03 21:00:00"},{"dt":1491264000,"main":{"temp":82.93,"temp_min":82.93,"temp_max":82.93,"pressure":1020.59,"sea_level":1023.34,"grnd_level":1020.59,"humidity":51,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":64},"wind":{"speed":13.13,"deg":186.002},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-04 00:00:00"},{"dt":1491274800,"main":{"temp":78.15,"temp_min":78.15,"temp_max":78.15,"pressure":1020.84,"sea_level":1023.61,"grnd_level":1020.84,"humidity":60,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":20},"wind":{"speed":9.86,"deg":181.505},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-04 03:00:00"},{"dt":1491285600,"main":{"temp":76.13,"temp_min":76.13,"temp_max":76.13,"pressure":1020.84,"sea_level":1023.56,"grnd_level":1020.84,"humidity":61,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":36},"wind":{"speed":11.77,"deg":190.001},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-04 06:00:00"},{"dt":1491296400,"main":{"temp":74.3,"temp_min":74.3,"temp_max":74.3,"pressure":1019.48,"sea_level":1022.2,"grnd_level":1019.48,"humidity":70,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":20},"wind":{"speed":15.79,"deg":185.501},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-04 09:00:00"},{"dt":1491307200,"main":{"temp":72.83,"temp_min":72.83,"temp_max":72.83,"pressure":1019.98,"sea_level":1022.98,"grnd_level":1019.98,"humidity":81,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":80},"wind":{"speed":16.69,"deg":199.501},"rain":{"3h":0.785},"sys":{"pod":"d"},"dt_txt":"2017-04-04 12:00:00"},{"dt":1491318000,"main":{"temp":71.15,"temp_min":71.15,"temp_max":71.15,"pressure":1021.47,"sea_level":1024.23,"grnd_level":1021.47,"humidity":94,"temp_kf":0},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"clouds":{"all":32},"wind":{"speed":10.45,"deg":226.002},"rain":{"3h":7.15},"sys":{"pod":"d"},"dt_txt":"2017-04-04 15:00:00"},{"dt":1491328800,"main":{"temp":76.81,"temp_min":76.81,"temp_max":76.81,"pressure":1020.73,"sea_level":1023.53,"grnd_level":1020.73,"humidity":82,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":48},"wind":{"speed":12.01,"deg":242.001},"rain":{"3h":0.039999999999999},"sys":{"pod":"d"},"dt_txt":"2017-04-04 18:00:00"},{"dt":1491339600,"main":{"temp":79.79,"temp_min":79.79,"temp_max":79.79,"pressure":1019.43,"sea_level":1022.34,"grnd_level":1019.43,"humidity":66,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":12.35,"deg":253.006},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-04 21:00:00"},{"dt":1491350400,"main":{"temp":73.62,"temp_min":73.62,"temp_max":73.62,"pressure":1020.56,"sea_level":1023.39,"grnd_level":1020.56,"humidity":60,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":9.35,"deg":252.505},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-05 00:00:00"},{"dt":1491361200,"main":{"temp":67,"temp_min":67,"temp_max":67,"pressure":1022.73,"sea_level":1025.55,"grnd_level":1022.73,"humidity":80,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":7.87,"deg":256.504},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-05 03:00:00"},{"dt":1491372000,"main":{"temp":63.31,"temp_min":63.31,"temp_max":63.31,"pressure":1023.36,"sea_level":1026.23,"grnd_level":1023.36,"humidity":95,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":20},"wind":{"speed":6.62,"deg":258.002},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-05 06:00:00"},{"dt":1491382800,"main":{"temp":61.98,"temp_min":61.98,"temp_max":61.98,"pressure":1023.54,"sea_level":1026.44,"grnd_level":1023.54,"humidity":97,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":24},"wind":{"speed":4.63,"deg":260.503},"rain":{},"sys":{"pod":"n"},"dt_txt":"2017-04-05 09:00:00"},{"dt":1491393600,"main":{"temp":60.57,"temp_min":60.57,"temp_max":60.57,"pressure":1024.58,"sea_level":1027.53,"grnd_level":1024.58,"humidity":93,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":32},"wind":{"speed":2.62,"deg":261.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-05 12:00:00"},{"dt":1491404400,"main":{"temp":74.96,"temp_min":74.96,"temp_max":74.96,"pressure":1025.93,"sea_level":1028.76,"grnd_level":1025.93,"humidity":72,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":20},"wind":{"speed":3.96,"deg":271.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-05 15:00:00"},{"dt":1491415200,"main":{"temp":80,"temp_min":80,"temp_max":80,"pressure":1025.54,"sea_level":1028.35,"grnd_level":1025.54,"humidity":58,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":36},"wind":{"speed":4,"deg":246.003},"rain":{},"sys":{"pod":"d"},"dt_txt":"2017-04-05 18:00:00"}],"city":{"id":4167147,"name":"Orlando","coord":{"lat":28.5383,"lon":-81.3793},"country":"US"}};
  }
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
