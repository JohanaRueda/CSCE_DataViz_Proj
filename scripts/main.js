var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = 600;

//cursor move in order to allow interactivity
var svg = d3.select("#chartDiv")
    .append("svg")
    .style("cursor", "move");
svg.attr("viewBox", "50 10 " + (width) + " " + (height))
    .attr("preserveAspectRatio", "xMinYMin");
//group element
var map = svg.append("g")
    .attr("class", "map");
//queue up multimple tasks, and await takes in place
d3.queue()
    .defer(d3.json, "data/50m.json")
    .defer(d3.json, "data/house_rep.json")
    .await(function (error, world, data) {
        if (error) {
            console.error('Oh man, something went wrong: ' + error);
        }
        else {
            drawMap(world, data);
        }
    });

function drawMap(world, data) {
    var projection = d3.geoMercator() //d3.geoOrthographic()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    // Actually drawing the lines
    var path = d3.geoPath().projection(projection);
    var features = topojson.feature(world, world.objects.countries).features;

    //population data
    //data.forEach(function (d) {
    //     populationById[d.country] = {
    //         total: +d.total,
    //         females: +d.females,
    //         males: +d.males
    //     }
    // });
    // features.forEach(function (d) {
    //     d.details = populationById[d.properties.name] ? populationById[d.properties.name] : {};
    // });

    map.append("g")
        .selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("name", function (d) {
            return d.properties.name;
        })
        .attr("id", function (d) {
            return d.id;
        })
        .attr("d", path)
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1.25)
                .style("cursor", "pointer")
                .style("fill","#FF1493");

            d3.select(".country")
                .text(d.properties.name);
                console.log(d.properties.name)

            d3.select(".drawing")
                 .text("insert drawing");
            //     console.log(d.details.females)

            // d3.select(".males")
            //     .text(d.details && d.details.males && "Male " + d.details.males || "Not available");

            d3.select('.details')
                .style('visibility', "visible")
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25)
                .style("fill","#A9A9A9")

            d3.select('.details')
                .style('visibility', "hidden");
        });
}