"use strict"
let righe = new Array();
d3.csv("Istat-popolazioneResidentePerRegione2021.csv", function (dati) {
    console.log(dati); /* per vedere nella console l'array dati */
    /* il valore massimo è il totale dell'Italia */
    const valoreMassimo = Number(dati[0].Value);


    righe =
        d3.select("body")
            .append("table")
            .selectAll("tr")
            .data(dati)
            .enter()
            .append("tr");

    righe.append("td")
        .text(function (d) {
            return d.Territorio
        });

    righe.append("td")
        .append("div")
        .style("width", function (d) {
            /* rapporta la larghezza al massimo */
            let larghezzaBarra = Math.round(d.Value / valoreMassimo * 100)
            return `${larghezzaBarra}%`
        })
        .text(function (d) { return Number(d.Value).toLocaleString() })


    d3.selectAll("table")
        .append("caption")
        .text("Didascalia di prova")
});


d3.select("body")
.append("h1")
.text("ciao mondo");

d3.select("body")
.append("p")
.text("ma guarda tu che roba")