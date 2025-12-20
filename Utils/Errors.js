const LOG_DIR = './Logs';
const MAX_LOG_SIZE = 5 * 1024 * 1024;

const formatTime = () => {
    return new Date().toLocaleString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: "Australia/Brisbane",
        hour12: true
    });
};

const writeLog = async (client, logPath, content) => {
    try {
        await client.modules.fsPromises.mkdir(LOG_DIR, {
            recursive: true
        });
        try {
            await client.modules.fsPromises.access(logPath);
            const stats = await client.modules.fsPromises.stat(logPath);
            if (stats.size > MAX_LOG_SIZE) {
                const backupPath = `${logPath}.${Date.now()}.backup`;
                await client.modules.fsPromises.rename(logPath, backupPath);
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                await client.modules.fsPromises.writeFile(logPath, '');
            } else {
                client.logger.error('ErrorLogger', `Failed to check log file: ${err}`);
            }
        }        
        const errorStack = content.error && content.error.stack ? content.error.stack : content.error;
        const logEntry = `[${new Date().toISOString()}]\n${Object.entries(content)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}\n${errorStack ? `Stack Trace:\n${errorStack}\n` : ''}\n`;
        await client.modules.fsPromises.appendFile(logPath, logEntry);
    } catch (err) {
        client.logger.error('ErrorLogger', `Failed to write to log file: ${err}`);
    }
};

const handleEventError = async (client, error, incidentID) => {
    await writeLog(client, client.modules.path.join(LOG_DIR, 'Event_Errors.log'), {
        date: new Date().toLocaleDateString(),
        time: formatTime(),
        incident: incidentID,
        error
    });
    return `Event Error: ${error}`;
};


const handleUnknownError = async (client, error, incidentID) => {
    await writeLog(client, client.modules.path.join(LOG_DIR, 'Unknown_Errors.log'), {
        date: new Date().toLocaleDateString(),
        time: formatTime(),
        incident: incidentID,
        error
    });
    return `Unknown Error: ${error}`;
};

const createErrorEmbed = (client, error, incidentID, errorType, user, guild) => {
    return new client.modules.discord.EmbedBuilder()
        .setAuthor({ name: `Error Log` })
        .setTitle(`Date: ${new Date().toLocaleDateString()}\nTime: ${client.modules.discord.time()} (AEST)\nIncident: ${incidentID}\nType: ${errorType}`)
        .setDescription(`\`\`\`yaml\n${error.toString().replace(/```/g, '`')}\`\`\``)
        .setColor(client.modules.discord.Colors.Red)
        .setTimestamp();
};

const createUserErrorResponse = (client, incidentID, errorType, user) => {
    const userInfo = user ? `\n> User: ${user.username}` : '';
    const supportButton = new client.modules.discord.ButtonBuilder()
        .setLabel('Support Guild')
        .setStyle(client.modules.discord.ButtonStyle.Link)
        .setURL(client.settings.bot.supportGuild);
    const components = [];
    if (supportButton) components.push(supportButton);
    const buildMainText = () => {
        return (
            `There has been an error!\nThis has been reported to my developers.\n` +
            `**Incident Information:**\n` +
            `> Date: ${new Date().toLocaleDateString()}\n` +
            `> Time: ${formatTime()} (AEST)\n` +
            `> Incident: ${incidentID}${userInfo}\n` +
            `> Type: ${errorType}`
        );
    };
    const embed = new client.modules.discord.EmbedBuilder()
        .setAuthor({ name: `${client.settings.bot.name} • Error Occurred` })
        .setTitle(`${buildMainText()}`)
        .setColor(client.modules.discord.Colors.Red)
        .setTimestamp();    
    const actionRow = new client.modules.discord.ActionRowBuilder();
    if (components.length > 0) {
        actionRow.addComponents(components);
    }    
    return {
        embed,
        components: components.length > 0 ? [actionRow] : []
    };
};

module.exports = async (client, error, interaction, errorType = 'Unknown') => {
    if (!error) return;
    const incidentID = Math.random().toString(36).substr(2);
    const user = interaction && interaction.user ? interaction.user : null;
    const guild = interaction && interaction.guild ? interaction.guild : null;
    try {
        switch (errorType) {
            case 'Event':
                await handleEventError(client, error, incidentID);
                break;
            default:
                await handleUnknownError(client, error, incidentID);
        }
        if (interaction && interaction.reply && !interaction.replied && !interaction.deferred) {
            const { embed, components } = createUserErrorResponse(client, incidentID, errorType, user);
            await interaction.reply({
                embeds: [embed],
                components: components,
                flags: client.modules.discord.MessageFlags.Ephemeral
            });
        }
        let fetchedChannel = null;
        try {
            fetchedChannel = client.channels.cache.get(client.settings.bot.errorChannel);
            if (fetchedChannel) {
                const errorEmbed = createErrorEmbed(client, error, incidentID, errorType);
                await fetchedChannel.send({
                    embeds: [errorEmbed]
                });
            }
        } catch (err) {
            client.logger.error('ErrorHandler', `Failed to handle error channel operations: ${err}`);
        }
    } catch (handlingError) {
        client.logger.error('ErrorHandler', `Error while handling error: ${handlingError}`);
    }
};