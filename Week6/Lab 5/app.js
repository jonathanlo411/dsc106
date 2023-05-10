
// Helper
let rowConverter = (d) => {
    return {
        Year: +d.Year,
        Sales: +d.Sales,
        Revenue: +d.Revenue,
        Expenses: +d.Expenses,
    }
}

// Main
let main = async () => {
    // Fetch and await data
    const data = await d3.csv("sales.csv", rowConverter)

    // Define SVG parameters
    const padding = 50
    const width = 500
    const height = 400
    const borderStyle = "1px solid rebeccapurple"

    // Generate SVG
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", borderStyle)

    // Create and call x and y scales
    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([padding, width - padding])
    let yScale = d3.scaleLinear()
        .domain(d3.extent(data, d=> d.Sales))
        .range([height - padding, padding])
    svg.append("g").call(d3.axisBottom(xScale))
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${height - padding})`)
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("class", "yScale")
        .attr("transform", `translate(${padding}, 0)`)

    // Plot sales data points
    svg.selectAll(".pointSales")
        .data(data).enter().append("circle")
        .attr("class", "pointSales")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Sales))
        .attr("r", 2)
        .attr("fill", "#CC0000")

    // Add sales line chart
    svg.append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(d => xScale(d.Year))
            .y(d => yScale(d.Sales))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", "#CC0000")
        .attr("stroke-width", 1)
        .attr("id", "salesPath")

    // Add title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", padding/2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Line Chart")

    // Update and recall y scale
    const allCols = [
        ...d3.extent(data, d => d.Sales),
        ...d3.extent(data, d => d.Revenue),
        ...d3.extent(data, d => d.Expenses)
    ]
    yScale = d3.scaleLinear()
        .domain(d3.extent(allCols))
        .range([height - padding, padding])
    d3.select(".yScale").call(d3.axisLeft(yScale))
        .attr("transform", `translate(${padding}, 0)`)

    // Remove old sales data
    svg.selectAll(".pointSales").remove()
    svg.selectAll("#salesPath").remove()

    // Re-Plot sales data points
    svg.selectAll(".pointSales")
        .data(data).enter().append("circle")
        .attr("class", "pointSales")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Sales))
        .attr("r", 2)
        .attr("fill", "#CC0000")

    // Re-Add sales line chart
    svg.append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(d => xScale(d.Year))
            .y(d => yScale(d.Sales))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", "#CC0000")
        .attr("stroke-width", 1)
        .attr("id", "pathSales")

    // Plot revenue data points
    svg.selectAll(".pointRevenue")
        .data(data).enter().append("circle")
        .attr("class", "pointRevenue")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Revenue))
        .attr("r", 2)
        .attr("fill", "#00CC00")

    // Add revenue line chart
    svg.append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(d => xScale(d.Year))
            .y(d => yScale(d.Revenue))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", "#00CC00")
        .attr("stroke-width", 1)
        .attr("id", "pathRevenue")

    // Plot expenses data points
    svg.selectAll(".pointExpenses")
        .data(data).enter().append("circle")
        .attr("class", "pointExpenses")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Expenses))
        .attr("r", 2)
        .attr("fill", "#0000CC")

    // Add expenses line chart
    svg.append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(d => xScale(d.Year))
            .y(d => yScale(d.Expenses))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", "#0000CC")
        .attr("stroke-width", 1)
        .attr("id", "pathExpenses")

    // Add legend
    svg.append("circle").attr("cx",width - 100).attr("cy",height - 150).attr("r", 4).style("fill", "#CC0000")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - 130).attr("r", 4).style("fill", "#00CC00")
    svg.append("circle").attr("cx",width - 100).attr("cy",height - 110).attr("r", 4).style("fill", "#0000CC")
    svg.append("text").attr("x", width-90).attr("y", height-150).text("Sales").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-90).attr("y", height-130).text("Revenue").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-90).attr("y", height-110).text("Expenses").style("font-size", "13px").attr("alignment-baseline","middle")

}

main()