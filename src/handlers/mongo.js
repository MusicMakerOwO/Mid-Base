const mongoose = require('mongoose')
const { mongo } = require('../../login.json')

module.exports = (client) => {
	const Log = require('../utils/logs.js');

	if (!mongo) return Log.warn('A MongoDB Link was not detected in your .env / login.config. There may be an issue with your link.');

    const connect = mongoose.connect(mongo);

    if (connect) {

	Log.success('Connection to MongoDB was succesful'); 

    }

}