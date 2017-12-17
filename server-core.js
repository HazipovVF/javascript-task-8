'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');
const server = http.createServer();
var messages = [];

server.on('request', (req, res) => {
    // Тут нужно обработать запрос
    const path = url.parse(req.url);
    const query = url.parse(req.url).query;
    const fromAndTo = qs.parse(query);
    res.setHeader('Content-Type', 'application/json');
    var urlTest = /^\/messages$/.test(path);
    if (req.method === 'GET' && !urlTest) {
        var filtredData = JSON.stringify(getFiltredData(fromAndTo));
        res.write(filtredData);
        res.end();
    } else if (req.method === 'POST' && !urlTest) {
        var body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () =>{
            var text = JSON.parse(body).text;
            messages.push(getData(fromAndTo, text));
            res.write(JSON.stringify(messages[messages.length - 1]));
            res.end();
        });
    } else {
        res.statuscode = 404;
        res.end();
    }

});

function getFiltredData(fromAndTo) {
    var result = messages;

    function fltr(element) {
        if (fromAndTo.from !== undefined) {
            return element.from === fromAndTo.from;
        }

        return true;
    }

    function fltr2(element) {
        if (fromAndTo.to !== undefined) {
            return element.to === fromAndTo.to;
        }

        return true;
    }


    return result.filter(fltr).filter(fltr2);
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
