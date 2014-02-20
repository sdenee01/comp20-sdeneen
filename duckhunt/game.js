onload = init;

function init() {
	draw();
}


function draw() {
	var canvas = document.getElementById("game");
	var image = document.getElementById("bigImage");
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 5, 3, 53, 40, 400, 300, 53, 40); //x then y
	}
}