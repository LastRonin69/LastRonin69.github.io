d3.select("body")
.append("table")
.append("thead")
.append("tr")
.selectAll("th")
.data(["Territorio", "Casi"])
.enter()
.append("th")
.text(function(d) { return d });


d3.csv("datiCovid.csv", function(datiCaricati){
    console.log(datiCaricati);

    d3.select("table")
       .append("tbody")
       .selectAll("tr")
       .data(datiCaricati)
       .enter()
       .append("tr")
       .selectAll("td")
       .data(function(d){
           return[d.denominazione_regione, Number(d.totale_casi).toLocaleString()]
       })
       .enter()
       .append("td")
       .text(function(d){return d })
});

