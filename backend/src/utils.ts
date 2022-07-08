const randomStr = (digit = 32, dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') => {
    let str = '';

    for (let i = 1; i <= digit; i++) str += dict[Math.floor(Math.random() * dict.length)];
    return str;
};

export { randomStr };
