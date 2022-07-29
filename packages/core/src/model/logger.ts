import chalk from 'chalk';

const log = (type: string = 'INFO', ...args: any[]) => {
    switch (type) {
        case 'INFO':
            console.log(chalk.blue('[INFO] '), chalk.grey(new Date().toISOString()), ...args);
            break;
        case 'WARN':
            console.log(chalk.yellow('[WARN] '), chalk.grey(new Date().toISOString()), ...args);
            break;
        case 'ERROR':
            console.log(chalk.red('[ERROR]'), chalk.grey(new Date().toISOString()), ...args);
            break;
        case 'SYS':
            console.log(chalk.green('[SYS]  '), chalk.grey(new Date().toISOString()), ...args);
            break;
        default:
            console.log(chalk.grey(`[${type}]${type.length === 4 ? ' ' : '  '}`), chalk.grey(new Date().toISOString()), ...args);
            break;
    }
};

export default log;
