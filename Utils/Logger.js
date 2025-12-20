let storedClient = null;
let logsDir = null;
let debugLog = null;

// Helper function to format date
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Helper function to format time
const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};

// Get or create debug log stream using client.modules
const getDebugLog = (client) => {
    const c = client || storedClient;
    if (!c) return null;    
    if (!debugLog) {
        if (!logsDir) {
            logsDir = c.modules.path.join(__dirname, "../Logs");
            if (!c.modules.fs.existsSync(logsDir)) {
                c.modules.fs.mkdirSync(logsDir, { recursive: true });
            }
        }
        debugLog = c.modules.fs.createWriteStream(c.modules.path.join(logsDir, "Debug.log"), { flags: "a" });
    }
    return debugLog;
};

const time = () => {
    if (!storedClient || !storedClient.modules) {
        return new Date().toLocaleString('en-AU', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: "Australia/Brisbane",
            hour12: true
        });
    }
    return `${storedClient.modules.chalk.grey(new Date().toLocaleString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: "Australia/Brisbane",
        hour12: true
    }))}`;
};

module.exports = {
    log(source, content) {
        if (!storedClient || !storedClient.modules) {
            console.log(`[${new Date().toLocaleString()}] INFO [${source}]: ${content}`);
            return;
        }
        console.log(`[${time()}] ${storedClient.modules.chalk.blueBright("INFO")} [${source}]: ${content}`);
    },
    warn(source, content) {
        if (!storedClient || !storedClient.modules) {
            console.log(`[${new Date().toLocaleString()}] WARN [${source}]: ${content}`);
            return;
        }
        console.log(`[${time()}] ${storedClient.modules.chalk.yellowBright("WARN")} [${source}]: ${content}`);
    },
    error(source, content) {
        if (!storedClient || !storedClient.modules) {
            console.log(`[${new Date().toLocaleString()}] ERROR [${source}]: ${content}`);
            return;
        }
        console.log(`[${time()}] ${storedClient.modules.chalk.redBright("ERROR")} [${source}]: ${content}`);
    },
    writeDebug(client, userId, data) {
        const c = client || storedClient;
        if (!c || !c.settings) return;        
        if (c.settings.bot.debugMode === true && c.settings.bot.developer.includes(userId)) {
            const date = new Date();
            const dateStr = formatDate(date) + " @ " + formatTime(date);
            const logEntry = `[${dateStr}] ${c.modules.util.format(data)}\n`;            
            getDebugLog(c);
            if (debugLog) {
                debugLog.write(logEntry);
            }
            process.stdout.write(logEntry);
        }
    },
    debug(source, content) {
        if (!storedClient || !storedClient.modules) {
            console.debug(`[${new Date().toLocaleString()}] DEBUG [${source}]: ${content}`);
            return;
        }
        console.debug(`[${time()}] ${storedClient.modules.chalk.magentaBright("DEBUG")} [${source}]: ${content}`);
    },
    clear() {
        console.clear();
    },
    // Cleanup function to close debug log stream
    close() {
        if (debugLog) {
            debugLog.end();
            debugLog = null;
        }
    }
};