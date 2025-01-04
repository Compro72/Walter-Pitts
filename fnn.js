

class Neuron {
	constructor(numberOfInputs, savedData=null) {
		if(savedData==null) {
			//Initialize random weights
			this.weights = [];
			for (let i = 0; i < numberOfInputs; i++) {
				this.weights.push(Math.random());
			}

			//Initialize random bias
			this.bias = Math.random();
		} else {
			this.weights = savedData.weights
			this.bias = savedData.bias
		}
	}

	activate(inputs) {
		//Apply all weights
		let appliedWeights = []
		for (let i = 0; i < inputs.length; i++) {
			appliedWeights.push(inputs[i] * this.weights[i]);
		}

		//Add all applied weights
		let output = 0;
		for (let i = 0; i < appliedWeights.length; i++) {
			output += appliedWeights[i];
		}

		//Add bias
		output += this.bias;

		//Apply sigmoid activation function
		output = 1 / (1 + Math.exp(-output));

		//Return neuron's output
		return output;
	}
}


class Layer {
	constructor(numberOfNeurons, inputsPerNeuron, savedData=null) {
		if(savedData==null) {
			//Create an array of neurons
			this.neurons = [];
			for (let i = 0; i < numberOfNeurons; i++) {
				this.neurons.push(new Neuron(inputsPerNeuron));
			}
		} else {
			this.neurons = [];
			for (let i = 0; i < savedData.neurons.length; i++) {
				this.neurons.push(new Neuron(0, savedData.neurons[i]));
			}
		}
	}

	activate(inputs) {
		//Activate the layer and output the results
		let output = [];
		for (let i = 0; i < this.neurons.length; i++) {
			output.push(this.neurons[i].activate(inputs));
		}
		return output;
	}
}


class NeuralNetwork {
	constructor(numberOfInputs, neuronsPerLayer, savedData=null) {
		if(savedData==null) {
			//Create an array of layers
			this.layers = [];
			for (let i = 0; i < neuronsPerLayer.length; i++) {
				this.layers.push(new Layer(neuronsPerLayer[i], (i == 0 ? numberOfInputs : neuronsPerLayer[i - 1])));
			}

			//The outputs of all the layers are stored in this array
			this.outputs = [];
		} else {
			this.layers = [];
			for (let i = 0; i < savedData.layers.length; i++) {
				this.layers.push(new Layer(0, 0, savedData.layers[i]));
			}
			
			this.outputs = [];
		}
	}

	feedForward(inputs) {
		//Calculate outputs then push to output array
		this.outputs = [];
		for (let i = 0; i < this.layers.length; i++) {
			this.outputs.push(this.layers[i].activate((i == 0 ? inputs : this.outputs[i - 1])));
		}
		return this.outputs;
	}
}


function train(network, trainingData, epochs, learningRate) {
	for (let epoch = 0; epoch < epochs; epoch++) {
		for (let dataIndex = 0; dataIndex < trainingData.length; dataIndex++) {
			//Set training input and target output
			const input = trainingData[dataIndex].input;
			const targetOutput = trainingData[dataIndex].output;

			//Pass the training input through the network to get predicted outputs
			network.feedForward(input);

			//Calculate output layer errors
			let errors = [];
			let currentErrors = [];
			let derivative = 0;
			let gradient = 0;
			for (let i = 0; i < targetOutput.length; i++) {
				//Calculate the derivative of the final output
				derivative = (1 / (1 + Math.exp(-(network.outputs[network.outputs.length - 1][i])))) * (1 - (1 / (1 + Math.exp(-(network.outputs[network.outputs.length - 1][i])))));
				
				//error = (target - finalOutput) * derivative
				gradient = targetOutput[i] - network.outputs[network.outputs.length - 1][i]
				currentErrors.push(gradient * derivative);
			}
			errors.push(currentErrors);


			//Calculate all the hidden layer errors
			currentErrors = [];
			for (let i = 0; i < (network.layers.length - 1); i++) {
				currentErrors = [];
				for (let j = 0; j < network.layers[network.layers.length - (i + 2)].neurons.length; j++) {
					let errorSum = 0;
					for (let k = 0; k < network.layers[network.layers.length - (i + 1)].neurons.length; k++) {
						//Multiply the weights from the current layer that contributed to the next layer's error with the error itself and add to the error sum
						errorSum += (network.layers[network.layers.length - (i + 1)].neurons[k].weights[j] * errors[0][k]);
					}
					//Calculate the derivative of the output for the current layer
					derivative = (1 / (1 + Math.exp(-(network.outputs[network.outputs.length - (i + 2)][j])))) * (1 - (1 / (1 + Math.exp(-(network.outputs[network.outputs.length - (i + 2)][j])))));

					//Current layer's new error is (errorSum * derivative)
					currentErrors.push(errorSum * derivative);
				}
				//Insert the current layer's errors to the start of the errors array
				errors.unshift(currentErrors);
			}

			//Update the weights and biases based on the errors
			for (let i = 0; i < network.layers.length; i++) {
				for (let j = 0; j < network.layers[i].neurons.length; j++) {
					for (let k = 0; k < network.layers[i].neurons[j].weights.length; k++) {
						network.layers[i].neurons[j].weights[k] += (learningRate * errors[i][j] * (i == 0 ? input[k] : network.outputs[i - 1][k]));
					}
					network.layers[i].neurons[j].bias += learningRate * errors[i][j];
				}
			}
		}
	}
	return network;
}

function predict() {
	letters = ["A", "B"]

	network.feedForward(resizePixelData());
	document.getElementById("prediction").innerText = letters[network.outputs[network.outputs.length - 1].indexOf(Math.max(...network.outputs[network.outputs.length - 1]))];
	
	if(mode == "light") {
		document.getElementById("prediction").style.color = "black";
	} else {
		document.getElementById("prediction").style.color = "#cccccc";
	}

	document.getElementById("confidence").innerText = "Confidence: " + Math.round(((Math.max(...network.outputs[network.outputs.length - 1]) - Math.min(...network.outputs[network.outputs.length - 1]))/(Math.max(...network.outputs[network.outputs.length - 1]) + Math.min(...network.outputs[network.outputs.length - 1])))*100) + "%";
}

function loadNetwork(savedData) {
	return new NeuralNetwork(0, 0, savedData)
}

//This was the code that trained the model. The "network" object was copied from the console and pasted in network.js

//This was the code that trained the model. The object was copied from the console and pasted in network.js

//let network = new NeuralNetwork(784, [100, 2]); //3 layers with 784 inputs, 100 neurons in the hidden layer and 2 outputs.
//network = train(network, trainingData, 1000, 0.03); //1000 epoches with a 0.02 learning rate.
//console.log(network);

let network = loadNetwork(savedNetwork);