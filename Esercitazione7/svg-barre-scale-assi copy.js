"use strict" /* obbliga a dichiarare le variabili */
/* misure del grafico in pixel */
const grafico = {
    altezza: Math.round(window.innerHeight * 0.9),
    larghezza: Math.round(window.innerWidth * 0.9)
};

const altezzaAsseOrizz = grafico.altezza * 0.1; /* spazio occupato dall'asse orizzontale */

d3.csv("Istat-popolazioneResidentePerRegione2021.csv",
    function (dati) {
        const valoreMassimo =
            d3.max(dati, function (d) { return Number(d.Value) });
        /* parte relativa ai fattori di scala */
        const arrayNomiRegioni =
            dati.map(function (d, i) { return d.Territorio });
        /* fattori di scala calcolabili solo dopo aver caricato i dati (dipendono da quanti sono) */



        const scalaVerticale =
            d3.scaleBand()
                .domain(arrayNomiRegioni)
                .rangeRound([0, grafico.altezza - altezzaAsseOrizz])
                .paddingInner(0.05);
        const altezzaBarre = scalaVerticale.bandwidth();
        const altezzaFont = Math.round(altezzaBarre * 2 / 3);
        const larghezzaFont = Math.round(altezzaFont / 2);
        /* la larghezza di una font è circa metà della sua altezza */

        const spazioLegenda = /* testo più lungo (in caratteri) moltiplicato larghezzaFont */
            d3.max(dati, function (d) { return d.Territorio.length + 2 }) * larghezzaFont;

        const scalaOrizzontale =
            d3.scaleLinear()
                .domain([0, valoreMassimo])
                .rangeRound([0, grafico.larghezza - spazioLegenda * 2]); /* lo spazio per le regioni a sinistra e per i valori delle barre a destra */

        let datiIterabili =
            d3.select("body")
                .append("svg")
                .attr("width", grafico.larghezza)
                .attr("height", grafico.altezza)
                .selectAll("rect")
                .data(dati)
                .enter();

        let attribuisciClasse = function (d) {
            if (d.ITTER107.length == 2) { return "Italia"; }
            else if (d.ITTER107.length == 3) { return "macroRegione"; }
            else { return "regione"; }
        };

        /* aggiunge le barre */
        datiIterabili
            .append("rect")
            .attr("x", spazioLegenda)
            .attr("y", function (d) { return scalaVerticale(d.Territorio) })
            .attr("height", altezzaBarre)
            .attr("width", function (d) { return scalaOrizzontale(d.Value) })
            .attr("class", function (d) {
                if (d.ITTER107.length == 2) { return `Italia datoClasse${d.ITTER107.length}`; }
                else if (d.ITTER107.length == 3) { return `macroRegione datoClasse${d.ITTER107.length}`; }
                else { return `regione datoClasse${d.ITTER107.length}`; }


            });
        /* aggiunge i valori 2px dopo l'inizio delle barre (sopra le barre) */
        datiIterabili
            .append("text")
            .attr("x", function (d) {
                return scalaOrizzontale(d.Value) + spazioLegenda + 2
            })
            .attr("y", function (d) {
                return scalaVerticale(d.Territorio) + altezzaBarre * 5 / 6
            }) /* al centro di una barra */
            .text(function (d) { return Number(d.Value).toLocaleString() })
            .attr("font-size", `${altezzaFont}px`);
        /* aggiunge i nomi delle regioni, 2px prima delle barre, allineati a destra */

        datiIterabili
            .append("text")
            .attr("x", spazioLegenda - 2)
            .attr("text-anchor", "end")
            .attr("y", function (d) {
                return scalaVerticale(d.Territorio) + altezzaFont
            })
            .text(function (d) { return d.Territorio })
            .attr("font-size", altezzaFont + "px")

        const asseOrizzontale = d3.axisBottom()
            .scale(scalaOrizzontale)
            .ticks(5);

        let gruppoAsseX = svg.append("g") /* aggiunge un gruppo per l'asse orizzontale */
            .attr("class", "asse") /* spostato a destra di spazioLegenda, e in basso del 90% del grafico */
            .attr("transform", `translate(${spazioLegenda},${(grafico.altezza * 0.9)})`);
        asseOrizzontale(gruppoAsseX);
        const asseVerticale = d3.axisLeft()
            .scale(scalaVerticale);
        let gruppoAsseY = svg.append("g") /* aggiunge un gruppo per l'asse verticale */
            .attr("style", `font-size: ${altezzaFont}px`)
            .attr("class", "asse") /* spostato a destra di spazioLegenda */
            .attr("transform", `translate(${spazioLegenda},0)`);
        asseVerticale(gruppoAsseY);




    });