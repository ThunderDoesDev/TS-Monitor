# TS Monitor

This repository contains the source code for a Discord bot monitor. This tool helps you track the presence status of your Discord bots, alerting users when a bot is online, offline, or undergoing maintenance.

## Features

- Real-time monitoring of Discord bot status.
- Notifications for bot availability changes.
- Compatible with Discord API v14.

## Usage

### Installation

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

1. Locate the `config.json` file in the `Settings` folder of the project directory.
2. Edit the `config.json` file to include the following details:
   - `token`: Your montior bot's Discord token.
   - `botID`: The ID of the bot you are monitoring.
   - `statusChannel`: The ID of the channel where status updates will be posted.
   - `mainGuild`: The ID of the main guild (server) where both the monitor bot and the main bot reside.

These details are crucial for the monitor to function correctly, so ensure they are accurate.
### Running the Monitor

1. Invite the monitor bot to your Discord server. Ensure the bot it's monitoring is present in the same server.
2. Open your command prompt or PowerShell.
3. Execute the monitor script by typing:
   ```bash
   node monitor
   ```

### Recommendations

- Keep the monitor script running 24/7 for continuous monitoring.
- Update your configuration settings as necessary to adapt to changes in your setup or the Discord API.

## Changelogs

- Introduced a new template.
- Upgraded to Discord API v14 for enhanced performance and compatibility.

## Support

For support, issues, or enhancements, please open an issue in this repository or join our discord support server.

[Join Support Server](https://discord.gg/thunderdoesdev)

## License

This project is licensed under the APACHE License - see the [LICENSE](LICENSE) file for details.
