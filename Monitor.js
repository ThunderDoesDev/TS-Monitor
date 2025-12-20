const {
    Client,
    IntentsBitField
} = require('discord.js');

const client = new Client({
    fetchAllMembers: true,
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    },
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION',
    ],
    intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent
    ],
});


client.settings = require('./Settings/Config.json');
client.logger = require("./Utils/Logger");
client.modules = require("./Utils/Modules"); 
client.packages = require('./package.json');
client.errors = require('./Utils/Errors');

const eventHandler = require('./Utils/Handlers');
eventHandler.eventsLoader(client);

let date = new Date();
client.footer = `\u00a9 ${date.getFullYear()} • ${client.settings.bot.statusBotName}`

let userAgent = client.userAgent || `${client.settings.bot.statusBotName}/${client.packages.version}`;
headers = {
    'Content-Type': 'application/json',
    'User-Agent': userAgent
};

client.login(client.settings.bot.token).catch(err => {
    client.logger.error("TOKEN_ERROR", err);
});