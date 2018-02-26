import getopts from 'getopts';
import dedent from 'dedent';
import chalk from 'chalk';
import { resolve } from 'path';

import { entries } from './utils/entries';
import { commands, getCommand } from './commands';
import { runCommand } from './run';

function help() {
  const availableCommands = entries(commands).map(
    ([name, description]) => `${name} - ${description}`
  );

  console.log(dedent`
    usage: kbn <command> [<args>]

    By default commands are run for Kibana itself, all packages in the 'packages/'
    folder and for all plugins in '../kibana-extra'.

    Available commands:

       ${availableCommands.join('\n       ')}

    Global options:

       --skip-kibana        Do not include the root Kibana project when running command.
       --skip-kibana-extra  Filter all plugins in ../kibana-extra when running command.
  `);
}

export async function run(argv: string[]) {
  // We can simplify this setup (and remove this extra handling) once Yarn
  // starts forwarding the `--` directly to this script, see
  // https://github.com/yarnpkg/yarn/blob/b2d3e1a8fe45ef376b716d597cc79b38702a9320/src/cli/index.js#L174-L182
  if (argv.includes('--')) {
    console.log(
      chalk.red(
        `Using "--" is not allowed, as it doesn't work with 'yarn kbn'.`
      )
    );
    process.exit(1);
  }

  const options = getopts(argv, {
    boolean: ['skip-kibana', 'skip-kibana-extra'],
    alias: {
      h: 'help',
    },
  });

  const args = options._;

  // We should no longer rely on `_` here, but rather on `args`.
  delete options._;

  if (options.help || args.length === 0) {
    help();
    return;
  }

  // This `rootPath` is relative to `./dist/` as that's the location of the
  // built version of this tool.
  const rootPath = resolve(__dirname, '../../../');

  const commandName = args[0];
  const extraArgs = args.slice(1);

  const commandOptions = { options, extraArgs, rootPath };

  if (!(commandName in commands)) {
    console.log(
      chalk.red(`[${commandName}] is not a valid command, see 'kbn --help'`)
    );
    process.exit(1);
  }

  const command = getCommand(commandName as any);

  await runCommand(command as any, commandOptions);
}
