const mongoose = require('mongoose')
const { mongo } = require('../../login.json')

	if (!mongo) return console.warn('A MongoDB Link was not detected in your .env / login.config. There may be an issue with your link.');
	const connect = mongoose.connect(mongo);
	if (connect) {
		console.log('Connection to MongoDB was succesful'); 
	}