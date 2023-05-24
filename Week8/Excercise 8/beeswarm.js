const width = 600;
const height = 500;

const svg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const xScale = d3.scaleLinear().domain([-100, 100]).range([0, width]);
const numNodes = 100;
const nodes = d3
  .range(numNodes)
  .map(() => ({ 
    radius: Math.random() * 10 + 5,
    xAttribute: Math.random()*200-100
   }));
console.log(nodes);

const nodeElements = svg
  .selectAll(".node")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("r", (d) => d.radius);
simulation = d3.forceSimulation(nodes)
  .force("x", d3.forceX().x( (d) => (d.xAttribute < 0.5) ? xScale(-50) : xScale(50)))
  .force("y", d3.forceY(height / 2))
  .force("collide", d3.forceCollide().radius(d=> d.radius));
simulation.on("tick", () => {
    nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
});