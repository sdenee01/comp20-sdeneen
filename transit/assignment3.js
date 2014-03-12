lat = -99999;
lng = -99999;

function initialize() {
    getMyLocation();
	var mapOptions = {
		center: new google.maps.LatLng(lat, lng),
        zoom: 8
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
    	                          mapOptions);
}


google.maps.event.addDomListener(window, 'load', initialize);


function getMyLocation() {
        elem = document.getElementById("loc");
        if (navigator.geolocation) {
            // the navigator.geolocation object is supported on your browser
            console.log("Call before navigator.geolocation");
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Got location");
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                elem.innerHTML = "<h1>You are in " + lat + ", " + lng + "</h1>";
            });
            console.log("Made the call to get location");
            elem.innerHTML = "<h1>You are in " + lat + ", " + lng + "</h1>";
        }
        else {
            alert("Geolocation is not supported by your web browser.  What a shame!");
        }
    }