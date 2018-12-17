const GDelt = require('./GDelt');
const Storage = require('./Storage');


const DEBUG = true;

(async () => {

    const storage = new Storage();

    console.log("Truncating database");
    await storage.truncate();

    console.log("Fetching master");
    const master = await GDelt.fetchMaster();

    console.log("Populating master");
    for (let date in master) {

        if (DEBUG && Math.random() > .01)
            continue;

        const entry = master[date];
        await storage.insertInMaster('export', date, entry['export']);
        await storage.insertInMaster('mentions', date, entry['mentions']);
    }
})();
