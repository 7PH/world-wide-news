const express = require('express');
const app = express();
const API = require('./API');
const http = require('http');
const https = require('https');
const Credentials = require('./Credentials');

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

        res.send(JSON.stringify(await api.getMentions(start, end, 0, 1000)));
    } catch (e) {

        res.send({"error": e.toString()});
    }
});

api.init().then(() => {

    if (typeof Credentials.HTTPS === "undefined") {
        http.createServer(app).listen(PORT);
    } else {
        https.createServer(Credentials.HTTPS, app).listen(PORT);
    }

    console.log(`Example app listening on port ${PORT}!`)
});
