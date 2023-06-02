function assignment6() {
  let filePath = "data_A7.csv";
  question0(filePath);
}

function cleanCSV(d) {
    return {
        Category: d.Category,
        State: d.State,
        Year: +d['Order Date'].slice(-4),
        Profit: Math.abs(+d.Profit),
        Sales: Math.abs(+d.Sales),
        SubCategory: d['Sub-Category']
    }
}

let question0 = function (filePath) {
  //preprocess data
  d3.csv(filePath, cleanCSV).then(function (data) {
    question1(data);
    question2(data);
    question3(); //this uses data.json
    question4(data);
  });
};

const convertInternMapToObject = (internMap, top = false) => {
    const obj = {};
    
    for (const [key, value] of internMap.entries()) {
      if (value instanceof Object) {
        obj[key] = convertInternMapToObject(value); // Recursively convert nested InternMaps
      } else {
        obj[key] = value;
      }
    }
    
    let arr = []
    if (top) {
        for (key in obj) {
            arr.push({group: key, ...obj[key]})
        }
        return arr
    }
    return obj;
  };

let question1 = function (data) {
    const padding = 70;
    const width = 800;
    const height = 500;

    // Create SVG
    let svg = d3.select("#q1_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Filter Data
    let filteredData = d3.filter(data, (d) => d.Category === 'Furniture' && d.Year > 2016)
    let groupedData = d3.rollup(filteredData, v => [
            d3.sum(v, d => d.Profit),
            d3.sum(v, d => d.Sales)
        ], d => d.State)
    let keys = Array.from(groupedData.keys())
    console.log(groupedData)

    // Setup Scales
    let xScale = d3.scaleBand()
        .domain(keys)
        .range([padding, width - padding])
    let yScale = d3.scaleLinear()
        .domain([0, d3.sum(d3.max(groupedData)[1]) + 50000])
        .range([height - padding, padding])

    // Setup area
    const area = d3.area()
        .x(d => xScale(d.data[0]))
        .y0(d => yScale(d.data[1][0]))
        .y1(d => yScale(d.data[1][1]))
    const stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .value((d, key) => d[1][key])
    const stackedData = stack(groupedData)
        
    svg.selectAll("path")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("d", area)
        .attr("fill", (d, i) => console.log(d[i]))
        // .attr("opacity", 0.8);

    svg.append("g").call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height - padding})`);
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("transform", `translate(${padding}, 0)`);

    // Labels and legend
    svg.append("text")
        .attr("x", width/2)
        .attr("y", padding/2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Furniture Profit and Sales by State (>2016)")
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height - padding/4)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("State")
    svg.append("text")
        .attr("x", padding/4)
        .attr("y", height/2)
        .attr("transform", `rotate(-90 , ${padding/4}, ${height/2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Dollars")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - height/4).attr("r", 4).style("fill", "#65b91f")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - height/4 - 20).attr("r", 4).style("fill", "#394f59")
    svg.append("text").attr("x", width-90).attr("y", height-height/4).text("Profits").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-90).attr("y", height-height/4-20).text("Sales").style("font-size", "13px").attr("alignment-baseline","middle")
}

let question2 = function (data) {
    const padding = 70;
    const width = 800 ;
    const height = 500;

    // Create SVG
    let svg = d3.select("#q2_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Filter Data
    let filteredData = d3.filter(data, (d) => d.Category === 'Technology' && d.Year > 2016)
    let groupedData = d3.rollup(filteredData,
            v => d3.sum(v, d => d.Sales),
            d => d.State, d => d.SubCategory
        )
    let keys = Array.from(groupedData.keys())
    let maxVal = d3.sum(d3.max(
        d3.map(groupedData, (dTop) => d3.map(dTop[1], (dBot) => dBot[1]))
    ))
    let flattened = d3.map(groupedData, (d) => d3.map(d[1], (dBot) => dBot[0])).flat()
    let subCategories = Array.from(new Set(flattened))
    groupedData = convertInternMapToObject(groupedData, true)

    // Create Scales
    let xScale = d3.scaleBand()
        .domain(keys)
        .range([padding, width - padding])
        .padding([0.1])
    let yScale = d3.scaleLinear()
        .domain([-10, 50000])
        .range([height - padding, padding])
    let colorScale = d3.scaleOrdinal()
        .domain(subCategories)
        .range(["#65b91f", "#394f59", "#d5daf8", "#e1dbb8"])

    // Create Stack
    let stackedData = d3.stack()
        .keys(subCategories)
        (groupedData)

    // Create plot
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", (d) => colorScale(d.key))
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return xScale(d.data.group); })
        .attr("y", function (d) { return yScale(d[1]); })
        .attr("height", function (d) {
            first = d[0] ? d[0] : 0
            second = d[1] ? d[1] : 0
            if (first > second) return 0
            return Math.abs(yScale(first) - yScale(second)); 
        })
        .attr("width", xScale.bandwidth())
        .attr("data-val", d => d[1])
        .on("mouseover", function (e, d) {
            let box = document.getElementById("tooltip")
            box.style.opacity = 1
            box.style.position = "absolute"
            box.style.backgroundColor = "white"
            box.style.left = e.pageX + 10 + "px"
            box.style.top = e.pageY - 10 + "px"
            box.innerHTML = d3.select(this)._groups[0][0].dataset.val
        })
        .on("mouseout", function (e, d) {
            let box = document.getElementById("tooltip")
            box.style.opacity = 0
            box.innerHTML = ""
        });

    // Axis
    svg.append("g").call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height - padding})`);
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("transform", `translate(${padding}, 0)`);

    // Labels and legend
    svg.append("text")
        .attr("x", width/2)
        .attr("y", padding/2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Technology Sub-Category Sales by State (>2016)")
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height - padding/4)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("State")
    svg.append("text")
        .attr("x", padding/4)
        .attr("y", height/2)
        .attr("transform", `rotate(-90 , ${padding/4}, ${height/2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Sales")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - height/4).attr("r", 4).style("fill", "#65b91f")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - height/4 - 20).attr("r", 4).style("fill", "#394f59")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - height/4 - 40).attr("r", 4).style("fill", "#d5daf8")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - height/4 - 60).attr("r", 4).style("fill", "#e1dbb8")
    svg.append("text").attr("x", width-90).attr("y", height-height/4).text("Phones").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-90).attr("y", height-height/4-20).text("Accessories").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-90).attr("y", height-height/4-40).text("Machines").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-90).attr("y", height-height/4-60).text("Copiers").style("font-size", "13px").attr("alignment-baseline","middle")
};

let question3 = function () {
  
  // Fetch the data from the JSON file
  d3.json('data.json').then(data => {
    const nodes = data.nodes;
    const links = data.links;
  
    // Create the SVG element
    const width = 800;
    const height = 500;
    const svg = d3.select("#q3_plot")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Set up the simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody(100))
      .force("collide", d3.forceCollide(5))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Define the link thickness scale
    const linkScale = d3.scaleLinear()
        .domain(d3.extent(links, d => d.value))
        .range([1, 5]); // Adjust the range as needed
  
    // Create the links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => linkScale(d.value))
      .attr("stroke", "grey");
  
    // Create the nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "blue");
  
    // Add labels to the nodes
    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.name)
      .attr("font-size", 5)
      .attr("font-weight", "bold")
      .attr("dx", 6)
      .attr("dy", 3);
  
      function zoomed(event) {
        const { transform } = event;
        link.attr("transform", transform);
        node.attr("transform", transform);
        label.attr("transform", transform);
      }

      const zoom = d3.zoom().on("zoom", zoomed);
      svg.call(zoom);
  
    // Update the positions of the nodes and links in each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  
      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });
  }).catch(error => {
    console.log(error);
  });
  
};

let stateSym = {
    AZ: "Arizona",
    AL: "Alabama",
    AK: "Alaska",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DC: "District of Columbia",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
};

let question4 = function (data) {

    // Data
    let counts = convertInternMapToObject(d3.rollup(data, v => v.length, d => d.State))
    let logScale = d3.scaleLog()
        .base(10)
        .domain(d3.extent(Object.values(counts)))
    let colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues) 
        .domain([logScale(1), logScale(1000)]);

    // Plot
    const width = 800;
    const height = 500;
    const svg = d3.select("#q4_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // new definition of projection1
    const projection1 = d3.geoAlbersUsa()
    .scale(700) // shrink the map size so that the entire map fits into the svg
    .translate([width/2, height /2]); // center the map around the center of the svg

    const pathgeo1 = d3.geoPath().projection(projection1);


    // load us-states.json
    const map = d3.json("./us-states.json");
    map.then(map => {

        svg.selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", pathgeo1)
            .attr("fill", d => {
                let stateName = stateSym[d.properties.name]
                return colorScale(logScale(counts[stateName]))
            })
        });

    
};
