require('dotenv').config();

const debug = require('debug')('webtorrent-audio:index');
const fs = require('fs');
const fetch = require('node-fetch');
const express = require('express');
const WebTorrent = require('webtorrent-hybrid');

const getInformation = require('./bin/lib/get-information-for-item');

const PORT_NUMBER = process.env.PORT || 3000;
const app = express();
const WTClient = new WebTorrent();

const EXISTING_SEEDS = {};

app.get('/:UUID([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})', (req, resA) => {

	getInformation(req.params.UUID)
		.then(data => {
			
			if(!!data){

				if(EXISTING_SEEDS[req.params.UUID]){
					resA.json({
						magnetURI : EXISTING_SEEDS[req.params.UUID].magnetURI
					});
				} else {
					
					fetch(data.url)
						.then(resB => {
							if(resB.ok){
								return resB;
							} else {
								throw resB;
							}
						})
						.then(resB => {
							WTClient.seed(resB.body, (torrent) => {
								debug(`Seeding ${req.params.UUID}`, torrent.magnetURI);
								EXISTING_SEEDS[req.params.UUID] = torrent;
								resA.json({
									magnetURI : torrent.magnetURI
								});
							});
						})
						.catch(err => {
							debug(`An error occurred trying to check that the file exists`, err);
							resA.status = err.status || 500;
							resA.json({
								status : 'err',
								message : 'An error occurred trying to check that the file exists'
							});
						})
					;
				
				}

			} else {
				resA.json(data);
			}

		})
	;

});

app.listen(PORT_NUMBER, function(){
	debug(`Server is listening on port ${PORT_NUMBER}`);
});


WTClient.on('error', (err) => {
	debug('Client error', err);
});