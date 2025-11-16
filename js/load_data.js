const loadStory1 = () => {
    //   Graph 1
    Promise.all([
        d3.json("./data/australian_states.json"),
        d3.csv("./data/total_fines_arrests_charges_jurisdictions.csv", d => ({
                jurisdiction: d.jurisdiction,
                total_fines: +d.sum_fines,
                total_arrests: +d.sum_arrests,
                total_charges: +d.sum_charges
        }))
    ])
    .then(([geo, data]) => {
        createGraph1(geo, data);
    }).catch(error => {
        console.log("Error loading data: ", error);
    });

    // Graph 2
    d3.csv("./data/total_fines_by_month.csv", d => {
        return {
            year: +d.year,
            month: +d.month,
            date: new Date(d.year, d.month - 1),
            total_fines: +d.total_fines
        };
    }).then(data => {
        const years = Array.from(new Set(data.map(d => d.year))).sort();

        const dropdown = d3.select("#graph-1-select");

        dropdown.selectAll("option")
            .data(years)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        const defaultYear = years[years.length - 1];
        dropdown.property("value", defaultYear);

        dropdown.on("change", function () {
            createGraph2(data, +this.value);
        });

        createGraph2(data, defaultYear);


    }).catch(error => {
        console.log("Error loading data: ", error);
    });

    // Graph 3
    d3.csv("./data/violation_types_by_jurisdiction.csv", d => {
        return {
            jurisdiction: d.jurisdiction,
            offence_type: d.metric,
            total_fines: +d.total_fines
        };
    }).then(data => {
        const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();

        jurisdictions.unshift("Nationwide");

        const dropdown = d3.select("#graph-3-select");

        dropdown.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        dropdown.property("value", "Nationwide");

        createGraph3(data, "Nationwide");

        dropdown.on("change", function () {
            createGraph3(data, this.value);
        });
    }).catch(error => {
        console.log("Error loading data: ", error);
    });
}

// const loadStory2 = () => {
//     d3.csv("./data/detection_by_type_age_and_jurisdiction.csv", d => {
//         return {
//             jurisdiction: d.jurisdiction,
//             age_group: d.age_group,
//             detection_group: d.detection_group,
//             total_fines: +d.total_fines
//         };
//     }).then(data => {
//         preppedData = prepGraph3Data(data);
//         createGraph3(preppedData);
//         createGraph4(preppedData);
//     }).catch(error => {
//         console.log("Error loading data: ", error);
//     });
// }

const loadStory3 = () => {
    return;
}