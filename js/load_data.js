const loadStory1 = () => {
    return Promise.all([
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
    }),

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


    }),

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
    })
    ]).catch(error => {
        console.log("Error loading data: ", error);
    });
}

const loadStory2 = () => {
    return Promise.all([
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
    }),

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
    }),

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
    }),

    // Graph 7
    d3.csv("./data/box_plot_fine_arrest_charge_rate_by_age_group_jurisdiction.csv", d => ({
        jurisdiction: d.jurisdiction,
        age_group: d.age_group,
        fines_per_capita_age: +d.fines_per_capita_age
    })).then(data => {
        createGraph7(data);
    })
    ]).catch(error => {
        console.log("Error loading data: ", error);
    });
}

const loadStory3 = () => {
    return Promise.all([
        // Graph 8 + 9
    d3.csv("./data/fine_charge_arrest_by_month_and_jurisdiction.csv", d => ({
        year: +d.year,
        month: +d.month,
        jurisdiction: d.jurisdiction,
        total_fines: +d.total_fines,
        total_arrests: +d.total_arrests,
        total_charges: +d.total_charges,
        date: new Date(+d.year, +d.month - 1)
    }))
    .then(data => {
        // Graph 8
        const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();
        jurisdictions.unshift("Nationwide");

        const dropdownGraph8 = d3.select("#graph-8-select");

        dropdownGraph8.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);

        dropdownGraph8.property("value", "Nationwide");

        createGraph8(data, "Nationwide");

        dropdownGraph8.on("change", function () {
            createGraph8(data, this.value);
        });

        // Graph 9

        const dropdownGraph9 = d3.select("#graph-9-select");

        dropdownGraph9.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);

        dropdownGraph9.property("value", "Nationwide");

        createGraph9(data, "Nationwide");

        dropdownGraph9.on("change", function () {
            createGraph9(data, this.value);
        });
    }),

    // Graph 10
    d3.csv("./data/fine_charge_arrest_by_age_and_jurisdiction.csv", d => ({
        jurisdiction: d.jurisdiction,
        age_group: d.age_group,
        fines: +d.total_fines,
        arrests: +d.total_arrests,
        charges: +d.total_charges
    })).then(data => {
        const jurisdictions = Array.from(new Set(data.map(d => d.jurisdiction))).sort();
        jurisdictions.unshift("Nationwide");

        const dropdownGraph10 = d3.select("#graph-10-select");
        dropdownGraph10.selectAll("option")
            .data(jurisdictions)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        dropdownGraph10.property("value", "Nationwide");

        createGraph10(data, "Nationwide");

        dropdownGraph10.on("change", function () {
            createGraph10(data, this.value);
        });
    })
    ]).catch(error => {
        console.log("Error loading data: ", error);
    });
};

