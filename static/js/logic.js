var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// read the Geojson file

d3.json(queryUrl, function(data){
   ///store coordinates, magnitudes of each earthquake
   
   console.log(data.features)


// create map

var myMap = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 5
  });
  
// add tile layer (light map) 

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

for (var i = 0; i < data.features.length; i++) {
    if (+data.features[i].properties.mag[i] >= 5) {
        quakeColor = "Tomato"
    }
    else if (+data.features[i].properties.mag >= 4) {
        quakeColor = "Tan"
    }
    else if (+data.features[i].properties.mag >= 3) {
        quakeColor = "SandyBrown"
    }
    else if (+data.features[i].properties.mag >= 2) {
        quakeColor = "PeachPuff"
    }
    else if (+data.features[i].properties.mag >= 1) {
        quakeColor = "YellowGreen"
    }
    else {
        quakeColor = "SpringGreen"
    };


   


    L.circle([+data.features[i].geometry.coordinates[1], +data.features[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: quakeColor,
        radius: +data.features[i].properties.mag * 50000
      }).addTo(myMap);
  }
  

// looping through earthquake 


 

})