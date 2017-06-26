const debug = require('debug')('bin:lib:get-info-for-item');
const fetch = require('node-fetch');

module.exports = function(UUID){

	return fetch(`https://${process.env.AVAILABILITY_SERVICE_ORIGIN}/check/${UUID}`)
		.then(res => {
			if(res.ok){
				return res.json();
			} else {
				throw res;
			}
		})
		.then(data => {
			if(data.haveFile === false){
				return false;
			} else {
				return data;
			}
		})
		.catch(err => {
			debug(err);
			return false;
		})
	;

};