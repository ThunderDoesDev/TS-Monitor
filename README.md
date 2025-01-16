# TS Monitor

This repository contains the source code for a Discord bot monitor. This tool helps you track the presence status of your Discord bots, alerting users when a bot is online, offline, or undergoing maintenance.

## Features

- Real-time monitoring of Discord bot status.
- Notifications for bot availability changes.
- Compatible with Discord API v14.

## Usage

### Installation

#### Prerequisites
- [Node.js](https://nodejs.org/) (v16.9.0 or later)
- [Discord Developer Portal Application](https://discord.com/developers/applications) with a bot token

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
   - Rename `config.example.json` to `config.json`.
   - Update the configuration with your bot token and server-specific settings:
     ```json
     {
        "bot": {
           "token": "YOUR_MONITOR_BOT_TOKEN",
            "botID": "YOUR_MAINBOT_ID",
            "statusChannel": "YOUR_STATUS_CHANNEL_ID",
            "mainGuild": "YOUR_MAIN_GUILD_ID"
         }
     }
     ```
   - Replace the placeholders with your specific details:
     - `token`: The Discord token of your monitor bot.
     - `botID`: The ID of the bot you want to monitor.
     - `statusChannel`: The ID of the channel where status updates will be posted.
     - `mainGuild`: The ID of the main server where both the monitor bot and the monitored bot reside.

2. Invite the monitor bot to your Discord server. Ensure the bot being monitored is present in the same server.

### Running the Monitor

1. Open your command prompt or PowerShell.
2. Execute the monitor script by typing:
   ```bash
   node monitor
   ```

### Recommendations

- Keep the monitor script running to ensure uninterrupted status tracking.
- Update your configuration settings as necessary to adapt to changes in your setup or the Discord API.
- Avoid sharing your bot token or committing it to public repositories.

## Changelogs

- Introduced a new configuration template.
- Upgraded to Discord API v14 for enhanced performance and compatibility.

## Support

For support, issues, or enhancements, please open an issue in this repository or join our discord support server.

[Join Support Server](https://discord.gg/thunderdoesdev)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
