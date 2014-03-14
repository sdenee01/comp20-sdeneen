//An array with index 0 holding a list of blue line stops, index 1 for
//orange line, and index 2 for red line

infowindow = new google.maps.InfoWindow();
yourLocContent = "";

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
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: "You are here!"
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
            LatLngs = new Array();
            LatLngs2 = new Array();
            var counter = 0;
            var counter2 = 0;
            var image = "MBTA_Logo_small.jpg";
            for (var i = 0; i < stops.length; i++) {
                if (stops[i].line == color) {
                    if (color == "red") {
                        if (i >= 48 ) {
                            LatLngs2[counter2] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                            markers[i] = new google.maps.Marker({
                                position: LatLngs2[counter2],
                                map: map,
                                title: stops[i].name,
                                icon: image
                            });
                            counter2++;
                        }
                        else if (i == 43) {
                            LatLngs2[counter2] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                            LatLngs[counter] = LatLngs2[counter2];
                            markers[i] = new google.maps.Marker({
                                position: LatLngs[counter],
                                map: map,
                                title: stops[i].name,
                                icon: image
                            });
                            counter++;
                            counter2++;
                        }
                        else {
                            LatLngs[counter] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                            markers[i] = new google.maps.Marker({
                                position: LatLngs[counter],
                                map: map,
                                title: stops[i].name,
                                icon: image
                            });
                            counter++;
                        }
                    }
                    else {
                        LatLngs[counter] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
                        markers[i] = new google.maps.Marker({
                            position: LatLngs[counter],
                            map: map,
                            title: stops[i].name,
                            icon: image
                        });
                        counter++;
                    }
                }
            }
            if (color == "blue") {
                polyline = new google.maps.Polyline({
                    path: LatLngs,
                    strokeColor: '#0000FF',
                    strokeWeight: 3
                });

                polyline.setMap(map);
            }
            else if (color == "orange") {
                polyline = new google.maps.Polyline({
                    path: LatLngs,
                    strokeColor: '#FFA500',
                    strokeWeight: 3
                });

                polyline.setMap(map);
            }
            else if (color == "red") {
                polyline = new google.maps.Polyline({
                    path: LatLngs,
                    strokeColor: '#FF0000',
                    strokeWeight: 3
                });
                polyline2 = new google.maps.Polyline({
                    path: LatLngs2,
                    strokeColor: '#FF0000',
                    strokeWeight: 3
                });

                polyline.setMap(map);
                polyline2.setMap(map);
            }


            min = 99999999999999999999999999999;
            minStation = ""
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
            getMinStation();
        }
    }
}

function createInfoWindowTable(i, j)
{
    content += '<tr><td>' + data['line'] + '</td><td>' + data["schedule"][i]["TripID"] +
               '</td><td>' + data["schedule"][i]["Destination"] + '</td><td>' +
                data["schedule"][i]["Predictions"][j].Seconds + '</td></tr>';
}


function getMinStation()
{
    /*
    if (color != "red") {
        for (var i in LatLngs) {
            distance = haversine(myLatLng.latitude, myLatLng.longitude, LatLngs[i].latitude, LatLngs[i].longitude);
            if (distance < min) {
                min = distance;
                minStation = markers[i].title;
            }
        }
    }
    else {
        for (var i in LatLngs2) {
            distance = haversine(myLatLng.latitude, myLatLng.longitude, LatLngs2[i].latitude, LatLngs2[i].longitude);
            if (distance < min) {
                min = distance;
                minStation = markers[m].title;
            }
        }
    }
    */
    
    for (var m in markers) {
        //console.log(markers[m].position.lat());
        //console.log(markers[m].position.lng());
        distance = haversine(myLatLng.lat(), myLatLng.lng(), markers[m].position.lat(), markers[m].position.lng());
        //console.log(markers[m].title + " : " + distance);
        //console.log(min);
        if (distance < min) {
            min = distance;
            minStation = markers[m].title;
        }
    }

    yourLocContent = "The closest T station to you is " + minStation + " which is about " + min + " miles away";
    infowindow.setContent(yourLocContent);
    infowindow.open(map, marker);
}

function haversine(lat1, lon1, lat2, lon2)
{
    console.log("lat1: " + lat1 + " lon1: " + lon1);
    console.log("lat2: " + lat2 + " lon2: " + lon2);
    console.log("");


    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }

    var lat2 = 42.741; 
    var lon2 = -71.3161; 
    var lat1 = 42.806911; 
    var lon1 = -71.290611; 

    var R = 3958.8; // miles
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}