// Require dependencies
const {Gpio} = require('onoff');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Create a log file
const logFile = path.resolve(__dirname, 'output.log');
const keyFile = path.resolve(__dirname, 'ifttt.key');

if (!fs.existsSync(keyFile)) {
	console.log(`Missing IFTTT key file`);
	process.exit(1);
}

// Get the key from file
const key = fs.readFileSync(keyFile, 'utf8');

// Contain each of the GPIO number for each button
const buttons = {
	poop: 26,
	pee: 17,
	walk: 25,
	feed: 12
};

// Time in milliseconds when to accept a new press
const block = 5000;

// Keep track of blocking time individually
const blockers = {};

// Setup the buttons
for (const id in buttons) {
	
	const button = new Gpio(buttons[id], 'in', 'both');
	
	button.watch(onPress.bind(null, id));
	
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
		
		const date = (new Date(now)).toLocaleTimeString();
		fs.appendFileSync(logFile, `[${date}] ${id}\n`);
		console.log(`[${date}] ${id}`);
		webhookPost(id);
	}
}

// Post to IFTTT to be intercepted
function webhookPost(id) {
	
	const options = {
		host: 'maker.ifttt.com',
		port: '443',
		path: `/trigger/cobalt_${id}/with/key/${key}`,
		method: 'POST'
	};

	// Set up the request
	const request = http.request(options, (result) => {
		result.setEncoding('utf8');
		result.on('data', (chunk) => {
			console.log('Response: ' + chunk);
		});
	});

	// Post
	request.end();
}
