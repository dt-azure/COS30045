const createGraph4 = (data, selectedJurisdiction) => {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip tooltip-graph-4");


    const container = d3.select(".graph-4 .viz-container");
    container.selectAll("svg").remove();

    const { width, height } = container.node().getBoundingClientRect();

    const svg = container.append("svg").attr("width", width).attr("height", height);
    const margin = { top: 30, right: 20, bottom: 50, left: 60 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let filtered;
    if (selectedJurisdiction === "Nationwide") {
        filtered = d3.rollups(
            data,
            v => d3.sum(v, d => d.total_fines),
            d => d.age_group,
            d => d.offence_type
        );
    } else {
        filtered = d3.rollups(
            data.filter(d => d.jurisdiction === selectedJurisdiction),
            v => d3.sum(v, d => d.total_fines),
            d => d.age_group,
            d => d.offence_type
        );
    }

    const ageGroups = Array.from(new Set(data.map(d => d.age_group)));
    const flat = ageGroups.map(ageGroup => {
        const row = { age_group: ageGroup };
        const bucket = filtered.find(([ag]) => ag === ageGroup);

        if (bucket) {
            bucket[1].forEach(([offence_type, total]) => {
                row[offence_type] = total;
            });
        }

        return row;
    });

    flat.forEach(row => {
        const total = d3.sum(offenceTypes.map(t => row[t] || 0));
        offenceTypes.forEach(t => {
            row[t] = total ? (row[t] / total) : 0;
        });
    });

    const x = d3.scaleBand()
        .domain(ageGroups)
        .range([0, innerWidth])
        .padding(0.25);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .domain(offenceTypes)
        .range(offenceTypes.map(t => offenceTypeColors[t]));

    const stack = d3.stack().keys(offenceTypes);
    const stackedData = stack(flat);

    const layers = g.selectAll("g.layer")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "layer")
    .attr("fill", d => color(d.key));

    layers.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.age_group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());


    const xAxis = d3.axisBottom(x);

    g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "13px")
        .style("fill", "#0b2540")
        .attr("text-anchor", "middle");

    const yAxis = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d3.format(".0%"));

    g.append("g")
        .call(yAxis)
        .selectAll("text")
        .style("fill", "#0b2540")
        .style("font-size", "13px");

    g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Age Group");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Percentage of Fines");

    addGraph4Interactions(g, stackedData, x, y, color, offenceTypes);
};

const createGraph5 = (data, selectedJurisdiction) => {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip tooltip-graph-5");

    const container = d3.select(".graph-5 .viz-container");
    container.selectAll("svg").remove();

    const { width, height } = container.node().getBoundingClientRect();

    const customeMargin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - customeMargin.left - customeMargin.right;
    const innerHeight = height - customeMargin.top - customeMargin.bottom;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${customeMargin.left},${customeMargin.top})`);

    let filtered;

    if (selectedJurisdiction === "Nationwide") {
        filtered = d3.rollups(
            data,
            v => d3.sum(v, d => d.total_fines),
            d => d.age_group,
            d => d.detection_type
        );
    } else {
        filtered = d3.rollups(
            data.filter(d => d.jurisdiction === selectedJurisdiction),
            v => d3.sum(v, d => d.total_fines),
            d => d.age_group,
            d => d.detection_type
        );
    }


    const ageGroups = Array.from(new Set(data.map(d => d.age_group)));
    const flat = ageGroups.map(ageGroup => {
        const row = { age_group: ageGroup };
        const bucket = filtered.find(([ag]) => ag === ageGroup);

        if (bucket) {
            bucket[1].forEach(([det, total]) => {
                row[det] = total;
            });
        }

        return row;
    });

    const keys = detectionTypes;

    flat.forEach(row => {
        const total = d3.sum(keys.map(k => row[k] || 0));
        keys.forEach(k => {
            row[k] = total ? (row[k] / total) : 0;
        });
    });

    const x = d3.scaleBand()
        .domain(ageGroups)
        .range([0, innerWidth])
        .padding(0.25);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(keys.map(k => detectionTypeColors[k]));

    const stack = d3.stack().keys(keys);
    const stackedData = stack(flat);

    const layers = g.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key));

    layers.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.age_group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .style("font-size", "13px");

    g.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")))
        .style("font-size", "13px");

    g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Age Group");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -48)
        .attr("text-anchor", "middle")
        .text("Percentage of Fines");

    addGraph5Interactions(g, stackedData, x, y, keys);
};

const createGraph6 = (data) => {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip tooltip-graph-6");

    const container = d3.select(".graph-6 .viz-container");
    container.selectAll("svg").remove();

    const { width, height } = container.node().getBoundingClientRect();

    const customMargin = { top: 70, right: 20, bottom: 60, left: 90 };
    const innerWidth = width - customMargin.left - customMargin.right;
    const innerHeight = height - customMargin.top - customMargin.bottom;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${customMargin.left},${customMargin.top})`);

    const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction)));

    const x = d3.scaleBand()
        .domain(ageOrder)
        .range([0, innerWidth])
        .padding(0.05);

    const y = d3.scaleBand()
        .domain(jurisdictions)
        .range([0, innerHeight])
        .padding(0.05);

    const maxRate = d3.max(data, d => d.rate);

    const color = d3.scaleSequential()
        .domain([0, maxRate])
        .interpolator(d3.interpolateBlues);

    const cells = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.age_group))
        .attr("y", d => y(d.jurisdiction))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.rate));

    g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "13px")
        .style("fill", "#0b2540");

    g.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "13px")
        .style("fill", "#0b2540");

    g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Age Group");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -70)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Jurisdiction");

    const legendWidth = 220;
    const legendHeight = 12;

    const legendScale = d3.scaleLinear()
        .domain([0, maxRate])
        .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(5);

    const legend = svg.append("g")
        .attr("transform", `translate(${customMargin.left}, ${customMargin.top - 50})`);

    const defs = svg.append("defs");
    const gradientId = "heat-gradient-graph6";

    const gradient = defs.append("linearGradient")
        .attr("id", gradientId);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", color(0));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color(maxRate));

    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", `url(#${gradientId})`);

    legend.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .selectAll("text")
        .style("font-size", "12px");

    legend.append("text")
        .attr("x", 0)
        .attr("y", -8)
        .style("font-size", "13px")
        .style("fill", "#0b2540")
        .text("Fine Rate per Capita");

    addGraph6Interactions(cells);
};

const createGraph7 = (raw) => {
    d3.select("body")
      .append("div")
      .attr("class", "tooltip tooltip-graph-7");

    const container = d3.select(".graph-7 .viz-container");
    container.selectAll("svg").remove();

    const { width, height } = container.node().getBoundingClientRect();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const grouped = d3.group(raw, d => d.age_group);

    const stats = ageOrder.map(age => {
        const values = grouped.get(age).map(d => d.fines_per_capita_age).sort(d3.ascending);
        return {
            age,
            min: values[0],
            q1: d3.quantile(values, 0.25),
            median: d3.quantile(values, 0.5),
            q3: d3.quantile(values, 0.75),
            max: values[values.length - 1],
            values
        };
    });

    const x = d3.scaleBand()
        .domain(ageOrder)
        .range([0, innerWidth])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stats, d => d.max) * 1.1])
        .range([innerHeight, 0]);

    const boxGroups = g.selectAll("g.box")
        .data(stats)
        .enter()
        .append("g")
        .attr("class", "box")
        .attr("transform", d => `translate(${x(d.age)},0)`);

    boxGroups.each(function (data) {
        const box = d3.select(this);
        const bw = x.bandwidth();

        box.append("line")
            .attr("x1", bw / 2)
            .attr("x2", bw / 2)
            .attr("y1", y(data.min))
            .attr("y2", y(data.max))
            .attr("stroke", "#333");

        box.append("rect")
            .attr("x", 0)
            .attr("width", bw)
            .attr("y", y(data.q3))
            .attr("height", y(data.q1) - y(data.q3))
            .attr("fill", ageColorMapping(data.age))
            .attr("opacity", 0.7)
            .attr("stroke", "#333");

        box.append("line")
            .attr("x1", 0)
            .attr("x2", bw)
            .attr("y1", y(data.median))
            .attr("y2", y(data.median))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        box.append("line")
            .attr("x1", bw * 0.25)
            .attr("x2", bw * 0.75)
            .attr("y1", y(data.min))
            .attr("y2", y(data.min))
            .attr("stroke", "#333");

        box.append("line")
            .attr("x1", bw * 0.25)
            .attr("x2", bw * 0.75)
            .attr("y1", y(data.max))
            .attr("y2", y(data.max))
            .attr("stroke", "#333");
    });

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .style("font-size", "13px");

    g.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "13px");

    g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Age Group");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Fines per Capita");

    addGraph7Interactions(boxGroups, stats, x, y, innerHeight);
};


