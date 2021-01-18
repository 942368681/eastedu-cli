const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const pkg = require('../package.json');

const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000, // 默认为 1000 * 60 * 60 * 24（1 天）
})

function updateChk() {
    if (notifier.update) {
        console.log(`有新版本可用：${chalk.cyan(notifier.update.latest)}，建议您在使用前进行更新`);
        notifier.notify();
    } else {
        console.log(chalk.cyan('已经是最新版本'));
    }
};

module.exports = updateChk;
