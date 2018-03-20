import del from 'del';
import chalk from 'chalk';
import { relative } from 'path';
import ora from 'ora';

import { isDirectory } from '../utils/fs';
import { createCommand } from './command';

export const CleanCommand = createCommand(
  {
    name: 'clean',
    description:
      'Remove the node_modules and target directories from all projects.',
  },

  async function({ projects, rootPath }) {
    const directoriesToDelete = [];
    for (const project of projects.values()) {
      if (await isDirectory(project.nodeModulesLocation)) {
        directoriesToDelete.push(project.nodeModulesLocation);
      }

      if (await isDirectory(project.targetLocation)) {
        directoriesToDelete.push(project.targetLocation);
      }
    }

    if (directoriesToDelete.length === 0) {
      console.log(chalk.bold.green('\n\nNo directories to delete'));
    } else {
      console.log(chalk.bold.red('\n\nDeleting directories:\n'));

      for (const dir of directoriesToDelete) {
        const deleting = del(dir, { force: true });
        ora.promise(deleting, relative(rootPath, dir));
        await deleting;
      }
    }
  }
);
