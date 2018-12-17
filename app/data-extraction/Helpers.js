
class Helpers {

    /**
     *
     * @param entry
     */
    static compressExport(entry) {
        const filtered = {};
        Helpers.EXPORT_KEEP_COLUMNS.forEach(column =>
            filtered[column[1]] = entry[column[0]]);
        return filtered;
    }

}

Helpers.EXPORT_KEEP_COLUMNS = [
    ['GlobalEventID',   'id'],
    ['ActionGeo_Lat',   'lat'],
    ['ActionGeo_Long',  'long'],
    ['GoldsteinScale',  'goldstein'],
    ['NumMentions',     'num_mentions'],
    ['DateAdded',       'date_added'],
    ['SourceURL',       'source_url']
];

Helpers.START_TIMESTAMP = 1475280000;
Helpers.END_TIMESTAMP = 1480550400;

module.exports = Helpers;
