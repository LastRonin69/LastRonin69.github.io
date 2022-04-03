"use strict" /* obbliga a dichiarare tutte le variabili utilizzate */
d3.csv("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv", function (dati) {
    console.log(dati);
    const larghezzaBarre = Math.floor(100 / dati.length);
    /* il valore massimo è il totale dell'Italia */
    const valoreMassimo = Number(dati[8].totale_casi);
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
            let altezzaBarra = Math.round(d.totale_casi / valoreMassimo * 100)
            return `${altezzaBarra}%`
        })
        .attr("title", function (d) {
            return `${d.denominazione_regione}: ${Number(d.totale_casi).toLocaleString()}`
            /* Number() converte la stringa in numero e toLocaleString() scrive il numero con le migliaia */
        })

});