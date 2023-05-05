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
    let bars = svg.selectAll(".bar")
      .data(dataset)
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

    // Redraw
    var bars = svg.selectAll(".bar")
      .data(dataset, d => d.x);
    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.y) - padding)
      .attr("fill", "#abcbe5")
      .merge(bars)
      .transition()
      .duration(200)
      .attr("class", "bar")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.y) - padding)
      .attr("fill", "#abcbe5");
    d3.select(".xAxis")
      .transition()
      .duration(200)
      .call(d3.axisBottom(xScale));
  };
  document.getElementById("add").addEventListener("click", () => add())

  // remove bar
  const remove = () => {
    // Update Dataset
    dataset.pop()

    // Update Scales
    let xScale = d3.scaleBand()
      .domain(dataset.map(d => d.x))
      .range([padding, width - padding])
      .padding(0.1)

    // Redraw
    var bars = svg.selectAll(".bar")
      .data(dataset, d => d.x);
    bars.join("rect")
      .transition()
      .duration(200)
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.y) - padding)
      .attr("fill", "#abcbe5")
    d3.select(".xAxis")
      .transition()
      .duration(200)
      .call(d3.axisBottom(xScale));
  };
  document.getElementById("remove").addEventListener("click", () => remove())

  // threshold highlighting
  const threshold = () => {
    let val = document.getElementById("thresh-in").value
    var bars = svg.selectAll(".bar")
      .data(dataset, d => d.x);
    bars.join("rect")
      .transition()
      .duration(200)
      .attr("fill", d => (d.y > val) ? "orange" : "grey")
  };
  document.getElementById("submit").addEventListener("click", () => {
    threshold()
  })
  document.getElementById("thresh-in").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      threshold()
    }
  })
  
  // calling the functions
  render();
  // add();S
  // threshold();
};
