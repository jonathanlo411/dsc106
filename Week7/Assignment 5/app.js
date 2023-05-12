function assignment5(){
    let filePath="data.csv";
    question0(filePath); //preprocess data 
 
}

let question0=function(filePath){
    
    let cleanData = (d) => {
        return {
            Name: d.Name,
            Sex: d.Sex,
            Age: +d.Age,
            Height: +d.Height,
            Weight: +d.Weight,
            Team: d.Team,
            Games: d.Games,
            Year: +d.Year,
            Sport: d.Sport,
            Event: d.Event,
            Medal: d.Medal
        }
    }
    
    d3.csv(filePath, cleanData).then(function(data){
        //preprocess data here

        question1(data);
        question2(data);
        question3(data);
    });
    
}

let question1=function(data){
    // create plot inside the div #q1_plot
    const margin = 40
    const width = 500
    const height = 400
    let svg_q1 = d3.select("#q1_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Create and call Axis
    let newData = data.filter(d => (d.Year > 2010) && (d.Sport === "Basketball"))
    let xScale = d3.scaleLinear()
        .domain(d3.extent(newData, d => d.Height))
        .range([margin, width - margin])
    let yScale = d3.scaleLinear()
        .domain(d3.extent(newData, d => d.Weight))
        .range([height - margin, margin])
    svg_q1.append("g").call(d3.axisBottom(xScale))
        .attr("id", "q1xAxis")
        .attr("transform", `translate(0, ${height - margin})`)
    svg_q1.append("g").call(d3.axisLeft(yScale))
        .attr("id", "q1yAxis")
        .attr("transform", `translate(${margin}, 0)`)

    // Plot points
    svg_q1.selectAll(".q1point")
        .data(newData).enter().append("circle")
        .attr("class", "q1point")
        .attr("cx", d => xScale(d.Height))
        .attr("cy", d => yScale(d.Weight))
        .attr("r", 2)
        .attr("fill", d => (d.Sex === 'M') ? "orange" : "blue")
    
    // Create chart metadata
    svg_q1.append("text")
        .attr("x", width/2)
        .attr("y", margin/2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Basketball Height vs Weight (2010 - Present)")
    svg_q1.append("text")
        .attr("x", width/2)
        .attr("y", height - margin/4)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Height")
    svg_q1.append("text")
        .attr("x", margin/4)
        .attr("y", height/2)
        .attr("transform", `rotate(-90 , ${margin/4}, ${height/2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Weight")
    svg_q1.append("circle").attr("cx",width - 100).attr("cy",height - height/4).attr("r", 4).style("fill", "orange")
    svg_q1.append("circle").attr("cx",width - 100).attr("cy",height - height/4 - 20).attr("r", 4).style("fill", "blue")
    svg_q1.append("text").attr("x", width-90).attr("y", height-height/4).text("Male").style("font-size", "13px").attr("alignment-baseline","middle")
    svg_q1.append("text").attr("x", width-90).attr("y", height-height/4-20).text("Female").style("font-size", "13px").attr("alignment-baseline","middle")
    
}

let question2=function(data){
    // create plot inside the div #q2_plot
    const margin = 40
    const width = 500
    const height = 400
    const colorMap = {
        "china": "red",
        "usa": "blue",
        "aus": "green"
    }
    let svg_q2 = d3.select("#q2_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Data processing
    let chinaData = data.filter(d => (d.Year > 1980) && (d.Team === "China"))
    let usaData = data.filter(d => (d.Year > 1980) && (d.Team === "USA"))
    let australiaData = data.filter(d => (d.Year > 1980) && (d.Team === "Australia"))
    const yearData = [
        ...chinaData,
        ...usaData,
        ...australiaData,
    ]
    let chinaGrouped = d3.rollup(chinaData, v => d3.sum(v, d => 1), d => d.Year)
    let usaGrouped = d3.rollup(usaData, v => d3.sum(v, d => 1), d => d.Year)
    let australiaGrouped = d3.rollup(australiaData, v => d3.sum(v, d => 1), d => d.Year)
    const compData = [
        ...chinaGrouped.values(),
        ...usaGrouped.values(),
        ...australiaGrouped.values(),
    ]
    chinaGrouped = sortInternMap(chinaGrouped);
    usaGrouped = sortInternMap(usaGrouped);
    australiaGrouped = sortInternMap(australiaGrouped);
    
    // Create and call axis
    let xScale = d3.scaleLinear()
        .domain(d3.extent(yearData, d => d.Year))
        .range([margin, width - margin])
    let yScale = d3.scaleLinear()
        .domain(d3.extent(compData))
        .range([height - margin, margin])
    svg_q2.append("g").call(d3.axisBottom(xScale).tickFormat(x => String(x)))
        .attr("id", "q2xAxis")
        .attr("transform", `translate(0, ${height - margin})`)
    svg_q2.append("g").call(d3.axisLeft(yScale))
        .attr("id", "q2yAxis")
        .attr("transform", `translate(${margin}, 0)`)

    // Plotting
    svg_q2.selectAll(".q2pointChina")
        .data(chinaGrouped).enter().append("circle")
        .attr("class", "q2pointChina")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 2)
        .attr("fill", colorMap["china"])
    svg_q2.selectAll(".q2pointUSA")
        .data(usaGrouped).enter().append("circle")
        .attr("class", "q2pointUSA")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 2)
        .attr("fill", colorMap["usa"])
    svg_q2.selectAll(".q2pointAUS")
        .data(australiaGrouped).enter().append("circle")
        .attr("class", "q2pointAUS")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 2)
        .attr("fill", colorMap["aus"])

    // Draw lines
    svg_q2.append("path")
        .datum(chinaGrouped)
        .attr("d", d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", colorMap["china"])
        .attr("stroke-width", 1)
        .attr("id", "pathChina")
        .style("stroke-dasharray", 5)
    svg_q2.append("path")
        .datum(usaGrouped)
        .attr("d", d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", colorMap["usa"])
        .attr("stroke-width", 1)
        .attr("id", "pathaUSA")
        .style("stroke-dasharray", 10)
    svg_q2.append("path")
        .datum(australiaGrouped)
        .attr("d", d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .curve(d3.curveMonotoneX)
        )
        .attr("fill", "none")
        .attr("stroke", colorMap["aus"])
        .attr("stroke-width", 1)
        .attr("id", "pathAUS")

    // Create chart metadata
    svg_q2.append("text")
        .attr("x", width/2)
        .attr("y", margin/2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("China, USA, and AUS Total Medals vs. Time (1980-Present)")
    svg_q2.append("text")
        .attr("x", width/2)
        .attr("y", height - margin/4)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Year")
    svg_q2.append("text")
        .attr("x", margin/4)
        .attr("y", height/2)
        .attr("transform", `rotate(-90 , ${margin/4}, ${height/2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Medal Count")
    svg_q2.append("circle").attr("cx",width - 100).attr("cy",height - height/7).attr("r", 4).style("fill", colorMap["china"])
    svg_q2.append("circle").attr("cx",width - 100).attr("cy",height - height/7 - 20).attr("r", 4).style("fill", colorMap['usa'])
    svg_q2.append("circle").attr("cx",width - 100).attr("cy",height - height/7 - 40).attr("r", 4).style("fill", colorMap['aus'])
    svg_q2.append("text").attr("x", width-90).attr("y", height-height/7).text("China").style("font-size", "13px").attr("alignment-baseline","middle")
    svg_q2.append("text").attr("x", width-90).attr("y", height-height/7-20).text("USA").style("font-size", "13px").attr("alignment-baseline","middle")
    svg_q2.append("text").attr("x", width-90).attr("y", height-height/7-40).text("Australia").style("font-size", "13px").attr("alignment-baseline","middle")
}

let question3=function(data){
    // create plot inside the div #q3_plot
    const margin = 40
    const width = 500
    const height = 400
    const colorMap = {
        Swimming: "blue",
        Rowing: "red",
        Football: "green"
    }
    let svg_q3 = d3.select("#q3_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
      
    // Create and call Axis
    let newData = data.filter(d => (d.Year > 1990) && (["Swimming", "Rowing", "Football"].includes(d.Sport)))
    let xScale = d3.scaleLinear()
        .domain(d3.extent(newData, d => d.Year))
        .range([margin, width - margin])
    let yScale = d3.scaleLinear()
        .domain(d3.extent(newData, d => d.Age))
        .range([height - margin, margin])
    svg_q3.append("g").call(d3.axisBottom(xScale).tickFormat(x => String(x)))
        .attr("id", "q3xAxis")
        .attr("transform", `translate(0, ${height - margin})`)
    svg_q3.append("g").call(d3.axisLeft(yScale))
        .attr("id", "q3yAxis")
        .attr("transform", `translate(${margin}, 0)`)

    // Plot points
    svg_q3.selectAll(".q3point")
        .data(newData).enter().append("g")
        .attr("class", "q3point")
        .attr("transform", d => `translate(${xScale(d.Year) - 5}, ${yScale(d.Age)})`)
    function renderIcon(svgData) {
        let q3groups = document.getElementsByClassName("q3point")
        let svgPath = svgData.getElementsByTagName("path")[0].outerHTML
        for (i = 0; i < q3groups.length; i++) {
            let elem = q3groups[i]
            elem.innerHTML = svgPath
        }
        d3.selectAll(".q3point>path")
            .data(newData)
            .attr("transform", "scale(0.015)")
            .attr("fill", d => colorMap[d.Sport])
    }
    d3.html("./icon.svg").then(d => renderIcon(d))
    
    // Create chart metadata
    svg_q3.append("text")
        .attr("x", width/2)
        .attr("y", margin/2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Swimming, Rowing, and Football Age vs. Time (1990-Present)")
    svg_q3.append("text")
        .attr("x", width/2)
        .attr("y", height - margin/4)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Year")
    svg_q3.append("text")
        .attr("x", margin/4)
        .attr("y", height/2)
        .attr("transform", `rotate(-90 , ${margin/4}, ${height/2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Age")
    svg_q3.append("circle").attr("cx",width - 100).attr("cy",height - height/7).attr("r", 4).style("fill", colorMap["Swimming"])
    svg_q3.append("circle").attr("cx",width - 100).attr("cy",height - height/7 - 20).attr("r", 4).style("fill", colorMap['Rowing'])
    svg_q3.append("circle").attr("cx",width - 100).attr("cy",height - height/7 - 40).attr("r", 4).style("fill", colorMap['Football'])
    svg_q3.append("text").attr("x", width-90).attr("y", height-height/7).text("Swimming").style("font-size", "13px").attr("alignment-baseline","middle")
    svg_q3.append("text").attr("x", width-90).attr("y", height-height/7-20).text("Rowing").style("font-size", "13px").attr("alignment-baseline","middle")
    svg_q3.append("text").attr("x", width-90).attr("y", height-height/7-40).text("Football").style("font-size", "13px").attr("alignment-baseline","middle")
}


// Helper
let sortInternMap = function (internMap) {
    return [...internMap].sort( (a, b) => {
        var valueA, valueB;
    
        valueA = a[0]; 
        valueB = b[0];
        if (valueA < valueB) {
            return -1;
        }
        else if (valueA > valueB) {
            return 1;
        }
        return 0;
    })
}