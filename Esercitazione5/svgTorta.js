"use strict" /* obbliga a dichiarare le variabili */
/* misure del grafico svg in pixel */
const grafico = {
    altezza: Math.round(window.innerHeight * 0.9),
    larghezza: Math.round(window.innerWidth * 0.9)
};
/* misure della "torta" */
const diametroTorta = 0.8 * Math.min(grafico.altezza, grafico.larghezza);
const raggioEsterno = Math.round(diametroTorta / 2);
const raggioInterno = 0;
/* imposta una funzione che calcola gli angoli dei settori */
const calcolaTorta = d3.pie();
/* imposta una funzione che calcola settori (fette) di torta */
const calcolaSettore = d3.arc()
    .innerRadius(raggioInterno)
    .outerRadius(raggioEsterno);
/* aggiunge un elemento SVG alla pagina */
const elementoSVG =
    d3.select("body")
        .append("svg")
        .attr("width", grafico.larghezza)
        .attr("height", grafico.altezza);

d3.csv("Istat-popolazioneResidentePerRegione2021.csv",
    function (dati) {
        console.log(dati);
        /* i territori con un codice ITTER107 di 3 caratteri sono macro-regioni */
        const testMacroRegione =
            function (d) { return d.ITTER107.length == 3 };
        const macroRegioni = dati.filter(testMacroRegione);
        const estraiValoreNumerico =
            function (d) { return Number(d.Value) };
        const valoriMacroRegioni = macroRegioni.map(estraiValoreNumerico);

        /* settori calcolabili solo dopo aver caricato i dati (dipende da quanti e quali sono) */
        const settori =
            elementoSVG.selectAll("g")
                .data(calcolaTorta(valoriMacroRegioni))
                .enter()
                .append("g")
                .attr("class", function (d, i) { return macroRegioni[i].Territorio })
                .classed("settore", true)
                .attr("fill", function (d, i) {console.log(macroRegioni[i].Value); return `rgb( ${Math.round( Number((macroRegioni[i].Value))/500000)} , ${Math.round( Number((macroRegioni[i].Value))/200000)} ,${Math.round( Number((macroRegioni[i].Value))/800000)} )`  })
                .attr("transform",
                    `translate(${raggioEsterno},${raggioEsterno})`);


        settori.append("path")
            .attr("d", calcolaSettore)


        settori.append("text")
            .attr("transform",
                function (v) { return `translate(${calcolaSettore.centroid(v)})` })
            .attr("text-anchor", "middle")
            .text(function (d, i) { return macroRegioni[i].Territorio + "  " + macroRegioni[i].Value })
    });