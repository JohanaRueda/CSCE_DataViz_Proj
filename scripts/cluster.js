var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height=Math.max(document.documentElement.clientHeight, window.innerHeight || 0);



var padding = 1.5, // separation between same-color nodes
    clusterPadding = 50, // separation between different-color nodes
    maxRadius = 12;

var color = d3.scaleBand()
      .range(["red", "blue","yellow","green","orange","pink","purple"]);



d3.text("data/house_cluster.csv", function(error, text) {
  if (error) throw error;
  var colNames = "text,size,group\n" + text;
  var data = d3.csvParse(colNames);

  data.forEach(function(d) {
    d.size = +d.size;
  });


//unique cluster/group id's
var cs = [];
data.forEach(function(d){
        if(!cs.contains(d.group)) {
            cs.push(d.group);
        }
});

var n = data.length, // total number of nodes
    m = cs.length; // number of distinct clusters

//create clusters and nodes
var clusters = new Array(m);
var nodes = [];
for (var i = 0; i<n; i++){
    nodes.push(create_nodes(data,i));
}

var force = d3.forceSimulation()
    .nodes(nodes)
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#clusteringdiv").append("svg")
    .attr("width", width)
    .attr("height", height);


var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("g").call(force.drag);


node.append("circle")
    .style("fill", function (d) {
    return color(d.cluster);
    })
    .attr("r", function(d){return d.radius})
    

node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.text.substring(0, d.radius / 3); });




function create_nodes(data,node_counter) {
  var i = cs.indexOf(data[node_counter].group),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = {
        cluster: i,
        //radius: data[node_counter].size*1.5,
        radius: 50,
        text: data[node_counter].text,
        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
      };
  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  return d;
};



function tick(e) {
    node.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
    .attr("transform", function (d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    })

}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
    return function (d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
    };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}
});

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};
