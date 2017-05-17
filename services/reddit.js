let request = require('request');
let config = require('../config');

module.exports = (url) => {
    return new Promise((resolve, reject) => {
        var options = { 
            method: 'GET',
            url: url
        };

        request(options, (error, response, body) => {
            if (error) return reject(error);
            if (!body) return reject('response error!');
            //reject(error);
            var data = JSON.parse(body);
            resolve(data.data);
        });
    });
}