'use strict';

module.exports.execute = execute;
module.exports.isStar = false;

const request = require('request');
const minimist = require('minimist');

const URL = 'http://localhost:8080/messages';
const chalk = require('chalk');

function execute() {
    // Внутри этой функции нужно получить и обработать аргументы командной строки
    const paramInput = process.argv.slice(3);
    const args = minimist(paramInput, {
        string: ['from', 'to']
    });
    const from = args.from;
    const to = args.to;
    const text = args.text;

    const command = process.argv[2];
    switch (command) {
        case 'send':
            return sendMessage(from, to, text);
        case 'list':
            return listMessages(from, to);
        default:
            return Promise.reject('Нет такой команды');
    }
}

function listMessages(from, to) {
    return new Promise ((resolve, reject) => {
        let options = {
            url: URL,
            qs: getObject(from, to),
            json: true
        };

        request(options, (error, response, body) =>{
            if (error) {
                reject(error);
            }
            let coolBody = colorMessages(body);
            resolve(coolBody);
        });
    });
}

function sendMessage(from, to, text) {
    return new Promise ((resolve, reject) => {
        let options = {
            url: URL,
            qs: getObject(from, to),
            method: 'POST',
            body: { text: text },
            json: true
        };

        request(options, (error, response, body) =>{
            if (error) {
                reject(error);
            }
            let tempArray = [];
            tempArray.push(body);
            let coolBody = colorMessages(tempArray);
            resolve(coolBody);
        });
    });
}

function getObject(from, to) {
    let result = {};

    if (from) {
        result.from = from;
    }

    if (to) {
        result.to = to;
    }

    return result;
}

function colorMessages(body) {
    let result = [];

    if (!body[0]) {
        body = [{}];
    }


    body.forEach(function (element) {

        let str = '';
        if (element.from) {
            str += `${chalk.hex('#f00')('FROM')}: ${element.from}\n`;
        }


        if (element.to) {
            str += `${chalk.hex('#f00')('TO')}: ${element.to}\n`;
        }

        str += `${chalk.hex('#0f0')('TEXT')}: ${element.text}`;


        result.push(str);
    });

    return result.join('\n\n');
}
