'use strict';

// To use this file, add a script src tag to the html page that references
// it and then construct a new map with the dimensions you want to use
// (I used 1280 by 1024 for testing).
// Ex:
// If your file structure has Index.html at the top level and this file in
// a folder named 'Scripts' in the same folder as Index.html, you would do this
// in Index.html:
// 
// <script src="Scripts/Map.js"></script>
// <script>
// 		var myMap = new Map(1280, 1024);
// </script>
// 
// It's worth noting as well that, at the very least, you must have a <body> tag
// defined in your html page.  The SVG will be automatically appended if one isn't
// found.

// Base class for drawing the Texas counties map.
// Constructs the base map once constructed.
class Map
{
	// Constructs a new map with an SVG element of the size specified.
	// Note that, right now, this will use the first SVG element it can find
	// in the main page.  If none is found, a new one will be appended
	// to the body tag.  If no body is found, this will fail.
	constructor(svgWidth, svgHeight)
	{
		// Setup member variables
		this.counties = {};
		this.countiesMap = {};
		this.countiesRead = false;
		this.path = d3.geo.path();
		this.mapSVG = d3.select("svg");
		if (this.mapSVG == '')
		{
			this.mapSVG = d3.select("body").append("svg");
		}

		this.mapSVG.attr("width", svgWidth)
			.attr("height", svgHeight);
		
		this.SetupProjection();

		// Functional setup.
		this.SetupCounties();
	}

	// Returns the raw counties object detailing
	// county data.
	get Counties()
	{
		return this.counties;
	}

	// Returns the SVG element used for this map.
	get SVG()
	{
		return this.mapSVG;
	}

	// Gets a county by name.  If that county cannot be found in the
	// county data, an error is printed and an empty table is returned.
	GetCounty(countyName)
	{
		let county = this.countiesMap[countyName];
		if (county == null)
		{
			console.error("[Map::GetCounty] Tried to get county named: \"" + countyName 
				+ "\", but no data has been stored for that county.");
				return {};
		}

		return county;
	}

	// Sets up whatever type of projection we want to use.
	// Also sets the base zoom level.  Base zoom in D3 is 
	// 1000, so 2000 is a 2x zoom.
	SetupProjection()
	{
		let projection = d3.geo.albersUsa()
				.scale([2000]);
		this.path = d3.geo.path()
			.projection(projection);
	}
	
	// Parses the county data via d3 callbacks and generates the path
	// elements for the svg.  Once this is called, the map will begin
	// drawing as soon as the callback is finished.
	// Calls OnCountiesLoaded once loading is complete.
	SetupCounties()
	{
		// 'this' is used in javascript to refer to the instance of
		// a particular class a function is currently acting on.
		// The 'this' value isn't passed correctly in callbacks, so when
		// d3.json gives us a callback later, we lose our 'this' reference,
		// and all of our member variables with it.
		// By declaring scoped versions of these variables here, the callback
		// can reference the same 'this' that was used to setup the callback
		// to begin with, circumventing the problem.
		let sThis = this;
		let sSVG = this.mapSVG;

		d3.json("geojson/Counties.json", function(json) {
			// Record the counties data in two ways.  The first is just the core json data.
			// This is passed to D3 for rendering.  The second is a map of county names
			// paired with the feature element in the json.  This is so we can access
			// data for specific counties more quickly when needed.
			sThis.counties = json.features;

			// Record counties data in a map.
			for (let i = 0; i < sThis.counties.length; i++)
			{
				let county = sThis.counties[i];
				sThis.countiesMap[county.properties.COUNTY] = county;
			}

			// Generate the paths.
			sSVG.selectAll("path")
				.data(sThis.counties)
				.enter()
				.append("path")
				.attr("d", sThis.path)
				.attr("fill", function(d) {
					if (d.fill)
					{
						return d.fill;
					}
					
					return d3.rgb(0, 0, 0);
				});
				sThis.countiesRead = true;

			// Done loading, fire the loading callback.
			sThis.OnCountiesLoaded();
		});
	}

	// Callback for when county data has finished loading.
	// D3 json parsing is asynchronous, so anything that relies on the map
	// having all of it's county data ready should go here.
	OnCountiesLoaded()
	{
		// This is currently just test code for accessing/redrawing county data.
		console.log("Testing data reloading...");
		this.GetCounty("Tarrant County").fill = d3.rgb(40, 40, 235);
		this.RepaintCounties();
	}

	// Refreshes data drawn in the counties and repaints the map.
	// This should be called whenever the county data is changed 
	// in a way that affects what the map looks like.
	RepaintCounties()
	{
		this.mapSVG.selectAll("path")
			.data(this.counties)
			.attr("d", this.path)
			.attr("fill", function(d) {
				if (d.fill)
				{
					return d.fill;
				}
				
				return d3.rgb(0, 0, 0);
			});
	}
}
