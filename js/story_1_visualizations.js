const mapTooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "8px 12px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "6px")
    .style("pointer-events", "none")
    .style("font-size", "14px")
    .style("opacity", 0)
    .attr("class", "tooltip graph-1");


const createGraph1 = (geojson, data) => {

    geojson.features = geojson.features.filter(f =>
        +f.properties.STATE_CODE >= 1 && +f.properties.STATE_CODE <= 8
    );

    const container = d3.select(".graph-1 .viz-container");
    const { width, height } = container.node().getBoundingClientRect();

    const svg = container.append("svg")
                         .attr("width", width)
                         .attr("height", height);

    const lookup = new Map(data.map(
        d => [ stateMap[d.jurisdiction], d.total_fines ]
    ));

    const projection = d3.geoMercator()
                         .fitExtent(
                             [
                             [width * 0.15, height * 0.10],
                             [width * 0.85, height * 0.80]
                             ],
                             geojson
                         );


    const path = d3.geoPath().projection(projection);

    const max = d3.max(data, d => d.total_fines);
    const color = d3.scaleSequential()
                    .domain([0, max])
                    .interpolator(d3.interpolateBlues);

    const paths = svg.selectAll("path")
                     .data(geojson.features)
                     .enter().append("path")
                     .attr("d", path)
                     .attr("fill", d => color(lookup.get(d.properties.STATE_NAME)))
                     .attr("stroke", "#fff")
                     .attr("stroke-width", 1);

    const legendWidth = 440;
    const legendHeight = 12;

    const legend = svg.append("g")
                      .attr("transform", `translate(${width/2 - legendWidth/2}, ${height - 60})`);

    const defs = legend.append("defs");

    const linearGradient = defs.append("linearGradient")
                               .attr("id", "legend-gradient");

    linearGradient.attr("x1", "0%")
                  .attr("x2", "100%")
                  .attr("y1", "0%")
                  .attr("y2", "0%");

    linearGradient.append("stop")
                  .attr("offset", "0%")
                  .attr("stop-color", color(0));

    linearGradient.append("stop")
                  .attr("offset", "100%")
                  .attr("stop-color", color(max));

    legend.append("rect")
             .attr("width", legendWidth)
             .attr("height", legendHeight)
             .style("fill", "url(#legend-gradient)");

    const legendScale = d3.scaleLinear()
                          .domain([0, max])
                          .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
                         .ticks(4)
                         .tickFormat(d3.format("~s"));

    legend.append("g")
             .attr("transform", `translate(0, ${legendHeight})`)
             .call(legendAxis)
             .selectAll("text")
             .style("font-size", "12px");

    legend.append("text")
             .attr("x", legendWidth/2)
             .attr("y", legendHeight + 32)
             .attr("text-anchor", "middle")
             .style("font-size", "14px")
             .text("Total fines");


    addGraph1Interactions(paths, lookup, color);
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