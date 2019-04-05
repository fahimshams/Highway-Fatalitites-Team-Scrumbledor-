var data = [{ group: 1, x: 5.5, y: 0 }, { group: 1, x: 0, y: 6 }, { group: 1, x: 7.5, y: 8 }, { group: 2, x: 4.5, y: 4 }, { group: 2, x: 4.5, y: 2 }, { group: 3, x: 4, y: 4 }];

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);
  

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
// Coerce the strings to numbers.
data.forEach(function(d) {
  d.x = +d.x;
  d.y = +d.y;
});

// Compute the scales’ domains.
x.domain(d3.extent(data, function(d) { return d.x; })).nice();
y.domain(d3.extent(data, function(d) { return d.y; })).nice();


// Add the x-axis.
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.svg.axis().scale(x).orient("bottom"));

// Add the y-axis.
svg.append("g")
  .attr("class", "y axis")
  .call(d3.svg.axis().scale(y).orient("left"));

// Get a subset of the data based on the group
function getFilteredData(data, group) {
	return data.filter(function(point) { return point.group === parseInt(group); });
}

// Helper function to add new points to our data
function enterPoints(data) {
  // Add the points!
  svg.selectAll(".point")
    .data(data)
    .enter().append("path")
    .attr("class", "point")
    .attr('fill', 'red')
    .attr("d", d3.svg.symbol().type("triangle-up"))
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
}

function exitPoints(data) {
  svg.selectAll(".point")
      .data(data)
      .exit()
      .remove();
}

function updatePoints(data) {
  svg.selectAll(".point")
      .data(data)
      .transition()
	  .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
}

// New select element for allowing the user to select a group!
var $groupSelector = document.querySelector('.group-select');
var groupData = getFilteredData(data, $groupSelector.value);

// Enter initial points filtered by default select value set in HTML
enterPoints(groupData);

$groupSelector.onchange = function(e) {
  var group = e.target.value;
  var groupData = getFilteredData(data, group);

  updatePoints(groupData);
  enterPoints(groupData);
  exitPoints(groupData);

};