const Animation = require('./Animation');

function gotoContent() {

    document.getElementById('page-intro').style.display = 'none';
    document.getElementById('page-content').classList.remove('hidden');

    Animation.start();
}


window.addEventListener('load', () => {

    document.getElementById('page-intro')
        .addEventListener('click', () => gotoContent());
});

window.addEventListener('load', () => {
    document
        .getElementById("page-title")
        .innerHTML = "If you see this message and it is centered<br> it means that the page has successfully loaded";
});
