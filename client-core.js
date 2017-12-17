'use strict';

module.exports.execute = execute;
module.exports.isStar = false;

const request = require('request');
const minimist = require('minimist');

const URL = 'http://localhost:8080/messages';
const chalk = require('chalk');
const red = chalk.hex('#f00');
const green = chalk.hex('#0f0');

function execute() {
    // Внутри этой функции нужно получить и обработать аргументы командной строки
    const args = minimist(process.argv.slice(3), {
        string: ['from', 'to']
    });
    var from = args.from;
    var to = args.to;
    var text = args.text;
    if (args.text === undefined) {
        text = null;
    }
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

            var coolBody = makeBodyGreatAgain2(body);
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

    body.forEach(function (element) {

        var str = '';
        if (element.from !== undefined) {
            str += red('FROM') + ': ' + element.from + '\n';
        }

        if (element.to !== undefined) {
            str += red('TO') + ': ' + element.to + '\n';
        }


        str += green('TEXT') + ': ' + element.text;


        result.push(str);
    });

    return result.join('\n\n');
}

function makeBodyGreatAgain2(body) {
    var result = [];

    var str = '';
    if (body.from !== undefined) {
        str += red('FROM') + ': ' + body.from + '\n';
    }

    if (body.to !== undefined) {
        str += red('TO') + ': ' + body.to + '\n';
    }


    str += green('TEXT') + ': ' + body.text;


    result.push(str);


    return result.join('\n\n');
}
