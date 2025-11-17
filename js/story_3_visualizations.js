d3.select(".tooltip-graph-8").remove();
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

    y.domain([0, d3.max(data, d => d[metricKey])]).nice();

    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d3.format(",.0f"));

    g.append("g")
        .call(yAxis)
        .selectAll("text")
        .style("fill", "#0b2540");


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
    d3.select(".tooltip-graph-9").remove();
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

const createGraph10 = (rawData, selectedJurisdiction) => {
    d3.selectAll(".tooltip-graph-10").remove();

    const tooltipGraph10 = d3.select("body")
        .append("div")
        .attr("class", "tooltip tooltip-graph-10");

    const container = d3.select(".graph-10 .viz-container");
    container.selectAll("svg").remove();

    const { width, height } = container.node().getBoundingClientRect();
    const margin = { top: 70, right: 30, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const metrics = ["fines", "arrests", "charges"];

    let filtered;

    if (selectedJurisdiction === "Nationwide") {
        filtered = ageOrder.map(age => {
            const rows = rawData.filter(r => r.age_group === age);
            return {
                age_group: age,
                fines: d3.sum(rows, d => d.fines),
                arrests: d3.sum(rows, d => d.arrests),
                charges: d3.sum(rows, d => d.charges)
            };
        });
    } else {
        filtered = rawData.filter(d => d.jurisdiction === selectedJurisdiction);
    }

    const longData = filtered.flatMap(row =>
        metrics.map(metric => ({
            age_group: row.age_group,
            metric,
            value: row[metric]
        }))
    );

    const x = d3.scaleBand()
        .domain(metrics)
        .range([0, innerWidth])
        .padding(0.15);

    const y = d3.scaleBand()
        .domain(ageOrder)
        .range([0, innerHeight])
        .padding(0.15);

    const rawMax = d3.max(longData, d => d.value);

    function roundMax(v) {
        if (v > 1_000_000) return Math.ceil(v / 500_000) * 500_000;
        if (v > 100_000)   return Math.ceil(v / 100_000) * 100_000;
        return Math.ceil(v / 10_000) * 10_000;
    }

    const legendMax = roundMax(rawMax);
    const logMax = Math.log(legendMax + 1);

    const color = d3.scaleSequential()
        .domain([0, logMax])
        .interpolator(d3.interpolateBlues);

    const cells = g.selectAll("rect")
        .data(longData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.metric))
        .attr("y", d => y(d.age_group))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(Math.log(d.value + 1)));

    addGraph10Interactions(cells);

    g.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "13px");

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).tickFormat(d =>
            d.charAt(0).toUpperCase() + d.slice(1)
        ))
        .selectAll("text")
        .style("font-size", "13px");

    const legendWidth = innerWidth - 40;
    const legendHeight = 12;

    const legendScale = d3.scaleLinear()
        .domain([0, logMax])
        .range([0, legendWidth]);

    const legendTicks = [0, logMax];

    const fmtLegend = t => {
        let raw = Math.exp(t) - 1;
        if (Math.abs(raw - legendMax) < 2) raw = legendMax;

        if (raw >= 1_000_000) return (raw / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        if (raw >= 1000)      return (raw / 1000).toFixed(0) + "k";
        return Math.round(raw);
    };

    const legendAxis = d3.axisBottom(legendScale)
        .tickValues(legendTicks)
        .tickFormat(fmtLegend);

    const legend = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top - 35})`);

    const defs = svg.append("defs");
    const gradientId = "heatmap10-gradient";

    const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("x2", "100%");

    const STEPS = 80;
    for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const linearValue = t * legendMax;
        const logValue = Math.log(linearValue + 1);
        gradient.append("stop")
            .attr("offset", `${t * 100}%`)
            .attr("stop-color", color(logValue));
    }

    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", `url(#${gradientId})`);

    legend.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#0b2540");

    legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .style("font-size", "13px")
        .style("font-weight", 600)
        .style("fill", "#0b2540")
        .text("Fine / Arrest / Charge Value");
};





