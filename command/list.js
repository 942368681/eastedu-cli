'use strict'
const config = require('../templates')

module.exports = () => {
    let str = '';
    Object.keys(config.tpl).forEach((item, index, array) => {
        if (index === array.length - 1) {
            str += item;
        } else {
            str += `${item} \n`;
        }
    });
    console.log(chalk.cyan(str));
    process.exit();
}