import {Controller} from "./animation/Controller";


window.addEventListener("load", async () => {
    const controller = new Controller();
    await controller.init();
});
