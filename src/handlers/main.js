const { GatewayIntentBits, Client, Partials } = require('discord.js')
const client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
const { bot_token } = require('../../login.json')
const Log = require('../utils/logs.js');

// CLIENT PASSING \\
require('./CmdHandler.js')(client);
require("./ComponentHandler")(client);
require('./mongo.js')(client);
require('./EventHandler.js')(client);
require('../utils/AntiCrash')(client);
require('./HotReload.js')(client);

// READY EVENT \\

client.on('ready', (x) => {
    Log.login(`${x.user.tag} Is Online`);
    // you can put a status here as well
})

client.login(bot_token)