const {
    Client,
    MessageEmbed,
    Intents
} = require('discord.js');
const {
    time
} = require('@discordjs/builders');

const client = new Client({
    fetchAllMembers: true,
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILDS
    ],
});


client.config = require('./settings/config.json');
client.logger = require("./logger")

client.on('ready', () => {
    const bot = client.users.cache.get(client.config.botID);
    const guild = client.guilds.cache.get(client.config.guildID);
    const channel = guild.channels.cache.find(chan => chan.id === client.config.channelID) || null;
    if (!client.users.id === client.config.botID) {
        client.logger.error("BOT_NOT_FOUND", `I need to be in the same guild as the bot I am monitoring.`);
    }
    if (!client.token) {
        client.logger.error("NO_TOKEN_FOUND", `I cannot connect to Discord without a valid token.`);
        process.exit(1);
    }
    if (!client.config.botID) {
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
        type: "WATCHING"
    });
    client.logger.log("CREATOR", `ThunderDoesDev#6666`);
    client.logger.log("LOGGED IN", `${client.user.tag}`);
    client.logger.log("MONITORING GUILD", `${guild}`);
    client.logger.log("MONITORING BOT", `${bot.tag}`);
    client.logger.log("MONITORING CHANNEL", `${channel.name}`);
});
client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (!oldPresence || !newPresence) return;
    if (oldPresence.status === newPresence.status) return;
    if (newPresence.userId !== client.config.botID) return;
    const bot = client.users.cache.get(client.config.botID);
    const channel = oldPresence.guild.channels.cache.find(chan => chan.id === client.config.channelID) || null;
    const d = new Date();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = [day[d.getDay()], d.getDate(), month[d.getMonth()], d.getFullYear()].join(' ');
    if (channel !== null) {
        if (newPresence.status === 'offline') {
            const embed = new MessageEmbed()
                .setTitle(`Bot Status Monitor`)
                .setColor('GREY')
                .setDescription(`**${bot.username} Is Currently Offline.**`)
                .addField(`Incident Date/Time:`, `${time(new Date(), 'R')}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747774638915584/offline.png')
            channel.send({
                embeds: [embed]
            }).then(() => client.logger.log(`STATUS`, `${bot.username} Is Currently Offline.`)).catch(e => client.logger.error(`ERROR`, e));
        } else if (newPresence.status === 'online') {
            const embed = new MessageEmbed()
                .setTitle(`Bot Status Monitor`)
                .setColor("GREEN")
                .setDescription(`**${bot.username} is now back Online.**`)
                .addField(`Incident Date/Time:`, `${time(new Date(), 'R')}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747775947669506/online.png')
            channel.send({
                embeds: [embed]
            }).then(() => client.logger.log(`STATUS`, `${bot.username} is now back Online.`)).catch(e => client.logger.error(`ERROR`, e));
        } else if (newPresence.status === 'dnd') {
            const embed = new MessageEmbed()
                .setTitle(`Bot Status Monitor`)
                .setColor('RED')
                .setDescription(`**${bot.username} has gone down for Maintenance.**`)
                .addField(`Incident Date/Time:`, `${time(new Date(), 'R')}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747772848209921/dnd.png')
            channel.send({
                embeds: [embed]
            }).then(() => client.logger.log(`STATUS`, `${bot.username} has gone down for Maintenance.`)).catch(e => client.logger.error(`ERROR`, e));
        }
    }
});

client.login(client.config.token);