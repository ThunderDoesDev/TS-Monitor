# TS Monitor

This repository contains the source code for a Discord bot monitor. This tool helps you track the presence status of your Discord bots, alerting users when a bot is online, offline, or undergoing maintenance.

## Features

- Real-time monitoring of Discord bot status and presence updates.
- Automatic notifications for bot availability changes (online, offline, idle, dnd, streaming).
- Error tracking and reporting to designated channels.
- Debug mode for troubleshooting.
- Compatible with Discord.js v14.
- Event-driven architecture with modular handlers.

## Usage

### Installation

#### Prerequisites
- [Node.js](https://nodejs.org/) (v16.9.0 or later)
- [Discord Developer Portal Application](https://discord.com/developers/applications) with a bot token
- Required Discord Bot Intents:
  - Guild Messages
  - Guild Members
  - Guild Presences
  - Message Content
  - And other intents as configured in the bot

### Setup
1. Clone this repository to your local machine using:
   ```bash
   git clone https://github.com/ThunderDoesDev/TS-Monitor.git
   ```
2. Navigate to the cloned directory.
3. Install the required Node.js modules with:
   ```bash
   npm install
   ```

### Configuration

1. Configure the bot:
   - Rename `Config.example.json` to `Config.json` in the `Settings` folder.
   - Update the configuration with your bot token and server-specific settings:
     ```json
     {
       "bot": {
         "token": "YOUR_MONITOR_BOT_TOKEN",
         "botID": "YOUR_MAINBOT_ID",
         "statusChannel": "YOUR_STATUS_CHANNEL_ID",
         "mainGuild": "YOUR_MAIN_GUILD_ID",
         "statusBotName": "YOUR_STATUS_BOT_NAME",
         "debugMode": false,
         "botOwners": [
           "YOUR_BOT_OWNER_ID"
         ],
         "errorChannel": "YOUR_ERROR_CHANNEL_ID"
       }
     }
     ```
   - Replace the placeholders with your specific details:
     - `token`: The Discord token of your monitor bot.
     - `botID`: The ID of the bot you want to monitor.
     - `statusChannel`: The ID of the channel where status updates will be posted.
     - `mainGuild`: The ID of the main server where both the monitor bot and the monitored bot reside.
     - `statusBotName`: The name of your status bot (used in footer and user agent).
     - `debugMode`: Enable or disable debug mode (boolean).
     - `botOwners`: Array of Discord user IDs who own the bot.
     - `errorChannel`: The ID of the channel where error notifications will be posted.

2. Invite the monitor bot to your Discord server. Ensure the bot being monitored is present in the same server.

### Running the Monitor

1. Open your command prompt or PowerShell.
2. Execute the monitor script using one of the following methods:
   ```bash
   npm start
   ```
   or
   ```bash
   node Monitor.js
   ```

### Recommendations

- Keep the monitor script running to ensure uninterrupted status tracking.
- Update your configuration settings as necessary to adapt to changes in your setup or the Discord API.
- **Never commit your `Config.json` file** to public repositories as it contains sensitive information (bot tokens, IDs).
- Use `Config.example.json` as a template and keep your actual `Config.json` in `.gitignore`.
- Ensure your monitor bot has the necessary permissions in the Discord server (View Channels, Send Messages, Embed Links).

## Version

Current version: **7.0.0**

## Changelogs

- Introduced a new configuration template with additional settings.
- Upgraded to Discord.js v14 for enhanced performance and compatibility.
- Added support for error channel notifications.
- Added debug mode configuration option.
- Added bot owner management.

## Support

For support, issues, or enhancements, please open an issue in this repository or join our discord support server.

[Join Support Server](https://discord.gg/thunderdoesdev)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
