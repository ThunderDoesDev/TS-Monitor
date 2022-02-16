const Discord = require('discord.js');
let logger = require("./logger")
const client = new Discord.Client({
    fetchAllMembers: true,
    intents: [
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILDS
    ],
});
client.config = require('./settings/config.json');

client.on('ready', () => {
    const bot = client.users.cache.get(client.config.botID);
    const guild = client.guilds.cache.get(client.config.guildID);
    const channel = guild.channels.cache.find(chan => chan.id === client.config.channelID) || null;
    if (!client.users.id === client.config.botID) {
        logger.error("BOT_NOT_FOUND", `I need to be in the same guild as the bot I am monitoring.`);
    }
    if (!client.token) {
        logger.error("NO_TOKEN_FOUND", `I cannot connect to Discord without a valid token.`);
        process.exit(1);
    }
    if (!client.config.botID) {
        logger.error("BOT_NOT_FOUND", `Please enter a BotID into my config.json.`);
        process.exit(1);
    }
    if (guild.length > 1) {
        logger.error("MORE_THAN_ONE_GUILD", `I can only be used in ONE_GUILD only.`);
        process.exit(1);
    }
    if (!guild) {
        logger.error("NO_GUILD_FOUND", `Please put me in a guild.`);
        process.exit(1);
    }
    if (!channel) {
        logger.error("CHANNEL_MISSING", `I need the channel to post in to be able to function properly, Make sure the name is in lowercase.`);
        process.exit(1);
    }
    client.user.setActivity(`${bot.tag}`, {
        type: "WATCHING"
    });
    logger.log("CREATOR", `ThunderDoesDev#6666`);
    logger.log("LOGGED IN", `${client.user.tag}`);
    logger.log("MONITORING GUILD", `${guild}`);
    logger.log("MONITORING BOT", `${bot.tag}`);
    logger.log("MONITORING CHANNEL", `${channel.name}`);
});
client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (!oldPresence || !newPresence) return;
    if (oldPresence.status === newPresence.status) return;
    if (newPresence.userId !== client.config.botID) return;
    const bot = client.users.cache.get(client.config.botID);
    const channel = oldPresence.guild.channels.cache.find(chan => chan.id === client.config.channelID) || null;
    if (channel !== null) {
        if (newPresence.status === 'offline') {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Bot Status Monitor`)
                .setColor('GREY')
                .setDescription(`**${bot.username} Is Currently Offline.**`)
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747774638915584/offline.png')
                .setTimestamp();
            channel.send({
                    embeds: [embed]
            }).then(() => logger.log(`STATUS`, `${bot.username} Is Currently Offline.`)).catch(e => logger.error(`ERROR`, e));
        } else if (newPresence.status === 'online') {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Bot Status Monitor`)
                .setColor("GREEN")
                .setDescription(`**${bot.username} is now Online.**`)
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747775947669506/online.png')
                .setTimestamp();
            channel.send({
                    embeds: [embed]
            }).then(() => logger.log(`STATUS`, `${bot.username} is now Online.`)).catch(e => logger.error(`ERROR`, e));
        } else if (newPresence.status === 'dnd') {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Bot Status Monitor`)
                .setColor('RED')
                .setDescription(`**${bot.username} has gone down for Maintenance.**`)
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747772848209921/dnd.png')
                .setTimestamp();
            channel.send({
                    embeds: [embed]
            }).then(() => logger.log(`STATUS`, `${bot.username} has gone down for Maintenance.`)).catch(e => logger.error(`ERROR`, e));
        }
    }
});

client.login(client.config.token);