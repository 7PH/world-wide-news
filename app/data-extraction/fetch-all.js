const API = require("./API");
const Helpers = require('./Helpers');

(async () => {

    let api = new API();
    await api.init();

    // fetch master
    await api.updateMaster();

    // fetch unfetched

    for (let type of ['export', 'mentions']) {
        const allUnfetch = await api.storage.getUnfetched(type, Helpers.START_DATE.getTime() / 1000, Helpers.END_DATE.getTime() / 1000);
        for (let unfetch of allUnfetch) {
            console.log(unfetch.url);
            await api.fetch(unfetch);
        }
    }

    console.log("Done");
})();
