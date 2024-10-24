const { GatewayIntentBits, Client, Partials } = require('discord.js')
const client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });
client.log = require('../logs.js');

// CLIENT PASSING \\
require('./CmdHandler.js')(client);
require("./ComponentHandler")(client);
client.config = require('../../login.json')

// READY EVENT \\

client.on('ready', (x) => {
    console.log(`${x.user.tag} Is Online`);
    // you can put a status here as well
})

client.login(client.config.bot_token)