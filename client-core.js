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
            uri: URL,
            qs: rightData(from, to)
        };
        request.get(options)

            .on('response', res => {
                var body = '';

                res.on('data', chunk => {
                    body += chunk;
                });

                res.on('error', () => {
                    reject('error');
                });

                res.on('end', () => {
                    var coolBody = makeBodyGreatAgain(JSON.parse(body));
                    resolve(coolBody);
                });
            })
            .on('error', () => {
                reject('error');
            });
    });
}

function sendMassege(from, to, text) {
    return new Promise ((resolve, reject) => {
        var options = {
            uri: URL,
            qs: rightData(from, to),
            form: JSON.stringify({ text })
        };

        request.post(options)

            .on('response', res => {
                var body = '';

                res.on('data', chunk => {
                    body += chunk;
                });

                res.on('error', () => {
                    reject('error');
                });

                res.on('end', () => {
                    var tempArray = [];
                    tempArray.push(JSON.parse(body));
                    var coolBody = makeBodyGreatAgain(tempArray);
                    resolve(coolBody);
                });
            })
            .on('error', () => {
                reject('error');
            });
    });
}

function rightData(from, to) {
    var result = {};

    if (from !== undefined && from !== true) {
        result.from = from;
    }

    if (to !== undefined && to !== true) {
        result.to = to;
    }

    return result;
}

function makeBodyGreatAgain(body) {
    var result = [];

    if (body[0] === undefined) {
        body.push({});
    }

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
