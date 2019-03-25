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
		this.countiesRead = false;
		this.geoGenerator = d3.geoPath();
		this.dragController = d3.drag();
		this.svgWidth = svgWidth;
		this.svgHeight = svgHeight;
		let body = d3.select("body");
		this.mapSVG = this.AppendSVGToElement(body);
		this.segmentSVGs = []; // These will be populated alongside county data.
		this.dirtySegments = []; // booleans paired to segmentSVGs
		this.SetupProjection();

		// Functional setup.
		this.SetupCounties();
	}

	// Returns the SVG element used for this map.
	get SVG()
	{
		return this.mapSVG;
	}

	AppendSVGToElement(element)
	{
		return element.append("svg")
			.attr("width", this.svgWidth)
			.attr("height", this.svgHeight);
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
		let projection = d3.geoAlbersUsa()
			.scale([2000]);
		this.geoGenerator = d3.geoPath()
			.projection(projection);
	}

	ModifySVGSegment(index, data, key, value)
	{
		data[key] = value;
		this.dirtySegments[index] = true;
	}
	
	// Parses the county data via d3 callbacks and generates the path
	// elements for the svg.  Once this is called, the map will begin
	// drawing as soon as the callback is finished.
	// Calls OnCountiesLoaded once loading is complete.
	SetupCounties()
	{
		// Record the counties data in two ways.  The first is just the core json data.
		// This is passed to D3 for rendering.  The second is a map of county names
		// paired with the feature element in the json.  This is so we can access
		// data for specific counties more quickly when needed.
		console.log("Loading data for " + GeoData.Instance.Features.length + " counties.");
		
		// Cache local 'this' so it can be used in callback functions.
		let sThis = this;

		// Generate the paths.
		for (let i = 0; i < GeoData.Instance.SegmentedData.length; i++)
		{
			let segment = GeoData.Instance.SegmentedData[i];
			if (this.segmentSVGs.length <= i)
			{
				this.segmentSVGs.push(this.AppendSVGToElement(this.mapSVG));
				this.dirtySegments.push(false);
			}

			let svg = this.segmentSVGs[i];
			svg.selectAll("path")
				.data(segment)
				.enter()
				.append("path")
				.attr("d", this.geoGenerator)
				.attr("fill", function(d) {
					if (d.fill)
					{
						return d.fill;
					}
					
					return d3.rgb(0, 0, 0);
				})
				.on("mouseover", function(d){
					sThis.ModifySVGSegment(i, d, "fill", d3.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255));
					sThis.RepaintCounties();
				})
				.on("mouseout", function(d){
					sThis.ModifySVGSegment(i, d, "fill", d3.rgb(0, 0, 0));
					sThis.RepaintCounties();
				})
				.on("dragstart", function(d){
					console.log("drag");
				})
		}
		this.countiesRead = true;

		// Done loading, fire the loading callback.
		this.OnCountiesLoaded();
	}

	// Callback for when county data has finished loading.
	// D3 json parsing is asynchronous, so anything that relies on the map
	// having all of it's county data ready should go here.
	OnCountiesLoaded()
	{
	}

	// Refreshes data drawn in the counties and repaints the map.
	// This should be called whenever the county data is changed 
	// in a way that affects what the map looks like.
	RepaintCounties()
	{
		for (let i = 0; i < GeoData.Instance.SegmentedData.length; i++)
		{
			if (!this.dirtySegments[i])
			{
				continue;
			}

			let segment = GeoData.Instance.SegmentedData[i];
			if (this.segmentSVGs.length <= i)
			{
				this.segmentSVGs.push(this.AppendSVGToElement(this.mapSVG));
			}

			let svg = this.segmentSVGs[i];
			svg.selectAll("path")
				.data(segment)
				.attr("d", this.geoGenerator)
				.attr("fill", function(d) {
					if (d.fill)
					{
						return d.fill;
					}
					
					return d3.rgb(0, 0, 0);
				})
		}
	}
}