/**
 * LOAD THE CLIENT EVENTS
*/
const eventsLoader = async function (client) {
    try {
        client.modules.fs.readdir("./Events/", async (err, files) => {
            let data = []
            if (files) {
                await files.map(async (folder) => {
                    data.push(folder)
                })
            }
            if (data.length !== 0) {
                let loadedEvents = 0;
                await data.forEach(folderName => {
                    client.modules.fs.readdir(`./Events/${folderName}/`, (err, files) => {
                        if (err) console.error(err);
                        let jsfiles = files.filter(f => f.split(".").pop().toLowerCase() === "js");
                        if (jsfiles.length > 0) {
                            jsfiles.forEach((f) => {
                                loadedEvents = loadedEvents + 1;
                                try {
                                    const event = require(`../Events/${folderName}/${f}`);
                                    let eventname = f.replace('.js', '');
                                    if (eventname) {
                                        const discordEventName = eventname.charAt(0).toLowerCase() + eventname.slice(1);
                                        client.on(discordEventName, event.run.bind(null, client));
                                    }
                                } catch (err) {
                                    console.error(`Error loading event ${f}:`, err);
                                }
                            });
                        }
                    });
                });
            }
        })
    } catch (error) {
        return client.logger.error('EVENT_HANDLER_ERROR', error.stack);
    }
}

module.exports = {
    eventsLoader
};