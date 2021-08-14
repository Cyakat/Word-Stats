const config = require("./config.json");
const {Client, Collection, Intents} = require("discord.js");
const fs = require("fs");
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS);

const bot = new Client({intents: [myIntents]});
bot.commands = new Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});

//Playing Message
bot.once("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);

  bot.user.setActivity("https://tikomc.tk/Word-Stats", {type: "WATCHING"});
});

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName   === 'ping') {
		await interaction.reply('Pong!');
	}
});

//Command Manager
/*bot.on("ineractionCreate", message => {
  if(message.author.bot) return;
  console.log(message.content);

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  //Check for prefix
  if(!cmd.startsWith(prefix)) return;

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});*/


//Token need in token.json
bot.login(config.token);
