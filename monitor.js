const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./settings/config.json');

client.on('ready', () => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const channel = guild.channels.cache.find(chan => chan.id === client.config.channelID) || null;
    if (!client.users.id === client.config.botID) {
        console.log("\n[BOT_NOT_FOUND]: I need to be in the same guild as the bot I am monitoring.\n")
    }
    if (!client.config.token) {
        console.log("\n[NO_TOKEN_FOUND]: I cannot connect to Discord without a valid token.\n");
        process.exit(1);
    }
    if (!client.config.botID) {
        console.log("\n[NO_BOT_ID_FOUND]: Please enter a BotID into my config.json.\n");
        process.exit(1);
    }
    if (guild.length > 1) {
        console.log("\n[MORE_THAN_ONE_GUILD]: I can only be used in ONE_GUILD only.\n");
        process.exit(1);
    }
    if (!guild) {
        console.log("\n[NO_GUILD_FOUND]: Please put me in a guild.\n");
        process.exit(1);
    }
    if (!channel) {
        console.log(`\n[CHANNEL_MISSING]: I need the channel to post in to be able to function properly.\nMake sure the name is in lowercase.\n`)
        process.exit(1);
    }
    console.log(`Discord Bot Monitor By Thunder#0666`);
    console.log(`Logged In As ${client.user.tag}`);
    console.log(`Monitoring In Guild: ${guild}`);
    console.log(`Monitoring Posting In: ${channel.name}.`);
});
client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (oldPresence.status == newPresence.status) return;
    if (newPresence.userID !== client.config.botID) return;
    const channel = oldPresence.guild.channels.cache.find(chan => chan.id === client.config.channelID) || null;
    if (channel !== null) {
        if (newPresence.status === 'offline') {
            const embed = new Discord.MessageEmbed()
                .setTitle('Bot Monitor')
                .setColor('GREY')
                .setDescription('**Bot Is Currently Offline.**')
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747774638915584/offline.png')
                .setTimestamp();
            channel.send(embed)
                .then(() => console.log('Bot has gone offline. Potential Crash?'))
                .catch(e => console.error(e));
        } else if (newPresence.status === 'online') {
            const embed = new Discord.MessageEmbed()
                .setTitle('Bot Monitor')
                .setColor("GREEN")
                .setDescription('**Everything is working as normal**')
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747775947669506/online.png')
                .setTimestamp();
            channel.send(embed)
                .then(() => console.log('Bot is healthy and online.'))
                .catch(e => console.error(e));
        } else if (newPresence.status === 'dnd') {
            const embed = new Discord.MessageEmbed()
                .setTitle('Bot Monitor')
                .setColor('RED')
                .setDescription('**Down For Maintenance**')
                .setThumbnail('https://cdn.discordapp.com/attachments/506233661616816138/513747772848209921/dnd.png')
                .setTimestamp();
            channel.send(embed)
                .then(() => console.log('Bot is down for maintenance.'))
                .catch(e => console.error(e));
        }
    }
});

client.login(client.config.token);