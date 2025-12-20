module.exports.run = async (client, message, args) => {
    try {
        if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
            if (!message.author.bot) {
                const embed = new client.modules.discord.EmbedBuilder()
                    .setTitle(`Hello there, I'm ${client.user.username}.`)
                    .setDescription("I am your status monitoring assistant.")
                    .setColor(client.modules.discord.Colors.Blue)
                    .setFooter({
                        text: client.footer
                    })
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTimestamp();
                return message.reply({
                    embeds: [embed]
                });
            }
        }
    } catch (error) {
        return client.errors(client, error, message, 'Events');
    }
};

