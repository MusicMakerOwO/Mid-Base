const { GatewayIntentBits, Client, Partials, Events, Collection } = require('discord.js')
const client = new Client({ intents: Object.values(GatewayIntentBits).slice(0, 22), partials: Object.values(Partials) });

// CLIENT PASSING \\

const commandHandler = require('./Command Handling');
commandHandler(client);
const componentHandler = require("./Component Handler");
componentHandler(client);
client.config = require('../../login.json')

// READY EVENT \\

client.on('ready', (x) => {
    console.log(`${x.user.tag} Is Online`);
    // you can put a status here as well
})

client.login(client.config.bot_token)