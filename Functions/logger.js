var fs = require("fs");
var util = require("util");
var debugLog = fs.createWriteStream("./Logs/debug.log", { flags: "a" });
var errorLog = fs.createWriteStream("./Logs/error.log", { flags: "a" });
var log_stdout = process.stdout;
var chalk = require("chalk");

const time = () => (`${chalk.grey(new Date().toLocaleString('en-AU', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: "Australia/Brisbane",
    hour12: true
}))}`);

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

module.exports = {
    log(source, content) {
        return console.log(`[${time()}] ${chalk.blueBright("INFO")} [${source}]: ${content}`);
    },
    warn(source, content) {
        return console.log(`[${time()}] ${chalk.yellowBright("WARN")} [${source}]: ${content}`);
    },
    error(source, content) {
        return console.log(`[${time()}] ${chalk.redBright("ERROR")} [${source}]: ${content}`);
    },
    writeDebug(data){
        var date = new Date().today() + " @ " + new Date().timeNow();
        debugLog.write(`[${date}] ${util.format(data)}\n`);
        log_stdout.write(`[${date}] ${util.format(data)}\n`);
    },
    writeError(data){
        var date = new Date().today() + " @ " + new Date().timeNow();
        errorLog.write(`[${date}] ${util.format(data)}\n`);
        log_stdout.write(`[${date}] ${util.format(data)}\n`);
    },
    debug(source, content){
        return console.debug(`[${time()}] ${chalk.magentaBright("DEBUG")} [${source}]: ${content}`);
    },
    clear(){
        return console.clear();
    },
    processes(){
        process.on('unhandledRejection', (rejection) => {
            return console.error(`[${time()}] ${chalk.redBright("ERROR")} [Unhandled Rejection]: ${rejection}`);
        });
        process.on('uncaughtException', (exception) => {
            return console.error(`[${time()}] ${chalk.redBright("ERROR")} [Uncaught Exception]: ${exception}`);
        });
    }
}