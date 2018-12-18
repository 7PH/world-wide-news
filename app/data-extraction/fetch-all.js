const API = require("./API");
const Helpers = require('./Helpers');

const WORKERS = 8;

const worker = async (api, jobs) => {

    let job = jobs.shift();
    if (typeof job === "undefined")
        return;
    console.log(job.url);
    await api.fetch(job);
    await worker(api, jobs);
    return job;
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
