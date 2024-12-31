const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const offscreenCanvas = document.getElementById("offscreenCanvas");
const offscreenCtx = offscreenCanvas.getContext("2d");

canvas.style.touchAction = "none";

let painting = false;

reset();

function reset() {
	offscreenCanvas.width = 28;
	offscreenCanvas.height = 28;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	offscreenCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
	offscreenCtx.drawImage(canvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
}

function startPosition(e) {
	painting = true;
	draw(e);
}

function endPosition() {
	painting = false;
	ctx.beginPath();
}

function draw(e) {
	if (!painting) return;
	ctx.lineWidth = 42;
	ctx.lineCap = "round";
	ctx.strokeStyle = "white";

	let x, y;
	if (e.type.includes("touch")) {
		x = e.touches[0].clientX - canvas.offsetLeft;
		y = e.touches[0].clientY - canvas.offsetTop;
	} else {
		x = e.clientX - canvas.offsetLeft;
		y = e.clientY - canvas.offsetTop;
	}

	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x, y);

	offscreenCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
	offscreenCtx.drawImage(canvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);


function resizePixelData() {
	const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
	const data = [];
	for (let i = 0; i < imageData.data.length; i += 4) {
		const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
		data.push(average / 255);
	}

	return data;
}