var isDrawing = false;
var isRunning = false;

var input = [];
var amplitude = [];
var phase = [];
var indices = [];
var fourierDrawing = [];

var sliderNMax;
var sliderDt;
var nMax = 0;
var drawingOffset = 0;
var dt = 1;

function setup() {
	createCanvas(1200, 700);
	background(32, 164, 100);

	//initializa sliderul pentru viteza de desen
	sliderDt = createSlider(0, 2, 1, 0.01);
	sliderDt.position(width / 2 - 200, height - 80);
	sliderDt.style('width', '400px');
	sliderDt.changed(() => (dt = sliderDt.value()));

	//si cel pentru numarul de puncte
	refreshNMaxSlider();
}

function draw() {
	background(32, 164, 100);

	if (isDrawing) {
		//verificam daca userul deseneaza in interiorul canvasului
		if (
			pow(mouseX - width / 2 - input[input.length - 1].x, 2) +
				pow(mouseY - height / 2 - input[input.length - 1].y, 2) >
			pow(1, 2)
		) {
			input.push(createVector(mouseX - width / 2, mouseY - height / 2));
		}
	}

	// Deseneaza inputul
	stroke(255);
	noFill();
	strokeWeight(5);
	beginShape();
	for (let i = 0; i < input.length; i++) {
		vertex(width / 2 + input[i].x, height / 2 + input[i].y);
	}
	endShape();

	// Deseneaza cercurile
	if (isRunning && amplitude[0]) {
		//deseneaza centrul primului cerc
		let currentX = width / 2 + amplitude[0].x;
		let currentY = height / 2 + amplitude[0].y;
		let center = createVector(currentX, currentY);

		fill(255, 255, 255, 100);
		noStroke();
		ellipse(currentX, currentY, 10);
		//pana aici

		for (let n = 1; n < nMax; n++) {
			let currentN = indices[n];
			let k = currentN <= input.length / 2 ? currentN : currentN - input.length;

			if (abs(amplitude[currentN]) > 5) {
				let phi = (drawingOffset * k * TWO_PI) / input.length + phase[currentN];

				//cacluleaza centrul urmatorului cerc de desenat
				currentX += amplitude[currentN] * Math.cos(phi);
				currentY += amplitude[currentN] * Math.sin(phi);

				//se deseneaza cercul
				drawCircles(center, amplitude[currentN], currentX, currentY);

				//se trece la urmatorul cerc
				center.x = currentX;
				center.y = currentY;
			}
		}
		//se adauga in vectorul desenat pozitia centrelor cercurilor
		if (nMax > 0) {
			fourierDrawing.push(createVector(currentX, currentY));
		}
	}

	if (!isDrawing && isRunning) {
		stroke(245, 186, 20, 255);
		noFill();
		strokeWeight(5);
		beginShape();
		for (let i = 0; i < fourierDrawing.length; i++) {
			vertex(fourierDrawing[i].x, fourierDrawing[i].y);
		}
		endShape();
	}

	// Text info
	stroke(255);
	fill(255);
	strokeWeight(0.5);
	textAlign(LEFT);
	textSize(20);
	text('kMax = ' + max(0, nMax - 1), width / 2 + 200, height - 30);
	text('dt = ' + dt, width / 2 + 200, height - 70);
	textSize(25);
	textAlign(CENTER);
	text('Desenati cu mouse-ul tinand apasat click stanga', width / 2, 0 + 30);

	//realizeaza animatia cercurilor in functie de viteza stabilita
	if (isRunning) {
		drawingOffset = drawingOffset + dt;
	}
	if (drawingOffset > input.length) {
		drawingOffset = 0;
		fourierDrawing = [];
	}
}

function reset() {
	performFourier();
	fourierDrawing = [];
	drawingOffset = 0;
	nMax = sliderNMax.value();
}

//adauga in array input, punctele desenate de user
function mousePressed() {
	console.log(height - 80);
	if (
		!(
			(mouseX > width / 2 - 200 || mouseX < width / 2 + 200) &&
			mouseY > height - 100
		)
	) {
		drawingOffset = 0;
		isRunning = false;
		input = [createVector(mouseX - width / 2, mouseY - height / 2)];
		isDrawing = true;
	}
}

//detecteaza finalizarea desenului
function mouseReleased() {
	if (
		!(
			(mouseX > width / 2 - 200 || mouseX < width / 2 + 200) &&
			mouseY > height - 100
		)
	) {
		isDrawing = false;
		refreshNMaxSlider();
		reset();
		isRunning = true;
	}
}

function refreshNMaxSlider() {
	if (sliderNMax) {
		sliderNMax.remove();
	}
	sliderNMax = createSlider(1, max(1, input.length), int(input.length / 2), 1);
	sliderNMax.position(width / 2 - 200, height - 40);
	sliderNMax.style('width', '400px');
	sliderNMax.changed(reset);
	nMax = sliderNMax.value();
}

//aplica transformata fourier
function performFourier() {
	fourier = fourierTransform(input);
	amplitude = fourier.amplitude;
	phase = fourier.phase;
	indices = fourier.indices;
}

function drawCircles(center, amplitude, currentX, currentY) {
	//deseneaza centrul cercului curent
	noFill();
	stroke(255, 255, 255, 100);
	ellipse(center.x, center.y, 2 * amplitude);
	// console.log(center);

	//deseneaza cercul
	fill(255, 255, 255, 100);
	noStroke();
	ellipse(currentX, currentY, 10);

	//deseneaza vectorul de rotatie
	stroke(255, 255, 255, 100);
	noFill();
	strokeWeight(2.5);
	line(currentX, currentY, center.x, center.y);
	strokeWeight(5);
}
