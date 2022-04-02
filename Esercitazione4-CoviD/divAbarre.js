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
});