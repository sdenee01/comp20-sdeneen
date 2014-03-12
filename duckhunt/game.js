onload = init;

function init() {
	draw();
}


function draw() {
	var canvas = document.getElementById("game");
	var image = document.getElementById("bigImage");
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		drawSky(ctx);
		drawTree(ctx, image);
		drawDirtAndGrass(ctx, image); 
		drawDog(ctx, image);
		drawBirds(ctx, image);
	}
}


//////////////////////////DRAWING FUNCTIONS////////////////////////////////////

function drawSky(ctx) {
	ctx.beginPath();
	ctx.lineTo(600,0);
	ctx.lineTo(600,800);
	ctx.lineTo(0,800);
	ctx.fillStyle = "#87CEEB";
	ctx.fill();
}

function drawTree(ctx, image) {
	ctx.drawImage(image, 0, 273, 77, 123, 50, 260, 144, 246); //Scaled 2x
}

function drawDirtAndGrass(ctx, image) {
	ctx.drawImage(image, 0, 716, 900, 184, 0, 436+4/9, 800, 163+5/9); //fit to different sized screen
}

function drawDog(ctx, image) {
	ctx.drawImage(image, 5, 3, 53, 40, 100, 495, 132.5, 100); //Scaled 2.5x
}

function drawBirds(ctx, image) {
	ctx.drawImage(image, 0, 120, 34, 25, 100, 100, 68, 50); //Scaled 2x
	ctx.drawImage(image, 300, 157, 34, 30, 200, 100, 68, 60); //Scaled 2x
	ctx.drawImage(image, 212, 156, 28, 32, 300, 100, 56, 64); //Scaled 2x
	ctx.drawImage(image, 81, 197, 31, 31, 400, 100, 62, 62); //Scaled 2x
	ctx.drawImage(image, 340, 118, 33, 29, 500, 100, 64, 58); //Scaled 2x
}