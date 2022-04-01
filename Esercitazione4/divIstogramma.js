/* "use strict"
d3.csv("Istat-popolazioneResidentePerRegione2021.csv", function(dati){
    console.log(dati);
    const larghezzaBarre = Math.floor(100/dati.length);
    const valoreMassimo = Number(dati[0].Value);
    document.getElementById("aggiornamento").innerHTML = 
    dati[0]["Tipo di indicatore demografico"]+" "+dati[0].TIME;
d3.select("figure")
.selectAll("div")
.data(dati)
.enter()
.append("div")
.style("width", `${larghezzaBarre}%`)
.style("height", function(d){
    let altezzaBarra = Math.round(d.Value / valoreMassimo * 100)
    return `${altezzaBarra}%`
})
.attr("title", function(d){

    return `${d.Territorio}:${Number(d.Value).toLocaleString()}`})

}) */

"use strict" /* obbliga a dichiarare tutte le variabili utilizzate */
d3.csv("Istat-popolazioneResidentePerRegione2021.csv", function (dati) {
    console.log(dati);
    const larghezzaBarre = Math.floor(100 / dati.length);
    /* il valore massimo è il totale dell'Italia */
    const valoreMassimo = Number(dati[0].Value);
    document.getElementById("aggiornamento").innerHTML =
        dati[0]["Tipo di indicatore demografico"] + " " + dati[0].TIME;
    d3.select("figure")
        .selectAll("div")
        .data(dati)
        .enter()
        .append("div")
        .style("width", `${larghezzaBarre}%`)
        .style("height", function (d) {
            /* rapporta l'altezza al massimo */
            let altezzaBarra = Math.round(d.Value / valoreMassimo * 100)
            return `${altezzaBarra}%`
        })
        .attr("title", function (d) {
            return `${d.Territorio}: ${Number(d.Value).toLocaleString()}`
            /* Number() converte la stringa in numero e toLocaleString() scrive il numero con le migliaia */
})

});