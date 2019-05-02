// var rect = svg.append("rect")
// .attr("x", 300)
// .attr("y", 50)
// .attr("height", 20)
// .attr("width", 20);

// rect.on('click', function(){
// console.log('i was clicked');
// }) ;

/*
let monday filter = new Filters("Monday")
let sunday filter = new Filters("Pizza")
 
burgerFilter.PrintTheThing();
 
class Filter
{
    get Filter()
    {
        return this.filter;
    }
 
    constructor(arg)
    {
        this.food = arg;
        this.filter = {
            time = Monday
        }
    }
}
*/

class Filter
{
    constructor(svg, div)
    {
    	this.svg = svg;
      this.div = div;
      this.pieGroupAm = null;
      this.pieGroupPm = null;
      
			this.DaysArray = [
          {label: "MON" },
          {label: "TUE" },
          {label: "WED" },
          {label: "THU"},
          {label: "FRI" },
          {label: "SAT" },
          {label: "SUN" },
        ];
      
      this.MonthsArray = [
        {label: "JAN"},
        {label: "FEB"},
        {label: "MAR"},
        {label: "APR"},
        {label: "MAY"},
        {label: "JUN"},
        {label: "JUL"},
        {label: "AUG"},
        {label: "SEP"},
        {label: "OCT"},
        {label: "NOV"},
        {label: "DEC"},];

      this.AmHoursArray = [
        {label: "1", count: 1},
        {label: "2", count: 1},
        {label: "3", count: 1},
        {label: "4", count: 1},
        {label: "5", count: 1},
        {label: "6", count: 1},
        {label: "7", count: 1},
        {label: "8", count: 1},
        {label: "9", count: 1},
        {label: "10", count: 1},
        {label: "11", count: 1},
        {label: "12", count: 1},];
      
        this.PmHoursArray = [
          {label: "1", count: 1},
          {label: "2", count: 1},
          {label: "3", count: 1},
          {label: "4", count: 1},
          {label: "5", count: 1},
          {label: "6", count: 1},
          {label: "7", count: 1},
          {label: "8", count: 1},
          {label: "9", count: 1},
          {label: "10", count: 1},
          {label: "11", count: 1},
          {label: "12", count: 1},];
        
      this.Filter = {
         AmHours : [
            {label: "01", active: true},
            {label: "02", active: true},
            {label: "03", active: true},
            {label: "04", active: true},
            {label: "05", active: true},
            {label: "06", active: true},
            {label: "07", active: true},
            {label: "08", active: true},
            {label: "09", active: true},
            {label: "10", active: true},
            {label: "11", active: true},
            {label: "12", active: true},],

          PmHours : [
            {label: "01", active: true},
            {label: "02", active: true},
            {label: "03", active: true},
            {label: "04", active: true},
            {label: "05", active: true},
            {label: "06", active: true},
            {label: "07", active: true},
            {label: "08", active: true},
            {label: "09", active: true},
            {label: "10", active: true},
            {label: "11", active: true},
            {label: "12", active: true},],

        Days : [
            {label: "MON", active: true},
            {label: "TUE", active: true},
            {label: "WED", active: true},
            {label: "THU", active: true},
            {label: "FRI", active: true},
            {label: "SAT", active: true},
            {label: "SUN", active: true},],

        Months : [
            {label: "JAN", active: true},
            {label: "FEB", active: true},
            {label: "MAR", active: true},
            {label: "APR", active: true},
            {label: "MAY", active: true},
            {label: "JUN", active: true},
            {label: "JUL", active: true},
            {label: "AUG", active: true},
            {label: "SEP", active: true},
            {label: "OCT", active: true},
            {label: "NOV", active: true},
            {label: "DEC", active: true},]
 			};
			
      this.HourButtons = null;
      let drawHeight = this.buildHourPies();
      this.DayButtons = null;
      drawHeight = this.buildDayGrid(drawHeight);
      this.MonthButtons = null;
      this.buildMonthGrid(drawHeight);
      
      
    }
    
    buildMonthGrid(drawHeight)
    {
    	//let gridData = this.generateGridData(2, 6, {x: 200, y: 40}, {width: 25, height: 25});
      let dim = {width: 50, height: 50};
      let centerX = this.div.clientWidth / 2;
      let boxWidth = 6 * dim.width;
      let pos = {x: centerX - (boxWidth /2), y: drawHeight + 90};
      let gridData = this.generateGridData(2, 6, pos, dim);
     	// let gridrow = gridData [0];
      for (let i = 0; i < 12; i++){
          let data = gridData[i];
          data.month = this.MonthsArray[i];
        }

      //Buttons for Months
      let sThis = this;
			let monthGroup = this.svg.append("g");
      let column = monthGroup.selectAll(".square")
        .data(gridData)
        .enter().append("rect")
        .attr("class", "square")
        .attr("x", function(d) {return d.x; })
        .attr("y", function(d) {return d.y; })
        .attr("width", function(d) {return d.width;})
        .attr("height", function(d) {return d.height;})
        .style("fill", "green")
        .style("stroke","#223")
        .on('click', function (d){
            sThis.handleMonthFilterChanges(d);
            sThis.setColorsForMonthButtons();
            EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });

      //TEXT for months
      let text = monthGroup.selectAll(".labelText")
        .data(gridData)
        .enter().append("text")
        .attr("class", "labelText")
        .attr("x", function(d) {return d.x + (d.width / 2); })
        .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
        .text(function(d) {
          return d.month.label;
         })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white")
				.on('click', function(d){
          sThis.handleMonthFilterChanges(d);
          sThis.setColorsForMonthButtons();
          EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });

        this.MonthButtons = monthGroup.selectAll("rect");

    }
    
    //edits the month filter on click
    handleMonthFilterChanges(d){

      let monthName = d.month.label;

      //FIND the filter that was clicked on
      let clickedFilter = null;
      let numInactive = 0;
      for(let i = 0; i < this.Filter.Months.length; i++)
      {
        let checkingFilter = this.Filter.Months[i];
        
        if ( checkingFilter.label === monthName)
        {
          clickedFilter = checkingFilter;
        }

        if (!checkingFilter.active)
        {
          numInactive ++;
        }
      }

      //
      for (let i = 0; i < this.Filter.Months.length; i++)
      {
        let checkingFilter = this.Filter.Months[i];
        let filterActive = checkingFilter.active;

        if (!filterActive)
        {
          clickedFilter.active = !clickedFilter.active;
          if (!clickedFilter.active)
          {
            numInactive++;
          }
          break;
        }
      }

      if (numInactive == 0) // All true, toggle everything off except the one we just clicked.
      {
        for (let i = 0; i < this.Filter.Months.length; i++)
        {
          let checkingFilter = this.Filter.Months[i];
          if (checkingFilter.label != clickedFilter.label)
          {
            checkingFilter.active = false;
          }
        }
      }
      else if (numInactive == this.Filter.Months.length) // All off, toggle everything on.
      {
        for (let i = 0; i < this.Filter.Months.length; i++)
        {
          let checkingFilter = this.Filter.Months[i];
          checkingFilter.active = true;
        }
      }
    }

    setColorsForMonthButtons()
    {
    	let sThis = this;
    	this.MonthButtons.style("fill", function(d) {
      	let label = d.month.label;
        for (let i = 0; i < sThis.Filter.Months.length; i++)
        {
        	let checkingFilter = sThis.Filter.Months[i];
          if (checkingFilter.label == label)
          {
          	if (checkingFilter.active)
            {
            	return "green";
            }
            else
            {
            	return "red";
            }
          }
        }
      });
    }


    buildDayGrid(drawHeight)
    {
    	// Generate the grid for the day buttons and inject day data.
      let topPadding = 60;
      let bottomPadding = 20;
      let dim = {width: 50, height: 50};
      let centerX = this.div.clientWidth / 2;
      let boxWidth = 7 * dim.width;
      let pos = {x: centerX - (boxWidth / 2), y: drawHeight + topPadding};
    	let gridData = this.generateGridData(1, 7, pos, dim);
      for (let i = 0; i<7; i++){
          let entry = gridData[i];
          entry.day = this.DaysArray[i];
      }
	
  		// Now we've got the grid's data, build the grid
      let sThis = this;
        
      // Buttons //
      let dayGroup = this.svg.append("g");
      let column = dayGroup.selectAll(".square")
          .data(gridData)
          .enter().append("rect")
          .attr("class","square")
          .attr("x", function(d) {return d.x; })
          .attr("y", function(d) {return d.y; })
          .attr("width",function(d) {return d.width;})
          .attr("height",function(d) {return d.height;})
          .style("fill","green")
          .style("stroke","#222")
					.on('click', function(d){
            sThis.handleFilterChanges(d);
            sThis.setColorsForDayButtons();
            EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });
        
        // Text //
      let text = dayGroup.selectAll(".labelText")
          .data(gridData)
          .enter().append("text")
          .attr("class", "labelText")
          .attr("x", function(d) {return d.x + (d.width / 2); })
          .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
          .text(function(d) {
          	return d.day.label;
          })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("fill", "white")
					.on('click', function(d){
            sThis.handleFilterChanges(d);
            sThis.setColorsForDayButtons();
            EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });
        
        this.DayButtons = dayGroup.selectAll("rect");
        
        return drawHeight + topPadding + dim.height + bottomPadding;
    }
    
    // Edits the day filter on click.
    handleFilterChanges(d)
    {
        //console.log(d.day.label);
      let dayName = d.day.label;

      // Find the filter we clicked on.
      let clickedFilter = null;
      let numInactive = 0;
      for (let i = 0; i < this.Filter.Days.length; i++)
      {
        let checkingFilter = this.Filter.Days[i];
        if (checkingFilter.label === dayName)
        {
          clickedFilter = checkingFilter;
        }

        if (!checkingFilter.active)
        {
          numInactive++;
        }
      }

      // Now we know which filter we clicked on, change it.
      // Two cases:
      // 1. Everything is true.  In this case set every filter we didn't click on to false.
      // 2. At least 1 false, just toggle the one we clicked on.
      //
      // As a post check, if all filters are false after toggling, then flip them all to true.
      for (let i = 0; i < this.Filter.Days.length; i++)
      {
        let checkingFilter = this.Filter.Days[i];
        let filterActive = checkingFilter.active;

        if (!filterActive)
        {
          clickedFilter.active = !clickedFilter.active;
          if (!clickedFilter.active)
          {
            numInactive++;
          }
          break;
        }
      }

      if (numInactive == 0) // All true, toggle everything off except the one we just clicked.
      {
        for (let i = 0; i < this.Filter.Days.length; i++)
        {
          let checkingFilter = this.Filter.Days[i];
          if (checkingFilter.label != clickedFilter.label)
          {
            checkingFilter.active = false;
          }
        }
      }
      else if (numInactive == this.Filter.Days.length) // All off, toggle everything on.
      {
        for (let i = 0; i < this.Filter.Days.length; i++)
        {
          let checkingFilter = this.Filter.Days[i];
          checkingFilter.active = true;
        }
      }
    }
    
    setColorsForDayButtons()
    {
    	let sThis = this;
    	this.DayButtons.style("fill", function(d) {
      	let label = d.day.label;
        for (let i = 0; i < sThis.Filter.Days.length; i++)
        {
        	let checkingFilter = sThis.Filter.Days[i];
          if (checkingFilter.label == label)
          {
          	if (checkingFilter.active)
            {
            	return "green";
            }
            else
            {
            	return "red";
            }
          }
        }
      });
    }
    
    // pos should be {x: #, y: #}, dimensions: {width: #, height: #}
    generateGridData(rowCount, columnCount, pos, dimensions)
    {
      let data = new Array();
      let xpos = pos.x;
      let ypos = pos.y;
      let width = dimensions.width;
      let height = dimensions.height;
      let click = 0;

      for (let row = 0; row< rowCount; row++){
          for (let column = 0; column< columnCount; column++){
              data.push({
                  x: xpos,
                  y: ypos,
                  width: width,
                  height: height,
                  click: click,
                //  dayIndex: column,
              })

              xpos += width; //imcrement the x pos
          }

          xpos = pos.x;
          ypos += height;
      }

      return data;
  	}
    
    buildHourPies()
    {
      //let svg = d3.select('#rightDiv')
      //  .append('svg')
      //  .attr('width', width)
      //  .attr('height',height)
      //  .append('g')
      //  .attr('transform','translate(' + (width /2)+ ',' + (height / 2 ) + ')');
    
    	let radius = 100;
      let verticalPadding = 20;
      let piePadding = 20;
      
      let center = this.div.clientWidth / 2;
      let offset = radius + (piePadding / 2);
      
    	this.pieGroupAm = this.svg.append('g')
      	.attr('transform', 'translate(' + (center - offset) + ',' + (radius + verticalPadding) +')');
        
      this.pieGroupPm = this.svg.append('g')
      	.attr('transform', 'translate(' + (center + offset) + ',' + (radius + verticalPadding) +')');
    	
      let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      let pie = d3.pie()
        .value(function(d) {return d.count;})
        .sort(null);

      let pathOne = this.pieGroupAm.selectAll('path')
        .data(pie(this.AmHoursArray))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i){ return d3.rgb(Math.random() * 255, 0, 0); });
       
      let pathTwo = this.pieGroupPm.selectAll('path')
        .data(pie(this.PmHoursArray))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i){ return d3.rgb(Math.random() * 255, 0, 0); });
        
    	return (verticalPadding * 2) + (radius * 2);
    };


};