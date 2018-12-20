const Crawler = require("js-crawler");
const GDelt = require('./GDelt');
const Storage = require('./Storage');
const Helpers = require('../data-extraction/Helpers');


class API {


    constructor() {
        this.gdelt = GDelt;
        this.storage = new Storage();
        this.crawler = new Crawler().configure({
            maxConcurrentRequests: 8,
            maxRequestsPerSecond: 20
        });
    }

    init() {
        return this.storage.connect();
    }

    /**
     * Empty all the local data
     *
     * @return {Promise}
     */
    truncate() {
        return this.storage.truncate();
    }

    /**
     * Updates local representation of the master file
     *
     * @param {number} min
     * @param {number} max
     * @return {Promise<void>}
     */
    async updateMaster(min, max) {
        const master = await this.gdelt.fetchMaster();
        for (let tms in master) {
            if (tms < min || tms > max)
                continue;
            for (let type of ['export', 'mentions'])
                await this.storage.insertInMaster(type, tms, master[tms][type]);
        }
    }

    /**
     * Fetch a master entry and mark it 'fetched' afterward in the master database
     *
     * @param masterEntry
     * @return {Promise<any>}
     */
    async fetch(masterEntry) {
        return new Promise(async (resolve, reject) => {
            await this.storage.markFetched(masterEntry.type, masterEntry.tms);
            this.crawler.crawl(masterEntry.url, async page => {

                const raw = await GDelt.unzip(page.response.body);

                if (masterEntry.type === 'export') {
                    const compressed = GDelt.parseExport(raw).map(Helpers.compressExport);
                    await this.storage.insertExports(compressed);
                } else {
                    const compressed = GDelt.parseMentions(raw).map(Helpers.compressMentions);
                    await this.storage.insertMentions(compressed);
                }

                resolve();
            }, reject);
        });
    }

    /**
     *
     *
     * @param {number} start
     * @param {number} end
     * @param {number} offset
     * @param {number} n
     * @return {Promise<{list: any[], top: any[]}>}
     */
    async getMentions(start, end, offset, n) {
        return this.storage.getMentions(start, end, 0, n);
    }
}

module.exports = API;
