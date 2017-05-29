// Require dependencies
const {Gpio} = require('onoff');
const fs = require('fs');
const path = require('path');
const http = require('http');
const querystring = require('querystring');

// Create a log file
const logFile = path.resolve(__dirname, 'output.log');
const keyFile = path.resolve(__dirname, 'ifttt.key');

if (!fs.existsSync(keyFile)) {
	console.log(`Missing IFTTT key file`);
	process.exit(1);
}

// Get the key from file
const key = fs.readFileSync(keyFile, 'utf8').trim();

// Contain each of the GPIO number for each button
const buttons = {
	poop: 26,
	pee: 17,
	walk: 25,
	feed: 12
};

// Time in milliseconds when to accept a new press
const block = 20 * 1000;

// Keep track of blocking time individually
const blockers = {};

// Collection of buttons
const buttonList = [];

// Setup the buttons
for (const id in buttons) {
	
	const button = new Gpio(buttons[id], 'in', 'both');
	
	button.watch(onPress.bind(null, id));
	buttonList.push(button);

	// Set a default blocker
	blockers[id] = Date.now();
}

// Handler for the button watch
function onPress(id, err, value) {
	
	const now = Date.now();
	
	// Prevent rapid fire buttons
	if (value && now > blockers[id]) {
		
		// Block until a few seconds from now
		blockers[id] = now + block;

		log(id);
		webhookPost(id);
	}
}

// Log function to set to log file
// as well as the console
function log(message) {

	// Create timestamp
	const now = new Date();
	const date = now.toLocaleDateString();
	const time = now.toLocaleTimeString();

	// Format the message
	message = `[${date} ${time}] ${message}`;

	// Add to the log file
	fs.appendFileSync(logFile, message + '\n');

	// Add to console
	console.log(message);
}

// Post to IFTTT to be intercepted
function webhookPost(id) {

	const data = querystring.stringify({
		value1: Date.now(),
		value2: id
	});

	const options = {
		port: '80',
		host: 'maker.ifttt.com',
		path: `/trigger/cobalt_${id}/with/key/${key}`,
		method: 'POST'
	};

	// Set up the request
	const request = http.request(options, (result) => {
		result.setEncoding('utf8');
		result.on('data', log);
	});

	// Post
	request.write(data);
	request.end();
}

// Clean up buttons on exit
process.on('SIGINT', function () {
	buttonList.forEach((button) => {
		button.unexport();
	});
});
