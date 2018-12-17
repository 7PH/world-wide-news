const mysql = require('promise-mysql');
const Credentials = require('./Credentials');

/**
 *
 */
class Storage {

    /**
     * Connect to mongodb server
     *
     * @return {Promise<void>}
     */
    async connect() {

        if (typeof this.db !== "undefined")
            return;

        this.db = await mysql.createConnection({
            host: Storage.DB_HOST,
            user: Storage.DB_USER,
            password: Storage.DB_PASSWORD,
            database: Storage.DB_NAME
        });
    }

    /**
     * Connect to the database
     *
     * @return {Promise<>}
     */
    async truncate() {

        await this.connect();

        await this.db.query(`
            CREATE TABLE IF NOT EXISTS ${Storage.TABLE_MASTER} (
                \`type\` varchar(32) COLLATE utf8_bin NOT NULL,
                \`date\` varchar(32) COLLATE utf8_bin NOT NULL,
                \`url\` varchar(256) COLLATE utf8_bin NOT NULL,
                \`fetched\` int(11) NOT NULL,
                PRIMARY KEY (\`type\`, \`date\`),
                INDEX(\`fetched\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`);

        await this.db.query(`
            CREATE TABLE IF NOT EXISTS ${Storage.TABLE_EVENTS} (
                \`id\` int(11) NOT NULL,
                \`lat\` float,
                \`long\` float,
                \`goldstein\` int(11) NOT NULL,
                \`num_mentions\` int(11) NOT NULL,
                \`date_added\` varchar(32) COLLATE utf8_bin NOT NULL,
                \`source_url\` varchar(256) COLLATE utf8_bin NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`);

        await this.db.query(`TRUNCATE ${Storage.TABLE_MASTER}`);
        await this.db.query(`TRUNCATE ${Storage.TABLE_EVENTS}`);
    }

    /**
     *
     * @param type
     * @param date
     * @param url
     * @return {Promise<void>}
     */
    insertInMaster(type, date, url) {
        return this
            .db
            .query(`INSERT INTO ${Storage.TABLE_MASTER}
                    (\`type\`, \`date\`, \`url\`, \`fetched\`)
                    VALUES (?, ?, ?, ?)`, [type, date, url, 0]);
    }

    /**
     * Get unfetched files from master
     *
     * @return {Promise<*>}
     */
    async getUnfetched() {
        return await this
            .db
            .query(`SELECT * FROM ${Storage.TABLE_MASTER} WHERE fetched=?`, [0]);
    }

    /**
     * Insert all events in db
     * @param events
     * @return {Promise<void[]>}
     */
    insertEvents(events) {
        return Promise.all(events.map(event => this.insertEvent(event)));
    }

    /**
     * Insert an event in database
     *
     * @param event
     * @return {Promise<*>}
     */
    async insertEvent(event) {
        return this
            .db
            .query(`INSERT INTO ${Storage.TABLE_EVENTS}
                    (\`id\`, \`lat\`, \`long\`, \`goldstein\`, \`num_mentions\`, \`date_added\`, \`source_url\`)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [event.id, event.lat, event.long, event.goldstein, event.num_mentions, event.date_added, event.source_url]);
    }

    async markFetched(type, date) {
        return await this
            .db
            .query(`UPDATE ${Storage.TABLE_MASTER} SET fetched=? WHERE type=? AND date=?`, [1, type, date]);
    }

    async close() {
        this.db.close();
    }
}

Storage.CONNECT_URL = "./data/database.sqlite";
Storage.DB_HOST = 'localhost';
Storage.DB_NAME = 'gdelt_dataviz';
Storage.DB_USER = Credentials.DB_USER;
Storage.DB_PASSWORD = Credentials.DB_PASSWORD;
Storage.TABLE_MASTER = 'master';
Storage.TABLE_EVENTS = "events";
Storage.TABLE_MENTIONS = "mentions";

module.exports = Storage;

