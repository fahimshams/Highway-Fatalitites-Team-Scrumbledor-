

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

      this.AgeArray = [
        
        {label: "00-10"},
        {label: "11-20"},
        {label: "21-30"},
        {label: "31-40"},
        {label: "41-50"},
        {label: "51-60"},
        {label: "61-70"},
        {label: "71-80"},
        {label: "81-90"},
        {label: "90+"},];

      this.AmHoursArray = [
        {label: "01", count: 1},
        {label: "02", count: 1},
        {label: "03", count: 1},
        {label: "04", count: 1},
        {label: "05", count: 1},
        {label: "06", count: 1},
        {label: "07", count: 1},
        {label: "08", count: 1},
        {label: "09", count: 1},
        {label: "10", count: 1},
        {label: "11", count: 1},
        {label: "12", count: 1},];
      
      this.PmHoursArray = [
        {label: "01", count: 1},
        {label: "02", count: 1},
        {label: "03", count: 1},
        {label: "04", count: 1},
        {label: "05", count: 1},
        {label: "06", count: 1},
        {label: "07", count: 1},
        {label: "08", count: 1},
        {label: "09", count: 1},
        {label: "10", count: 1},
        {label: "11", count: 1},
        {label: "12", count: 1},];

      this.TimeArray = [
        {label: "AM"},
        {label: "PM"},
      ];

      this.AgeLabelArray =[
        {label: "Ages"},
      ];

      
          
          //filter for AM PM hours and Days and Months
          //with boolean true 
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
            {label: "DEC", active: true},],

          Ages : [
           
            {label: "00-10", active: true, min: 0, max: 10},
            {label: "11-20", active: true, min: 11, max: 20},
            {label: "21-30", active: true, min: 21, max: 30},
            {label: "31-40", active: true, min: 31, max: 40},
            {label: "41-50", active: true, min: 41, max: 50},
            {label: "51-60", active: true, min: 51, max: 60},
            {label: "61-70", active: true, min: 61, max: 70},
            {label: "71-80", active: true, min: 71, max: 80},
            {label: "81-90", active: true, min: 81, max: 90},
            {label: "90+", active: true, min: 91, max: 200}, ]
       };
      
      this.MainGroup = this.svg.append('g').attr("transform", this.translateString(this.div.clientWidth / 2, 0));
			
      this.AmHourButtons = null;
      this.PmHourButtons = null;
      this.TimeButtons = null;
      let drawHeight = this.buildHourPies();

      this.DayButtons = null;
      drawHeight = this.buildDayGrid(drawHeight);

      this.MonthButtons = null;
      drawHeight = this.buildMonthGrid(drawHeight);

      this.AgeButtons = null;
      drawHeight = this.buildAgeGrid(drawHeight);

      this.AgeLabelButtons = null;
      drawHeight = this.buildAgeLabelGrid(drawHeight);
      
      EventSystem.Instance.AddListener("OnWindowResize", this, this.handleResize);
    }
    
    handleResize()
    {
      let center = this.div.clientWidth / 2;

      this.MainGroup.attr("transform", this.translateString(center, 0));
    }

    translateString(x, y)
    {
      return "translate(" + x + "," + y + ")";
    }

    buildMonthGrid(drawHeight)
    {
      //let gridData = this.generateGridData(2, 6, {x: 200, y: 40}, {width: 25, height: 25});
      let topPadding = 60;
      let bottomPadding = 20;
      let dim = {width: 50, height: 50};
      let boxWidth = 6 * dim.width;
      let pos = {x: -(boxWidth /2), y: drawHeight + topPadding};
      let gridData = this.generateGridData(2, 6, pos, dim);
     	// let gridrow = gridData [0];
      for (let i = 0; i < 12; i++){
          let data = gridData[i];
          data.month = this.MonthsArray[i];
        }

      //Buttons for Months
      let sThis = this;
      this.MonthButtons = this.MainGroup.selectAll(".monthButton")
        .data(gridData)
        .enter().append("rect")
        .attr("class", "monthButton")
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
      let text = this.MainGroup.selectAll(".monthLabelText")
        .data(gridData)
        .enter().append("text")
        .attr("class", "monthLabelText")
        .attr("x", function(d) {return d.x + (d.width / 2); })
        .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
        .text(function(d) {
          return d.month.label;
         })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white")
        .style("user-select", "none")
        .style("pointer-events", "none")
				.on('click', function(d){
          sThis.handleMonthFilterChanges(d);
          sThis.setColorsForMonthButtons();
          EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });

        return drawHeight + topPadding + dim.height + bottomPadding;

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
      let boxWidth = 7 * dim.width;
      let pos = {x: -(boxWidth / 2), y: drawHeight + topPadding};
    	let gridData = this.generateGridData(1, 7, pos, dim);
      for (let i = 0; i<7; i++){
          let entry = gridData[i];
          entry.day = this.DaysArray[i];
      }
	
  		// Now we've got the grid's data, build the grid
      let sThis = this;
        
      // Buttons //
      this.DayButtons = this.MainGroup.selectAll(".dayButton")
          .data(gridData)
          .enter().append("rect")
          .attr("class","dayButton")
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
      let text = this.MainGroup.selectAll(".dayLabelText")
          .data(gridData)
          .enter().append("text")
          .attr("class", "dayLabelText")
          .attr("x", function(d) {return d.x + (d.width / 2); })
          .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
          .text(function(d) {
          	return d.day.label;
          })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("fill", "white")
          .style("user-select", "none")
          .style("pointer-events", "none")
					.on('click', function(d){
            sThis.handleFilterChanges(d);
            sThis.setColorsForDayButtons();
            EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });
        
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

    buildAgeGrid(drawHeight)
    {
      //Generate grid for the age buttons and inject data
      let topPadding = 60;
      let bottomPadding = 20;
      let dim = {width: 50, height: 50};
      let boxWidth = 5 * dim.width;
      let pos = {x: -(boxWidth /2), y: drawHeight + topPadding};
      let gridData = this.generateGridData(2, 5, pos, dim);
      for (let i = 0; i <10;i++){
          let AgeData = gridData[i];
          AgeData.age = this.AgeArray[i];
      }

      let sThis = this;

      //Buttons for Age
      this.AgeButtons = this.MainGroup.selectAll(".ageButton")
          .data(gridData)
          .enter().append("rect")
          .attr("class", "ageButton")
          .attr("x", function(d) {return d.x; })
          .attr("y", function(d) {return d.y; })
          .attr("width", function(d) {return d.width;})
          .attr("height", function(d) {return d.height;})
          .style("fill", "green")
          .style("stroke","#222")
          .on('click', function(d){
            sThis.handleAgeFilterChanges(d);
            sThis.setColorsForAgeButtons();
            EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
          });


      let text = this.MainGroup.selectAll(".ageLabelText")
          .data(gridData)
          .enter().append("text")
          .attr("class", "ageLabelText")
          .attr("x", function(d) {return d.x + (d.width /5); })
          .attr("y", function(d) {return d.y + (d.height/2) + 5})
          .text(function(d) {return d.age.label;})
          .attr("text-Anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "13.5px")
          .attr("fill", "white")
          .style("user-select", "none")
          .style("pointer-events", "none")
          .on('click', function(d){
            sThis.handleAgeFilterChanges(d);
            sThis.setColorsForAgeButtons();
            EventSystem.Instance.RaiseEvent("onFilterChange". sThis.Filter);
          });

          return drawHeight + topPadding + dim.height + bottomPadding;
    }


    //edits day filter
    handleAgeFilterChanges(d)
    {
      let ageName = d.age.label;

      // Find the filter we clicked on.
      let clickedFilter = null;
      let numInactive = 0;
      for (let i = 0; i < this.Filter.Ages.length; i++)
      {
        let checkingFilter = this.Filter.Ages[i];
        if (checkingFilter.label === ageName)
        {
          clickedFilter = checkingFilter;
        }

        if (!checkingFilter.active)
        {
          numInactive++;
        }
      }

      for (let i = 0; i < this.Filter.Ages.length; i++)
      {
        let checkingFilter = this.Filter.Ages[i];
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
        for (let i = 0; i < this.Filter.Ages.length; i++)
        {
          let checkingFilter = this.Filter.Ages[i];
          if (checkingFilter.label != clickedFilter.label)
          {
            checkingFilter.active = false;
          }
        }
      }
      else if (numInactive == this.Filter.Ages.length) // All off, toggle everything on.
      {
        for (let i = 0; i < this.Filter.Ages.length; i++)
        {
          let checkingFilter = this.Filter.Ages[i];
          checkingFilter.active = true;
        }
      }
    }
    
    setColorsForAgeButtons()
    {
    	let sThis = this;
    	this.AgeButtons.style("fill", function(d) {
      	let label = d.age.label;
        for (let i = 0; i < sThis.Filter.Ages.length; i++)
        {
        	let checkingFilter = sThis.Filter.Ages[i];
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

    buildAgeLabelGrid(drawHeight)
    {
    	// Generate the grid for the day buttons and inject day data.
      let topPadding = 60;
      let bottomPadding = 20;
      let dim = {width: 50, height: 50};
      let boxWidth = 1 * dim.width;
      let pos = {x: -(boxWidth / 2), y: drawHeight + topPadding};
    	let gridData = this.generateGridData(1, 1, pos, dim);
      for (let i = 0; i<1; i++){
          let entry = gridData[i];
          entry.AgeLabel = this.AgeLabelArray[i];
      }
	
  		// Now we've got the grid's data, build the grid
      let sThis = this;
        
      // Buttons //
      this.AgeLabelButtons = this.MainGroup.selectAll(".ageLabel")
          .data(gridData)
          .enter().append("rect")
          .attr("class","ageLabel")
          .attr("x", function(d) {return d.x; })
          .attr("y", function(d) {return d.y; })
          .attr("width",function(d) {return d.width;})
          .attr("height",function(d) {return d.height;})
          .style("fill","black")
          .style("stroke","#222")
        
        
        // Text //
      let text = this.MainGroup.selectAll(".ageText")
          .data(gridData)
          .enter().append("text")
          .attr("class", "ageText")
          .attr("x", function(d) {return d.x + (d.width / 2); })
          .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
          .text(function(d) {
          	return d.AgeLabel.label;
          })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("fill", "white")
          .style("user-select", "none")
          .style("pointer-events", "none")
        
        return drawHeight + topPadding + dim.height + bottomPadding;
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
    


    //build pies for time
    buildHourPies()
    {
      
    	let radius = 100;
      let verticalPadding = 20;
      let piePadding = 20;

      let sThis=this;
      
      let center = this.div.clientWidth / 2;
      let offset = radius + (piePadding / 2);
      
      

    	this.pieGroupAm = this.MainGroup.append('g')
      	.attr('transform', 'translate(' + (-offset) + ',' + (radius + verticalPadding) +')');
        
      this.pieGroupPm = this.MainGroup.append('g')
      	.attr('transform', 'translate(' + (offset) + ',' + (radius + verticalPadding) +')');
      

      let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      let labelArc = d3.arc()
        .innerRadius(radius/4)
        .outerRadius(radius);

      let pie = d3.pie()
        .value(function(d) {return d.count;})
        .sort(null);


      // pathOne for Am Clock
      this.AmHourButtons = this.pieGroupAm.selectAll('path')
        .data(pie(this.AmHoursArray))
        .enter()
        .append('path')
        .attr('d', arc)
        //.attr('fill', function (d, i){ return d3.rgb(Math.random() * 255, 0, 0); })
        .on('click', function(d){
          sThis.handleAmFilterChanges(d);
          sThis.setColorsForAmPie();
          sThis.setColorsForPmPie();
          EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter)});

      sThis.setColorsForAmPie();

      //Am text
      this.pieGroupAm.selectAll(".arc")
        .data(pie(this.AmHoursArray))
        .enter().append("text")
        .attr("transform",function(d) {return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) {return d.data.label;})
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white")
        .style("user-select", "none")
        .style("pointer-events", "none");

      //pathTwo for Pm Clock
      this.PmHourButtons = this.pieGroupPm.selectAll('path')
        .data(pie(this.PmHoursArray))
        .enter()
        .append('path')
        .attr('d', arc)
        //.attr('fill', function (d, i){ return d3.rgb(Math.random() * 255, 0, 0); })
        .on('click', function(d){
          sThis.handlePmFilterChanges(d);
          sThis.setColorsForAmPie();
          sThis.setColorsForPmPie();
          EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter)});
          
      sThis.setColorsForPmPie();

      //text for PM Clock
      this.pieGroupPm.selectAll(".arc")
      .data(pie(this.PmHoursArray))
      .enter().append("text")
      .attr("transform",function(d) {return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) {return d.data.label;})
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "white")        
      .style("user-select", "none")
      .style("pointer-events", "none");


      //////for AM PM buttons
      //
      //
      //
      //
          //
      //
    
      let dim = {width: 50, height: 50};
      let height = 220;
      let boxWidth = 2 * dim.width;
      let pos = {x: -(boxWidth /2), y: (height)};
      let gridData = this.generateGridData(1, 2, pos, dim);
      for (let i = 0; i <2;i++){
          let TimeData = gridData[i];
          TimeData.time = this.TimeArray[i];
      }

      //let sThis = this;

      //non clickable Buttons for AM PM 
      let timeGroup = this.MainGroup.append("g");
      let column = timeGroup.selectAll(".square")
          .data(gridData)
          .enter().append("rect")
          .attr("class", "square")
          .attr("x", function(d) {return d.x; })
          .attr("y", function(d) {return d.y; })
          .attr("width", function(d) {return d.width;})
          .attr("height", function(d) {return d.height;})
          .style("fill", "black")
          .style("stroke","#222")

          let text = timeGroup.selectAll(".labelText")
          .data(gridData)
          .enter().append("text")
          .attr("class", "labelText")
          .attr("x", function(d) {return d.x + (d.width / 2); })
          .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
          .text(function(d) {
            return d.time.label;
           })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("fill", "white")
          .style("user-select", "none")
          .style("pointer-events", "none")

          this.TimeButtons = timeGroup.selectAll("rect");
        

    	return (verticalPadding * 2) + (radius * 2);
    };

    handleAmFilterChanges(d)
    {
      //console.log(d.day.label);
      let hourName = d.data.label;

      // Find the filter we clicked on.
      let clickedFilter = null;
      let numInactive = 0;
      for (let i = 0; i < this.Filter.AmHours.length; i++)
      {
        let checkingFilter = this.Filter.AmHours[i];
        if (checkingFilter.label === hourName)
        {
          clickedFilter = checkingFilter;
        }

        if (!checkingFilter.active)
        {
          numInactive++;
        }
      }

      // Check the PM filters as well
      for (let i = 0; i < this.Filter.PmHours.length; i++)
      {
        let checkingFilter = this.Filter.PmHours[i];
        if (!checkingFilter.active)
        {
          numInactive++;
        }
      }
  
      let checkPmFilters = true;
      for (let i = 0; i < this.Filter.AmHours.length; i++)
      {
        let checkingFilter = this.Filter.AmHours[i];
        let filterActive = checkingFilter.active;

        if (!filterActive)
        {
          clickedFilter.active = !clickedFilter.active;
          if (!clickedFilter.active)
          {
            numInactive++; // We toggled one filter off, so increment numInactive if we did.
          }

          checkPmFilters = false;
          break;
        }
      }

      if (checkPmFilters) // Didn't find an inactive filter in the AM pie, look for one in the PM pie.
      {
        for (let i = 0; i < this.Filter.PmHours.length; i++)
        {
          let checkingFilter = this.Filter.PmHours[i];
          let filterActive = checkingFilter.active;

          if (!filterActive)
          {
            clickedFilter.active = !clickedFilter.active;
            if (!clickedFilter.active)
            {
              numInactive++; // We toggled one filter off, so increment numInactive if we did.
            }
            break;
          }
        }
      }

      if (numInactive == 0) // All true, toggle everything off except the one we just clicked.
      {
        for (let i = 0; i < this.Filter.AmHours.length; i++)
        {
          let checkingFilter = this.Filter.AmHours[i];
          if (checkingFilter.label != clickedFilter.label)
          {
            checkingFilter.active = false;
          }
        }

        for (let i = 0; i < this.Filter.PmHours.length; i++)
        {
          let checkingFilter = this.Filter.PmHours[i];
          checkingFilter.active = false;
        }
      }
      else if (numInactive == this.Filter.AmHours.length + this.Filter.PmHours.length) // All off, toggle everything on.
      {
        for (let i = 0; i < this.Filter.AmHours.length; i++)
        {
          let checkingFilter = this.Filter.AmHours[i];
          checkingFilter.active = true;
        }

        for (let i = 0; i < this.Filter.PmHours.length; i++)
        {
          let checkingFilter = this.Filter.PmHours[i];
          checkingFilter.active = true;
        }
      }
    }

    setColorsForAmPie()
    {
    	let sThis = this;
    	this.AmHourButtons.style("fill", function(d) {
      	let label = d.data.label;
        for (let i = 0; i < sThis.Filter.AmHours.length; i++)
        {
        	let checkingFilter = sThis.Filter.AmHours[i];
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


    handlePmFilterChanges(d)
    {
      //console.log(d.day.label);
      let hourName = d.data.label;

      // Find the filter we clicked on.
      let clickedFilter = null;
      let numInactive = 0;
      for (let i = 0; i < this.Filter.PmHours.length; i++)
      {
        let checkingFilter = this.Filter.PmHours[i];
        if (checkingFilter.label === hourName)
        {
          clickedFilter = checkingFilter;
        }

        if (!checkingFilter.active)
        {
          numInactive++;
        }
      }

      // Check the PM filters as well
      for (let i = 0; i < this.Filter.AmHours.length; i++)
      {
        let checkingFilter = this.Filter.AmHours[i];
        if (!checkingFilter.active)
        {
          numInactive++;
        }
      }
  
      let checkAmFilters = true;
      for (let i = 0; i < this.Filter.PmHours.length; i++)
      {
        let checkingFilter = this.Filter.PmHours[i];
        let filterActive = checkingFilter.active;

        if (!filterActive)
        {
          clickedFilter.active = !clickedFilter.active;
          if (!clickedFilter.active)
          {
            numInactive++; // We toggled one filter off, so increment numInactive if we did.
          }

          checkAmFilters = false;
          break;
        }
      }

      if (checkAmFilters) // Didn't find an inactive filter in the PM pie, look for one in the AM pie.
      {
        for (let i = 0; i < this.Filter.AmHours.length; i++)
        {
          let checkingFilter = this.Filter.AmHours[i];
          let filterActive = checkingFilter.active;

          if (!filterActive)
          {
            clickedFilter.active = !clickedFilter.active;
            if (!clickedFilter.active)
            {
              numInactive++; // We toggled one filter off, so increment numInactive if we did.
            }
            break;
          }
        }
      }

      if (numInactive == 0) // All true, toggle everything off except the one we just clicked.
      {
        for (let i = 0; i < this.Filter.PmHours.length; i++)
        {
          let checkingFilter = this.Filter.PmHours[i];
          if (checkingFilter.label != clickedFilter.label)
          {
            checkingFilter.active = false;
          }
        }

        for (let i = 0; i < this.Filter.AmHours.length; i++)
        {
          let checkingFilter = this.Filter.AmHours[i];
          checkingFilter.active = false;
        }
      }
      else if (numInactive == this.Filter.AmHours.length + this.Filter.PmHours.length) // All off, toggle everything on.
      {
        for (let i = 0; i < this.Filter.PmHours.length; i++)
        {
          let checkingFilter = this.Filter.PmHours[i];
          checkingFilter.active = true;
        }

        for (let i = 0; i < this.Filter.AmHours.length; i++)
        {
          let checkingFilter = this.Filter.AmHours[i];
          checkingFilter.active = true;
        }
      }
    }

    setColorsForPmPie()
    {
    	let sThis = this;
    	this.PmHourButtons.style("fill", function(d) {
      	let label = d.data.label;
        for (let i = 0; i < sThis.Filter.PmHours.length; i++)
        {
        	let checkingFilter = sThis.Filter.PmHours[i];
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

};