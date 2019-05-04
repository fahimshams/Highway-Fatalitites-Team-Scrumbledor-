'use strict'

class Table
{
	constructor(bgSvg, bgDiv, tableDiv, returnButton)
	{
		this.returnButton = returnButton;
		this.visible = true;
		this.bgDiv = bgDiv;
		this.columns = ["COUNTY", "FATALS", "YEAR", "MONTH", "DAY", "DAY_WEEK", "HOUR", "MINUTE"];
		this.tableDiv = tableDiv;
		this.bgSVG = bgSvg;
		
		let sThis = this;
		let zoomHandler = d3.zoom().on("zoom", function(d) {
			sThis.HandleTransform();
		});
		
		this.g = d3.select(this.tableDiv).append("g");
		this.table = this.g.append('table').style("table-layout", "fixed").call(zoomHandler);
		let thead = this.table.append('thead');
		this.tbody = this.table.append('tbody');

		this.ind = 0;
		this.rows = 20;
		this.rowHeight = 20;

		thead.append('tr')
			.selectAll('th')
			.data(this.columns).enter()
			.append('th')
			.attr("width", function(d) { return sThis.GetWidthForCell(d); })
			.text(function(column) { return column; })
			.style("background-color", "lightblue")

		this.SetRows();

		EventSystem.Instance.AddListener("OnWindowResize", this, this.SetSVGDimensions);

		this.bg = this.bgSVG.append("rect")
			.attr("width", this.bgDiv.clientWidth)
			.attr("height", this.bgDiv.clientHeight)
			.attr("fill", "white");


		// Set button position
		d3.select(returnButton)
		.style("top", (((this.rows + 1) * this.rowHeight) + (this.rows * 2) + 2) + "px")
		.on("click", function() {
			sThis.ToggleVisiblity();
		});

		this.Hide();
		EventSystem.Instance.AddListener("OnWindowResize", this, this.HandleResize);
	}

	HandleResize()
	{
		this.bg.attr("width", this.bgDiv.clientWidth)
			.attr("height", this.bgDiv.clientHeight);

		
	}

	HandleTransform(e)
	{
		let t = d3.event.transform;
		if (d3.event.sourceEvent.deltaY != null)
		{
			this.ind += d3.event.sourceEvent.deltaY;
			this.SetRows();
		}
		//this.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	SetRows()
	{
		// Get the slice of data we need.
		let fatalityData = FatalityData.Instance.fullData;
		if (this.ind + this.rows >= fatalityData.length)
		{
			this.ind = fatalityData.length - this.rows;
		}
		else if (this.ind < 0)
		{
			this.ind = 0;
		}
		
		let slice = fatalityData.slice(this.ind, this.ind + this.rows);
		// Delete old rows.
		this.tbody.selectAll("tr").remove();

		// Create new rows.
		let rows = this.tbody.selectAll('tr')
			.data(slice)
			.enter()
			
			.append('tr')
			.style("background-color", "lightgreen")
			.attr("height", this.rowHeight);
			

		let sThis = this;
		let cells = rows.selectAll('td')
			.data(function (row) {
				return sThis.columns.map(function (column) {
					return {column: column, value: row[column]};
				});
			})
			.enter()
			.append('td')
			
			.text(function (d) { return sThis.GetTextForCell(d) });
	}

	GetTextForCell(d)
	{
		if (d.column == "COUNTY")
		{
			return FatalityData.Instance.GetCountyByID(d.value);
		}
		else if (d.column == "DAY_WEEK")
		{
			switch (d.value)
			{
				case 1: return "Sunday";
				case 2: return "Monday";
				case 3: return "Teusday";
				case 4: return "Wednesday";
				case 5: return "Thursday";
				case 6: return "Friday";
				case 7: return "Saturday";
				default: return "Unknown";
			}
		}
		else if (d.column == "MONTH")
		{
			switch (d.value)
			{
				case 1: return "January";
				case 2: return "February";
				case 3: return "March";
				case 4: return "April";
				case 5: return "May";
				case 6: return "June";
				case 7: return "July";
				case 8: return "August";
				case 9: return "September";
				case 10: return "October";
				case 11: return "November";
				case 12: return "December";
				default: return "Unknown";
			}
		}

		return d.value;
	}

	GetWidthForCell(columnName)
	{
		if (columnName == "COUNTY")
		{
			return 100;
		}
		else if (columnName == "MONTH")
		{
			return 75;
		}
		return 50;
	}

	SetSVGDimensions()
	{
		// this.svg.attr("width", this.div.clientWidth)
		// 	.attr("height", this.div.clientHeight);
	}

	Hide()
	{
		if (!this.visible)
		{
			return;
		}

		this.visible = false;
		d3.select(this.bgDiv).style("opacity", 0).style("pointer-events", "none");
		d3.select(this.tableDiv).style("opacity", 0).style("pointer-events", "none");
		
	}

	Show()
	{
		if (this.visible)
		{
			return;
		}

		this.visible = true;
		d3.select(this.bgDiv).style("opacity", 1).style("pointer-events", "all");
		d3.select(this.tableDiv).style("opacity", 1).style("pointer-events", "all");
	}
	
	ToggleVisiblity()
	{
		if (this.visible)
		{
			this.Hide();
		}
		else
		{
			this.Show();
		}
	}
}