const addGraph1Interactions = (paths, lookup) => {
    paths
        .on("mouseenter", function(e, d) {
            d3.select(this).attr("stroke-width", 2);

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
        .on("mouseleave", function() {
            d3.select(this).attr("stroke-width", 1);
            mapTooltip.style("opacity", 0);
        });
}


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