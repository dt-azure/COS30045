const addGraph1Interactions = (paths, lookup, color) => {
    paths
        .on("mouseenter", function(e, d) {
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("fill", colorBlue3);

            const value = lookup.get(d.properties.STATE_NAME);

            mapTooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.properties.STATE_NAME}</strong><br>
                    ${value.toLocaleString()} fines
                `);
        })
        .on("mousemove", function(e) {
            mapTooltip
                .style("left", (e.pageX + 15) + "px")
                .style("top", (e.pageY + 15) + "px");
        })
        .on("mouseleave", function(e, d) {
            d3.select(this)
                .attr("stroke-width", 1)
                .attr("fill", color(lookup.get(d.properties.STATE_NAME)));

            mapTooltip.style("opacity", 0);
        });
};


const addGraph2Interactions = (g, filtered, x, y, innerWidth, innerHeight) => {
  const tooltip = d3.select(".tooltip")
  
  const hoverLine = g.append("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .style("opacity", 0);


    const hoverCircle = g.append("circle")
        .attr("r", 4)
        .attr("fill", "#3F72AF")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .style("opacity", 0);


    const bisect = d3.bisector(d => d.date).left;

    function onMouseMove(event) {
        const [mx] = d3.pointer(event);

        const hoveredDate = x.invert(mx);
        const index = bisect(filtered, hoveredDate);

        const d0 = filtered[index - 1];
        const d1 = filtered[index];
        const closest =
            !d0 ? d1 :
            !d1 ? d0 :
            (hoveredDate - d0.date) > (d1.date - hoveredDate) ? d1 : d0;

        hoverLine
            .attr("x1", x(closest.date))
            .attr("x2", x(closest.date))
            .style("opacity", 1);

        hoverCircle
            .attr("cx", x(closest.date))
            .attr("cy", y(closest.total_fines))
            .style("opacity", 1);

        tooltip
            .style("opacity", 1)
            .html(`
                <strong>${d3.timeFormat("%b %Y")(closest.date)}</strong><br>
                Fines Issued: ${closest.total_fines.toLocaleString()}
            `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    function onMouseLeave() {
        hoverLine.style("opacity", 0);
        hoverCircle.style("opacity", 0);
        tooltip.style("opacity", 0);
    }

    g.append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave);
}

function addGraph3Interactions(g, arcs, arc, filtered) {
    const tooltip = d3.select(".tooltip");

    const slices = g.selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => offenceTypeColors[d.data.offence_type])
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .style("transition", "all 0.1s ease");

    const totalSum = d3.sum(filtered, d => d.total_fines);

    slices
        .on("mousemove", function (event, d) {
            d3.select(this)
                .transition()
                .duration(80)
                .attr("d", d3.arc()
                    .outerRadius(arc.outerRadius()() + 10)
                    .innerRadius(0)
                );

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.data.offence_type}</strong><br>
                    Fines Issued: ${d.data.total_fines.toLocaleString()} fines<br>
                    Percentage: ${d3.format(".0%")(d.data.total_fines / totalSum)}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseleave", function () {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("d", arc);

            tooltip.style("opacity", 0);
        });
}

const addGraph4Interactions = (g, stackedData, x, y, color, offenceTypes) => {

    const tooltip = d3.select(".tooltip-graph-4");

    g.selectAll("g.layer").selectAll("rect")
        .on("mousemove", function (event, d) {

            const age = d.data.age_group;

            const offence = d3.select(this.parentNode).datum().key;

            const totalFines = d.data[offence] || 0;

            const totalGroup = d3.sum(offenceTypes, t => d.data[t] || 0);

            const pct = totalGroup > 0 ? (totalFines / totalGroup) : 0;

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>Age group: ${age}</strong><br>
                    Offence: ${offence}<br>
                    Fines: ${totalFines.toLocaleString()}<br>
                    Share: ${d3.format(".1%")(pct)}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseleave", function () {
            tooltip.style("opacity", 0);
        });
};

const addGraph5Interactions = (g, stackedData, x, y, keys) => {

    const tooltip = d3.select(".tooltip-graph-5");

    g.selectAll("g.layer").selectAll("rect")
        .on("mousemove", function(event, d) {

            const age = d.data.age_group;
            const detType = d3.select(this.parentNode).datum().key;

            const raw = d.data[detType] || 0;

            const total = d3.sum(keys.map(k => d.data[k] || 0));
            const pct = total ? raw / total : 0;

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>Age group: ${age}</strong><br>
                    Type: ${detType}<br>
                    Percentage: ${d3.format(".1%")(pct)}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseleave", function() {
            tooltip.style("opacity", 0);
        });
};

const addGraph6Interactions = (cells) => {
    const tooltip = d3.select(".tooltip-graph-6");

    cells.on("mousemove", function(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`
                <strong>Jurisdiction: ${d.jurisdiction}</strong><br>
                Age group: ${d.age_group}<br>
                Fine rate: ${(d.rate * 100).toFixed(1)}%
            `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseleave", () => {
        tooltip.style("opacity", 0);
    });
};


const addGraph7Interactions = (boxGroups, stats, x, y, innerHeight) => {

    const tooltip = d3.select(".tooltip-graph-7");

    boxGroups.append("rect")
        .attr("class", "hover-area")
        .attr("x", -5)
        .attr("width", x.bandwidth() + 10)
        .attr("y", 0)
        .attr("height", innerHeight)
        .style("fill", "transparent")
        .style("pointer-events", "all")
        .on("mousemove", function (event, d) {

            tooltip.style("opacity", 1)
                .html(`
                    <strong>Age group: ${d.age}</strong><br>
                    Min: ${d.min.toFixed(4)}<br>
                    Q1: ${d.q1.toFixed(4)}<br>
                    Median: ${d.median.toFixed(4)}<br>
                    Q3: ${d.q3.toFixed(4)}<br>
                    Max: ${d.max.toFixed(4)}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseleave", function () {
            tooltip.style("opacity", 0);
        });
};

const addGraph8Interactions = (g, data, x, y, innerWidth, innerHeight, metricKey, color) => {
    const marker = g.append("circle")
        .attr("r", 4)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("opacity", 0);

    g.append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", function(event) {

            const [mx] = d3.pointer(event);
            const hoveredDate = x.invert(mx);

            const bisect = d3.bisector(d => d.date).left;
            const i = bisect(data, hoveredDate);

            const d0 = data[i - 1];
            const d1 = data[i];
            const d = (!d0) ? d1 :
                      (!d1) ? d0 :
                      (hoveredDate - d0.date > d1.date - hoveredDate ? d1 : d0);

            marker
                .style("opacity", 1)
                .attr("cx", x(d.date))
                .attr("cy", y(d[metricKey]));

            metricKeyCleaned = metricKey.replace("total_", "").replace("_", " ");
            tooltipGraph8
                .interrupt()
                .style("opacity", 1)
                .html(`
                    <strong>${d3.timeFormat("%b %Y")(d.date)}</strong><br>
                    ${metricKeyCleaned.charAt(0).toUpperCase() + metricKeyCleaned.slice(1)}:
                    ${d[metricKey].toLocaleString()}
                `)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseleave", () => {
            marker.style("opacity", 0);
            tooltipGraph8.style("opacity", 0);
        });
}

const addGraph9Interactions = (g, filtered, tooltipGraph9) => {
    g.selectAll("rect")
        .on("mousemove", function (event, d) {

            const year = d.data.year;
            const row = filtered.find(r => r.year === year);

            tooltipGraph9
                .interrupt()
                .style("opacity", 1)
                .html(`
                    <strong>${year}</strong><br>
                    Fines: ${row.fines.toLocaleString()} (${(row.fines_pct * 100).toFixed(1)}%)<br>
                    Charges: ${row.charges.toLocaleString()} (${(row.charges_pct * 100).toFixed(1)}%)<br>
                    Arrests: ${row.arrests.toLocaleString()} (${(row.arrests_pct * 100).toFixed(1)}%)
                `)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseleave", () => {
            tooltipGraph9.style("opacity", 0);
        });
};






