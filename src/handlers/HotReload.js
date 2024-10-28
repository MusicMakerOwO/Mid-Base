const fs = require('node:fs');
const path = require('node:path');
const log = require('../utils/logs')
const Debounce = require('../utils/Debounce')

const WATCHED_FOLDERS = [
	'slash/commands',
    'components/buttons',
    'components/menus',
    'components/modals',
    'prefix'
]
function EditCallback(client, folder, event, filename) {
    log.info(`File "${filename}" has been changed!`);
    log.info(`Event: ${event}`);

    const fullPath = path.join(__dirname, '../', folder, filename);

    if (filename.endsWith('.js')) {
        delete require.cache[require.resolve(fullPath)]; // so we can use require() again
    }

    // doesn't register the commands if the name changes
    if (folder.includes('commands')) {
        const command = require(fullPath);
        const commandData = command.data.toJSON();
        client.commands.set(commandData.name, command);
    }
}

module.exports = function (client) {
    for (const folder of WATCHED_FOLDERS) {
        log.info(`Watching Folder: ${folder}`);
        // oopsies try again lmao | Ok XD yeah I can
        const callback = EditCallback.bind(null, client, folder);
        fs.watch(`${__dirname}/../${folder}`, { recursive: true }, Debounce(callback, 500)); // Half Second Delay
    }
}