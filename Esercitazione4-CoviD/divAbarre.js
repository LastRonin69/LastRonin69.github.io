"use strict"
let righe = new Array();
d3.csv("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv", function (dati) {
console.log(dati); /* per vedere nella console l'array dati */
/* il valore massimo è il totale dell'Italia */
const valoreMassimo = Number(dati[8].totale_casi);
righe =
d3.select("body")
.append("table")
.selectAll("tr")
.data(dati)
.enter()
.append("tr");

righe.append("td")
.text(function (d) {
return d.denominazione_regione
});

righe.append("td")
.append("div")
.style("width", function (d) {
/* rapporta la larghezza al massimo */
let larghezzaBarra = Math.round(d.totale_casi / valoreMassimo * 100)
return `${larghezzaBarra}%`
})
.text(function (d) { return Number(d.totale_casi).toLocaleString() })
});