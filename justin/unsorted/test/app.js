var margin = {top: 10, right: 30, bottom: 60, left: 80},
    width = 1728 - margin.left - margin.right,
    height = 1440 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Load data from data.csv
d3.csv("data.csv").then(function(dataAsset) {

  console.log(dataAsset);

  // // log a list of abbr
  var abbr = dataAsset.map(data => data.abbr);
  console.log("abbr", abbr);

  // log a list of healthcare rates
  var healthcare = dataAsset.map(data => data.healthcare);
  console.log("healthcare", healthcare);

  // log a list of poverty rates
  var poverty = dataAsset.map(data => data.poverty);
  console.log("poverty", poverty);

  // // Cast each healthcare value in dataAsset as a number using the unary + operator, iterate
  // dataAsset.forEach(function(data) {
  //   data.healthcare = +data.healthcare;
  //   console.log("abbr:", data.abbr);
  //   console.log("healthcare:", data.healthcare);
  // });

  var min_poverty = Math.min.apply(null, poverty);
  var max_poverty = Math.max.apply(null, poverty);

  console.log(Math.floor(min_poverty - 1))
  console.log(Math.ceil(max_poverty + 1))
      
  var min_healthcare = Math.min.apply(null, healthcare),
      max_healthcare = Math.max.apply(null, healthcare);

  console.log(Math.floor(min_healthcare - 1))
  console.log(Math.ceil(max_healthcare + 1))
  
  // Add X axis
  var x_range = Array.from({length: (Math.ceil(max_poverty + 1) - Math.floor(min_poverty - 1)) + 1}, (_, i) => i + Math.floor(min_poverty - 1));
  var x_tick_length = x_range.length;
  var x_ticks = [];
  for (var i = 0; i < x_tick_length; i = i + 2) {
    x_ticks.push(x_range[i])
  };
  var x = d3.scaleLinear()
    .domain([x_ticks[0], x_ticks[x_ticks.length-1]])
    .range([0, width]);
  console.log(x);
  var x_axis = d3.axisBottom().scale(x)
    .tickValues(x_ticks)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(x_axis);

  // Add Y axis
  var y_range = Array.from({length: (Math.ceil(max_healthcare + 1) - Math.floor(min_healthcare - 1)) + 1}, (_, i) => i + Math.floor(min_healthcare - 1));
  var y_tick_length = y_range.length;
  var y_ticks = [];
  for (var i = 0; i < y_tick_length; i = i + 2) {
    y_ticks.push(y_range[i])
  };
  var y = d3.scaleLinear()
    .domain([y_ticks[0], y_ticks[y_ticks.length-1]])
    .range([height, 0]);
  console.log(y);
  var y_axis = d3.axisLeft().scale(y)
    .tickValues(y_ticks)
  svg.append("g")
    .call(y_axis);


  var circle_radius = 12;
  var circle_text_size = 7;

  // Create circles
  svg.append("g")
    .selectAll("dot")
    .data(dataAsset)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.poverty))
    .attr("cy", d => y(d.healthcare))
    .attr("r", `${circle_radius}`)
    .style("fill", "#FF8000")
    .style("stroke", "#C4C4C4")
    .style("opacity", ".7")

  svg.append("g")
    .selectAll("circle")
    .data(dataAsset)
    .enter()
    .append("text")
    .attr("x", function(d) {
      return x(d.poverty);
    })
    .attr("y", function(d) {
      return y(d.healthcare) + (circle_text_size/3);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", `${circle_text_size}px`)
    .attr("text-anchor", "middle")
    .attr("fill", "white");
  
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + 40)
    .text("in poverty (%)");

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "start")
    .attr("y", -40)
    .attr("x", -488)
    // .attr("transform",
    //       "translate(0, -40)")
    .attr("transform", "rotate(-90)")
    .text("lacks healthcare (%)");
  // // Add dots
  // svg.append('g')
  //   .selectAll("dot")
  //   .data(dataAsset)
  //   .enter()
  //   .append("circle")
  //     .attr("cx", function (d) { return x(d.poverty); } )
  //     .attr("cy", function (d) { return y(d.healthcare); } )
  //     .attr("r", 8)
  //     .style("fill", "#FF8000")
  //     .style("stroke", "#C4C4C4")
  //     .style("opacity", ".7")
}).catch(function(error) {
  console.log(error);
});