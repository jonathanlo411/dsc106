
/* 
    Head Calls
*/
async function main() {
    // Seperate Loads to prevent waterfall
    loadPage();
    loadVisualizations();
}

async function loadPage() {
    // Side Nav Scroll Navigation
    const buttons = document.getElementsByClassName("buttons");
    for (let i = 0; i < buttons.length; i++) {
        bt = buttons[i]
        bt.addEventListener("click", () => {
            it = document.getElementById(`s${i}`)
            it.scrollIntoView({behavior: "smooth"});
        })
    }

    // Cards
    const cards = document.getElementsByClassName("showcase");
    for (let i = 0; i < 3; i++) {
        bt = cards[i]
        bt.addEventListener("click", () => {
            it = document.getElementById(`s${i + 1}`)
            it.scrollIntoView({behavior: "smooth"});
        })
    }

    // End Cards
    const endCards = document.getElementsByClassName("end");
    for (let i = 0; i < 3; i++) {
        bt = endCards[i]
        bt.addEventListener("click", () => {
            it = document.getElementById(`s${i + 1}`)
            it.scrollIntoView({behavior: "smooth"});
        })
    }

    // BG Images
    const imageLocations = [
        "https://cdn.discordapp.com/attachments/942218891952783421/1118770446033231962/image.png",
        "https://cdn.discordapp.com/attachments/942218891952783421/1118778711538401301/image.png",
        "https://cdn.discordapp.com/attachments/942218891952783421/1118784649041281145/image.png"
    ]
    const bgTargets = document.getElementsByClassName("showcase-img-wrapper")
    for (let i = 0; i < bgTargets.length; i ++) {
        let iter = (i > 2) ? i - 3 : i
        bgTargets[i].style.backgroundImage = `url(${imageLocations[iter]})`
    }

}

async function loadVisualizations() {
    // Load Data
    const rawData = await fetch("myanimelist-data.json");
    const data = await rawData.json();

    // Load Visualizations Asynchronously to prevent waterfall
    loadVizTable(data);
    loadVizNetwork(data);
    loadVizGeo(data);
}


/*
    VISUALIZATIONS
*/
async function loadVizTable(data) {
    // Define Meta
    const height = 500;
    const width = 800;
    const margin = 40;

    // Select only recent data and top genres
    const topGenres = ["Comedy", "Kids", "Fantasy", "Action", "Adventure", "Sci-Fi", "Drama", "Romance", "School"]
    const cleanedData = d3.filter(data, (d) => {
        const post2000 = (d.start_season) ? d.start_season.year > 2000 : false
        const pre2022 = (d.start_season) ? d.start_season.year < 2022 : false
        const onlyTopGenres = (d.genres && d.genres[0]) ? topGenres.includes(d.genres[0].name) : false
        return post2000 && pre2022 && onlyTopGenres
    })

    // Generate Viz data
    const groupedData = d3.group(cleanedData, d => d.start_season.year);
    const stackedData = Array.from(groupedData, ([year, values]) => {
        const genreCounts = new Map();
        values.forEach(entry => {
            const genre = (entry.genres) ? entry.genres[0].name : "Unkown";
            const count = genreCounts.get(genre) || 0;
            genreCounts.set(genre, count + 1);
        });
        return { year, genreCounts };
    });

    // Create Viz
    let svg = d3.select('#s1')
        .append("div")
        .classed("svg-container-s1", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1000 1000")
        .classed("svg-content-s1", true);
    const xScale = d3.scaleBand()
        .domain(stackedData.map(d => d.year))
        .range([margin, width - margin])
        .padding(0.1);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(Array.from(d.genreCounts.values())))])
        .range([height - margin, margin]);
    const colorMap = {
        "Comedy": "#FCECC9",
        "Kids": "#FCB0B3",
        "Fantasy": "#F93943",
        "Action": "#7EB2DD",
        "Adventure": "#445E93",
        "Sci-Fi": "#660000",
        "Drama": "#484041",
        "Romance": "#14342B",
        "School": "#087E8B"
    }

    // Create stacked bars
    const bars = svg.selectAll(".bar")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", d => `translate(${xScale(d.year)}, 0)`);
    bars.selectAll("rect")
        .data(d => Array.from(d.genreCounts.entries()))
        .enter()
        .append("rect")
        .attr("x", d => xScale.bandwidth(d[0]) / 2)
        .attr("y", 0)
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => 0)
        .attr("fill", d => colorMap[d[0]])
        .on("mouseover", (e, d) => {
            let box = document.getElementById("tooltip")
            box.style.opacity = 1
            box.style.position = "absolute"
            box.style.backgroundColor = "white"
            box.style.left = e.pageX + 10 + "px"
            box.style.top = e.pageY - 10 + "px"
            box.innerHTML = d[0]
        })
        .on("mouseout", function (e, d) {
            let box = document.getElementById("tooltip")
            box.style.opacity = 0
            box.innerHTML = ""
        })
        .transition() 
        .duration(500)
        .delay((d, i) => i * 50) 
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(0) - yScale(d[1]))

    

    // Metadata
    svg.append("g").call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height - margin})`)
    svg.append("g").call(d3.axisLeft(yScale))
        .attr("transform", `translate(${margin}, 0)`)
    svg.append("text")
        .attr("x", width/2)
        .attr("y", margin/2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Count of Most Popular Genres (2000-2021)")
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height - margin/4)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Year")
    svg.append("text")
        .attr("x", margin/4)
        .attr("y", height/2)
        .attr("transform", `rotate(-90 , ${margin/4}, ${height/2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "Helvetica")
        .style("font-weight", "bold")
        .text("Count")
    let counter = 0;
    for (var key of Object.keys(colorMap)) {
        svg.append("circle").attr("cx", 70).attr("cy",height/10 + counter * 20).attr("r", 3).style("fill", colorMap[key])
        svg.append("text").attr("x", 80).attr("y", height/10 + counter * 20).text(key).style("font-size", "8px").attr("alignment-baseline","middle")
        counter ++;
    }
    
    
}

async function loadVizNetwork(data) {
    // Use nodes that are "popular"
    const filteredData = d3.filter(data, (d) => {
        const goodScore = d.mean > 8;
        const goodRank = d.rank < 1000;
        const goodPopularity = d.popularity < 800;
        return goodScore || goodPopularity
    })
    const colorMap = {
        "Comedy": "#FCECC9",
        "Kids": "#FCB0B3",
        "Fantasy": "#F93943",
        "Action": "#7EB2DD",
        "Adventure": "#445E93",
        "Sci-Fi": "#660000",
        "Drama": "#484041",
        "Romance": "#14342B",
        "School": "#087E8B"
    }

    // Get links and nodes
    const nodes = [];
    const links = [];
    filteredData.forEach(item => {
        // Get nodes
        const node = {
            id: item.id,
            title: item.title,
            genre: (item.genres) ? item.genres[0].name : "Unkown"
        };
        nodes.push(node);

        // Get Links
        let i = 0;
        while (i < 10 && item.recommendations[i]) {
            let recommendation = item.recommendations[i];
            const link = {
                source: item.id,
                target: recommendation.node.id,
                num_recommendations: recommendation.num_recommendations
            };
            links.push(link);
            i ++;
        }
    });

    // Verify integrity of links
    const validLinks = links.filter(link => {
        const targetNode = nodes.find(node => node.id === link.target);
        return targetNode !== undefined;
    });

    // Specify the dimensions of the graph
    const width = 1000;
    const height = 1000;

    // Create a canvas container for the graph
    const canvas = d3.select("#c-target")
        .append("div")
        .classed("canvas-container-s2", true)
        .append("canvas")
        .attr("width", width)
        .attr("height", height)
        .classed("canvas-content-s2", true);

    // Get the canvas context
    const context = canvas.node().getContext("2d");

    // Create a force simulation for the graph
    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(8))
        .force("link", d3.forceLink(validLinks).id( d => d.id))
    
    // Define the tick function to update the positions of the nodes and links
    const ticked = () => {
        context.clearRect(0, 0, width, height);

        // Draw the links between the nodes
        context.beginPath();
        validLinks.forEach(link => {
            context.moveTo(link.source.x, link.source.y);
            context.lineTo(link.target.x, link.target.y);
        });
        context.strokeStyle = "grey";
        context.stroke();
    
        // Draw the nodes
        context.beginPath();
        nodes.forEach(node => {
            context.moveTo(node.x + 8, node.y);
            context.arc(node.x, node.y, 8, 0, 2 * Math.PI);
        });
        context.fillStyle = "steelblue";
        context.fill();

        // Draw the labels
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        nodes.forEach(node => {
            context.fillText(node.title, node.x, node.y);
        });

    };

    // Start the simulation
    simulation.on("tick", ticked);

    // Zooming and panning
    function zoomed(event) {
        const { transform } = event;
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        ticked();
        context.restore();
    }
    const zoom = d3.zoom().on("zoom", zoomed);
    d3.select(canvas.node().parentNode).call(zoom);

    
}

async function loadVizGeo(data) {
    // Create Counts data
    const counts = d3.rollup(data, v => v.length, d => (d.studios[0]) ? (d.studios[0]).name : undefined)

    // Fetch Locations
    const mapsHeat = [];
    const locations = await d3.csv("animation_studio_location.csv");
    for (let i = 0; i < locations.length; i ++) {
        let studioData = locations[i]
        let heatLocation = {
            location: new google.maps.LatLng(studioData.Latitude, studioData.Longitude),
            // weight: counts.get(studioData.Studio)
        } 
        mapsHeat.push(heatLocation)
    }
    console.log(mapsHeat)
    
    // Load maps data
    initMap();
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: mapsHeat
    });
    heatmap.setMap(heatmap.getMap() ? null : map);
}

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: {lat: 35.652832, lng: 139.839478},
    });
}

/* Head Execution */
main()
