var drawingWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var drawingHeight= 300;
var margin = { top: 10, right: 10, bottom: 100, left: 50 };
var xAxisLabelHeader = "X Header";
var yAxisLabelHeader = "Y Header";
var data;
var canvas;
var chartWidth;
var chartHeight;

init();

function init() {
	chartWidth = drawingWidth - margin.left - margin.right;
	chartHeight = drawingHeight - margin.top - margin.bottom;
    // load data from json
	d3.json("./data/us_apple.json", function(error, json) {
		if (error) {
			return console.warn(error);
		} else {
			data = json;
			console.log("JSON loaded");
			initializeCanvas();
		}
	});
}//end init

function initializeCanvas() {

    canvas= d3.select("#drawDiv")
        .append("svg")
        .attr("width", drawingWidth)
        .attr("height", drawingHeight);
    canvas.plotArea = canvas.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

	



   