'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');
const server = http.createServer();
const messages = [];

server.on('request', (req, res) => {
    // Тут нужно обработать запрос
    const query = url.parse(req.url).query;
    let fromAndTo = qs.parse(query);
    let urlTest = (/^\/messages($|\?)/).test(req.url);
    if (req.method === 'GET' && urlTest) {
        res.setHeader('Content-Type', 'application/json');
        let filtredData = JSON.stringify(getFiltredData(fromAndTo));
        res.write(filtredData);
        res.end();
    } else if (req.method === 'POST' && urlTest) {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () =>{
            res.setHeader('Content-Type', 'application/json');
            let text = JSON.parse(body).text;
            messages.push(getData(fromAndTo, text));
            res.write(JSON.stringify(getData(fromAndTo, text)));
            res.end();
        });
    } else {
        res.statusCode = 404;
        res.end();
    }

});

function getFiltredData(fromAndTo) {
    let result = messages;

    if (fromAndTo.from && fromAndTo.to) {
        return result.filter(function (element) {
            return element.from === fromAndTo.from && element.to === fromAndTo.to;
        });
    }

    if (fromAndTo.from) {
        return result.filter(function (element) {
            return element.from === fromAndTo.from;
        });
    }

    if (fromAndTo.to) {
        return result.filter(function (element) {
            return element.to === fromAndTo.to;
        });
    }

    return result;
}

function getData(fromAndTo, text) {
    fromAndTo.text = text;

    return fromAndTo;
}


module.exports = server;
