import {Preload} from "../preloader/Preload";
import {Model} from "./Model";
import {View} from "./View";
import {scale} from "../util/maths";
const Helpers = require("../../../data-extraction/Helpers");


export class Controller {

    constructor() {

        this.model = new Model();
        this.view = new View(this.model);

        this.autoplay = true;
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

        if (this.autoplay)
            setTimeout(() => this.playTimeline(), 1000);

        document.getElementById('ambient-audio').play();
    }

    /**
     *
     * @return {Promise<void>}
     */
    async playTimeline() {

        let tms = Helpers.getTmsFromScale(+this.view.timelineRange.value);
        const newScale = Helpers.getScaleFromTms(tms + 901);
        await this.setTimeline(newScale);
        if (this.autoplay && this.view.timelineRange.value < 1)
            setTimeout(() => this.playTimeline(), 1000);
    }

    /**
     * Bind view
     *
     * @private
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
        const start = Helpers.getTmsFromScale(v);
        const duration = 900; //@TODO refactor: hardcoded
        await this.model.setWindow(start, start + duration);
    }

    /**
     * When the timeline is manually updated
     *
     * @param v
     */
    async onTimelineUpdate(v) {

        this.autoplay = false;
        const start = Helpers.getTmsFromScale(v);
        const duration = 900; //@TODO refactor: hardcoded
        await this.model.setWindow(start, start + duration);
    }
}
