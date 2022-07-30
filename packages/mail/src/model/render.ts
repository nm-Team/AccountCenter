import fs from 'fs';
import path_ from 'path';

class Render {
    public path: string;

    constructor(path: string = path_.resolve(__dirname, '../../templates/')) {
        this.path = path;
    }

    public async render(template: string, language: string, variables: any = {}) {
        if (!fs.existsSync(`${this.path}/${template}/index.html`)
            && !fs.existsSync(`${this.path}/${template}/${language}.json`)) {
            throw new Error('Template or language not found');
        }
        const html = fs.readFileSync(`${this.path}/${template}/index.html`, 'utf8');
        const lang = JSON.parse(fs.readFileSync(`${this.path}/${template}/${language}.json`, 'utf8'));
        const data = { ...lang, ...variables };
        return [html.replace(/\${([^}]+)}/g, (match, name) => data[name]), lang.subject];
    }
}

export { Render };
