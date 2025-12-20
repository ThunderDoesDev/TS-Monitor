module.exports.run = async (client, oldPresence, newPresence) => {
    try {
        const textStatusLabels = {
            online: "Online",
            offline: "Offline",
            idle: "Idle",
            dnd: "Do Not Disturb",
            streaming: "Streaming"
        };
        const statusThumbnail = {
            dnd: 'attachment://dnd.png',
            idle: 'attachment://idle.png',
            online: 'attachment://online.png',
            offline: 'attachment://offline.png',
            streaming: 'attachment://streaming.png'
        };
        const statusColor = {
            dnd: client.modules.discord.Colors.Red,
            idle: client.modules.discord.Colors.Yellow,
            online: client.modules.discord.Colors.Green,
            offline: client.modules.discord.Colors.Grey,
            streaming: client.modules.discord.Colors.Purple
        };
        const statusAttachments = {
            dnd: new client.modules.discord.AttachmentBuilder('./Images/dnd.png'),
            idle: new client.modules.discord.AttachmentBuilder('./Images/idle.png'),
            online: new client.modules.discord.AttachmentBuilder('./Images/online.png'),
            offline: new client.modules.discord.AttachmentBuilder('./Images/offline.png'),
            streaming: new client.modules.discord.AttachmentBuilder('./Images/streaming.png')
        };
        const presence = newPresence ? newPresence : oldPresence;
        if (!presence) return;
        if (!presence.member) return;
        if (!presence.member.user) return;
        if (!presence.member.user.bot) return;
        if (presence.userId !== client.settings.bot.botID) return;
        const bot = client.users.cache.get(client.settings.bot.botID) || null;
        if (!bot) return;
        const guild = client.guilds.cache.get(client.settings.bot.mainGuild) || null;
        if (!guild) return;
        const channel = guild.channels.cache.find(chan => chan.id === client.settings.bot.statusChannel) || null;
        if (!channel) return;
        const activities = newPresence && newPresence.activities ? newPresence.activities : [];
        const isStreaming = activities.some(a => a.type === 'STREAMING');
        const status = newPresence && newPresence.status ? newPresence.status : 'offline';
        const rawStatus = isStreaming ? 'streaming' : status;
        const oldActivities = oldPresence && oldPresence.activities ? oldPresence.activities : [];
        const wasStreaming = oldActivities.some(a => a.type === 'STREAMING');
        const oldStatus = oldPresence && oldPresence.status ? oldPresence.status : 'offline';
        const oldRawStatus = wasStreaming ? 'streaming' : oldStatus;
        if (oldPresence && newPresence && oldRawStatus === rawStatus) return;
        const pretty = textStatusLabels[rawStatus];
        const embed = new client.modules.discord.EmbedBuilder()
            .setTitle(`${bot.username} - Status Monitor`)
            .setColor(statusColor[rawStatus])
            .addFields({
                name: `Status:`,
                value: pretty
            })
            .addFields({
                name: `Incident Date/Time:`,
                value: `${client.modules.discord.time(new Date(), 'R')}`
            })
            .setFooter({
                text: client.footer
            })
            .setThumbnail(statusThumbnail[rawStatus]);
        await channel.send({
            embeds: [embed],
            files: [statusAttachments[rawStatus]]
        }).then(() => {
            client.logger.log(`STATUS`, `${bot.username} status changed to ${pretty}.`);
        }).catch(e => {
            client.logger.error(`ERROR`, e);
        });
    } catch (error) {
        client.errors(client, error.stack, oldPresence, 'Events');
    }
};