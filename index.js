
const {Gpio} = require('onoff');
const fs = require('fs');
const path = require('path');

// Create a log file
const log = path.resolve(__dirname, 'output.log');

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
		fs.appendFileSync(log, `[${date}] ${id}\n`);
		console.log(`[${date}] ${id}`);
	}
}