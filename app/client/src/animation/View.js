import {Stage} from "./Stage";
import {rangeControl} from "../util/range";
import * as EventEmitter from "events";


/**
 *
 * @emits timeline_update When the timeline is updated
 */
export class View extends EventEmitter {

    constructor(model) {
        super();

        this.model = model;
        this.timeline = document.getElementById(View.TIMELINE_RANGE_ID);
        this.setTimeline = null;
        this.stage = new Stage();
        this.bind();
    }

    bind() {
        this.setTimeline = rangeControl(View.TIMELINE_RANGE_ID, v => this.emit('timeline_update', v));
        this.model.on('update', points => this.update(points));
    }

    async update(points) {
        await this.stage.addDots(points);
    }

    async start() {

        await this.stage.start();
    }
}

View.TIMELINE_RANGE_ID = 'timeline-range';
