const fetch = require('node-fetch');


class GDelt {

    /**
     * Fetch raw master
     *
     * @return {Promise<{export: string, mentions: string, gkg: string}[]>}
     */
    static async fetchMaster() {
        return GDelt.parseMaster(await (await fetch(GDelt.MASTER_URL)).text());
    }

    /**
     * Parse master file
     *
     * @param {string} masterRaw
     * @return {{export: string, mentions: string, gkg: string}[]}
     */
    static parseMaster(masterRaw) {
        const lines = masterRaw.split("\n");
        const data = {};
        for (const line of lines) {
            const url = line.split(' ')[2];

            // empty line?
            if (typeof url === "undefined")
                continue;

            // match data about this line
            const mtc = url.match(/([0-9]+)\.([a-z]+)\.csv\.zip$/i) || [];
            const date = mtc[1];
            const type = mtc[2];

            // incorrect type?
            if (GDelt.MASTER_TYPES.indexOf(type) === -1)
                console.warn(`Err parsing master file: ${line}`);

            // store data
            if (typeof data[date] === "undefined")
                data[date] = {};
            data[date][type] = url;
        }

        // clean data that is missing at least one of the files (export, mention, gkg)
        for (let i in data) {
            if (Object.keys(data[i]).length !== 3)
                delete data[i];
        }

        return data;
    }
}

GDelt.MASTER_URL = "http://data.gdeltproject.org/gdeltv2/masterfilelist.txt";
GDelt.MASTER_TYPES = ['export', 'mentions', 'gkg'];

module.exports = GDelt;
