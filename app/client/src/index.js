import {Stage} from "./animation/Stage";

function gotoContent() {

    document.getElementById("page-intro").style.display = "none";
    document.getElementById("page-content").classList.remove("hidden");

    Stage.start();
}


window.addEventListener("load", () => {

    document.getElementById("page-intro")
        .addEventListener("click", () => gotoContent());
});
