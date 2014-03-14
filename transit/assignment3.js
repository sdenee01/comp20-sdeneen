//An array with index 0 holding a list of blue line stops, index 1 for
//orange line, and index 2 for red line


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
            var map = new google.maps.Map(document.getElementById("map-canvas"),
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
            alert("Bad Data!");
        }
    }
}

function showTStops()
{
    if (stopsRequest.readyState == 4) {
        if (stopsRequest.status == 200) {
            stops = JSON.parse(stopsRequest.responseText);
            if (color == "blue") {
                startIndex = 0;
                endIndex = 11;
            }
            else if (color == "orange") {
                startIndex = 12;
                endIndex = 30;
            }
            else if (color == "red") {
                startIndex = 31;
                endIndex = 52;

            }
            for (var i = startIndex; i <= endIndex; i++) {
                LatLng = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                var marker = new google.maps.Marker({
                    position: LatLng,
                    map: map,
                    title: stops[i].name
                });
            
                var infowindow = new google.maps.InfoWindow({
                    content: stops[i].name
                });
                infowindow.open(map, marker);
            }
        }
    }
}
    





}