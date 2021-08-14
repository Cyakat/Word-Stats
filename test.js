const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('fs');
const {Client, Intents, Collection} = require('discord.js');
const client = new Client({intents: Intents.FLAGS.GUILDS});


//This section adds the slash commands to the server it is on
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));



// Place your client and guild ids here
const clientId = '875780936380350465';
const guildId = '637740070648021000';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
//------------------------------------------------------------

//This section is the command handler for handling the commands not loading them to the server
//Any command variable that has Handler on the end means that that variable is seperate from the one in the command loader section
//because when i copied the code from the guide they had the same variable name and it broke it :/
client.commands = new Collection();

const commandFilesHandler = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFilesHandler) {
	const commandHandler = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(commandHandler.data.name, commandHandler);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (!client.commands.has(commandName)) return;

	try {
		await client.commands.get(commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
//------------------------------------------------------------

client.login(token);
