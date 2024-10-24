const mongoose = require('mongoose')
const { mongo } = require('../../login.json')

module.exports = (client) => {
	client.log = require('../logs.js');

	if (!mongo) return client.log.warn('A MongoDB Link was not detected in your .env / login.config. There may be an issue with your link.');

    const connect = mongoose.connect(mongo);

    if (connect) {

	client.log.success('Connection to MongoDB was succesful'); 
	
    }

}