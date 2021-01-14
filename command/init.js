'use strict';
const fs = require('fs');
const exec = require('child_process').exec;
const config = require('../templates');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const clui = require('clui');
const Spinner = clui.Spinner;
const status = new Spinner('正在下载...');

module.exports = () => {
    let gitUrl;
    let branch;
    clear();
    console.log(chalk.yellow(figlet.textSync('Eastedu-CLI', {
        horizontalLayout: 'full'
    })));
    inquirer.prompt([
        {
            name: 'templateName',
            type: 'list',
            message: '请选择你需要的模板：',
            choices: Object.keys(config.tpl),
        },
        {
            name: 'projectName',
            type: 'input',
            message: '请输入你的项目名称：',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return '请输入你的项目名称';
                }
            },
        }
    ])
    .then(answers => {
        gitUrl = config.tpl[answers.templateName].url;
        branch = config.tpl[answers.templateName].branch;
        let cmdStr = `git clone ${gitUrl} ${answers.projectName} && cd ${answers.projectName} && git checkout ${branch}`;
        status.start();
        exec(cmdStr, (error, stdout, stderr) => {
            status.stop();
            if (error) {
                console.log('发生了一个错误：', chalk.red(JSON.stringify(error)));
                process.exit();
            }
            const meta = {
                name: answers.projectName
            };
            const content = fs.readFileSync(`${answers.projectName}/package.json`).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(`${answers.projectName}/package.json`, result);
            console.log(chalk.green('\n √ 下载完成!'));
            console.log(chalk.cyan(`\n cd ${answers.projectName} && yarn \n`));
            process.exit();
        })
    })
    .catch(error => {
        console.log(error);
        console.log('发生了一个错误：', chalk.red(JSON.stringify(error)));
        process.exit();
    });
}