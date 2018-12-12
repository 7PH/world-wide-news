import {Preload} from "../preloader/Preload";


const TIMELINE_RANGE_ID = "timeline-range";

let timelineRange;

Preload.addJob(async () => {

    timelineRange = document.getElementById(TIMELINE_RANGE_ID);

    console.log(timelineRange);
});
