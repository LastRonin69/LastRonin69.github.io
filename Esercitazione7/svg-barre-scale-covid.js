"use strict" /* obbliga a dichiarare le variabili */
/* misure del grafico in pixel */
const grafico = {
    altezza: Math.round(window.innerHeight * 0.9),
    larghezza: Math.round(window.innerWidth * 0.9)
};
d3.csv("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv",
    function (dati) {
        document.getElementById("aggiornamento").innerHTML = (new Date(dati[0].data)).toLocaleString();
        const valoreMassimo =
            d3.max(dati, function (d) { return Number(d.totale_casi) });
        /* parte relativa ai fattori di scala */
        const arrayNomiRegioni =
            dati.map(function (d, i) { return d.denominazione_regione })
        /* fattori di scala calcolabili solo dopo aver caricato i dati (dipendono da quanti sono) */
        const scalaOrizzontale =
            d3.scaleLinear()
                .domain([0, valoreMassimo])
                .rangeRound([0, grafico.larghezza]);
        const scalaVerticale =
            d3.scaleBand()
                .domain(arrayNomiRegioni)
                .rangeRound([0, grafico.altezza])
                .paddingInner(0.05);
        const altezzaBarre = scalaVerticale.bandwidth();
        const altezzaFont = Math.round(altezzaBarre * 2 / 3);
        const larghezzaFont = Math.round(altezzaFont / 2);
        /* la larghezza di un font è circa metà della sua altezza */
        const spazioLegenda = /* testo più lungo (in caratteri) moltiplicato larghezzaFont */
            d3.max(dati, function (d) { return d.denominazione_regione.length + 2 }) * larghezzaFont;

        let datiIterabili =
            d3.select("body")
                .append("svg")
                .attr("width", grafico.larghezza)
                .attr("height", grafico.altezza)
                .selectAll("rect")
                .data(dati)
                .enter();

        /* aggiunge le barre */
        datiIterabili
            .append("rect")
            .attr("x", spazioLegenda)
            .attr("y", function (d) { return scalaVerticale(d.denominazione_regione) })
            .attr("height", altezzaBarre)
            .attr("width", function (d) { return scalaOrizzontale(d.totale_casi) })
            .attr("class", function (d) {
                if (d.variazione_totale_positivi <= 0) { return `ottimeNotizie`; }
                else { return `pessimeNotizie`; }
            });
        /* aggiunge i valori 2px dopo l'inizio delle barre (sopra le barre) */
        datiIterabili
            .append("text")
            .attr("x", spazioLegenda + 2)
            .attr("y", function (d) {
                return scalaVerticale(d.denominazione_regione) + altezzaFont
            })
            .text(function (d) { return Number(d.totale_casi).toLocaleString() })
            .attr("font-size", altezzaFont + "px");
        /* aggiunge i nomi delle regioni, 2px prima delle barre, allineati a destra */
        datiIterabili
            .append("text")
            .attr("x", spazioLegenda - 2)
            .attr("text-anchor", "end")
            .attr("y", function (d) {
                return scalaVerticale(d.denominazione_regione) + altezzaFont
            })
            .text(function (d) { return d.denominazione_regione })
            .attr("font-size", altezzaFont + "px")
    });

