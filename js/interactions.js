const addGraph1Interactions = (paths, lookup, color) => {
    paths
        .on("mouseenter", function(e, d) {
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("fill", colorPink);

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



const addGraph2Interactions = (hoverBars) => {
    const tooltip = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("background", "#fff")
                      .style("padding", "8px 12px")
                      .style("border", "1px solid #ccc")
                      .style("border-radius", "4px")
                      .style("pointer-events", "none")
                      .style("font-size", "12px")
                      .style("opacity", 0)
                      .attr("class", "tooltip graph-2");

hoverBars
  .on("mouseenter", function(e, d) {
    tooltip.style("opacity", 1);

    tooltip.html(`
      <strong>Age group: ${d.age_group}</strong><br>
      Camera: ${d.Camera.toFixed(2)}%<br>
      Police Issued: ${d["Police Issued"].toFixed(2)}%<br>
      Other: ${d.Other.toFixed(2)}%
    `);
  })
  .on("mousemove", e => {
    tooltip.style("left", (e.pageX + 14) + "px")
           .style("top",  (e.pageY + 14) + "px");
  })
  .on("mouseleave", () => tooltip.style("opacity", 0));
}

const initGraph3 = (data) => {
    const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();
    const select = d3.select("#graph-3-select");

    select.append("option")
          .attr("value", "Australia")
          .text("Australia (Overall)");

    jurisdictions.forEach(j => {
        select.append("option")
              .attr("value", j)
              .text(j);
    });

    createGraph3("Australia", data);

    select.on("change", () => {
        createGraph3(select.node().value, data);
    });
}

const addGraph3Interactions = (rects) => {
  rects.on("mouseover", function (event, d) {
      tooltip.style("opacity", 1)
             .html(`<strong>Age group: ${d.age}</strong><br>${(d.proportion * 100).toFixed(1)}%`);
    }).on("mousemove", function (event) {
      tooltip.style("left", (event.pageX + 12) + "px")
             .style("top", (event.pageY + 12) + "px");
    }).on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}

const addGraph4Interactions = (circles) => {
    circles.on("mouseover", (event, d) => {
      tooltip.style("opacity", 1)
             .html(`<strong>${d.age_group}</strong><br>${d.total_fines.toLocaleString()} fines`);
    }).on("mousemove", (event) => {
      tooltip.style("left", (event.pageX + 12) + "px")
             .style("top", (event.pageY + 12) + "px");
    }).on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}