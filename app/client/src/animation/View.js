import {Stage} from "./Stage";
import {rangeControl} from "../util/range";
import * as EventEmitter from "events";
import {CAMEO_CODES} from "../util/cameo"


/**
 *
 * @emits timeline_update When the timeline is updated
 */
export class View extends EventEmitter {

    constructor(model) {
        super();

        this.model = model;
        this.hud = document.getElementById(View.PAGE_HUD);
        this.audio = document.getElementById(View.AMBIENT_AUDIO);
        this.audioButton = document.getElementById(View.AUDIO_BUTTON);
        this.timeline = document.getElementById(View.TIMELINE);
        this.timelineHud = document.getElementById(View.TIMELINE_HUD);
        this.timelineHudInfo = this.timelineHud.children[0];
        this.timelineHudLeft = this.timelineHud.children[1];
        this.timelineHudRight = this.timelineHud.children[2];
        this.timelineRange = document.getElementById(View.TIMELINE_RANGE_ID);
        this.autoplayButton = document.getElementById(View.AUTOPLAY_BUTTON);
        this.setTimeline = null;
        this.stage = new Stage();

        this.timelineHudLeft.innerHTML = this.dateToHtml(model.minDate, 2);
        this.timelineHudRight.innerHTML = this.dateToHtml(model.maxDate, 2);

        this.bind();
    }

    bind() {
        this.setTimeline = rangeControl(View.TIMELINE_RANGE_ID, v => this.emit('timeline_update', v));
        this.model.on('update', () => this.onUpdate());
        this.model.on('trigger', () => this.setWindow(this.model.start, this.model.end))
    }

    /**
     *
     * @return {Promise<void>}
     */
    async onUpdate() {
        await this.stage.setEvents(this.model.data.list);
        this.hud.innerHTML = '<pre>'
            + '..top events..' + '\n'
            + '\n'
            + this.model.data.topEvents
                .slice(0, 10)
                .map(r => `  <a href="${r.url}" target="_blank">${r.actor_name == null ? '' : r.actor_name + ' / '}${CAMEO_CODES[r.event_code.substr(0, 2)]}</a>`)
                .join('\n')
            + '\n'
            + '\n'
            + '\n'
            + '..top websites..' + '\n'
            + '\n'
            + this.model.data.topMentions
                .slice(0, 10)
                .map(r => `  ${r.name} (${r.count})`)
                .join('\n')
            + '</pre>';
    }

    /**
     *
     * @param start
     * @param end
     */
    setWindow(start, end) {
        this.timelineHudInfo.innerHTML = `
        ${this.dateToHtml(start, 3)}
         - ${this.dateToHtml(end, 3)}
        `;
    }

    /**
     *
     * @return {Promise<void>}
     */
    async start() {
        await this.stage.start();
    }

    /**
     *
     */
    playAudio() {
        this.audio.play();
    }

    /**
     *
     */
    stopAudio() {
        this.audio.pause();
    }

    /**
     *
     * @param {boolean} value
     */
    setAutoPlay(value) {
        this.autoplayButton.checked = !!value;
    }

    /**
     * @TODO document
     * @TODO move to Helpers?
     *
     * @param date
     * @param type
     * @return {string}
     */
    dateToHtml(date, type) {
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        switch (type || 1) {
            case 1:
                return `${M < 10 ? '0' : ''}${M}/${Y}`;
            case 2:
                return `${D < 10 ? '0' : ''}${D}/${M < 10 ? '0' : ''}${M}/${Y}`;
            case 3:
                return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m} ${D < 10 ? '0' : ''}${D}/${M < 10 ? '0' : ''}${M}/${Y}`;
            default:
                throw new Error("Unsupported date display type");
        }
    }
}

View.PAGE_HUD = 'page-hud';
View.TIMELINE = 'timeline';
View.TIMELINE_HUD = 'timeline-hud';
View.TIMELINE_RANGE_ID = 'timeline-range';
View.AUTOPLAY_BUTTON = 'timeline-autoplay';
View.AUDIO_BUTTON = 'timeline-music';
View.AMBIENT_AUDIO = 'ambient-audio';
