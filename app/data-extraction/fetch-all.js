const API = require("../server/API");
const Helpers = require('./Helpers');


(async () => {

    let api = new API();
    await api.init();

    // truncate
    //await api.truncate();

    // fetch master
    await api.updateMaster(Helpers.START_DATE.getTime() / 1000, Helpers.END_DATE.getTime() / 1000);

    // fetch unfetched
    for (let type of ['export', 'mentions']) {
        const jobs = await api.storage.getUnfetched(type, Helpers.START_DATE.getTime() / 1000, Helpers.END_DATE.getTime() / 1000);
        for (let job of jobs) {
            console.log(job.url, jobs.length + ' remaining');
            await api.fetch(job);
        }
    }

    console.log("Done");
})();
