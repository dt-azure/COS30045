const createGraph1 = (data) => {
    const container = d3.select('.graph-1 .viz-container');
    const { width, height } = container.node().getBoundingClientRect();

    const margin = { top: 20, right: 20, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const meanRow = data.find(d => d.jurisdiction === "Mean");
    const filtered = data.filter(d => d.jurisdiction !== "Mean");

    const svg = container.append("svg")
                         .attr("width", width)
                         .attr("height", height);

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
                .domain(filtered.map(d => d.jurisdiction))
                .range([0, innerWidth])
                .padding(0.2);

    const y = d3.scaleLinear()
                .domain([0, d3.max(filtered, d => d.total_fines)])
                .nice()
                .range([innerHeight, 0]);

    const bars = g.selectAll("rect")
                  .data(filtered)
                  .enter()
                  .append("rect")
                  .attr("x", d => x(d.jurisdiction))
                  .attr("y", d => y(d.total_fines))
                  .attr("width", x.bandwidth())
                  .attr("height", d => innerHeight - y(d.total_fines))
                  .attr("fill", colorMain);

    if (meanRow) {
        g.append("line")
         .attr("x1", 0)
         .attr("x2", innerWidth)
         .attr("y1", y(meanRow.total_fines))
         .attr("y2", y(meanRow.total_fines))
         .attr("stroke", "#888")
         .attr("stroke-dasharray", "6 3")
         .attr("stroke-width", 2);
    }

    g.append("text")
     .attr("x", innerWidth + 20)
     .attr("y", y(meanRow.total_fines) - 6)
     .attr("text-anchor", "end")
     .attr("fill", "#555")
     .attr("font-size", 12)
     .text("Mean");


    const xAxis = g.append("g")
     .attr("transform", `translate(0,${innerHeight})`)
     .call(d3.axisBottom(x));

    xAxis.selectAll("text")
         .style("font-size", "14px")
         .style("font-weight", "500");

    const yAxis = g.append("g")
     .call(d3.axisLeft(y));

    yAxis.selectAll("text")
         .style("font-size", "14px")
         .style("font-weight", "500");

    addGraph1Interactions(bars);
}

const createGraph2 = (data) => {
    const container = d3.select(".graph-2 .viz-container");
    const { width, height } = container.node().getBoundingClientRect();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const ageOrder = ["0-16", "17-25", "26-39", "40-64", "65 and over"];

    const nested = d3.rollups(
        data,
        v => ({
        Camera: d3.sum(v.filter(x => x.detection_group === "Camera"), x => x.percentage),
        "Police Issued": d3.sum(v.filter(x => x.detection_group === "Police Issued"), x => x.percentage),
        Other: d3.sum(v.filter(x => x.detection_group === "Other"), x => x.percentage)
        }),
        d => d.age_group
    ).map(([age_group, obj]) => ({ age_group, ...obj }));

    const methods = ["Camera", "Police Issued", "Other"];

    const stackGen = d3.stack()
        .keys(methods);

    const stacked = stackGen(nested);

    const x = d3.scaleBand()
        .domain(ageOrder)
        .range([0, innerWidth])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .domain(methods)
        .range(d3.schemeSet2);

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("g.layer")
        .data(stacked)
        .enter()
        .append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.age_group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());
    
    const hoverBars = g.selectAll(".hover-bar")
                       .data(nested)
                       .enter()
                       .append("rect")
                       .attr("class", "hover-bar")
                       .attr("x", d => x(d.age_group))
                       .attr("y", 0)
                       .attr("width", x.bandwidth())
                       .attr("height", innerHeight)
                       .attr("fill", "transparent");


    const xAxis = g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

    xAxis.selectAll("text")
         .style("font-size", "14px")
         .style("font-weight", "500");

    const yAxis = g.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%"));

    yAxis.selectAll("text")
         .style("font-size", "14px")
         .style("font-weight", "500");

    const legend = svg.append("g")
                      .attr("transform", `translate(${(width / 2) - 140}, ${height - margin.bottom + 30})`); 

    methods.forEach((m, i) => {
    const xPos = i * 140;

    legend.append("rect")
        .attr("x", xPos)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(m));

    legend.append("text")
        .attr("x", xPos + 26)
        .attr("y", 15)
        .attr("font-size", 14)
        .attr("fill", "#333")
        .text(m);
    });



    addGraph2Interactions(hoverBars);
}