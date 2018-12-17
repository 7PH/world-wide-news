const express = require('express');
const app = express();
const API = require('../data-extraction/API');

const PORT = 3000;
const api = new API();

app.get('/api', async (req, res) => {

    // init
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // parse params
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);

    // fetch data
    try {
        const data = {
            result: await api.getMentions(start, end),
            ok: Date.now()
        };

        res.send(JSON.stringify(data));
    } catch (e) {

        res.send({"error": e.toString()});
    }
});

api.init().then(() => {
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
});
