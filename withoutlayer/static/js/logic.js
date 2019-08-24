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

  // getcolor function 

  function getColor(d) {
    return d > 5  ? '#f57e42' :
           d > 4  ? '#f59c42' :
           d > 3  ? '#f5b642' :
           d > 2  ? '#eff542' :
           d > 1  ? '#c8f542' :
          '#42f55a' ;       
  }

  for (var i = 0; i < data.features.length; i++) {
  L.circle([+data.features[i].geometry.coordinates[1], +data.features[i].geometry.coordinates[0]], {
        fillOpacity: 0.5,
        color: getColor(data.features[i].properties.mag),
        fillColor: getColor(data.features[i].properties.mag),
        radius: +data.features[i].properties.mag * 30000
      }).addTo(myMap);
    }
  
  

grades = [0, 1, 2, 3, 4, 5],
labels = ["#42f55a", "#c8f542", "#eff542", "#f5b642", "#f59c42", "#f57e42" ];

var info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend")
  
  for (var i = 0; i < grades.length; i++) {
    	div.innerHTML +=
    		'<i style="background:' + labels[i] + '"></i> ' +
    		grades[i] + (grades[i + 1] ? '-' + grades[i + 1] + '<br>' : '+');
    }
   return div
};

info.addTo(myMap);

 

})