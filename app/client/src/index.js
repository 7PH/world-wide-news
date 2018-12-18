import {Stage} from "./animation/Stage";
import {Preload} from "./preloader/Preload";
import {rangeControl} from "./util/range";
import "./timeline/timeline";
const Helpers = require("../../data-extraction/Helpers");

async function gotoContent() {

    document.getElementById("page-intro").style.display = "none";
    document.getElementById("page-content").classList.remove("hidden");

    const stage = new Stage();
    await stage.start();

    rangeControl('timeline-range', value => {
        const timestamp = Helpers.START_TMS + value * (Helpers.END_TMS - Helpers.START_TMS);
        console.log(timestamp);
        stage.loadPointsFrom(timestamp);
    });
}

window.addEventListener("load", async () => {

    await Preload.run();

    document.getElementById("page-intro")
        .addEventListener("click", () => gotoContent());
});
