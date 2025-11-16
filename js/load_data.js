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

const loadStory2 = () => {
    // Graph 4
    d3.csv("./data/violation_type_by_type_age_and_jurisdiction.csv", d => {
        return {
            jurisdiction: d.jurisdiction,
            age_group: d.age_group,
            offence_type: d.metric,
            total_fines: +d.total_fines
        };
    }).then(data => {
       const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();
        jurisdictions.unshift("Nationwide");

        const dropdown = d3.select("#graph-4-select");
        dropdown.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        dropdown.property("value", "Nationwide");

        createGraph4(data, "Nationwide");

        dropdown.on("change", function() {
            createGraph4(data, this.value);
        });
    }).catch(error => {
        console.log("Error loading data: ", error);
    });

    // Graph 5
    d3.csv("./data/detection_by_type_age_and_jurisdiction.csv", d => {
        return {
            jurisdiction: d.jurisdiction,
            age_group: d.age_group,
            detection_type: d.detection_group,
            total_fines: +d.total_fines
        };
    }).then(data => {
       const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();
        jurisdictions.unshift("Nationwide");

        const dropdown = d3.select("#graph-5-select");
        dropdown.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        dropdown.property("value", "Nationwide");

        createGraph5(data, "Nationwide");

        dropdown.on("change", function() {
            createGraph5(data, this.value);
        });
    }).catch(error => {
        console.log("Error loading data: ", error);
    });

    // Graph 6
    d3.csv("./data/heatmap_fine_rate_per_capita_age.csv").then(raw => {

        const data = [];

        raw.forEach(row => {
            ageOrder.forEach(age => {
                data.push({
                    jurisdiction: row.jurisdiction,
                    age_group: age,
                    rate: +row[age]
                });
            });
        });

        createGraph6(data); 
    }).catch(error => {
        console.log("Error loading data: ", error);
    });

    // Graph 7
    d3.csv("./data/box_plot_fine_arrest_charge_rate_by_age_group_jurisdiction.csv", d => ({
        jurisdiction: d.jurisdiction,
        age_group: d.age_group,
        fines_per_capita_age: +d.fines_per_capita_age
    })).then(data => {
        createGraph7(data);
    }).catch(error => {
        console.log("Error loading data: ", error);
    });
}

const loadStory3 = () => {
    // Graph 8
    d3.csv("./data/fine_charge_arrest_by_month_and_jurisdiction.csv", d => ({
        year: +d.year,
        month: +d.month,
        jurisdiction: d.jurisdiction,
        total_fines: +d.total_fines,
        total_arrests: +d.total_arrests,
        total_charges: +d.total_charges,
        date: new Date(+d.year, +d.month - 1)
    })).then(raw => {

        const aggregated = d3.rollups(
            raw,
            v => ({
                total_fines: d3.sum(v, d => d.total_fines),
                total_arrests: d3.sum(v, d => d.total_arrests),
                total_charges: d3.sum(v, d => d.total_charges),
                date: new Date(v[0].year, v[0].month - 1)
            }),
            d => d.jurisdiction,
            d => d.year,
            d => d.month
        ).flatMap(([jurisdiction, years]) =>
            years.flatMap(([year, months]) =>
                months.map(([month, vals]) => ({
                    jurisdiction,
                    year,
                    month,
                    ...vals
                }))
            )
        );

        const jurisdictions = Array.from(new Set(aggregated.map(d => d.jurisdiction))).sort();
        jurisdictions.unshift("Nationwide");

        const dropdown = d3.select("#graph-8-select")
            .on("change", function () {
                createGraph8(aggregated, this.value);
            });

        dropdown.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);

        dropdown.property("value", "Nationwide");

        createGraph8(aggregated, "Nationwide");
    }).catch(error => {
        console.log("Error loading data: ", error);
    });

    // Graph 9
    d3.csv("./data/fine_charge_arrest_by_month_and_jurisdiction.csv", d => ({
    year: +d.year,
    month: +d.month,
    jurisdiction: d.jurisdiction,
    total_fines: +d.total_fines,
    total_arrests: +d.total_arrests,
    total_charges: +d.total_charges
})).then(data => {

    const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();
    jurisdictions.unshift("Nationwide");

    const dropdown = d3.select("#graph-9-select");

    dropdown.selectAll("option")
        .data(jurisdictions)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    dropdown.property("value", "Nationwide");

    createGraph9(data, "Nationwide");

    dropdown.on("change", function () {
        createGraph9(data, this.value);
    });
});

};
