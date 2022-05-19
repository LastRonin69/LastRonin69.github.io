
const grafico = {
    altezza: Math.round(window.innerHeight * 0.8),
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

    // calcolato il massimo e il minimo degli ettari
    const massimoSuperficie = d3.max(superficie, function (d) { return Number(d.Value) });
    console.log(massimoSuperficie);
    const minimoSuperficie = d3.min(superficie, function (d) { return Number(d.Value) });
    console.log(minimoSuperficie);
    // calcolato il massimo e il minimo dei quintali, che sono stati convertiti in tonnellate
    const massimoQuintali = d3.max(quintali, function (d) { return Number(d.Value) / 10 });
    console.log(massimoQuintali);
    const minimoQuintali = d3.min(quintali, function (d) { return Number(d.Value) / 10 });
    console.log(minimoQuintali);

    // lo spazio occupato dalla legenda dell'asse sinistro, ogni carattere è grande circa 8px, dato trovato su internet
    let spazioLegenda = d3.max(superficie, function (d) { return d.Value.length * 8 });
    console.log(spazioLegenda);

    // scala temporale
    scalaTemporale = d3.scaleTime()
        .domain([
            d3.min(superficie, function (d) { return new Date(d.TIME) }),
            d3.max(superficie, function (d) { return new Date(d.TIME) })
        ])
        .range([0, grafico.larghezza]);

    // scala superficie
    scalaSuperficie = d3.scaleLinear()
        .domain([d3.min(superficie, function (d) {
            return d.Value;
        }), d3.max(superficie, function (d) {
            return d.Value;
        })])
        .range([grafico.altezza, 0]);

    // definire linea superficie
    let lineaSuperficie = d3.line()
        .x(function (d) { return scalaTemporale(new Date(d.TIME)) })
        .y(function (d) { return scalaSuperficie(d.Value) });

    // scala tonnellate
    scalaQuintali = d3.scaleLinear()
        .domain([minimoQuintali, massimoQuintali])
        .range([grafico.altezza, 0]);

    // definire linea quintali (dividendo per 10 ogni valore (d.Value) si convertono quintali in tonnellate)
    let lineaTonnellate = d3.line()
        .x(function (d) { return scalaTemporale(new Date(d.TIME)) })
        .y(function (d) { return scalaQuintali(d.Value / 10) });


    // svg che conterrà le linee, gli assi e quindi tutto il grafico
    let svg = d3.select("body")
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    // creare linea superficie
    svg.append("path")
        .datum(superficie)
        .attr("transform", `translate(${spazioLegenda},0)`)
        .attr("class", "classeLineaSuperficie")
        .attr("d", lineaSuperficie);

    // creare linea tonnellate
    svg.append("path")
        .datum(quintali)
        .attr("transform", `translate(${spazioLegenda},0)`)
        .attr("class", "classeLineaQuintali")
        .attr("d", lineaTonnellate);


    // asse temporale o asse delle ascisse
    let asseTemporale = d3.axisBottom()
        .scale(scalaTemporale);

    svg.append("g")
        .attr("transform", `translate( ${spazioLegenda}, ${grafico.altezza})`)
        .attr("class", "asseTemporale")
        .call(asseTemporale);

    // asse delle ordinate sinistro, della superficie in ettari
    let asseOrdinateSuperficie = d3.axisLeft()
        .scale(scalaSuperficie)
        .ticks(5);

    svg.append("g")
        .attr("transform", `translate(${spazioLegenda},0)`)
        .classed("asseSuperficie","true")
        .call(asseOrdinateSuperficie);

    // asse delle ordinate destro, della produzione in tonnellate
    let asseOrdinateQuintali = d3.axisRight()
        .scale(scalaQuintali)
        .ticks(5);

    svg.append("g")
        .attr("transform", `translate(${grafico.larghezza + spazioLegenda},0)`)
        .classed("asseQuintali","true")
        .call(asseOrdinateQuintali);


});



// azione interattiva che permette di disattivare una delle due linee o entrambe
d3.select(`#quintali`).on("click", function () {
    if (this.checked) d3.selectAll(`.classeLineaQuintali`).attr(`style`, `display: block`)
    else d3.selectAll(`.classeLineaQuintali`).attr(`style`, `display: none`)
});

d3.select(`#superficie`).on("click", function () {
    if (this.checked) d3.selectAll(`.classeLineaSuperficie`).attr(`style`, `display: block`)
    else d3.selectAll(`.classeLineaSuperficie`).attr(`style`, `display: none`)
});