import shell from 'shelljs';
import { execa } from 'execa';
import { Logger } from './Logger.js';
import lodash from 'lodash';

const format = (template = '', context = {}) => {
  const log = new Logger();
  try {
    return lodash.template(template)(context);
  } catch (error) {
    log.error(
      `Unable to render template with context:\n${template}\n${JSON.stringify(context)}`
    );
    log.error(error);
    throw error;
  }
};

const noop = Promise.resolve();

export class Shell {
  /**
   *
   * @param {object} container
   * @param {Logger} container.log
   */
  constructor(container = {}) {
    this.config = container.config || {};
    this.cache = new Map();
    this.log = container.log || new Logger();
  }

  /**
   * run command
   *
   * @param {string | object} command
   * @param {object} options
   * @param {boolean} options.silent Whether to print output
   * @param {object} options.env command var
   * @param {Record<string, any>} context
   * @returns
   */
  exec(command, options = {}, context = {}) {
    // FIXME: Error will be reported when command is emtpy
    if (lodash.isEmpty(command)) {
      return;
    }
    return typeof command === 'string'
      ? this.execFormattedCommand(format(command, context), options)
      : this.execFormattedCommand(command, options);
  }

  async execFormattedCommand(command, options = {}) {
    const { isDryRun } = this.config;
    const isWrite = options.write !== false;
    const isExternal = options.external === true;
    const cacheKey = typeof command === 'string' ? command : command.join(' ');
    const isCached = !isExternal && this.cache.has(cacheKey);

    if (isDryRun && isWrite) {
      this.log.exec(command, { isDryRun });
      return noop;
    }

    this.log.exec(command, { isExternal, isCached });

    if (isCached) {
      return this.cache.get(cacheKey);
    }

    const result =
      typeof command === 'string'
        ? this.execStringCommand(command, options, { isExternal })
        : this.execWithArguments(command, options, { isExternal });

    if (!isExternal && !this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  execStringCommand(command, options, { isExternal }) {
    return new Promise((resolve, reject) => {
      shell.exec(
        command,
        { async: true, ...options },
        (code, stdout, stderr) => {
          stdout = stdout.toString().trimEnd();
          // debug({ command, options, code, stdout, stderr });
          if (code === 0) {
            resolve(stdout);
          } else {
            this.log.error(command);
            reject(new Error(stderr || stdout));
          }
        }
      );
      // childProcess.stdout.on('data', (stdout) =>
      //   this.log.verbose(stdout.toString().trimEnd(), { isExternal })
      // );
      // childProcess.stderr.on('data', (stderr) =>
      //   this.log.verbose(stderr.toString().trimEnd(), { isExternal })
      // );
    });
  }

  async execWithArguments(command, options, { isExternal }) {
    const [program, ...programArgs] = command;

    try {
      const { stdout: out, stderr } = await execa(program, programArgs);
      const stdout = out === '""' ? '' : out;
      this.log.verbose(stdout, { isExternal });
      // debug({ command, options, stdout, stderr });
      return Promise.resolve(stdout || stderr);
    } catch (error) {
      if (error.stdout) {
        this.log.log(`\n${error.stdout}`);
      }
      // debug({ error });
      return Promise.reject(new Error(error.stderr || error.message));
    }
  }
}
