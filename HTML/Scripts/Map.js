'use strict';

// For an example of usage of this class, see MapExample.html under the HTML folder.

// Base class for drawing the Texas counties map.
// Constructs the base map once constructed.
class TexasMap
{
	// Constructs a new map using the passed SVG element. It is assumed that
	// the passed SVG element is attached to the passed div.
	constructor(mapSVG, div)
	{
		this.div = div;

		// Setup member variables
		this.countiesMin = {
			x: 99999,
			y: 99999
		};
		this.countiesMax = {
			x: -99999,
			y: -99999
		};
		
		this.toolTip = d3.select("body").append("div")
			.attr("class", "mapToolTip")
			.style("opacity", 0);
		this.toolTipOffset = 10; // Offsets tooltip from mouse on x and y.
		this.defaultZoom = 2;
		this.minScrollBorder = 100; // No matter how far you scroll, this many map pixels will always be visible.
		this.geoGenerator = d3.geoPath();
		this.svgWidth = this.div.clientWidth;
		this.svgHeight = this.div.clientHeight;
		
		this.mapSVG = mapSVG;
		this.bgGroup = this.mapSVG.append("g");
		this.mapGroup = this.mapSVG.append("g");
		this.segmentSVGs = []; // These will be populated alongside county data.
		this.dirtySegments = []; // booleans paired to segmentSVGs
		this.allDirty = false;
		this.visualizationRect = null;
		this.savedTransform = null;
		this.baseTranslation = {
			x: 0,
			y: 0
		};
		this.SetupProjection();
		this.CalculateMapBounds();
		this.CenterMap();

		// Functional setup.
		this.SetupCounties();

		EventSystem.Instance.AddListener("OnWindowResize", this, this.HandleResize);
		EventSystem.Instance.AddListener("OnGeoFatalityDataUpdated", this, this.HandleFatalityDataUpdate);
	}

	HandleFatalityDataUpdate()
	{
		this.allDirty = true;
		let features = GeoData.Instance.Features;
		for (let i = 0; i < features.length; i++)
		{
			this.CalculateFillForFeature(features[i]);
		}

		this.RepaintCounties();
	}

	// Callback for handling resize events fired from the main page.
	HandleResize()
	{
		this.svgWidth = this.div.clientWidth;
		this.svgHeight = this.div.clientHeight;

		this.visualizationRect
			.attr("width", this.svgWidth)
			.attr("height", this.svgHeight)

		// If the transform has changed from dragging or zooming, maintain the
		// correct positioning.  If it's null, it hasn't been changed and doesn't
		// need to be maintained.
		if (this.savedTransform != null)
		{
			let t = this.savedTransform;
			this.mapGroup.attr("transform", this.ClipTransformToViewSpace(t));
			this.savedTransform = t;
		}
	}

	// Returns the SVG element used for this map.
	get SVG()
	{
		return this.mapSVG;
	}

	// Calculates the pixel bounds of the map based on our projection's zoom level.
	// Used to control pan extents later.
	CalculateMapBounds()
	{
		for (let i = 0; i < GeoData.Instance.Features.length; i++)
		{
			let feature = GeoData.Instance.Features[i];
			let bounds = this.geoGenerator.bounds(feature);

			this.countiesMin.x = Math.min(this.countiesMin.x, bounds[0][0]);
			this.countiesMax.x = Math.max(this.countiesMax.x, bounds[1][0]);

			this.countiesMin.y = Math.min(this.countiesMin.y, bounds[0][1]);
			this.countiesMax.y = Math.max(this.countiesMax.y, bounds[1][1]);
		}
	}

	// Centers the map of texas in the main svg.
	// Also records base translation values that are fed to the d3 zoom
	// handler later when the counties are set up.
	CenterMap()
	{
		let countiesXCenter = (this.countiesMax.x - this.countiesMin.x) / 2.0;
		let countiesYCenter = (this.countiesMax.y - this.countiesMin.y) / 2.0;

		let svgXCenter = (this.svgWidth) / 2.0;
		let svgYCenter = (this.svgHeight) / 2.0;

		let xTranslate = svgXCenter - this.countiesMin.x - countiesXCenter;
		let yTranslate = svgYCenter - this.countiesMin.y - countiesYCenter;

		this.mapGroup.attr("transform", "translate(" + xTranslate + "," + yTranslate + ")");
		this.baseTranslation.x = xTranslate;
		this.baseTranslation.y = yTranslate;
	}

	// overrides are kludges to fix a weird issue we're getting where
	// the bottom of the map is cut off when the page loads on certain
	// resolutions.  Seems to be happening because the svg for the map
	// isn't centered on the map itself, so part of the map is drawing
	// off of the svg.
	AppendSVGToElement(element, overrideWidth, overrideHeight)
	{
		if (overrideWidth == null)
		{
			overrideWidth = this.svgWidth;
		}

		if (overrideHeight == null)
		{
			overrideHeight = this.svgHeight;
		}

		return element.append("svg")
			.attr("width", overrideWidth)
			.attr("height", overrideHeight);
	}

	// Takes a transform and clips it's translation to the svg's viewing space.
	ClipTransformToViewSpace(t)
	{
		// For some reason, t.k is the current scale value.
		t.x = Math.max(t.x, (-this.countiesMax.x * t.k) + this.minScrollBorder);
		t.y = Math.max(t.y, (-this.countiesMax.y * t.k) + this.minScrollBorder);
		
		t.x = Math.min(t.x, this.svgWidth - (this.countiesMin.x * t.k) - this.minScrollBorder);
		t.y = Math.min(t.y, this.svgHeight - (this.countiesMin.y * t.k) - this.minScrollBorder);
		return t;
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
			.scale([this.defaultZoom * 1000]);
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
		// Cache local 'this' so it can be used in callback functions.
		let sThis = this;

		// Probably temporary, but this rect is added to the layer behind the map
		// to give a visual indicator of where the bounds of the svg element are.
		// Pan bounds feel incredibly arbitrary without this visual.
		this.visualizationRect = this.bgGroup.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", this.svgWidth)
			.attr("height", this.svgHeight)
			.style("stroke", 'black')
			.style("stroke-width", 4)
			.style("opacity", 0.1);
			
		// Generate the paths.
		for (let i = 0; i < GeoData.Instance.SegmentedData.length; i++)
		{
			let segment = GeoData.Instance.SegmentedData[i];
			if (this.segmentSVGs.length <= i)
			{
				this.segmentSVGs.push(this.AppendSVGToElement(this.mapGroup, 2048, 2048));
				this.dirtySegments.push(false);
			}

			// Insert fill data based on fatality information.
			for (let j = 0; j < segment.length; j++)
			{
				let feature = segment[j];
				this.CalculateFillForFeature(feature);
			}

			let svg = this.segmentSVGs[i];
			svg.selectAll("path")
				.data(segment)
				.enter()
				.append("path")
				.attr("d", this.geoGenerator)
				.attr("fill", function(d) {
					if (d.mapData.fill)
					{
						return d3.rgb(d.mapData.fill * 255, 0, 0);
					}
					
					return d3.rgb(0, 0, 0);
				})
				.on("mouseover", function(d) {
					let tooltip = "<b>" + d.properties.COUNTY + "</b>";
					if (d.fatalityData == null)
					{
						tooltip += "<br><br>No data available.";
					}
					else
					{
					tooltip += "<br><br>Fatalities: " + d.fatalityData.Deaths +
						"\nAccidents: " + d.fatalityData.Accidents.length;
					}
					sThis.toolTip.transition().duration(200).style("opacity", .9);
					sThis.toolTip.html(tooltip)
						.style("left", (d3.event.pageX + sThis.toolTipOffset) + "px")
						.style("top", (d3.event.pageY + sThis.toolTipOffset) + "px");
				})
				.on("mouseout", function(d) {
					sThis.toolTip.transition().duration(400).style("opacity", 0);
				});
		}

		// the zoom callback uses a lambda function to call HandleTransform so we
		// can get the correct 'this' into the HandleTransform call.
		let zoomHandler = d3.zoom().on("zoom", function(d) {
			sThis.HandleTransform();
		});
		this.mapSVG.call(zoomHandler
							.scaleExtent([1, 10])
							)
					.call(zoomHandler.transform, d3.zoomIdentity.translate(this.baseTranslation.x,this.baseTranslation.y));

		EventSystem.Instance.AddListener("OnFatalityDataUpdated", this, this.HandleFatalityDataUpdate);
	}

	CalculateFillForFeature(feature)
	{
		if (feature.mapData == null)
		{
			feature.mapData = {};
		}

		feature.mapData.fill = 0.0;

		let data = feature.fatalityData;
		if (data == undefined)
		{
			feature.mapData.fill = 0.0;
			return;
		}
		
		let featureDeaths = feature.fatalityData.Deaths;
		let upperBound = FatalityData.Instance.MaxDeathsByCounty;
		feature.mapData.fill = featureDeaths / upperBound;
		feature.mapData.fill = this.CoerceFillValue(feature.mapData.fill);
	}

	// Takes a fill value between 0 and 1 and coerces it to be larger
	// so that it is visible when displayed.
	CoerceFillValue(fill)
	{
		// If no fatalities, no fill.
		if (fill == 0)
		{
			return 0;
		}

		// Remap fill from 0-1 to 0.15-1
		let minFill = 0.15;
		fill = fill * (1.0 - minFill);
		fill += minFill;
		return fill;
	}

	// Handles transform (translation and scale) for the map when the user
	// pans or zooms.  Zoom extents are managed by the zoom definition, but
	// the translation extents available in d3 are finicky at best and don't
	// provide as much control as I would like, so those are managed
	// internall in this function instead.
	HandleTransform()
	{
		let t = d3.event.transform;
		this.mapGroup.attr("transform", this.ClipTransformToViewSpace(t));

		// Transform is saved off once it has been altered.  For some reason,
		// the function that allows users to query transform data from svg group
		// elements was removed in this version of d3 and no other function was
		// introduced to replace it.  As a result, we just save away the changes
		// manually.
		// This value will be null until the user drags or zooms the map for the
		// first time.
		this.savedTransform = t;
	}

	// Refreshes data drawn in the counties and repaints the map.
	// This should be called whenever the county data is changed 
	// in a way that affects what the map looks like.
	RepaintCounties()
	{
		for (let i = 0; i < GeoData.Instance.SegmentedData.length; i++)
		{
			if (!this.allDirty && !this.dirtySegments[i])
			{
				continue;
			}

			let segment = GeoData.Instance.SegmentedData[i];
			if (this.segmentSVGs.length <= i)
			{
				this.segmentSVGs.push(this.AppendSVGToElement(this.mapGroup));
			}

			let svg = this.segmentSVGs[i];
			svg.selectAll("path")
				.attr("fill", function(d) {
					if (d.mapData.fill)
					{
						return d3.rgb(d.mapData.fill * 255, 0, 0);
					}
					
					return d3.rgb(0, 0, 0);
				})
			
			this.dirtySegments[i] = false;
		}

		this.allDirty = false;
	}
}