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
                PRIMARY KEY (\`type\`, \`date\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`);

        await this.db.query(`TRUNCATE ${Storage.TABLE_MASTER}`);
    }

    /**
     *
     * @param type
     * @param dateStart
     * @param dateEnd
     * @return {Promise<void>}
     */
    async searchMaster(type, dateStart, dateEnd) {

    }

    /**
     *
     * @param type
     * @param date
     * @return {Promise<boolean>}
     */
    async hasInMaster(type, date) {
        const rqt = await this
            .db
            .query(`SELECT COUNT(*) as count FROM ${Storage.TABLE_MASTER}
                    WHERE type=? AND date=?`, [type, date]);
        return rqt[0].count !== 0;
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
                    (\`type\`, \`date\`, \`url\`)
                    VALUES (?, ?, ?)`, [type, date, url]);
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

