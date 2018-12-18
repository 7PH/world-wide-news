import {Preload} from "../preloader/Preload";
import {Model} from "./Model";
import {View} from "./View";
import {scale} from "../util/maths";
const Helpers = require("../../../data-extraction/Helpers");


export class Controller {

    constructor() {

        this.model = new Model();
        this.view = new View(this.model);
    }

    /**
     * Preload all deps and init the web app
     *
     * @return {Promise<void>}
     */
    async init() {

        await Preload.run();

        document
            .getElementById("page-intro")
            .addEventListener("click", () => this.start());

        this.bind();
    }

    /**
     * Go to content
     *
     * @return {Promise<void>}
     */
    async start() {

        document.getElementById("page-intro").style.display = "none";
        document.getElementById("page-content").classList.remove("hidden");

        await this.view.start();

        setTimeout(() => this.playTimeline(), 100);
    }

    async playTimeline() {

        const v = +this.view.timeline.value + +this.view.timeline.step;
        await this.setTimeline(v);
        if (this.view.timeline.value < 1)
            setTimeout(() => this.playTimeline(), 100);
    }

    /**
     * Bind view
     */
    bind() {

        this.view.on('timeline_update', v => this.onTimelineUpdate(v))
    }

    /**
     * Manually override the timeline value
     *
     * @param v
     * @return {Promise<void>}
     */
    async setTimeline(v) {
        this.view.setTimeline(v);
        await this.onTimelineUpdate(v);
    }

    /**
     * When the timeline is manually updated
     *
     * @param v
     */
    async onTimelineUpdate(v) {

        const start = scale(v, Helpers.START_TMS, Helpers.END_TMS);
        const duration = 901; //@TODO refactor: hardcoded
        await this.model.setWindow(start, start + duration);
    }
}
