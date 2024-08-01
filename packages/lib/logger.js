import { EOL } from 'node:os';
import chalk from 'chalk';
import lodash from 'lodash';

const { first, last, isObject, isString, lowerCase, upperFirst, isArray } =
  lodash;
const { green, bold, yellow, red, grey } = chalk;

const LEVELS = {
  LOG: 'LOG',
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG'
};

export class Logger {
  constructor({ isCI = false, dryRun = false, debug = false } = {}) {
    this.isCI = isCI;
    this.isDryRun = dryRun;
    this.isDebug = debug;
  }

  /**
   * Basic logging methods.
   * @param {string} level it can be any string, inner use `LEVELS`
   * @param  {...any} args
   */
  print(level, ...args) {
    console.log(...args);
  }

  log(...args) {
    this.print(LEVELS.LOG, ...args);
  }

  info(...args) {
    this.print(LEVELS.INFO, green('INFO'), ...args);
  }

  warn(...args) {
    this.print(LEVELS.WARN, yellow('WARNING'), ...args);
  }

  error(...args) {
    this.print(LEVELS.ERROR, red('ERROR'), ...args);
  }

  debug(...args) {
    if (this.isDebug) {
      const firstArg = first(args);
      const firstValue = isObject(firstArg)
        ? JSON.stringify(firstArg)
        : firstArg;

      this.print(LEVELS.DEBUG, grey('DEBUG'), firstValue, ...args.slice(1));
    }
  }

  verbose(...args) {
    if (this.isDebug) {
      // use purple color
      this.print(LEVELS.DEBUG, ...args);
    }
  }

  exec(...args) {
    const { isDryRun, isExternal: isExecutedInDryRun } = last(args) || {};
    if (isDryRun || this.isDryRun || isExecutedInDryRun) {
      const prefix = isExecutedInDryRun == null ? '$' : '!';
      const command = args
        .map((cmd) => (isString(cmd) ? cmd : isArray(cmd) ? cmd.join(' ') : ''))
        .join(' ');
      const message = [prefix, command].join(' ').trim();
      this.log(message);
    }
  }

  obtrusive(...args) {
    if (!this.isCI) this.log();
    this.log(...args);
    if (!this.isCI) this.log();
  }

  preview({ title, text }) {
    if (text) {
      const header = bold(upperFirst(title));
      const body = text.replace(new RegExp(EOL + EOL, 'g'), EOL);
      this.obtrusive(`${header}:${EOL}${body}`);
    } else {
      this.obtrusive(`Empty ${lowerCase(title)}`);
    }
  }
}
