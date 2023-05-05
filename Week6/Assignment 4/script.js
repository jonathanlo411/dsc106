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

  // render bar chart
  const render = () => {
    svg.selectAll(".bar")
      .data(dataset).enter().append("rect")
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
    xScale = d3.scaleBand()
      .domain(dataset.map(d => d.x))
      .range([padding, width - padding])
      .padding(0.1)
    yScale = d3.scaleLinear()
      .domain([0, 20])
      .range([height - padding, padding])
    svg.selectAll("g.yScale")
      .call(yScale);
    svg.selectAll("g.xScale")
      .call(xScale);

  };

  // remove bar
  const remove = () => {

  };

  // threshold highlighting
  const threshold = () => {

  };
  
  // calling the functions
  render();
  add();
  remove();
  threshold();
};
