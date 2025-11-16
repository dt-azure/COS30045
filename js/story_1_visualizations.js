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
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip tooltip-graph-1");

    geojson.features = geojson.features.filter(f =>
        +f.properties.STATE_CODE >= 1 && +f.properties.STATE_CODE <= 8
    );

    const container = d3.select(".graph-1 .viz-container");

    container.selectAll("svg").remove();

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
                      .attr("transform", `translate(${width/2 - legendWidth/2 - 20}, ${height - 60})`);

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
                          .nice()
                          .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
                         .ticks(4)
                         .tickFormat(d3.format(".2s"));

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


const createGraph2 = (data, selectedYear) => {
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip tooltip-graph-2");

    const container = d3.select(".graph-2 .viz-container");
    container.selectAll("svg").remove();

    const { width: outerWidth, height: outerHeight } = container.node().getBoundingClientRect();

    const localMargin = {
        top: margin.top,
        right: margin.right,
        bottom: Math.max(margin.bottom, 70),
        left: margin.left + 10
    };

    const adjustedHeight = outerHeight * 1.0;
    const innerWidth = outerWidth - localMargin.left - localMargin.right;
    const innerHeight = adjustedHeight - localMargin.top - localMargin.bottom;

    const filtered = data
        .filter(d => d.year === selectedYear)
        .map(d => ({
            ...d,
            date: new Date(d.year, d.month - 1)
        }))
        .sort((a, b) => a.date - b.date);

    if (!filtered.length) {
        container.append("div")
            .attr("class", "no-data")
            .text(`No data for ${selectedYear}`);
        return;
    }

    const avgFines = d3.mean(filtered, d => d.total_fines);

    const svg = container.append("svg")
        .attr("width", outerWidth)
        .attr("height", adjustedHeight);

    const g = svg.append("g")
        .attr("transform", `translate(${localMargin.left},${localMargin.top})`);

    const x = d3.scaleTime()
        .domain([d3.min(filtered, d => d.date), d3.max(filtered, d => d.date)])
        .range([0, innerWidth]);

    const minFines = d3.min(filtered, d => d.total_fines);
    const maxFines = d3.max(filtered, d => d.total_fines);

    const y = d3.scaleLinear()
            .domain([minFines * 0.9, maxFines * 1.05])
            .range([innerHeight, 0]);


    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.total_fines))
        .curve(d3.curveMonotoneX);

    g.append("path")
        .datum(filtered)
        .attr("fill", "none")
        .attr("stroke", "#3F72AF")
        .attr("stroke-width", 2)
        .attr("d", line);

    g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", y(avgFines))
        .attr("y2", y(avgFines))
        .attr("stroke", colorGrey)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6 4");

    g.append("text")
        .attr("x", innerWidth - 6)
        .attr("y", y(avgFines) - 6)
        .attr("text-anchor", "end")
        .attr("fill", colorGrey)
        .attr("font-size", "12px")
        .text(`Avg: ${Math.round(avgFines).toLocaleString()}`);

    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%b %Y"));

    const xg = g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis);

    xg.selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#0b2540")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.4em")
        .attr("dy", "0.25em");

    g.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .selectAll("text")
            .style("fill", "#0b2540");

    g.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + localMargin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Month");

    g.append("text")
        .attr("class", "axis-label")
        .attr("x", -innerHeight / 2)
        .attr("y", -localMargin.left + 15)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Total Fines");

    addGraph2Interactions(g, filtered, x, y, innerWidth, innerHeight);
}

const createGraph3 = (data, selectedJurisdiction) => {
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip tooltip-graph-3");

    const container = d3.select(".graph-3 .viz-container");
    container.selectAll("svg").remove();

    const { width, height } = container.node().getBoundingClientRect();
    const radius = Math.min(width, height) / 2 * 0.85;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    let filtered;

    if (selectedJurisdiction === "Nationwide") {
        const totals = d3.rollups(
            data,
            v => d3.sum(v, d => d.total_fines),
            d => d.offence_type
        ).map(([offence_type, total_fines]) => ({ offence_type, total_fines }));

        filtered = totals;
    } else {
        filtered = data
            .filter(d => d.jurisdiction === selectedJurisdiction)
            .map(d => ({
                offence_type: d.offence_type,
                total_fines: d.total_fines
            }));
    }
    

    const pie = d3.pie()
        .value(d => d.total_fines)
        .sort(null);

    const arcs = pie(filtered);

    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    const labelArc = d3.arc()
        .outerRadius(radius * 0.7)
        .innerRadius(radius * 0.7);

    const totalSum = d3.sum(filtered, d => d.total_fines);

    addGraph3Interactions(g, arcs, arc, filtered);

    // g.selectAll("text")
    //     .data(arcs)
    //     .enter()
    //     .append("text")
    //     .attr("transform", d => `translate(${labelArc.centroid(d)})`)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "12px")
    //     .text(d => {
    //         const pct = d.data.total_fines / totalSum;
    //         return pct >= 0.04 ? d3.format(".0%")(pct) : "";
    //     });
};

