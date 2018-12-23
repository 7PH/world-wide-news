const GDelt = require('../server/GDelt');

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
        return 0.001 * (Helpers.START_DATE.getTime() + ratio * (Helpers.END_DATE.getTime() - Helpers.START_DATE.getTime()));
    }

    /**
     * @TODO document
     *
     * @param tms
     * @return {number}
     */
    static getScaleFromTms(tms) {
        return (tms * 1000 - Helpers.START_DATE.getTime()) / (Helpers.END_DATE.getTime() - Helpers.START_DATE.getTime());
    }
}

Helpers.EXPORT_KEEP_COLUMNS = [
    ['GlobalEventId',   'id'],
    ['EventCode',       'event_code'],
    ['Actor1Name',      'actor_name'],
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

Helpers.START_DATE = new Date(1543644000 * 1000);
Helpers.END_DATE = new Date(1545609600 * 1000);

module.exports = Helpers;
