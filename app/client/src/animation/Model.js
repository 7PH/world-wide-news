import * as EventEmitter from "events";
import {APIHelper} from "../api/APIHelper";


export class Model extends EventEmitter {

    /**
     *
     */
    constructor() {
        super();

        this.points = [];
    }

    /**
     * @private
     */
    update() {
        this.emit('update', this.points);
    }

    /**
     *
     * @param {number} start
     * @param {number} end
     * @return {Promise<void>}
     */
    async setWindow(start, end) {

        this.points = await APIHelper.fetch(start, end);
        this.update();
    }
}
