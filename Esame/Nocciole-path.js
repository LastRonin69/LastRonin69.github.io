
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

//spazioGrafico


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


    const massimoSuperficie = d3.max(superficie, function (d) { return Number(d.Value) });
    console.log(massimoSuperficie);
    const minimoSuperficie = d3.min(superficie, function (d) { return Number(d.Value) });
    console.log(minimoSuperficie);
    const massimoQuintali = d3.max(quintali, function (d) { return Number(d.Value)/10 });
    console.log(massimoQuintali);
    const minimoQuintali = d3.min(quintali, function (d) { return Number(d.Value)/10 });
    console.log(minimoQuintali);

let spazioLegenda = d3.max(superficie, function (d) { return d.Value.length * 8 }) ;
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

    // scala quintali
    scalaQuintali = d3.scaleLinear()
        .domain([minimoQuintali, massimoQuintali])
        .range([ grafico.altezza ,0]);

    // definire linea quintali (dividendo per 10 si convertono quintali in tonnellate)
    let lineaQuintali = d3.line()
        .x(function (d) { return scalaTemporale(new Date(d.TIME)) })
        .y(function (d) { return scalaQuintali(d.Value/10) });


    // svg che conterrà le linee
    let svg = d3.select("body")
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    // creare linea superficie
    svg.append("path")
        .datum(superficie)
        .attr("transform", `translate(${spazioLegenda},0)`)
        .attr("class", "primaLinea")
        .attr("d", lineaSuperficie);

    // creare linea quintali
    svg.append("path")
        .datum(quintali)
        .attr("transform", `translate(${spazioLegenda},0)`)
        .attr("class", "secondaLinea")
        .attr("d", lineaQuintali);

// andiamo ora a ragionare sugli assi grafici

let asseTemporale = d3.axisBottom()
.scale(scalaTemporale);

svg.append("g")
.attr("transform",`translate( ${spazioLegenda}, ${grafico.altezza})`)
.attr("class", "asseTemporale")
.call(asseTemporale);

// assi delle ordinate
let asseOrdinate = d3.axisLeft()
.scale(scalaSuperficie)
.ticks(5);

svg.append("g")
.attr("transform",`translate(${spazioLegenda},0)`)
.call(asseOrdinate);

let asseOrdinateQuintali = d3.axisRight()
.scale(scalaQuintali)
.ticks(5);

svg.append("g")
.attr("transform",`translate(${grafico.larghezza + spazioLegenda},0)`)
.call(asseOrdinateQuintali);


});




d3.select(`#quintali`).on("click", function () {
    if (this.checked) d3.selectAll(`.secondaLinea`).attr(`style`, `display: block`)
    else d3.selectAll(`.secondaLinea`).attr(`style`, `display: none`)
});

d3.select(`#superficie`).on("click", function () {
    if (this.checked) d3.selectAll(`.primaLinea`).attr(`style`, `display: block`)
    else d3.selectAll(`.primaLinea`).attr(`style`, `display: none`)
});