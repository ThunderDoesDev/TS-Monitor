const {
    ActivityType
} = require("discord.js");
const cfonts = require("cfonts");

module.exports.run = (client, message, args) => {
    const bot = client.users.cache.get(client.settings.bot.botID);
    const guild = client.guilds.cache.get(client.settings.bot.mainGuild);
    const channel = guild.channels.cache.find(chan => chan.id === client.settings.bot.statusChannel) || null;
    if (!client.users.id === client.settings.bot.botID) {
        client.logger.error("BOT_NOT_FOUND", `I need to be in the same guild as the bot I am monitoring.`);
    }
    if (!client.token) {
        client.logger.error("NO_TOKEN_FOUND", `I cannot connect to Discord without a valid token.`);
        process.exit(1);
    }
    if (!client.settings.bot.botID) {
        client.logger.error("BOT_NOT_FOUND", `Please enter a BotID into my config.json.`);
        process.exit(1);
    }
    if (guild.length > 1) {
        client.logger.error("MORE_THAN_ONE_GUILD", `I can only be used in ONE_GUILD only.`);
        process.exit(1);
    }
    if (!guild) {
        client.logger.error("NO_GUILD_FOUND", `Please put me in a guild.`);
        process.exit(1);
    }
    if (!channel) {
        client.logger.error("CHANNEL_MISSING", `I need the channel to post in to be able to function properly, Make sure the name is in lowercase.`);
        process.exit(1);
    }
    client.user.setActivity(`${bot.tag}`, {
        type: ActivityType.Watching
    });
    const banner = cfonts.render((`TSMonitor`), {
        font: 'chrome',
        color: 'candy',
        align: 'center',
        gradient: ["red", "magenta"],
        lineHeight: 1
    });
    console.log(banner.string);
    client.logger.log("CREATOR", `Thunder#6666`);
    client.logger.log("LOGGED IN", `${client.user.tag}`);
    client.logger.log("MONITORING GUILD", `${guild}`);
    client.logger.log("MONITORING BOT", `${bot.tag}`);
    client.logger.log("MONITORING CHANNEL", `${channel.name}`);
}