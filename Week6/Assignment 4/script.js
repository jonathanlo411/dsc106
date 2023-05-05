const assignment4 = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Initialize dataset with letters A-E
  const dataset = Array.from({ length: 5 }, (_, i) => ({
    x: alphabet[i],
    y: Math.floor(Math.random() * 20) + 1,
  }));
  console.log(dataset)

  // set variables, axes, scales here
  const height = 300;
  const width = 600;
  const padding = 40;
  var svg = d3.select("svg")
  svg.attr("width", width)
    .attr("height", height)
    .style("display", "block")

  let xScale = d3.scaleBand()
    .domain(dataset.map(d => d.x))
    .range([padding, width - padding])
    .padding(0.1)
  let yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([height - padding, padding])
  let bars = svg.selectAll(".bar")
    .data(dataset)

  // render bar chart
  const render = () => {
    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.y) - padding)
      .attr("fill", "#abcbe5")
    svg.append("g").call(d3.axisBottom(xScale))
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${height - padding})`)
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("class", "yAxis")
        .attr("transform", `translate(${padding}, 0)`)
  };

  // add bar
  const add = () => {
    // Update Dataset
    let newChar = alphabet[dataset.length]
    let newNum = Math.floor(Math.random() * 20) + 1
    dataset.push({x: newChar, y: newNum})

    // Update Scales
    let xScale = d3.scaleBand()
      .domain(dataset.map(d => d.x))
      .range([padding, width - padding])
      .padding(0.1)
    let yScale = d3.scaleLinear()
      .domain([0, 20])
      .range([height - padding, padding])

    // Redraw
    var bars = svg.selectAll(".bars")
      .data(dataset, function(d){ return d.title});
    bars.exit()
      .transition()
      .duration(1000)
      .attr("height", 0)
      .remove();
    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.y) - padding)
      .attr("fill", "#abcbe5")
      .merge(bars)//and from now on, both the enter and the update selections
      .transition()
      .duration(1000)
      .delay(1000)
      .attr("class", "bar")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.y) - padding)
      .attr("fill", "#abcbe5")
    d3.select(".xAxis")
      .transition()
      .duration(1000)
      .delay(750)
      .call(xScale);
    console.log(dataset)
  };
  document.getElementById("add").addEventListener("click", () => add())

  // remove bar
  const remove = () => {

  };
  document.getElementById("remove").addEventListener("click", () => remove())

  // threshold highlighting
  const threshold = () => {

  };
  
  // calling the functions
  render();
  // add();
  remove();
  threshold();
};
