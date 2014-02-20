onload = init;

function init() {
	draw();
}


function draw() {
	var canvas = document.getElementById("game");
	var image = document.getElementById("bigImage");
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 273, 77, 123, 50, 260, 144, 246);
		ctx.drawImage(image, 0, 716, 900, 184, 0, 436+4/9, 800, 163+5/9); 
		ctx.drawImage(image, 5, 3, 53, 40, 100, 495, 132.5, 100); //Scaled dog 2.5x bigger
	}
}