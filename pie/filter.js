
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
			this.DaysArray = [
          {label: "MON" },
          {label: "TUE" },
          {label: "WED" },
          {label: "THUR"},
          {label: "FRI" },
          {label: "SAT" },
          {label: "SUN" },
  			];
      this.Filter = {
        //  Hours = [
        //     {label: "01", active: true},
        //     {label: "02", active: true},
        //     {label: "03", active: true},
        //     {label: "04", active: true},
        //     {label: "05", active: true},
        //     {label: "06", active: true},
        //     {label: "07", active: true},
        //     {label: "08", active: true},
        //     {label: "09", active: true},
        //     {label: "10", active: true},
        //     {label: "11", active: true},
        //     {label: "12", active: true},],

        Days : [
            {label: "MON", active: true},
            {label: "TUE", active: true},
            {label: "WED", active: true},
            {label: "THUR", active: true},
            {label: "FRI", active: true},
            {label: "SAT", active: true},
            {label: "SUN", active: true},]

        // Months = [
        //     {label: "JAN", active: true},
        //     {label: "FEB", active: true},
        //     {label: "MAR", active: true},
        //     {label: "APR", active: true},
        //     {label: "MAY", active: true},
        //     {label: "JUNE", active: true},
        //     {label: "JULY", active: true},
        //     {label: "AUG", active: true},
        //     {label: "SEP", active: true},
        //     {label: "OCT", active: true},
        //     {label: "NOV", active: true},
        //     {label: "DEC", active: true},]
 			};
			
      this.DayButtons = null;
      this.buildDayGrid();
      //this.buildMonthGrid();
    }
    
    buildMonthGrid()
    {
    	let gridData = this.generateGridData(2, 6, {x: 200, y: 40}, {width: 25, height: 25});
    }
    
    buildDayGrid()
    {
    	// Generate the grid for the day buttons and inject day data.
    	let gridData = this.generateGridData(1, 7, {x: 300, y: 60}, {width: 50, height: 50});
      let gridrow = gridData [0];
      for (let i = 0; i<7; i++){
          let entry = gridrow[i];
          entry.day = this.DaysArray[i];
      }
	
  		// Now we've got the grid's data, build the grid
      let row = this.svg.selectAll(".row")
          .data(gridData)
          .enter().append("g")
          .attr("class","row");
       //
      let sThis = this;
        
      // Buttons // 
      let column = row.selectAll(".square")
          .data(function(d){
              return d;
          })
          .enter().append("rect")
          //.attr("class","square")
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
      let text = row.selectAll(".square")
          .data(function(d){
              return d;
          })
          .enter().append("text")
          .attr("x", function(d) {return d.x; })
          .attr("y", function(d) {return d.y + (d.height / 2) + 5; })
          .text(function(d) {
          	return d.day.label;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "red")
					.on('click', function(d){
            sThis.handleFilterChanges(d);
            sThis.setColorsForDayButtons();
            EventSystem.Instance.RaiseEvent("OnFilterChange", sThis.Filter);
        });
        
        this.DayButtons = row.selectAll("rect");
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
          data.push( new Array() );

          for (let column = 0; column< columnCount; column++){
              data[row].push({
                  x: xpos,
                  y: ypos,
                  width: width,
                  height: height,
                  click: click,
                //  dayIndex: column,
              })

              xpos += width; //imcrement the x pos
          }

          xpos = 10;
          ypos += height;
      }

      return data;
  	}
    
    
}
//////////////////////
//// DAYS////////////
/////////////////////


/*function gridMData(rowCount, columnCount){
  var data = new Array();
  var xpos = 200;
  var ypos =40;
  var width = 25;
  var height = 25;
  var click = 0;

  for (var row = 0; row< rowCount; row++){
    data.push( new Array() );

    for (var column = 0; column< columnCount; column++){
      data[row].push({
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        click: click,
        //  dayIndex: column,
      })

      xpos += width; //imcrement the x pos
    }

    xpos = 10;
    ypos += height;
  }

  return data;
}
*/




 
//function onclick(d)
//{
//    let label = d.dayData.label;
//    for (let i = 0; i < this.filter.Days.length; i++ )
//    {
//        let  dayEntry = this.filter.Days[i];
//        if (label == dayEntry.label)
//        {
//            dayEntry.active = !dayEntry.active;
//            EventSystem.Instance.RaiseEvent("OnFilterChange", this.filter)
//            NotifyFilterUpdate();
//            break;
//        }
//    }
//    console.error("error!");
//};




/////////       /////////////////////////
///////     MONTHS      /////////
//////////////////////////////////


/*
let MonthsArray = [
        {label: "JAN" },
        {label: "FEB" },
        {label: "MAR" },
        {label: "APRIL"},
        {label: "MAY" },
        {label: "JUNE" },
        {label: "JULY" },
        {label: "AUG" },
        {label: "SEP" },
        {label: "OCT" },
        {label: "NOV" },
        {label: "DEC" },
];



var gridMData = gridMData(1, 12);
    let gridMrow = gridMData [0];
    for (let i = 0; i<12; i++){
        let entry = gridMrow[i];
        entry.day = MonthsArray[i];
    }
    console.log(gridMData);
 
var grid = d3.select("#grid")
    .append("svg")
    .attr("width","1000px")
    .attr("height","250px");
 
var row = grid.selectAll(".row")
    .data(gridMData)
    .enter().append("g")
    .attr("class","row")
 //
var column = row.selectAll(".square")
    .data(function(d){
        return d;
    })
.enter().append("rect")
.attr("class","square")
.attr("x", function(d) {return d.x; })
.attr("y", function(d) {return d.y; })
.attr("width",function(d) {return d.width;})
.attr("height",function(d) {return d.height;})
.style("fill","#fff")
.style("stroke","#222")

.on('click', function(d){
    console.log(d.dayData.MonthsArray.label);
    d.click ++;
    if ((d.click)%4 == 0 ) {d3.select(this).style("fill","#fff");}
    if ((d.click)%4 == 1 ) {d3.select(this).style("fill","#2c93E8");}
    if ((d.click)%4 == 2 ) {d3.select(this).style("fill","#F56C4E");}
    if ((d.click)%4 == 3 ) {d3.select(this).style("fill","#838690");}
})
*/

 
// /////////       /////////////////////////
// ///////     HOURS      /////////
// //////////////////////////////////

// function gridHData(rowCount, columnCount){
//     var data = new Array();
//     var xpos = 200;
//     var ypos =40;
//     var width = 25;
//     var height = 25;
//     var click = 0;
 
//     for (var row = 0; row< rowCount; row++){
//         data.push( new Array() );
 
//         for (var column = 0; column< columnCount; column++){
//             data[row].push({
//                 x: xpos,
//                 y: ypos,
//                 width: width,
//                 height: height,
//                 click: click,
//               //  dayIndex: column,
//             })
         
//             xpos += width; //imcrement the x pos
//         }
 
//         xpos = 10;
//         ypos += height;
//     }
 
//     return data;
// }

// let HOURSArray = [
//         {label: "1" },
//         {label: "2" },
//         {label: "3" },
//         {label: "4"},
//         {label: "5" },
//         {label: "6" },
//         {label: "7" },
//         {label: "8" },
//         {label: "9" },
//         {label: "10" },
//         {label: "11" },
//         {label: "12" },
// ];



// var gridMData = gridMData(1, 12);
//     let gridMrow = gridMData [0];
//     for (let i = 0; i<12; i++){
//         let entry = gridMrow[i];
//         entry.day = MonthsArray[i];
//     }
//     console.log(gridMData);
 
// var grid = d3.select("#grid")
//     .append("svg")
//     .attr("width","1000px")
//     .attr("height","250px");
 
// var row = grid.selectAll(".row")
//     .data(gridMData)
//     .enter().append("g")
//     .attr("class","row")
//  //
// var column = row.selectAll(".square")
//     .data(function(d){
//         return d;
//     })
// .enter().append("rect")
// .attr("class","square")
// .attr("x", function(d) {return d.x; })
// .attr("y", function(d) {return d.y; })
// .attr("width",function(d) {return d.width;})
// .attr("height",function(d) {return d.height;})
// .style("fill","#fff")
// .style("stroke","#222")

// .on('click', function(d){
//     console.log(d.dayData.MonthsArray.label);
//     d.click ++;
//     if ((d.click)%4 == 0 ) {d3.select(this).style("fill","#fff");}
//     if ((d.click)%4 == 1 ) {d3.select(this).style("fill","#2c93E8");}
//     if ((d.click)%4 == 2 ) {d3.select(this).style("fill","#F56C4E");}
//     if ((d.click)%4 == 3 ) {d3.select(this).style("fill","#838690");}
// })







 



/*    
var square = svg.append("rect")
    .attr("height", 50)
    .attr("width", 50)
    .attr("x", 10)
    .attr("x", 10)
    .attr("fill", "orange")
    .on("mousedown", mouseDown)
    .on("mouseup", mouseUp)
    .on("click", mouseClick);
 
function mouseDown(){
    console.log("mouseDown");
}
 
function mouseUp(){
    console.log("mouseup");
}
 
function mouseClick(){
    console.log("mouseClick");
}




*/