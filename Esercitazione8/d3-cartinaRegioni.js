"use strict"

/* variabile globale per l'array delle sole regioni: */
let popolazioneRegioni = new Array();
/* variabile globale per la funzione di scala popolazione-sfumature: */
let scalaColori;
/* array globale regioni-sfumature: */
let popColori = new Array();
/* funzione che calcola true se d è una regione, false altrimenti */
function filtraRegioni(d) {
    return d.ITTER107.length == 4
};


/* carica i dati dei territori e memorizza nell'array popolazioneRegioni solo le regioni */
d3.csv("Istat-popolazioneResidentePerRegione2021.csv",
    function (datiCaricati) {
        popolazioneRegioni = datiCaricati.filter(filtraRegioni);
console.log(popolazioneRegioni);
        const minPopolazione = d3.min(popolazioneRegioni,
            function (d) { return Number(d.Value) });

        const maxPopolazione = d3.max(popolazioneRegioni,
            function (d) { return Number(d.Value) })
        scalaColori = d3.scaleQuantize()
            .domain([minPopolazione, maxPopolazione])
            .range(['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494']);

        /* array globale che associa i primi 5 caratteri del nome del territorio alla sfumatura: */
        popColori = popolazioneRegioni.map(function (d) {
            return {
                primi5: d.Territorio.substring(0, 5),
                sfumatura: scalaColori(Number(d.Value))
            }
        })
    });


const grafico = {
    larghezza: Math.round(window.innerWidth * 0.45), /* misure per uno schermo orizzontale */
    altezza: Math.round(window.innerHeight * 0.9)
};
/* imposta una proiezione di Mercatore, centrata su Roma, e scalata "opportunamente", trasla
tutto al centro di svg */
const proiezione = d3.geoMercator()
    .scale(1500)
    .center([12, 42]) /* long. e lat. di Roma */
    .translate([grafico.larghezza / 2, grafico.altezza / 2]);

/* imposta il generatore di paths con la proiezione costruita */
const path = d3.geoPath()
    .projection(proiezione);

/* Crea un elemento SVG */
const svg = d3.select("body")
    .append("svg")
    .attr("width", grafico.larghezza)
    .attr("height", grafico.altezza);


/* carica i dati GeoJSON della cartina con le regioni italiane */
d3.json("limits_IT_regions.geojson", function (datiJSON) {
    console.log(datiJSON.features)
    /* abbina paths e dati, e crea un path per GeoJSON feature (=regione) */
    const regioni = svg.selectAll("g")
        .data(datiJSON.features)
        .enter()
        .append("g");
    regioni.append("path")
        .attr("d", path)
        .attr("style", function (d) {
            return "fill:" + popColori.filter(
                function (e) {
                    return e.primi5 == d.properties.reg_name.substring(0, 5)
                })[0].sfumatura
        }
        )
        /* attribuisce alla regione una classe = primi 5 caratteri del suo nome: */
        .attr("class", function (d) { return d.properties.reg_name.substring(0, 5) })
        /* aggiunge l'interazione che passando il mouse sulla mappa, si evidenzia (sfondo giallo) gli
        elementi "li" con la stessa classe della regione sulla mappa: */
        .on("mouseover", function () {
            d3.selectAll("li." + this.className.baseVal)
                .attr("style", "background-color: yellow")
        })
        .on("mouseout", function () {
            d3.selectAll("li." + this.className.baseVal)
                .attr("style", "background-color: white")
        });

        
        regioni.select("path")
        .append("text")
        .text(function (d, i ){return popolazioneRegioni[i].Territorio});

    /* costruisce una lista con nomi e popolazione di ciascuna regione, e dà a ciascuna riga una classe
    = primi 5 caratteri del nome: */
    d3.select("body")
        .append("ul")
        .selectAll("li")
        .data(popolazioneRegioni)
        .enter()
        .append("li")
        .on("mouseover", function () {
            d3.selectAll("path." + this.className)
                .attr("stroke-width", "3")
        })
        .on("mouseout", function () {
            d3.selectAll("path." + this.className)
                .attr("stroke-width", "1")
        })
        .attr("class", function (d) { return d.Territorio.substring(0, 5) })
        .text(function (d) {
            return d.Territorio + ": " + Number(d.Value).toLocaleString()
        });
});