// earthquake json data 

var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// plate boundary json data

var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// read the Geojson file


// read json with d3.json
d3.json(quakeUrl, function(data1){
  d3.json(plateUrl,  function(data2){

  // get quake and plate data
  var quakeData = data1.features;
  var plateData = data2.features;

   // console.log(quakeData)
   console.log(plateData[0].geometry.coordinates[0][0])
   
   // get plate line lat, lng data
   var plateCoords = [] ;
   for (var p = 0; p < plateData.length; p++){
      var a = []
      for (var q = 0; q < plateData[p].geometry.coordinates.length; q++) {
        a.push([plateData[p].geometry.coordinates[q][1], plateData[p].geometry.coordinates[q][0]])
      }
      plateCoords.push(a)
   }
   
   console.log(plateCoords)


  // create tilelayer: Satellite, Grayscale, Outdoor

  var Satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  })

  var Grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })
  

  var  Outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  })
  

  // getcolor function

  function getColor(d) {
    return d > 5  ? '#f57e42' :
           d > 4  ? '#f59c42' :
           d > 3  ? '#f5b642' :
           d > 2  ? '#eff542' :
           d > 1  ? '#c8f542' :
          '#42f55a' ;       
  }
 
  // create eqrthquake layer

  var quakeMarkers = [];
  for (var i = 0; i < quakeData.length; i++) {
    if (+quakeData[i].properties.mag >0) {
    quakeMarkers.push(L.circle([+quakeData[i].geometry.coordinates[1], +quakeData[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: getColor(+quakeData[i].properties.mag),
        fillColor: getColor(+quakeData[i].properties.mag),
        radius: +quakeData[i].properties.mag * 50000
      }))
    }
  }

  var quakeLayer = L.layerGroup(quakeMarkers);

  // create fault lines layer
  var flMarkers = []
  for (var j =0; j < plateCoords.length; j++){
    flMarkers.push(L.polyline(plateCoords[j], {
      color: "#f5b642"
    })
    )
  }

  var flLayer = L.layerGroup(flMarkers)

  // base mapa
  var baseMaps = {
      Satellite: Satellite,
      Grayscale: Grayscale,
      Outdoors: Outdoors
    };
    
  // overlay maps
  var overlayMaps = {
    "Fault Lines": flLayer, 
    Earthquakes: quakeLayer
  };

  // create map
  var myMap = L.map("map", {
    center: [40.1164, -88.2434],
    zoom: 3,
    layers: [Satellite, flLayer, quakeLayer]
    });
  
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5],
		labels = ["SpringGreen", "YellowGreen", "PeachPuff", "SandyBrown", "Tan", "Tomato" ];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + labels[i] + '"></i> ' +
			grades[i] - (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	 return div;
  };

  legend.addTo(myMap);

// looping through earthquake 


 
})

})
