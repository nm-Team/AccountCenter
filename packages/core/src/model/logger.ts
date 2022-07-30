import chalk from 'chalk';

const log = (type: string = 'INFO', ...args: any[]) => {
    switch (type) {
        case 'INFO':
            console.log(chalk.blue('[INFO]'), ...args);
            break;
        case 'WARN':
            console.log(chalk.yellow('[WARN]'), ...args);
            break;
        case 'ERROR':
            console.log(chalk.red('[ERROR]'), ...args);
            break;
        case 'SYS':
            console.log(chalk.green('[SYS]'), ...args);
            break;
        default:
            console.log(chalk.grey(`[${type}]`), ...args);
            break;
    }
};

export default log;
