const prepGraph3Data = (data) => {

    // group by jurisdiction → then by age_group
    const byJurisdiction = d3.rollups(
        data,
        v => d3.sum(v, d => +d.total_fines),
        d => d.jurisdiction,
        d => d.age_group
    );

    // turn that into tidy rows
    let tidy = [];

    for (const [jur, ageArr] of byJurisdiction) {
        for (const age of ageOrder) {

            // ageArr = array like: [ ["0-16", 144], ["17-25", 22154], ... ]
            const found = ageArr.find(([k]) => k === age);
            const total = found ? found[1] : 0;

            tidy.push({
                jurisdiction: jur,
                age_group: age,
                total_fines: total
            });
        }
    }

    // compute Australia Overall
    const overall = d3.rollups(
        tidy,
        v => d3.sum(v, d => d.total_fines),
        d => d.age_group
    ).map(([age, sum]) => ({
        jurisdiction: "Australia (Overall)",
        age_group: age,
        total_fines: sum
    }));

    tidy = tidy.concat(overall);

    // proportions for stacked bars
    const totalByJur = d3.rollup(
        tidy,
        v => d3.sum(v, d => d.total_fines),
        d => d.jurisdiction
    );

    const tidyWithProps = tidy.map(d => ({
        ...d,
        proportion: d.total_fines / totalByJur.get(d.jurisdiction)
    }));

    return tidyWithProps;
}