//An array with index 0 holding a list of blue line stops, index 1 for
//orange line, and index 2 for red line

infowindow = new google.maps.InfoWindow();

google.maps.event.addDomListener(window, 'load', getMyLocation);

function getMyLocation()
{
    lat = -99999;
    lng = -99999;
    elem = document.getElementById("loc");
    if (navigator.geolocation) {
        // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            myLatLng = new google.maps.LatLng(lat, lng);
            var mapOptions = {
                center: myLatLng,
                zoom: 8
            };
            map = new google.maps.Map(document.getElementById("map-canvas"),
                                          mapOptions);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: "You are here"
            });
            var infowindow = new google.maps.InfoWindow({
                content: "You are here!"
            });
            infowindow.open(map, marker);
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }

    getTData();
}


function getTData()
{
    request = new XMLHttpRequest();
    request.open("GET", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
    request.send(null);
    request.onreadystatechange = readData;
}


function readData()
{
    if (request.readyState == 4) {
        if (request.status == 200) {
            data = JSON.parse(request.responseText);
            color = data.line;

            stopsRequest = new XMLHttpRequest();
            stopsRequest.open("GET", "stations.json", true);
            stopsRequest.send(null);
            stopsRequest.onreadystatechange = showTStops;
        }
        else {
            //HANDLE ERROR HERE! (add to infowindow?)
            console.log("BAD DATA");
        }
    }
}

function showTStops()
{
    if (stopsRequest.readyState == 4) {
        if (stopsRequest.status == 200) {
            stops = JSON.parse(stopsRequest.responseText);
            markers = new Array(stops.length);
            LatLngs = new Array(stops.length);
            for (var i = 0; i < stops.length; i++) {
                if (stops[i].line == color) {
                    LatLngs[i] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                    markers[i] = new google.maps.Marker({
                        position: LatLngs[i],
                        map: map,
                        title: stops[i].name
                    });
                    polyline = new google.maps.Polyline({
                        path: LatLngs;
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeWeight: 2
                    })
                    polyline.setMap(map);
                }
            }

            for (var m in markers) {
                google.maps.event.addListener(markers[m], 'click', function() {
                    content = "<h1>" + this.title + "</h1>";
                    content += '<table id="schedule"><tr><th>Line</th><th>Trip #</th><th>Direction</th><th>Time Remaining</th></tr>';
                    for (var i = 0; i < data["schedule"].length; i++) {
                        for (var j = 0; j < data["schedule"][i]["Predictions"].length; j++) {
                            if (data["schedule"][i]["Predictions"][j].Stop == this.title) {
                                //FOUND A MATCH TO ADD TO TABLE
                                createInfoWindowTable(i, j);
                            }
                        }
                    }
                    content += '</table>';
                    infowindow.setContent(content);
                    infowindow.open(map, this);

                });
            }
        }
    }
}

function createInfoWindowTable(i, j)
{
    content += '<tr><td>' + data['line'] + '</td><td>' + data["schedule"][i]["TripID"] +
               '</td><td>' + data["schedule"][i]["Destination"] + '</td><td>' +
                data["schedule"][i]["Predictions"][j].Seconds + '</td></tr>';
}