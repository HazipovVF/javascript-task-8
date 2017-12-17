'use strict';

module.exports.execute = execute;
module.exports.isStar = false;

const request = require('request');
const minimist = require('minimist');

const URL = 'http://localhost:8080/messages';
const chalk = require('chalk');

function execute() {
    // Внутри этой функции нужно получить и обработать аргументы командной строки
    const args = minimist(process.argv.slice(3), {
        string: ['from', 'to']
    });
    var from = args.from;
    var to = args.to;
    var text = args.text;
    var command = process.argv[2];
    switch (command) {
        case 'send':
            return sendMassege(from, to, text);
        case 'list':
            return listMasseges(from, to);
        default:
            return Promise.reject('Нет такой команды');
    }
}

function listMasseges(from, to) {
    return new Promise ((resolve, reject) => {
        var options = {
            url: URL,
            qs: rightData(from, to),
            method: 'GET',
            json: true
        };

        request(options, (error, response, body) =>{
            if (error) {
                reject('ОШИБКА');
            }
            var coolBody = makeBodyGreatAgain(body);
            resolve(coolBody);
        });
    });
}

function sendMassege(from, to, text) {
    return new Promise ((resolve, reject) => {
        var options = {
            url: URL,
            qs: rightData(from, to),
            method: 'POST',
            body: { text: text },
            json: true
        };

        request(options, (error, response, body) =>{
            if (error) {
                reject('ОШИБКА');
            }
            var tempArray = [];
            tempArray.push(body);
            var coolBody = makeBodyGreatAgain(tempArray);
            resolve(coolBody);
        });
    });
}

function rightData(from, to) {
    var result = {};

    if (from) {
        result.from = from;
    }

    if (to) {
        result.to = to;
    }

    return result;
}

function makeBodyGreatAgain(body) {
    var result = [];

    if (!body[0]) {
        body = [{}];
    }


    body.forEach(function (element) {

        var str = '';
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
