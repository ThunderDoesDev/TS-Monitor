const {
    Client,
    IntentsBitField
} = require('discord.js');

const client = new Client({
    fetchAllMembers: true,
    intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildScheduledEvents
    ],
});


client.settings = require('./Settings/config.json');
client.logger = require("./Functions/logger");

const eventHandler = require('./Functions/handlers');
eventHandler.loadEvents(client);

client.login(client.settings.bot.token);