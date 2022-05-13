"use strict" /* obbliga a dichiarare le variabili */
/* misure del grafico in pixel */
const grafico = {
    altezza: Math.round(window.innerHeight * 0.9),
    larghezza: Math.round(window.innerWidth * 0.9)
}
function attribuisciClasse(d) {
    if (d.ITTER107.length == 2)
        return "Italia";
    else if (d.ITTER107.length == 3)
        return "macroRegione";
    else return "regione"
}
const altezzaAsseOrizz = grafico.altezza * 0.1; /* spazio occupato dall'asse orizzontale */
d3.csv("Istat-popolazioneResidentePerRegione2021.csv",
    function (dati) {
        const valoreMassimo =
            d3.max(dati, function (d) { return Number(d.Value) });
        /* d.Value è una stringa, bisogna convertirla in numero */
        const arrayNomiRegioni =
            dati.map(function (d) { return d.Territorio })
        /* fattori di scala calcolabili solo dopo aver caricato i dati (dipendono da quanti sono) */
        const scalaVerticale =
            d3.scaleBand()
                .domain(arrayNomiRegioni)
                .rangeRound([0, grafico.altezza - altezzaAsseOrizz])
                .paddingInner(0.05);
        const altezzaBarre = scalaVerticale.bandwidth();
        const altezzaFont = Math.round(altezzaBarre * 2 / 3);
        const larghezzaFont = Math.round(altezzaFont / 2);
        /* larghezza di un font = circa metà della sua altezza */
        const spazioLegenda = /* nome più lungo (in caratteri) moltiplicato larghezzaFont */
            d3.max(arrayNomiRegioni, function (nome) { return nome.length }) * larghezzaFont;
        const scalaOrizzontale =
            d3.scaleLinear()
                .domain([0, valoreMassimo])
                .rangeRound([0, grafico.larghezza - spazioLegenda * 2]);
        /* lo spazio per le barre è grafico.larghezza meno lo spazio per le regioni (a sinistra) e per i valori(a destra delle barre) */
        const svg = d3.select("body")
            .append("svg")
            .attr("width", grafico.larghezza)
            .attr("height", grafico.altezza);
        const datiIterabili =
            svg.selectAll("rect")
                .data(dati)
                .enter();
        datiIterabili
            .append("rect")
            .attr("class", attribuisciClasse)
            .attr("x", spazioLegenda)
            .attr("y", function (d) { return scalaVerticale(d.Territorio) })
            .attr("height", altezzaBarre)
            .attr("width", function (d) { return scalaOrizzontale(d.Value) });
        /* aggiunge i valori 2px dopo LA FINE delle barre */
        datiIterabili
            .append("text")
            .attr("class", attribuisciClasse)
            .attr("x", function (d) {
                return scalaOrizzontale(d.Value) + spazioLegenda + 2
            })
            .attr("y", function (d) {
                return scalaVerticale(d.Territorio) + altezzaBarre * 5 / 6
            }) /* al centro di una barra */
            .text(function (d) { return Number(d.Value).toLocaleString() })
            .attr("font-size", `${altezzaFont}px`)
        /* calcola e aggiunge gli assi */
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

d3.select(`#spuntaRegioni`).on("click", function () {
    if (this.checked) d3.selectAll(`.regione`).attr(`style`, `display: block`)
    else d3.selectAll(`.regione`).attr(`style`, `display: none`)
});

d3.select(`#spuntaMacro`).on("click", function () {
    if (this.checked) d3.selectAll(`.macroRegione`).attr(`style`, `display: block`)
    else d3.selectAll(`.macroRegione`).attr(`style`, `display: none`)
});