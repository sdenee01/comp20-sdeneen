onload = init;


function init() {
	var inputBox = document.getElementById("msg");
	inputBox.onchange = function getMessage() {
		updateStatus();
		inputBox.value = "";
	}
}

function updateStatus() {
	var p = document.createElement("p");
	var message = getDateAndTime() + " - " + document.getElementById("msg").value;
	p.appendChild(document.createTextNode(message));

	var output = document.getElementById("msgs");
	var first = output.firstChild;
	output.insertBefore(p, first);
}



function getDateAndTime() {
	var D = new Date();
	var date = "";
	date = date + (D.getMonth() + 1) + "/"; //Add month
	date = date + D.getDate() + "/"; //Add day
	date = date + D.getFullYear() + " "; //Add year

	date = date + D.getHours() + ":"; //Add hour
	var minute = D.getMinutes();
	if (minute >= 0 && minute < 10) {
		minute = "0" + minute;
	}
	date = date + minute; //Add minute
	return date;
}