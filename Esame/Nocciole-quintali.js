
const grafico = {
    altezza: Math.round(window.innerHeight * 0.9),
    larghezza: Math.round(window.innerWidth * 0.7)
};

let rowConverter = function (d) {
    return {
        //make a new Date object for each year
        TIME: new Date(d.TIME).getFullYear(),
        VALUE: Number(d.Value),
        ITTER107: d.ITTER107,
        TIPO_DATO5: d.TIPO_DATO5,
    };
};



d3.csv("ReportNocciola.csv", function (dati) {
    // carico i dati in una variabile
    let dataset = dati;
    // creo una funzione di filtraggio per ottenere solo i valori relativi ad italia
    let filtraItalia = function (d) {
        return d.ITTER107.length == 2;
    };
    // filtro i valori ottenendo solo quelli relativi ad italia per superficie e quintali
    const soloItalia = dataset.filter(filtraItalia);
    console.log(soloItalia);

    // preparo due funzioni per filtrare superficie e quintali
    let filtraQuintali = function (d) { return d.TIPO_DATO5 == "TP_QUIN_EXT" };
    let filtraSuperficie = function (d) { return d.TIPO_DATO5 == "ART" };

    // proviamo ora a dividere dati produzione da dati superficie
    let superficie = soloItalia.filter(filtraSuperficie);
    console.log(superficie);

    let quintali = soloItalia.filter(filtraQuintali);
    console.log(quintali);

    const massimoQuintali = d3.max(quintali, function (d) { return Number(d.Value) });
    console.log(massimoQuintali);
    const minimoQuintali = d3.min(quintali, function (d) { return Number(d.Value) });
    console.log(minimoQuintali);
    const massimoSuperficie = d3.max(superficie, function (d) { return Number(d.Value) });
    console.log(massimoSuperficie);
    const minimoSuperficie = d3.min(superficie, function (d) { return Number(d.Value) });
    console.log(minimoSuperficie);


    // qui la scala temporale
    scalaTemporale = d3.scaleTime()
        .domain([
            d3.min(superficie, function (d) { return d.TIME; }),
            d3.max(superficie, function (d) { return d.TIME; })
        ])
        .range([0, grafico.larghezza]);



    scalaQuintali = d3.scaleLinear()
        .domain([d3.min(quintali, function (d) {
            return `${Number(d.Value)}`;
        }), d3.max(quintali, function (d) {
            return `${Number(d.Value)}`;
        })])
        .range([grafico.altezza, -10]);

    // define line generator
    let lineaQuintali = d3.line()
        .x(function (d) { return scalaTemporale(d.TIME) })
        .y(function (d) { return scalaQuintali(d.Value) });



    let svg = d3.select("body")
        .append("svg")
        .attr("width", grafico.larghezza)
        .attr("height", grafico.altezza);


    // create line
    svg.append("path")
        .datum(quintali)
        .attr("class", "secondaLinea")
        .attr("d", lineaQuintali);
});