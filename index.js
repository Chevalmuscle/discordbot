require('console-stamp')(console, '[HH:MM:ss.l]');
const Discord = require("discord.js");
const http = require("http");

const client = new Discord.Client();

require("dotenv").config(); // to use environment variables
const port = process.env.PORT;
const discordToken = process.env.DISCORD_TOKEN;

const commands = require("./commands");

client.login(discordToken);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${commands.help.invocation} to 😧`)
});

client.on("message", async message => {
  if (!message.guild) return;

  const voiceChannel = message.member.voiceChannel;
  const textChannel = message.channel;

  const messageArgs = message.content.split(" ");
  const messageArgAmount = messageArgs.length;

  const invokeArgs = {
    message: messageArgs,
    textChannel: textChannel,
    voiceChannel: voiceChannel,
  };

  let commandInvoked = false;

  // checks if the message is a known command
  for (command in commands) {
    const value = commands[command];
    if (
      value.invocation === messageArgs[0] &&
      value.argumentsAmount === messageArgAmount
    ) {
      value.invoke(invokeArgs);
      commandInvoked = true;
    }
  }

  // if the command is not found, it might be a sound command
  if (!commandInvoked && messageArgAmount === commands.play.argumentsAmount) {
    commands.play.invoke(invokeArgs);
  }
});

const serveRequest = function(request, response) {
  response.write("hello world !");
  response.end();
};

const server = http.createServer(serveRequest);

server.listen(port, err => {
  if (err) {
    console.log("Something bad happened when starting to server", err);
  }
  console.log(`Listening on port ${port} 🐷`);
});
