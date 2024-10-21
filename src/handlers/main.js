const { GatewayIntentBits, Client, Partials, Events, Collection } = require('discord.js')
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({ intents: Object.values(GatewayIntentBits).slice(0, 22), partials: Object.values(Partials) });
const componentHandler = require("./Component Handler");
componentHandler(client);
client.config = require('../../login.json')

client.on('ready', (x) => {
    console.log(`${x.user.tag} Is Online`);
    // you can put a status here as well
})

client.commands = new Collection();
client.prefix = new Collection();
const commandHandler = require('./Command Handling');
commandHandler(client);

const foldersPath = path.join(__dirname, '../slash');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(client.config.bot_token)