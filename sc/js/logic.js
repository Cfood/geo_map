var quakeMap = L.map("map", {
    center: [40, -100.95],
    zoom: 5
  });


//add tiel layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(quakeMap);


//get data for earthquakes in the past day
var baseURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

d3.json(baseURL).then(function(response) {

    var points = L.featureGroup();

    for (var i = 0; i< response.features.length; i++) {

        var quake = response.features[i]

        var location = quake.geometry.coordinates
        var magnitude = quake.properties.mag
        var depthScale = Math.sqrt(location[2]+2)
        if (depthScale > 0) {
        for (j=0; j<17;j++) {
            if (depthScale > j && depthScale < (j+1)) {
                var depthColor =  j
            } 
        }      
    } else {
        var depthColor = 0
    }
        if (depthColor < 4) {
            var color = '#FFFFFF'
        } else if (depthColor < 8) {
            var color = '#999999'
        } else if (depthColor < 12) {
            var color = '#555555'
        } else {
            var color = '#000000'
        }

        if (location) {
             marker = L.circleMarker([location[1], location[0]], {radius: (magnitude**2)*2, color: color, fillOpacity: .54} ).addTo(points)
        }



        var tooltip = marker.bindTooltip(response.features[i].properties.place + " -- Magnitude: " +response.features[i].properties.mag);

        quakeMap.addLayer(points)

    }



})

