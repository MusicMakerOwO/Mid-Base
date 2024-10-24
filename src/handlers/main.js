const { GatewayIntentBits, Client, Partials, Events, Collection } = require('discord.js')
const client = new Client({ intents: Object.values(GatewayIntentBits).slice(0, 22), partials: Object.values(Partials) });
client.log = require('../logs.js');

// CLIENT PASSING \\
const commandHandler = require('./CmdHandler.js')
commandHandler(client);
const componentHandler = require("./ComponentHandler");
componentHandler(client);
client.config = require('../../login.json')

// READY EVENT \\

client.on('ready', (x) => {
    console.log(`${x.user.tag} Is Online`);
    // you can put a status here as well
})

client.login(client.config.bot_token)