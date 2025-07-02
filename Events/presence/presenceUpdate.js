const {
    EmbedBuilder,
    time,
    Colors
} = require('discord.js');
const { log, error } = require("../../Functions/logger")

module.exports.run = (client, oldPresence, newPresence) => {
    if (!oldPresence || !newPresence) return;
    if (oldPresence.status === newPresence.status) return;
    if (newPresence.userId !== client.settings.bot.botID) return;
    const bot = client.users.cache.get(client.settings.bot.botID) || null;
    const guild = client.guilds.cache.get(client.settings.bot.mainGuild) || null;
    const channel = guild && guild.channels.cache.find(chan => chan.id === client.settings.bot.statusChannel) || null;
    if (channel !== null) {
        if (newPresence.status === 'offline') {
            const embed = new EmbedBuilder()
                .setTitle(`${oldPresence.user.username} - Status Monitor`)
                .setColor(Colors.Grey)
                .setDescription(`**${bot.username} Is Currently Offline.**`)
                .addFields({
                    name: `Incident Date/Time:`,
                    value: `${time(new Date(), 'R')}`
                })
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747774638915584/offline.png')
            channel.send({
                embeds: [embed]
            }).then(() => log(`STATUS`, `${bot.username} Is Currently Offline.`)).catch(e => error(`ERROR`, e));
        } else if (newPresence.status === 'online') {
            const embed = new EmbedBuilder()
                .setTitle(`${oldPresence.user.username} - Status Monitor`)
                .setColor(Colors.Green)
                .setDescription(`**${bot.username} is now back Online.**`)
                .addFields({
                    name: `Incident Date/Time:`,
                    value: `${time(new Date(), 'R')}`
                })
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747775947669506/online.png')
            channel.send({
                embeds: [embed]
            }).then(() => log(`STATUS`, `${bot.username} is now back Online.`)).catch(e => error(`ERROR`, e));
        } else if (newPresence.status === 'dnd') {
            const embed = new EmbedBuilder()
                .setTitle(`${oldPresence.user.username} - Status Monitor`)
                .setColor(Colors.Red)
                .setDescription(`**${bot.username} has gone down for Maintenance.**`)
                .addFields({
                    name: `Incident Date/Time:`,
                    value: `${time(new Date(), 'R')}`
                })
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747772848209921/dnd.png')
            channel.send({
                embeds: [embed]
            }).then(() => log(`STATUS`, `${bot.username} has gone down for Maintenance.`)).catch(e => error(`ERROR`, e));
        }
    }
}

