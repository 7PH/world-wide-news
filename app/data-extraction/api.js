const Crawler = require("js-crawler");
const GDelt = require('./GDelt');
const Storage = require('./Storage');
const Helpers = require('./Helpers');

const DEBUG = true;

const fetchExport = (crawler, storage, unfetched) => {
    return new Promise(resolve => {
        crawler.crawl(unfetched.url, async page => {
            const exportRaw = await GDelt.unzip(page.response.body);
            const exportRes = GDelt.parseExport(exportRaw);
            const compressed = exportRes.map(Helpers.compressExport);
            await storage.insertEvents(compressed);
            await storage.markFetched(unfetched.type, unfetched.date);
            resolve();
        });
    });
};

const fetchMentions = (crawler, storage, unfetched) => {
    return new Promise(resolve => {
        crawler.crawl(unfetched.url, async page => {
            const exportRaw = await GDelt.unzip(page.response.body);
            const exportRes = GDelt.parseExport(exportRaw);
            const compressed = exportRes.map(Helpers.compressExport);
            await storage.insertEvents(compressed);
            await storage.markFetched(unfetched.type, unfetched.date);
            resolve();
        });
    });
};


(async () => {

    const storage = new Storage();
    const crawler = new Crawler().configure({
        maxConcurrentRequests: 8,
        maxRequestsPerSecond: 20
    });

    console.log("Truncating database");
    await storage.truncate();

    console.log("Fetching master");
    const master = await GDelt.fetchMaster();

    console.log("Populating master");
    for (let date in master) {

        if (DEBUG && Math.random() > .0001)
            continue;

        const entry = master[date];
        await storage.insertInMaster('export', date, entry['export']);
        await storage.insertInMaster('mentions', date, entry['mentions']);
    }

    console.log("Fetching unfetched files");
    let allUnfetched = await storage.getUnfetched();

    for (let unfetched of allUnfetched) {

        if (unfetched.type !== 'mentions')
            continue;

        await fetchMentions(crawler, storage, unfetched);
        break;
    }

    console.log("Done");
})();
