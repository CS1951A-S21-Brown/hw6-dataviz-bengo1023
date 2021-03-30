// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

let g1_filenames = ["./data/netflix.csv", "./data/movies.csv", "./data/tv.csv"];

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 625;
let year1 = 1942;
let year2 = 2020;

let slider = new Slider('#year_range', {});

let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

slider.on("slideStop", function(range) {
    year1 = range[0];
    year2 = range[1];
    g2_setData(year1,year2);
});

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Create a linear scale for the x axis (count)
let g1_x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

    // Create a scale band for the y axis (genre)
let g1_y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability
// Set up reference to count SVG group
let countRef = svg.append("g");
// Set up reference to y axis label to update text in setData
let g1_y_axis_label = svg.append("g");

// TODO: Add x-axis label
svg.append("text")
        .attr("transform", `translate(${graph_1_width/2 - margin.right -30},${graph_1_height - margin.top/2 - margin.bottom})`)     // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Count");

// TODO: Add y-axis label
g1_y_axis_text = svg.append("text")
        .attr("transform", `translate(${-1*margin.right -35}, ${graph_1_height/2 - margin.top})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Genre");

// TODO: Add chart title
let g1_title = svg.append("text")
    .attr("transform", `translate(${graph_1_width/2 - margin.left},${-margin.top/2})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

function g1_setData(index, attr) {

	d3.csv(g1_filenames[index]).then(function(data) {
		data = g1_cleanData(data, function(a,b) {return parseInt(b[1]) - parseInt(a[1])}, NUM_EXAMPLES);
		console.log(data);

		g1_x.domain([0,d3.max(data, function(d) {return parseInt(d[1]);})])

	    g1_y.domain(data.map(function(d) {return d[0]}))

	    // Add y-axis label
	    g1_y_axis_label.call(d3.axisLeft(g1_y).tickSize(0).tickPadding(10));

	    let bars = svg.selectAll("rect").data(data);

	    let color = d3.scaleOrdinal()
	        .domain(data.map(function(d) { return d[0] }))
	        .range(d3.quantize(d3.interpolateHcl("#f05d93", "#098EC9"), NUM_EXAMPLES));

	    bars.enter()
	        .append("rect")
	        .merge(bars)
	        .transition()
            .duration(1000)
	        .attr("fill", function(d) { return color(d[0]) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
	        .attr("x", g1_x(0))
	        .attr("y", function(d) {return g1_y(d[0]);})               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
	        .attr("width", function(d) {return g1_x(parseInt(d[1]));})
	        .attr("height",  g1_y.bandwidth());    

	    let counts = countRef.selectAll("text").data(data);

	    counts.enter()
	        .append("text")
	        .merge(counts)
	        .transition()
            .duration(1000)
	        .attr("x", function(d) {return g1_x(d[1]) + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
	        .attr("y", function(d) {return g1_y(d[0]) + 10})       // HINT: Add a small offset to the top edge of the bar, found by 
	        .style("text-anchor", "start")
	        .text(function(d) {return d[1]});

	    // TODO: Add chart title
	    g1_title.text("Top 10 " + attr + " Genres on Netflix");
	    // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
	});
}


function g1_cleanData(data, comparator, NUM_EXAMPLES) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
	const result1 = data.map(function(d) {return d["listed_in"]})
	.reduce(function(count, item) {
	  genres = item.split(", ");
	  for (i = 0; i < genres.length; i++) {
	  	genre = genres[i];
      	if( count[genre] === undefined ) {    
        	count[genre] = 1;
      	}
      	else {
        	count[genre] ++;
      	}
      }
      return count;
    }, {})

    const genre_list = Object.keys(result1);

    const result2 = genre_list.map(function(genre) {return [genre,result1[genre]]});

	const result3 = result2.sort(comparator).slice(0, NUM_EXAMPLES);

	return result3;
}


let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Create a linear scale for the x axis (count)
let g2_x = d3.scaleBand()
    .range([0, graph_2_width - margin.left - margin.right])
    .padding(0.1);// Improves readability

    // Create a scale band for the y axis (genre)
let g2_y = d3.scaleLinear()
    .range([0, graph_2_height - margin.top - margin.bottom]);
// Set up reference to count SVG group
let countRef2 = svg2.append("g");
// Set up reference to x and y axis labels to update text in setData
let g2_y_axis_label = svg2.append("g");
let g2_x_axis_label = svg2.append("g");

let lines = svg2.attr("class", "lines");

// TODO: Add x-axis label
svg2.append("text")
        .attr("transform", `translate(${graph_2_width/2 - margin.right - 30},${graph_2_height - margin.top - margin.bottom + 40})`)     // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Year");

// TODO: Add y-axis label
g2_y_axis_text = svg2.append("text")
        .attr("transform", `translate(${-1*margin.right -5}, ${graph_2_height/2 - margin.top})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Average Runtime (min)");

// TODO: Add chart title
let g2_title = svg2.append("text")
    .attr("transform", `translate(${graph_2_width/2 - margin.left},${-margin.top/2})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

function g2_setData(y1,y2) {
	d3.csv("./data/movies.csv").then(function(data) {
    data = g2_getData(data, y1, y2);
		//console.log(data);

		g2_x.domain(data.map(function(d) {return d[0]}))
    g2_y.domain([d3.max(data, function(d) {return parseInt(d[1]);}),0])


    let durations = data.map(function(d) {return parseInt(d[1])});
    //console.log(durations);
    let quartiles = jStat.quartiles(durations);
    //console.log(quartiles);

    // Add y-axis label
    g2_y_axis_label.call(d3.axisLeft(g2_y).tickSize(5).tickSizeOuter(0).tickPadding(10));

    // Add x-axis label
    g2_x_axis_label.call(d3.axisBottom(g2_x).tickValues(g2_x.domain().filter(function(d) {
    return !(d % 5);})).tickSize(5).tickSizeOuter(0).tickPadding(5))
      .attr("transform",`translate(${0},${graph_2_height - margin.bottom - margin.top})`);

    let bars = svg2.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d[0] }))
        .range(d3.quantize(d3.interpolateHcl("#098EC9","#f05d93"), (y2-y1+1)));

    let color2 = d3.scaleOrdinal()
        .domain(quartiles)
        .range(d3.quantize(d3.interpolateHcl("#098EC9","#f05d93"), 3));

    let lns = svg2.selectAll('.lines').data(quartiles)

    lns.enter()
        .append("line")
        .attr("class", "lines")
        .merge(lns)
        .transition()
          .duration(1000)
        .style("stroke", function(d) {return color2(d)})
        .style("stroke-width", "2")
        .attr("x1", 0)
        .attr("x2", graph_2_width - margin.right - margin.left)
        .attr("y1", function(d) {return g2_y(d)})
        .attr("y2", function(d) {return g2_y(d)})

    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
          .duration(1000)
        .attr("fill", function(d) {return color(d[0]) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("y", function(d) {return g2_y(parseInt(d[1]));})          
        .attr("x", function(d) {return g2_x(d[0]);})// HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("height", function(d) {return graph_2_height - margin.bottom - margin.top - g2_y(parseInt(d[1]));})
        .attr("width", g2_x.bandwidth());

    let counts = countRef2.selectAll("text").data(data);

    // TODO: Add chart title
    g2_title.text("Average Runtime of Movies on Netflix from " + y1 + " to "+ y2);
    
    lns.exit().remove();
    bars.exit().remove();
    counts.exit().remove();
	});
}


function g2_getData(data, y1, y2) {
	const result0 = data.map(function(d) {return [d["release_year"],d["duration"]]})
	const result1 = result0.reduce(function(lengths, year) {
      	let y = parseInt(year[0])
      	if(lengths[y] === undefined) { 
        	if(y >= y1 && y <= y2){
            let d = parseInt(year[1].split(" ")[0]);
            lengths[y] = [d];
        	}
      	}
      	else {
        	if(y >= y1 && y <= y2){
            let d = parseInt(year[1].split(" ")[0]);
            lengths[y] = lengths[y].concat([d]);
        	}
      	}
      return lengths;
    }, {})

    const num_years = y2-y1;
    const years = Object.keys([...Array(num_years)]).map(
    	function(x) {return(parseInt(x))}).map(
    	function(x) {return(x+y1)});
    //console.log(years);

    let year_list = []

    for (i = 0; i < num_years+1; i++){
      if (result1[i+y1] === undefined){
    		year_list[i] = [i+y1, [0]];
    	}
      else {
        year_list[i] = [i+y1, result1[i+y1]]
      }
    };

    //console.log(year_list);

    const avgs = year_list.map(
    	function(y) {return [y[0],Math.round(jStat.mean(y[1]))]});
    //console.log(avgs);
	return avgs;
}

/*
function netdata() {
  d3.csv("../data/movies.csv").then(function(data) {
    let years = data.filter(function(d) {return (d["type"] == "Movie")})
      .filter(function(d) {return (d["country"] == "India")})
      .filter(function(d) {return (d["release_year"] <= 2020 && d["release_year"] >= 2018)})

    const casts = years.map(function(d) {return d["cast"]}).map(function(d) {return d.split(", ")});
    const non_solo = casts.filter(function(d) {return !(d.length == 1)})
    //console.log(non_solo);
    //return non_solo;
    const p = {};
    const a = new Set(); //all actors in graph set

    for (i = 0; i < casts.length; i++) {
      let cast = casts[i];
      for (j = 0; j < cast.length-1; j++) {
        for (k = j+1; k < cast.length; k++) {
          if (p[[cast[j], cast[k]]] === undefined && 
            p[[cast[k], cast[j]]] === undefined){
            p[[cast[j], cast[k]]] = 1;
          }
          a.add(cast[j]);
          a.add(cast[k]);
        }
      }
    }

    //console.log(Array.from(a)); // all actors in graph array

    const p2 = Object.keys(p).map(function(x) {return x.split(",")});
    //console.log(p);
    //console.log(p2);
    const a2 = Array.from(a)
    let a3 = {}
    for (i = 0; i < a2.length; i++) {
      let person = a2[i]
      a3[a2[i]] = {"id": i, "name": a2[i]}
    }

    const p3 = p2.map(function(x) 
      {return {"source": a3[x[0]].id, "target": a3[x[1]].id}})
    
    const nodes = Object.values(a3);
    console.log({"nodes": nodes, "links": p3});
    return {"nodes": nodes, "links": p3};
  })
}
*/

function network(type, place, genre, y1,y2) {
  d3.csv("./data/movies.csv").then(function(data) {
    let years = data.filter(function(d) {return (d["type"] == type)})
      .filter(function(d) {return (d["country"] == place)})
      .filter(function(d) {return (d["listed_in"].split(", ").includes(genre))})
      .filter(function(d) {return (d["release_year"] >= y1 && d["release_year"] <= y2)})

    const casts = years.map(function(d) {return d["cast"]}).map(function(d) {return d.split(", ")});
    const non_solo = casts.filter(function(d) {return !(d.length == 1)})
    //console.log(non_solo);
    //return non_solo;
    const p = {};
    const a = new Set(); //all actors in graph set

    for (i = 0; i < casts.length; i++) {
      let cast = casts[i];
      for (j = 0; j < cast.length-1; j++) {
        for (k = j+1; k < cast.length; k++) {
          if (p[[cast[j], cast[k]]] === undefined && 
            p[[cast[k], cast[j]]] === undefined){
            p[[cast[j], cast[k]]] = 1;
          }
          a.add(cast[j]);
          a.add(cast[k]);
        }
      }
    }

    //console.log(Array.from(a)); // all actors in graph array

    const p2 = Object.keys(p).map(function(x) {return x.split(",")});
    //console.log(p);
    //console.log(p2);
    const a2 = Array.from(a)
    let a3 = {}
    for (i = 0; i < a2.length; i++) {
      let person = a2[i]
      a3[a2[i]] = {"id": i, "name": a2[i]}
    }

    const p3 = p2.map(function(x) 
      {return {"source": a3[x[0]].id, "target": a3[x[1]].id}})
    
    const nodes = Object.values(a3);
    let ndata = {"nodes": nodes, "links": p3};

    console.log(ndata);
    console.log(ndata.nodes);
    let actors = ndata.nodes;
    let edges = ndata.links;

    let forces = d3.forceSimulation(actors)
    .force("link", d3.forceLink(edges).distance(30).id(function(x) {return x.id}))
    .force("charge", d3.forceManyBody().strength(-15))
    .force("center", d3.forceCenter(graph_3_width/2-margin.left, graph_3_height/2 -margin.bottom))
    .force('x', d3.forceX(graph_3_width/2).strength(.04))
    .force('y', d3.forceY(graph_3_height/2).strength(.04))


    let svg3 = d3.select("#graph3")
      .append("svg")
      .attr("width", graph_3_width)     // HINT: width
      .attr("height", graph_3_height)     // HINT: height
      .append("g")
      .attr("transform",`translate(${margin.left},${margin.top*2})`);

    let g3_title = svg3.append("text")
      .attr("transform", `translate(${graph_3_width/2 - margin.left},${-margin.top})`)       // HINT: Place this at the top middle edge of the graph
      .style("text-anchor", "middle")
      .style("font-size", 15)
      .text(type + " Actor Collaborations in " +genre+" from "+ place+ " on Netflix released between " +y1+" and " + y2);


    let edge = svg3.append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(edges)
      .enter().append("line")
      .attr("stroke", "#9aa1a1")
      .attr("stroke-width", 1);
      
    svg3.merge(edge);

    //console.log(edge);

    let actor = svg3.append("g")
      .attr("class", "actor")
      .selectAll("circle")
      .data(actors)
      .enter().append("circle")
      .attr("r", 4)
      .attr("name", function(d) {return d.name})
      .attr("fill", "#098EC9")
      .attr("stroke", "#f05d93")
      .attr("stroke-width", 1)

      actor.on("mouseover", function(a) {show_tool(a)})
        .on("mouseout", function(a) {hide_tool(a)});

      svg3.merge(actor);



    forces.force("link").links(edges);

    //console.log(actor);

    forces.on("tick", event => {
      edge.attr("x1", function(e) {return e.source.x})
        .attr("y1", function(e) {return e.source.y})
        .attr("x2", function(e) {return e.target.x})
        .attr("y2", function(e) {return e.target.y})
      actor.attr("cx", function(a) {return Math.max(a.x,Math.min(graph_3_width, a.x))})
        .attr("cy", function(a) {return Math.max(a.y,Math.min(graph_3_height, a.y))})
      });

    return svg3.actor;
  })
}


let show_tool= function(a) {
  console.log(1);
  let name = `${a.name}`;

  tooltip.html(name)
        .style("left", `${(d3.event.pageX) + 10}px`)
        .style("top", `${(d3.event.pageY) - 30}px`)
        .style("width", `80px`)
        .style("height", `50px`)
        .style("background-color", `#D8DEDE`)
        .style("box-shadow", `2px 2px 5px #f05d93`)
        .transition()
        .duration(200)
        .style("opacity", .9);
}

let hide_tool= function(a) {
  let name = `${a.name}`;

  tooltip.html(name)
        .style("left", `${-200}px`)
        .style("top", `${-200}px`)
        .transition()
        .duration(200)
        .style("opacity", 0);
}


// On page load, render the graphs

//(a,b) index of file name and name of format
g1_setData(0, "");

//(y1,y2) years over which avg movie runtime is displayed
g2_setData(year1, year2);

//(type, place, genre, y1,y2) type - format, place - country,
//genre - genre, y1 - start of year range, y2 - end of year range
network("Movie", "India", "Independent Movies", 2018,2020)
