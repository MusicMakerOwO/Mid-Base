// THANK YOU TO ghowsting.dev FOR LETTING ME USE THIS

const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const Log = require('../utils/logs.js');
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const eventModule = require(filePath);
        Log.success(`Loaded ${eventFiles.length} event(s)`);
        if (eventModule.once) {
            client.once(eventModule.event, (...args) => eventModule.execute(...args, client));
        } else {
            client.on(eventModule.event, (...args) => eventModule.execute(...args, client));
        }
    }
};

// it didnt actually update the code