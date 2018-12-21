const express = require('express');
const app = express();
const API = require('./API');
const http = require('http');
const https = require('https');
const Credentials = require('./Credentials');
const PromiseCaching = require('promise-caching').PromiseCaching;

const PORT = 3000;
const api = new API();

const CACHE_DURATION = 60 * 60 * 24 * 1000;
const MIN_WINDOW = 900;

const cache = new PromiseCaching({ returnExpired: true });

const getData = (start, end) => {
    return cache.get('' + start + ';' + end, CACHE_DURATION, async () => {
        const d = await api.getMentions(start, end, 0, 10000);
        d.list = d.list.filter(e => e.lat != null && e.long != null);
        d.list = d.list.map(e => [e.event_code, e.lat, e.long]);
        return d;
    });
};

app.get('/api', async (req, res) => {

    // init
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // parse params
    const start = MIN_WINDOW * Math.floor(parseInt(req.query.start) / MIN_WINDOW);
    const end = MIN_WINDOW * Math.floor(parseInt(req.query.end) / MIN_WINDOW);

    // fetch data
    try {

        const d = await getData(start, end);
        res.send(JSON.stringify(d));
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
