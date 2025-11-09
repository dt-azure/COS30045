const addGraph1Interactions = (bars) => {
    const tooltip = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("background", "#fff")
                      .style("padding", "6px 10px")
                      .style("border", "1px solid #ccc")
                      .style("border-radius", "4px")
                      .style("pointer-events", "none")
                      .style("font-size", "12px")
                      .style("opacity", 0)
                      .attr("class", "tooltip graph-1");;

  bars.on("mouseenter", function(e, d) {
      d3.select(this).attr("fill", colorBlue1);
      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d.jurisdiction}</strong><br>
          Fines: ${d.total_fines.toLocaleString()}
        `);
    }).on("mousemove", function(e) {
      tooltip
        .style("left", (e.pageX + 12) + "px")
        .style("top", (e.pageY + 12) + "px");
    }).on("mouseleave", function() {
      d3.select(this).attr("fill", colorMain);
      tooltip.style("opacity", 0);
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