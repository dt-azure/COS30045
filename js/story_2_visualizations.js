const createGraph3 = (selectedOption, raw) => {
    let filtered;

    if (selectedOption === "Australia") {
        filtered = d3.rollups(
            raw,
            v => d3.sum(v, d => d.total_fines),
            d => d.age_group
        ).map(([age_group, total]) => ({ age_group, total }));
    } else {
        const r = raw.filter(d => d.jurisdiction === selectedOption);

        filtered = d3.rollups(
            r,
            v => d3.sum(v, d => d.total_fines),
            d => d.age_group
        ).map(([age_group, total]) => ({ age_group, total }));
    }

    const grandTotal = d3.sum(filtered, d => d.total);

    filtered.forEach(d => {
        d.percent = (d.total / grandTotal) * 100;
    });

    console.log(filtered);


    const container = d3.select(".graph-3 .viz-container");
    container.selectAll("*").remove();

    const { width, height } = container.node().getBoundingClientRect();
    const margin = {top: 30, right: 20, bottom: 40, left: 60};

    const svg = container.append("svg")
                         .attr("width", width)
                         .attr("height", height);

    const ageOrder = ["0-16", "17-25", "26-39", "40-64", "65 and over"];

    const x = d3.scaleBand().domain(ageOrder).range([margin.left, width - margin.right]).padding(0.35);
    const y = d3.scaleLinear().domain([0,100]).range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
                    .domain(ageOrder)
                    .range(d3.schemeSet2);

    svg.selectAll("rect")
        .data(filtered)
        .enter()
        .append("rect")
        .attr("x", d => x(d.age_group))
        .attr("y", d => y(d.percent))
        .attr("width", x.bandwidth())
        .attr("height", d => (height - margin.bottom) - y(d.percent))
        .attr("fill", d => color(d.age_group));

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(d => d + "%"));
}