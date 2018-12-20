import * as EventEmitter from "events";
import {APIHelper} from "../api/APIHelper";
const Helpers = require("../../../data-extraction/Helpers");


export class Model extends EventEmitter {

    /**
     *
     */
    constructor() {
        super();

        this.minDate = Helpers.START_DATE;
        this.maxDate = Helpers.END_DATE;
        this.start = new Date();
        this.end = this.start;
        this.data = {};
    }

    /**
     *
     * @param {number} start
     * @param {number} end
     * @return {Promise<void>}
     */
    async setWindow(start, end) {

        this.start = new Date(start * 1000);
        this.end = new Date(end * 1000);
        this.emit('trigger');
        this.data = await APIHelper.fetch(start, end);
        this.emit('update', this.data);
    }
}
