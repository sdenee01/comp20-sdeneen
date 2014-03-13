google.maps.event.addDomListener(window, 'load', getMyLocation);

function getMyLocation() {
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
            })
            var infowindow = new google.maps.InfoWindow({
                content: "You are here!"
            })
            infowindow.open(map, marker);
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }

    getTData()
}


function getTData() {
    var request = new XMLHttpRequest();
    request.open("GET", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
    request.send(null);
    request.onreadystatechange = callback;
}


function callback() {
    if (request.readyState == 4 && request.status == 200) {
        console.log(request.responseText);
    }
}