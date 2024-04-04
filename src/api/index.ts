import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { appendPrefix } from '../functions';

export const createApi = async (app: any) => {
    const readdir = promisify(fs.readdir);
    const writeFile = promisify(fs.writeFile);
    const appendFile = promisify(fs.appendFile);

    const folders = (await readdir('./src/api')).filter((f) => !f.includes('.'));
    await writeFile('./src/api/router.md', '## ROUTER ##');
    for (const e of folders) {
        const p = path.join(__dirname, `./${e}/${e}Router.ts`);
        if (fs.existsSync(p)) {
            appendFile('./src/api/router.md', `\n \t${appendPrefix(e)}`);
            app.use(appendPrefix(e), require(`./${e}/${e}Router`));
        }
    }
}