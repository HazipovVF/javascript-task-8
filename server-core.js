'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');
const server = http.createServer();
var messages = [];

server.on('request', (req, res) => {
    // Тут нужно обработать запрос
    const pathname = url.parse(req.url).pathname;
    const query = url.parse(req.url).query;
    const fromAndTo = qs.parse(query);
    res.setHeader('Content-Type', 'application/json');
    var regexp = /^\/messages\/{0,2}$/;
    if (regexp.test(pathname) || pathname === '/messages/:[object%20Undefined]') {
        if (req.method === 'GET') {
            var filtredData = JSON.stringify(getFiltredData(fromAndTo));
            res.write(filtredData);
            res.end();
        } else if (req.method === 'POST') {
            var body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () =>{
                var text = JSON.parse(body).text;
                messages.push(getData(fromAndTo, text));
                res.write(JSON.stringify(getData(fromAndTo, text)));
                res.end();
            });
        }

    } else {
        res.statuscode = 404;
        res.end();
    }

});

function getFiltredData(fromAndTo) {
    var result = messages;

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
    var result = {};
    if (fromAndTo.from) {
        result.from = fromAndTo.from;
    }

    if (fromAndTo.to) {
        result.to = fromAndTo.to;
    }

    result.text = text;

    return result;
}


module.exports = server;
