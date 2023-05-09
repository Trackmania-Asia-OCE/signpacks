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
    const parsedFiles = files.map(path.parse);
    const filteredFiles = parsedFiles.filter(file => file.ext !== '.loc');

    filteredFiles.forEach(file => {
      const relativePath = path
        .relative(process.cwd(), path.resolve(file.dir, file.base))
        .split('\\')
        .join('/');

      fs.writeFileSync(
        path.resolve(file.dir, `${file.name}.loc`),
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
