const grafico = {
    altezza: Math.round(window.innerHeight * 0.9),
    larghezza: Math.round(window.innerWidth * 0.9)
};
/* misure della "torta" */
const diametroTorta = 0.8 * Math.min(grafico.altezza, grafico.larghezza);
const raggioEsterno = diametroTorta / 2;
const raggioInterno = 0;
/* imposta una funzione che calcola gli angoli dei settori */
const calcolaTorta = d3.pie();
/* imposta una funzione che calcola settori (fette) di torta */
const calcolaSettore = d3.arc()
    .innerRadius(raggioInterno)
    .outerRadius(raggioEsterno);
/* aggiunge un elemento SVG alla pagina */
window.addEventListener("load", function () {
    const elementoSVG =
        d3.select("body")
            .append("svg")
            .attr("width", grafico.larghezza)
            .attr("height", grafico.altezza);

    d3.csv("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv",
        function (dati) {
            console.log(dati);
            document.getElementById("aggiornamento")
                .innerHTML = (new Date(dati[0].data))
                    .toLocaleString("it-IT",
                        { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                        const estraiValoreNumerico =
                        function (d) { return Number(d.totale_casi) }
                    const valori = dati.map(estraiValoreNumerico);

                    /* settori calcolabili solo dopo aver caricato i dati (dipende da quanti e quali sono) */
                    const settori =
                        elementoSVG.selectAll("g.settore")
                            .data(calcolaTorta(valori))
                            .enter()
                            .append("g")
                            .attr("class", "settore")
                            .attr("transform",
                                `translate(${raggioEsterno},${raggioEsterno})`);

                    settori.append("path")
                        .attr("class", function (d, i) { return dati[i].denominazione_regione })
                        .attr("d", calcolaSettore)
                        .attr("fill", function (d, i) {
                            return d3.schemeCategory20[i]
                        });

                    settori.append("text")
                        .attr("transform",
                            function (v) { return `translate(${calcolaSettore.centroid(v)})` })
                        .attr("text-anchor", "middle")
                        .text(function (d, i) {
                            return dati[i].denominazione_regione + ": "
                                + Number(dati[i].totale_casi).toLocaleString()
                        })
                })
        })