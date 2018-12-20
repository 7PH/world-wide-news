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

        this.bindedHandler = this.start.bind(this);
        document.getElementById("page-intro").addEventListener("click", this.bindedHandler);

        this.bind();
    }

    /**
     * Go to content
     *
     * @return {Promise<void>}
     */
    async start() {

        document.getElementById("page-intro").removeEventListener("click", this.bindedHandler);

        setTimeout(() => {
            document.getElementById('page-intro').classList.add('hidden');
            this.view.timeline.classList.remove('timeline-hidden');
            this.view.hud.classList.remove('page-hud-hidden');
        }, Controller.FADE_DURATION);

        document.getElementById("page-intro").style.opacity = "0";
        document.getElementById("page-content").classList.remove("hidden");

        this.view.playAudio();
        await this.view.start();

        if (this.autoplay)
            setTimeout(() => this.playTimeline(), 0.1 * Controller.FADE_DURATION);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async playTimeline() {

        let tms = Helpers.getTmsFromScale(+this.view.timelineRange.value);
        const newScale = Helpers.getScaleFromTms(tms + 901);
        await this.setTimeline(newScale);
        if (this.view.timelineRange.value >= 1)
            this.view.timelineRange.value = 0;
        if (this.autoplay)
            setTimeout(() => this.playTimeline(), Controller.TIMELINE_SPEED);
    }

    /**
     * Bind view
     *
     * @private
     */
    bind() {
        this.view.on('timeline_update', v => this.onTimelineUpdate(v));
        this.view.autoplayButton.addEventListener('change', e => this.onAudioPlayButtonClicked(e));
        this.view.audioButton.addEventListener('change', e => this.onAudioButtonClicked(e));
    }

    /**
     *
     * @param evt
     */
    onAudioPlayButtonClicked(evt) {
        this.autoplay = !!evt.target.checked;
        if (this.autoplay)
            setTimeout(() => this.playTimeline(), Controller.TIMELINE_SPEED);
    }

    /**
     *
     * @param evt
     */
    onAudioButtonClicked(evt) {
        if (!! evt.target.checked)
            this.view.playAudio();
        else
            this.view.stopAudio();
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

        const start = Helpers.getTmsFromScale(v);
        const duration = 1800; //@TODO refactor: hardcoded
        await this.model.setWindow(start, start + duration);
    }
}

Controller.FADE_DURATION = 4 * 1000;
Controller.TIMELINE_SPEED = 0;
