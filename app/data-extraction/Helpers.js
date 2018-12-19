const GDelt = require('./GDelt');

/**
 * @TODO refactor: extract method
 */
class Helpers {

    /**
     *
     * @param entry
     */
    static compressExport(entry) {
        const filtered = {};
        Helpers.EXPORT_KEEP_COLUMNS.forEach(column =>
            filtered[column[1]] = entry[column[0]]);
        filtered.tms = GDelt.gdeltToDate(filtered.tms).getTime() / 1000;
        if (! filtered.goldstein)
            filtered.goldstein = 0;
        return filtered;
    }

    /**
     *
     * @param entry
     */
    static compressMentions(entry) {
        const filtered = {};
        Helpers.MENTIONS_KEEP_COLUMNS.forEach(column =>
            filtered[column[1]] = entry[column[0]]);
        filtered.tms = GDelt.gdeltToDate(filtered.tms).getTime() / 1000;
        return filtered;
    }

    /**
     * @TODO document
     *
     * @param ratio
     * @return {number}
     */
    static getTmsFromScale(ratio) {
        return Helpers.START_TMS + ratio * (Helpers.END_TMS - Helpers.START_TMS);
    }

    /**
     * @TODO document
     *
     * @param tms
     * @return {number}
     */
    static getScaleFromTms(tms) {
        return (tms - Helpers.START_TMS) / (Helpers.END_TMS - Helpers.START_TMS);
    }
}

Helpers.EXPORT_KEEP_COLUMNS = [
    ['GlobalEventId',   'id'],
    ['ActionGeo_Lat',   'lat'],
    ['ActionGeo_Long',  'long'],
    ['GoldsteinScale',  'goldstein'],
    ['NumMentions',     'num_mentions'],
    ['DateAdded',       'tms'],
    ['SourceURL',       'source_url']
];

Helpers.MENTIONS_KEEP_COLUMNS = [
    ['GlobalEventId',       'event'],
    ['MentionTimeDate',     'tms'],
    ['MentionSourceName',   'name'],
    ['Confidence',          'confidence'],
    ['MentionDocTone',      'tone'],
];

Helpers.START_DATE = new Date(1543622400 * 1000);
Helpers.START_TMS = Helpers.START_DATE.getTime() / 1000;
Helpers.END_DATE = new Date(1545223814 * 1000);
Helpers.END_TMS = Helpers.END_DATE.getTime() / 1000;

module.exports = Helpers;
