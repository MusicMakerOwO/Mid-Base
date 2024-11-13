const { REST, Routes, Collection, Events } = require('discord.js');
const { client_id, bot_token, prefix } = require('../../login.json');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async (client) => {
	const commands = [];
	
	// Grab all the command folders from the commands directory you created earlier
	const foldersPath = path.join(__dirname, '../slash');
	const commandFolders = fs.readdirSync(foldersPath);
	const prefixFolders = fs.readdirSync("src/prefix").filter((f) => f.endsWith(".js"));

	client.prefix = new Collection();
	client.commands = new Collection();

	const Log = require('../utils/logs.js');

	for (arx of prefixFolders) {
		const Cmd = require('../prefix/' + arx)
		client.prefix.set(Cmd.name, Cmd)
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
				const commandData = command.data.toJSON();
				const cmds = commandData.name;
				const data = command.data.toJSON();
				if (commandData.alias) {
					command.alias.map(alias => {
						let data2 = data;
						data.name = alias;
						client.commands.set(data2.name, command);
					});
				}
                Log.blue(`Loaded Command: /${cmds}`)
				client.commands.set(commandData.name, command);
				commands.push(commandData);
			} else {
				Log.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(bot_token);

	try {
		Log.debug(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(client_id),
			{ body: commands },
		);
	

		Log.success(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		Log.error(error);
	}

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
			Log.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction, client);
		} catch (error) {
			Log.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		if(command.execute) {
			Log.info(`[ INTERACTION ] /${interaction.commandName} has been executed by ${interaction.user.tag}`)
		}
	});

	client.on('messageCreate', async message => {;
		if (!message.content.startsWith(prefix) || message.author.bot) return;
	
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
	
		const command = client.prefix.get(commandName);

		/*if (command.alias) {
			prefix.alias.map(alias => {
				let data2 = data;
				data.name = alias;
				client.prefix.set(data2.name, prefix);
			});
		}*/
	
		if (!command) return;
	
		try {
			await command.execute(message, args, client);
		} catch (error) {
			Log.error(error);
			await message.reply('There was an error executing that command!');
		}
		if(command.execute) {
			Log.info(`[ MESSAGE ] ${prefix}${commandName} has been executed by ${message.author.tag}`)
		}
	});
}