let tooltipGraph8 = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip tooltip-graph-8");

const drawMiniLineChart = (parent, data, metricKey, label, color) => {

    const { width, height } = parent.node().getBoundingClientRect();

    const customMargin = { top: 25, right: 40, bottom: 45, left: 55 };
    const innerWidth = width - customMargin.left - customMargin.right;
    const innerHeight = height - customMargin.top - customMargin.bottom;

    const svg = parent.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${customMargin.left},${customMargin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, innerWidth]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[metricKey]) * 1.1])
        .range([innerHeight, 0]);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d[metricKey]))
        .curve(d3.curveMonotoneX);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end")
        .style("font-size", "13px");

    g.append("g").call(d3.axisLeft(y))
                 .style("font-size", "13px");

    g.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .style("font-weight", "600")
        .style("font-size", "14px")
        .text(label);

    return { g, x, y, innerWidth, innerHeight };
};

const createGraph8 = (data, selectedJurisdiction) => {
    const container = d3.select(".graph-8 .viz-container");
    container.selectAll("*").remove();

    let filtered;

    if (selectedJurisdiction === "Nationwide") {

        filtered = d3.rollups(
            data,
            v => ({
                total_fines: d3.sum(v, d => d.total_fines),
                total_arrests: d3.sum(v, d => d.total_arrests),
                total_charges: d3.sum(v, d => d.total_charges),
                date: v[0].date
            }),
            d => d.year,
            d => d.month
        )
        .flatMap(([year, months]) =>
            months.map(([month, vals]) => ({
                year,
                month,
                ...vals
            }))
        );

    } else {
        filtered = data.filter(d => d.jurisdiction === selectedJurisdiction);
    }

    if (!filtered.length) return;

    filtered = filtered.sort((a, b) => a.date - b.date);

    const panels = [
        { key: "total_fines", label: "Fines", color: "#3F72AF" },
        { key: "total_arrests", label: "Arrests", color: "#EA801C" },
        { key: "total_charges", label: "Charges", color: "#C44E52" }
    ];

    panels.forEach(p => {
        const panelDiv = container.append("div")
            .attr("class", "mini-chart")
            .style("height", "250px");

        const mini = drawMiniLineChart(
            d3.select(panelDiv.node()),
            filtered,
            p.key,
            p.label,
            p.color
        );

        addGraph8Interactions(
            mini.g,
            filtered,
            mini.x,
            mini.y,
            mini.innerWidth,
            mini.innerHeight,
            p.key,
            p.color
        );
    });
};

const createGraph9 = (data, selectedJurisdiction) => {

    const tooltipGraph9 = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip tooltip-graph-9")
                            .style("opacity", 0);

    const container = d3.select(".graph-9 .viz-container");
    container.selectAll("*").remove();

    let filtered = (selectedJurisdiction === "Nationwide")
        ? data
        : data.filter(d => d.jurisdiction === selectedJurisdiction);

    filtered = d3.rollups(
        filtered,
        v => ({
            fines: d3.sum(v, d => d.total_fines),
            charges: d3.sum(v, d => d.total_charges),
            arrests: d3.sum(v, d => d.total_arrests)
        }),
        d => d.year
    ).map(([year, vals]) => ({
        year,
        ...vals
    }));

    filtered.forEach(d => {
        const total = d.fines + d.charges + d.arrests;
        d.fines_pct   = d.fines   / total;
        d.charges_pct = d.charges / total;
        d.arrests_pct = d.arrests / total;
        d.total = total;
    });

    const { width, height } = container.node().getBoundingClientRect();
    const customMargin = { top: 30, right: 40, bottom: 50, left: 80 };
    const innerWidth = width - customMargin.left - customMargin.right;
    const innerHeight = height - customMargin.top - customMargin.bottom;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
        .domain(filtered.map(d => d.year))
        .range([0, innerHeight])
        .padding(0.25);

    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, innerWidth]);

    const keys = ["fines_pct", "charges_pct", "arrests_pct"];

    const colors = {
        "fines_pct": "#3F72AF",
        "charges_pct": "#C44E52",
        "arrests_pct": "#EA801C"
    };

    const stackGen = d3.stack().keys(keys);
    const stackedData = stackGen(filtered);

    g.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", d => colors[d.key])
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
            .attr("y", d => y(d.data.year))
            .attr("x", d => x(d[0]))
            .attr("height", y.bandwidth())
            .attr("width", d => x(d[1]) - x(d[0]));

    g.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style("fill", "#0b2540")
        .style("font-size", "13px");

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%")))
        .selectAll("text")
        .style("fill", "#0b2540");

    g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Proportion of Enforcement Actions");

    addGraph9Interactions(g, filtered, tooltipGraph9);
};



