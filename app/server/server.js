const express = require('express');
const spawn = require('child_process');
const execFile = spawn.execFile;
const app = express();

const PORT = 3000;

async function asyncExec(command, args) {
    return new Promise((resolve, reject) => {
        execFile(command, args, {maxBuffer: 1024 * 10000}, (error, stdout, stderr) => {
            if (error)
                reject(error);
            else
                resolve(stdout);
        })
    });
}

/**
 * @TODO document
 *
 * @param type
 * @param start
 * @param end
 * @returns {Promise<string>}
 */
async function fetchType(type, start, end) {
    const stdout = await asyncExec('python3', ['-m', 'app.preprocessing.api', Math.floor(start), Math.floor(end), type]);
    return JSON.parse(stdout);
}


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
            'export': fetchType('export', start, end),
            'mentions': fetchType('export', start, end)
        };
        data.export = await data.export;
        data.mentions = await data.mentions;
        res.send(JSON.stringify(data));
    } catch (e) {

        res.send({"error": e.toString()});
    }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
