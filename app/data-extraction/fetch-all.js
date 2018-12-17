const API = require("./API");
const Helpers = require('./Helpers');

const WORKERS = 32;

const worker = async (api, jobs) => {

    if (jobs.length === 0)
        return;

    let job = jobs.shift();
    console.log(job.url);
    await api.fetch(job);
    await worker(api, jobs);
};


(async () => {

    let api = new API();
    await api.init();

    // truncate
    //await api.truncate();

    // fetch master
    //await api.updateMaster();

    // fetch unfetched

    for (let type of ['export', 'mentions']) {
        const jobs = await api.storage.getUnfetched(type, Helpers.START_DATE.getTime() / 1000, Helpers.END_DATE.getTime() / 1000);
        let workers = [];
        for (let i = 0; i < WORKERS; ++ i)
            workers.push(worker(api, jobs));
        await Promise.all(workers);
    }

    console.log("Done");
})();
