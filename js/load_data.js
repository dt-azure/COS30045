const loadStory1 = () => {
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


    d3.csv("./data/total_detections_by_age_group.csv", d => {
        return {
            age_group: d.age_group,
            detection_group: d.detection_group,
            total_fines: +d.sum_fines_of_each_method_in_each_group,
            percentage: +d.percentage_in_age_group
        };
    }).then(data => {
        createGraph2(data)
    }).catch(error => {
        console.log("Error loading data: ", error);
    });
}

const loadStory2 = () => {
    d3.csv("./data/detection_by_type_age_and_jurisdiction.csv", d => {
        return {
            jurisdiction: d.jurisdiction,
            age_group: d.age_group,
            detection_group: d.detection_group,
            total_fines: +d.total_fines
        };
    }).then(data => {
        preppedData = prepGraph3Data(data);
        createGraph3(preppedData);
        createGraph4(preppedData);
    }).catch(error => {
        console.log("Error loading data: ", error);
    });
}

const loadStory3 = () => {
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


    d3.csv("./data/total_detections_by_age_group.csv", d => {
        return {
            age_group: d.age_group,
            detection_group: d.detection_group,
            total_fines: +d.sum_fines_of_each_method_in_each_group,
            percentage: +d.percentage_in_age_group
        };
    }).then(data => {
        createGraph2(data)
    }).catch(error => {
        console.log("Error loading data: ", error);
    });
}