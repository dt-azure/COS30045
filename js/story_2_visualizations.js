// const barWidth = 300;
const barHeight = 80;
const lollipopWidth = 650;
const lollipopHeight = 250;

const tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip graph-3")
                  .style("position", "absolute")
                  .style("pointer-events", "none")
                  .style("padding", "6px 10px")
                  .style("background", "white")
                  .style("border", "1px solid #ccc")
                  .style("border-radius", "4px")
                  .style("font-size", "12px")
                  .style("opacity", 0);

const drawStackedBar = (data, svgSelector, barWidth) => {
        const svg = d3.select(svgSelector);
        svg.selectAll("*").remove();

        const series = ageOrder.map(k => [
            data.filter(d => d.age_group === k)[0].proportion
        ]);

        let x0 = 0;
        series.forEach((v,i) => {
            const w = v[0] * barWidth;
            const rects = svg.append("rect")
                             .datum({
                                age: ageOrder[i],
                                proportion: v[0]
                             })
                             .attr("x", x0)
                             .attr("y", 0)
                             .attr("width", w)
                             .attr("height", barHeight)
                             .attr("fill", ageColorMapping(ageOrder[i]));

            addGraph3Interactions(rects, v, tooltip);
            x0 += w;
        });

        let xText = 0;
        series.forEach((v,i) => {
            const proportion = v[0];
            const w = proportion * barWidth;

            if (proportion > 0.01) {
                svg.append("text")
                   .attr("x", xText + w/2)
                   .attr("y", barHeight/2 + 4)
                   .attr("text-anchor", "middle")
                   .attr("fill", "#fff")
                   .style("font-size", "12px")
                   .style("pointer-events", "none")
                   .text((v[0] * 100).toFixed(1) + "%");
            }
        
            xText += w;
        });
}

const updateStackedBar = (jur, barWidth) => {
        const jurData = preppedData.filter(d => d.jurisdiction === jur);
        drawStackedBar(jurData, "#graph-3-selected", barWidth);
}

function drawLollipop(data, svg, width, height) {

    svg.selectAll("*").remove();

    const x = d3.scalePoint()
        .domain(ageOrder)
        .range([80, width - 40]);

    const yMax = d3.max(data, d => d.total_fines);
    const y = d3.scaleLinear()
        .domain([0, yMax]).nice()
        .range([height - 30, 20]);

    svg.append("g")
        .attr("transform", `translate(55,0)`)
        .call(d3.axisLeft(y).ticks(5));

    svg.append("text")
       .attr("x", -height/2)
       .attr("y", 12)
       .attr("text-anchor", "middle")
       .attr("transform", "rotate(-90)")
       .style("font-size", "12px")
       .text("Total fines");
    
    svg.selectAll(".stem")
       .data(data)
       .enter()
       .append("line")
       .attr("class", "stem")
       .attr("x1", d => x(d.age_group))
       .attr("x2", d => x(d.age_group))
       .attr("y1", d => y(0))
       .attr("y2", d => y(d.total_fines))
       .attr("stroke", "#444")
       .attr("stroke-width", 2);

    const circles = svg.selectAll("circle")
                       .data(data)
                       .enter()
                       .append("circle")
                       .attr("cx", d => x(d.age_group))
                       .attr("cy", d => y(d.total_fines))
                       .attr("r", 6)
                       .attr("fill", d => ageColorMapping(d.age_group));

    svg.selectAll(".x-label")
       .data(ageOrder)
       .enter()
       .append("text")
       .attr("class", "x-label")
       .attr("x", d => x(d))
       .attr("y", height - 5)
       .attr("text-anchor", "middle")
       .style("font-size", "12px")
       .text(d => d);



    addGraph4Interactions(circles);
}


const createGraph3 = (preppedData) => {
    const container = d3.select(".graph-3 .viz-container");
    const containerWidth = container.node().getBoundingClientRect().width;

    container.selectAll("svg").remove();


    const overallBlock = container.append("div")
                                  .attr("class", "graph3-bar-block")
                                  .style("margin-bottom", "20px");

    overallBlock.append("div")
                .attr("class", "bar-title")
                .style("font-size", "14px")
                .style("font-weight", "600")
                .style("margin-bottom", "4px")
                .text("Australia Overall");

    const svgOverall = overallBlock.append("svg")
                                   .attr("id", "graph-3-overall")
                                   .attr("width", containerWidth)
                                   .attr("height", barHeight);


    const selectedBlock = container.append("div")
                                   .attr("class", "graph3-bar-block");

    selectedBlock.append("div")
                 .attr("class", "bar-title")
                 .style("font-size", "14px")
                 .style("font-weight", "600")
                 .style("margin-bottom", "4px")
                 .text("Selected Jurisdiction");

    const svgSelected = selectedBlock.append("svg")
                                     .attr("id", "graph-3-selected")
                                     .attr("width", containerWidth)
                                     .attr("height", barHeight);



    const jurisdictions = [...new Set(preppedData
        .map(d => d.jurisdiction)
        .filter(d => d !== "Australia (Overall)")
    )];

    const select = d3.select("#graph-3-select");
    select.selectAll("option").remove();
    select.selectAll("option")
          .data(jurisdictions)
          .enter()
          .append("option")
          .attr("value", d => d)
          .text(d => d);

    const ausData = preppedData.filter(d => d.jurisdiction === "Australia (Overall)");
    
    drawStackedBar(ausData, "#graph-3-overall", containerWidth);

    // Lenged
    container.selectAll(".graph-3-legend").remove();

    const legend = container
    .append("div")
    .attr("class", "graph-3-legend")
    .style("display", "flex")
    .style("gap", "12px")
    .style("margin-top", "8px");

    ageOrder.forEach((age) => {
    const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px");

    item.append("div")
        .style("width", "12px")
        .style("height", "12px")
        .style("background-color", ageColorMapping(age));

    item.append("span")
        .style("font-size", "12px")
        .text(age);
    });


    const first = jurisdictions[0];
    updateStackedBar(first, containerWidth);

    select.on("change", function () {
        updateStackedBar(this.value, containerWidth);
    });
}

const createGraph4 = (preppedData) => {

    const container = d3.select(".graph-4 .viz-container");
    container.selectAll("*").remove(); // clean

    const width = container.node().getBoundingClientRect().width;
    const height = 260;

    const lolliBlock = container.append("div")
                                .attr("class", "graph4-lollipop-block");

    lolliBlock.append("div")
              .attr("class", "bar-title")
              .style("font-size", "12px")
              .style("font-weight", "600")
              .style("margin-bottom", "4px")
              .text("Selected Jurisdiction");

    const svg = lolliBlock.append("svg")
                          .attr("id", "graph-4-lollipop")
                          .attr("width", width)
                          .attr("height", height);

    const jurisdictions = [...new Set(preppedData
        .map(d => d.jurisdiction)
        .filter(d => d !== "Australia (Overall)")
    )];

    const select = d3.select("#graph-4-select");
    select.selectAll("option").remove();
    select.selectAll("option")
          .data(jurisdictions)
          .enter()
          .append("option")
          .attr("value", d => d)
          .text(d => d);

    const first = jurisdictions[0];
    update(first);

    select.on("change", function () {
        update(this.value);
    });

    function update(jur) {
        const jurData = preppedData.filter(d => d.jurisdiction === jur);
        drawLollipop(jurData, svg, width, height);
    }
}
