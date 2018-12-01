import {Stage} from "./animation/Stage";

function gotoContent() {

    document.getElementById("page-intro").style.display = "none";
    document.getElementById("page-content").classList.remove("hidden");

    Stage.start();
}


window.addEventListener("load", () => {

    document.getElementById("timeline-range").value = "0.1,0.2";

    document.getElementById("page-intro")
        .addEventListener("click", () => gotoContent());
});
