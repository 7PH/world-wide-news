const fetch = require('node-fetch');
const jszip = require('jszip');


class GDelt {

    /**
     * Convert a date object to gdelt format
     *
     * @param {Date} date
     * @return {string}
     */
    static dateToGdelt(date) {
        let yr = date.getFullYear();
        let mt = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        let dy = (date.getDate() < 10 ? '0' : '') + date.getDate();
        let hr = (date.getHours() - 1 < 10 ? '0' : '') + (date.getHours() - 1);
        let mn = 15 * Math.floor(date.getMinutes() / 15);
        mn = (mn < 10 ? '0' : '') + mn;
        return '' + yr + mt + dy + hr + mn + '00';
    }

    /**
     * Create a javascript Date object from the GDelt representation
     *
     * @param {string} gdelt
     * @return {Date}
     */
    static gdeltToDate(gdelt) {
        let yr = parseInt(gdelt.substr(0, 4));
        let mt = parseInt(gdelt.substr(4, 2)) - 1;
        let dy = parseInt(gdelt.substr(6, 2));
        let hr = parseInt(gdelt.substr(8, 2)) + 1;
        let mn = parseInt(gdelt.substr(10, 2));
        return new Date(yr, mt, dy, hr, mn, 0);
    }

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
            const date = GDelt.gdeltToDate(mtc[1]).getTime() / 1000;
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

    /**
     *
     * @param binary
     */
    static async unzip(binary) {
        const zip = await jszip.loadAsync(binary);
        for (let fileId in zip.files)
            return await zip.files[fileId].async("string");
        throw new Error("No file in zip");
    }

    /**
     *
     * @param exportRaw
     */
    static parseExport(exportRaw) {

        const lines = exportRaw.split("\n");
        const entries = [];

        for (const line of lines) {

            const splitted = line.split("\t");

            if (splitted.length !== GDelt.EXPORT_COLUMNS.length)
                continue;

            const entry = {};
            GDelt.EXPORT_COLUMNS.forEach((column, index) =>
                entry[column] = splitted[index] === "" ? undefined : splitted[index]);
            entries.push(entry);
        }

        return entries;
    }

    /**
     *
     * @param mentionsRaw
     */
    static parseMentions(mentionsRaw) {

        const lines = mentionsRaw.split("\n");
        const entries = [];

        for (const line of lines) {

            const splitted = line.split("\t");

            if (splitted.length !== GDelt.MENTIONS_COLUMNS.length)
                continue;

            const entry = {};
            GDelt.MENTIONS_COLUMNS.forEach((column, index) =>
                entry[column] = splitted[index] === "" ? undefined : splitted[index]);
            entries.push(entry);
        }

        return entries;
    }
}

GDelt.MASTER_URL = "http://data.gdeltproject.org/gdeltv2/masterfilelist.txt";
GDelt.MASTER_TYPES = ['export', 'mentions', 'gkg'];
GDelt.EXPORT_COLUMNS = "GlobalEventId SQLDate MonthYear Year FractionDate Actor1Code Actor1Name Actor1CountryCode Actor1KnownGroupCode Actor1EthnicCode Actor1Religion1Code Actor1Religion2Code Actor1Type1Code Actor1Type2Code Actor1Type3Code Actor2Code Actor2Name Actor2CountryCode Actor2KnownGroupCode Actor2EthnicCode Actor2Religion1Code Actor2Religion2Code Actor2Type1Code Actor2Type2Code Actor2Type3Code IsRootEvent EventCode EventBaseCode EventRootCode QuadClass GoldsteinScale NumMentions NumSources NumArticles AvgTone Actor1Geo_Type Actor1Geo_FullName Actor1Geo_CountryCode Actor1Geo_ADM1Code Actor1Geo_ADM2Code Actor1Geo_Lat Actor1Geo_Long Actor1Geo_FeatureID Actor2Geo_Type Actor2Geo_FullName Actor2Geo_CountryCode Actor2Geo_ADM1Code Actor2Geo_ADM2Code Actor2Geo_Lat Actor2Geo_Long Actor2Geo_FeatureID ActionGeo_Type ActionGeo_FullName ActionGeo_CountryCode ActionGeo_ADM1Code ActionGeo_ADM2Code ActionGeo_Lat ActionGeo_Long ActionGeo_FeatureID DateAdded SourceURL".split(" ");
GDelt.MENTIONS_COLUMNS = "GlobalEventId EventTimeDate MentionTimeDate MentionType MentionSourceName MentionIdentifier SentenceID ActorCharOffset Actor2CharOffset ActionCharOffset InRawTest Confidence MentionDocLen MentionDocTone MentionDocTranslationInfo Extras".split(" ");

module.exports = GDelt;
