const fs = require("fs");

const loadEvents = async function (client) {
    fs.readdir("./Events/", async (err, files) => {
        let data = []
        if (files) {
            await files.map(async (folder) => {
                data.push(folder)
            })
        }
        if (data.length !== 0) {
            let loadedEvents = 0;
            await data.forEach(folderName => {
                fs.readdir(`./Events/${folderName}/`, (err, files) => {
                    if (err) console.error(err);
                    let jsfiles = files.filter(f => f.split(".").pop() === "js");
                    if (jsfiles.length > 0) {
                        jsfiles.forEach((f) => {
                            loadedEvents = loadedEvents + 1
                            const event = require(`../Events/${folderName}/${f}`);
                            let eventname = f.replace('.js', '') || null
                            if (eventname) {
                                client.on(eventname, event.run.bind(null, client))
                            }
                        });
                    } else {
                        //client.logger.error("EVENTS LOADER", `Seems like the folder ${folderName} has no events files.`);
                    }
                });
            });
        }
    })
}

module.exports = {
    loadEvents
};