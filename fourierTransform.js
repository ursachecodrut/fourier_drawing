function fourierTransform(input) {
	let mean = createVector(0, 0);
	for (let i = 0; i < input.length; i++) {
		mean.add(createVector(input[i].x, input[i].y));
	}

	let amplitude = [createVector(mean.x / input.length, mean.y / input.length)];
	let phase = [0];

	for (let n = 1; n < input.length; n++) {
		let k = n <= input.length / 2 ? n : n - input.length;
		let re = 0;
		let im = 0;

		for (let i = 0; i < input.length; i++) {
			//minusul da sensul de rotatie
			let phi = (-2 * Math.PI * k * i) / input.length;
			let cos = Math.cos(phi);
			let sin = Math.sin(phi);

			//coordonatele vectorului - calculam Cn
			re += input[i].x * cos - input[i].y * sin;
			im += input[i].y * cos + input[i].x * sin;
		}

		//micsoram mereu partea reala si imaginara pentru ca desena cercuri din ce in ce mai mici
		re /= input.length;
		im /= input.length;

		//adauga in vectorul de raze si unghiuri (faze)
		amplitude.push(Math.sqrt(re * re + im * im));
		phase.push(Math.atan2(im, re));
	}

	//adaugam in vectorul de indici, "key"-le unice din vectorul de raze si apoi le sortam
	let indices = [...Array(amplitude.length).keys()];
	indices.sort((a, b) => amplitude[b] - amplitude[a]);

	//returnam mapul fourier cu toate componentele necesare pentru animatie
	let fourier = { amplitude: amplitude, phase: phase, indices: indices };
	return fourier;
}
