
// Helpers
let rowConverter = function(d){
    return {
        name : d.Name,   
        manufacturer : d.Manufacturer,        
        calories : +d.Calories, 
        carbo : +d.Carbo,
        year : +d.Year
    }
}


// Main
function main(data) {
    /* Draw scatterplot with Calories and Carbo */
    const svgwidth = 300;
    const svgheight = 300;

    let svg = d3.select("body").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight)

    // Question 2: add your code below to draw a scatterplot
    const colorMapping = {
        "G": "green",
        "K": "red",
        "P": "blue"
    };
    const padding = 25;
    let xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.calories), d3.max(data, d => d.calories)])
        .range([padding, svgwidth - padding])
    let yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.carbo), d3.max(data, d => d.carbo)])
        .range([padding, svgheight - padding])

    svg.selectAll(".scatterpoint")
        .data(data).enter()
            .append("circle")
        .attr("class", "scatterpoint")
        .attr("cx", d => xScale(d.calories))
        .attr("cy", d => svgheight - yScale(d.carbo))
        .attr("r", 2)
        .attr("opacity", 0.5)
        .attr("fill", d => colorMapping[d.manufacturer])
    svg.append("g").call(d3.axisBottom(xScale))
        .attr("class", "xAxis")
        .attr("transform", `translate(${0}, ${svgheight - padding})`)
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("class", "yScale")
        .attr("transform", `translate(${padding})`)
    svg.selectAll(".scatterpoint-label")
        .data(data).enter()
            .append("text")
        .attr("x", d => xScale(d.calories))
        .attr("y", d => svgheight - yScale(d.carbo))
        .attr("text-anchor", "right")
        .attr("dy", ".3em")
        .text(d => d.name)
        .style("font-size", "8px")

}


// Init Call
d3.csv("cereal.csv", rowConverter)
    .then(data => main(data))

