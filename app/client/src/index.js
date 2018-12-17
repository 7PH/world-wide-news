import {Stage} from "./animation/Stage";
import {Preload} from "./preloader/Preload";
import "./timeline/timeline";


function gotoContent() {

    document.getElementById("page-intro").style.display = "none";
    document.getElementById("page-content").classList.remove("hidden");

    new Stage()
        .start();
}

window.addEventListener("load", async () => {

    await Preload.run();

    document.getElementById("timeline-range").value = "0.1,0.2";

    document.getElementById("page-intro")
        .addEventListener("click", () => gotoContent());
});
