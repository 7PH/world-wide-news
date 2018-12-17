const API = require("./API");
const Helpers = require('./Helpers');

(async () => {

    let api = new API();
    await api.init();

    // fetch master
    await api.updateMaster();

    // fetch unfetched
    const toFetch = await api.storage.getUnfetched('export', Helpers.START_DATE.getTime() / 1000, Helpers.END_DATE.getTime() / 1000);


    console.log("Done");
})();
