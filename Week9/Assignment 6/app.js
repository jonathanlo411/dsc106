function assignment6() {
  let filePath = "data_A7.csv";
  question0(filePath);
}

function cleanCSV(d) {
    return {
        Category: d.Category,
        State: d.State,
        Year: +d['Order Date'].slice(-4),
        Profit: +d.Profit,
        Sales: +d.Sales
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

let question1 = function (data) {
    const padding = 20;
    const width = 500 ;
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
    console.log()
        
    svg.selectAll("path")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("d", area)
        // .attr("fill", (d, i) => console.log(d[i]))
        // .attr("opacity", 0.8);

    svg.append("g").call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height - padding})`);
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("transform", `translate(${padding}, 0)`);

}

let question2 = function (data) {};

let question3 = function () {
  // State Symbol dictionary for conversion of names and symbols.
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
};
let question4 = function (data) {};
