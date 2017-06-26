require('dotenv').config();

const debug = require('debug')('webtorrent-audio:index');
const express = require('express');
const WebTorrent = require('webtorrent-hybrid');

const PORT_NUMBER = process.env.PORT || 3000;
const app = express();
const WTClient = new WebTorrent();

app.get('/', (req, res) => {
	res.send('hello');
});

app.listen(PORT_NUMBER, function(){
	debug(`Server is listening on port ${PORT_NUMBER}`);
});

WTClient.seed('./resources/fb705712-3be7-11e7-821a-6027b8a20f23.mp3', (torrent) => {
	debug(torrent.magnetURI);
});

WTClient.on('error', (err) => {
	debug('Client error', err);
});