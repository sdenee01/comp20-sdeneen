onload = init;


function init() {
	updateStatus();
	var inputBox = document.getElementById("msg");
	inputBox.onchange = function getMessage() {
		store();
		updateStatus();
		inputBox.value = "";
	}
}

function store()
{
	var input = document.getElementById("msg");
	var message = getDateAndTime() + " - " + input.value;
	var time = new Date().getTime();
	localStorage.setItem(time, message);
}

function updateStatus() {
	var output = document.getElementById("status");
	output.innerHTML = "";
	for (key in localStorage) {
		var p = document.createElement("p");
		var message = localStorage.getItem(key);
		p.appendChild(document.createTextNode(message));

		var first = output.firstChild;
		output.insertBefore(p, first);
	}
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