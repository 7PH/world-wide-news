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

Helpers.START_DATE = new Date(1475280000000);
Helpers.START_TMS = Helpers.START_DATE.getTime() / 1000;
Helpers.END_DATE = new Date(1475539200000);
Helpers.END_TMS = Helpers.END_DATE.getTime() / 1000;

module.exports = Helpers;
