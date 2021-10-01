/* eslint-disable import/no-extraneous-dependencies */

const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

function runBuild(experimentPath) {
  return new Promise((resolve, reject) => {
    exec('npm run build', {
      cwd: experimentPath,
    }, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

const PATH_DESTINATION = path.resolve(process.cwd(), 'dist');
const PATH_EXPERIMENTS = path.resolve(process.cwd(), 'experiments');

(async () => {
  const experiments = await fs.readdir(PATH_EXPERIMENTS);

  await fs.ensureDir(PATH_DESTINATION);

  for (const experiment of experiments) {
    const experimentPath = path.resolve(PATH_EXPERIMENTS, experiment);
    const experimentStat = await fs.stat(experimentPath);

    if (!experimentStat.isDirectory()) {
      continue;
    }

    await runBuild(experimentPath);
    await fs.copy(path.resolve(experimentPath, 'dist'), path.resolve(PATH_DESTINATION, experiment));
  }
})();
