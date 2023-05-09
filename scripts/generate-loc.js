import chalk from 'chalk';
import fileUrl from 'file-url';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { rimraf } from 'rimraf';
import { getFiles, toSecond } from './utils.js';

const BASE_URL = 'https://trackmania-asia-oce.github.io/signpacks';

async function main() {
  const start = process.hrtime();
  const spinner = ora(`${chalk.yellowBright('Generating new .loc files...')}`).start();

  getFiles(path.resolve(process.cwd(), 'public')).then(files => {
    files.forEach(file => {
      const relativePath = path.relative(process.cwd(), file).split('\\').join('/');
      const parsedFile = path.parse(file);
      fs.writeFileSync(
        path.resolve(parsedFile.dir, `${parsedFile.name}.loc`),
        relativePath.replace('public/', `${BASE_URL}/`)
      );
    });

    const end = `${toSecond(process.hrtime(start))} seconds`;
    spinner.succeed(`Done in ${chalk.greenBright(end)}`);
  });
}

main().catch(err => {
  console.error(err);
});
