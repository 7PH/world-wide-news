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
    }

    /**
     * Bind view
     */
    bind() {

        this.view.on('timeline_update', v => this.onTimelineUpdate(v))
    }

    /**
     * When the timeline is manually updated
     *
     * @param v
     */
    async onTimelineUpdate(v) {

        const start = scale(v, Helpers.START_TMS, Helpers.END_TMS);
        const duration = 901;
        await this.model.setWindow(start, start + duration);
    }
}
