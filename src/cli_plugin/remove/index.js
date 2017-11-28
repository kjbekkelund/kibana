import remove from './remove';
import Logger from '../lib/logger';
import { parse } from './settings';
import { getConfig } from '../../server/path';
import logWarnings from '../lib/log_warnings';
import { pluginDirExplanation } from '../lib/plugin_dir';

function processCommand(command, options) {
  let settings;
  try {
    settings = parse(command, options);
  } catch (ex) {
    //The logger has not yet been initialized.
    console.error(ex.message);
    process.exit(64); // eslint-disable-line no-process-exit
  }

  const logger = new Logger(settings);
  logWarnings(settings, logger);
  remove(settings, logger);
}

export default function pluginRemove(program) {
  program
    .command('remove <plugin>')
    .option('-q, --quiet', 'disable all process messaging except errors')
    .option('-s, --silent', 'disable all process messaging')
    .option(
      '-c, --config <path>',
      'path to the config file',
      getConfig()
    )
    .onUnknownOptions(['--plugin-dir', '-d'], () => {
      console.error(pluginDirExplanation);
      process.exit(1);
    })
    .description('remove a plugin',
      `common examples:
  remove x-pack`)
    .action(processCommand);
}
