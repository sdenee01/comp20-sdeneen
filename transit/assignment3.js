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
            for (var i = 0; i < stops.length; i++) {
                if (stops[i].line == color) {
                    LatLng = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                    markers[i] = new google.maps.Marker({
                        position: LatLng,
                        map: map,
                        title: stops[i].name
                    });
                }
            }
            for (var m in markers) {
                google.maps.event.addListener(markers[m], 'click', function() {
                    content = "<h1>" + this.title + "</h1>";
                    if (data[m]["schedule"]["Predictions"].length > 0) {
                        content = '<table id="schedule"><tr><th>Line</th><th>Trip #</th><th>Direction</th><th>Time Remaining</th></tr>';
                        for (var j = 0; j < data[m]["schedule"]["Predictions"].length; j++) {
                            if (data[m].line == color && data[m]["schedule"]["Predictions"][j].Stop == this.title) {
                                createInfoWindowTable(m, j);
                            }
                        }
                    }
                    else {
                        content += "<p>No schedule of upcoming trains for this station.</p>";
                    }

                    infowindow.setContent(content);
                    infowindow.open(map, this);
                });
            }
        }
    }
}

function createInfoWindowTable(i, j)
{
    content += '<tr><td>' + data[i]['line'] + '</td><td>' + data[i]["schedule"]["TripID"] +
               '</td><td>' + data[i]["schedule"]["Destination"] + '</td><td>' +
                data[i]["schedule"]["Predictions"][j].Seconds + '</td></tr>';
    content += '</table>';

}