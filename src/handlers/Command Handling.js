// one of the last things im doing cus i suck at handlers lol
const { REST, Routes, Collection, Events } = require('discord.js');
const { client_id, bot_token, prefix } = require('../../login.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, '../slash');
const commandFolders = fs.readdirSync(foldersPath);
module.exports = (client) => {
const prefixFolders = fs.readdirSync("src/prefix").filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
	const Cmd = require('../prefix/' + arx)
	client.prefix.set(Cmd.name, Cmd)
}

client.on('messageCreate', async message => {;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
 
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
 
	const command = client.prefix.get(commandName);
 
	if (!command) return;
 
	try {
	  await command.execute(message, args);
	} catch (error) {
	  console.error(error);
	  await message.reply('There was an error executing that command!');
	}
 });
 }

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(bot_token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(client_id),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
module.exports = (client) => {
client.on(Events.InteractionCreate, async (interaction, client) => {
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
}