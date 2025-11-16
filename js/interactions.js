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

// const addGraph4Interactions = (circles) => {
//     circles.on("mouseover", (event, d) => {
//       tooltip.style("opacity", 1)
//              .html(`<strong>${d.age_group}</strong><br>${d.total_fines.toLocaleString()} fines`);
//     }).on("mousemove", (event) => {
//       tooltip.style("left", (event.pageX + 12) + "px")
//              .style("top", (event.pageY + 12) + "px");
//     }).on("mouseout", () => {
//       tooltip.style("opacity", 0);
//     });
// }