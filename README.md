# Data Visualization Project

<img src="https://travis-ci.com/7PH/EPFL-Data-Visualization-Project.svg?token=Za94vW75EZvYRU3Un778&branch=master">

**Visualization of the latest news**

Live demo: https://news.benjamin-raymond.pro/

## Install

```bash
git clone https://github.com/7PH/world-wide-news;
cd world-wide-news;
npm install;
echo "module.exports = { DB_USER: '', DB_PASSWORD: '',};" > app/server/Credentials.js;
```

## Crawl the database

```bash
node app/data-extraction/fetch-all.js;
```

## Launch the app

```bash
npm start;
```
