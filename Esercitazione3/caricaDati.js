d3.select("body")
.append("table")
.append("thead")
.append("tr")
.selectAll("th")
.data(["Territorio", "Popolazione"])
.enter()
.append("th")
.text(function(d) { return d });


d3.csv("Istat-popolazioneResidentePerRegione2021.csv", function(datiCaricati){
    console.log(datiCaricati);

    d3.select("table")
       .append("tbody")
       .selectAll("tr")
       .data(datiCaricati)
       .enter()
       .append("tr")
       .attr("class", function(d){

 /* scegliere se togliere il commento e attivare questa seconda scelta */
        
       /* let classe = "";
        if (d.ITTER107.length == 4)
        classe = "regione"
        else if (d.ITTER107.length == 3)
        classe = "macroRegione"
        else
        classe = "italia"
        return classe */


           return "datoClasse" + d.ITTER107.length
       }) 
       .selectAll("td")
       .data(function(d){
           return[d.Territorio, Number(d.Value).toLocaleString()]
       })
       .enter()
       .append("td")
       .text(function(d){return d })
});

