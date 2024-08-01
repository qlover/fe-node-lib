declare module '@qlover/fe-node-lib' {
  /**
   * Used to check dependencies
   */
  export class Dependency {
    /**
     * Check `packageName` has installed
     * @param {string} packageName
     * @param {boolean} global
     * @returns {Promise<{local?: { version: string }, global?: { version: string }}>}
     */
    static checkDependency(
      packageName: string,
      global?: boolean
    ): Promise<{
      local?: {
        version: string;
      };
      global?: {
        version: string;
      };
    }>;

    static checkWithInstall(packageName: any): Promise<void>;
  }

  export class Env {
    /**
     * Function to clear environment variable
     * @param {string} variable
     */
    static clear(variable: string): void;
    /**
     * Destroy after obtaining a variable
     * @param {string} varname
     * @returns
     */
    static get(varname: string, destory: any): string | undefined;
  }
  export class Files {
    /**
     * Used replace import json file
     * @param {string} filepath
     * @returns
     */
    static readJSON(filepath: string): any;
  }
  export class Logger {
    constructor({
      isCI,
      dryRun,
      debug
    }?: {
      isCI?: boolean | undefined;
      dryRun?: boolean | undefined;
      debug?: boolean | undefined;
    });

    isCI: boolean;
    isDryRun: boolean;
    isDebug: boolean;
    /**
     * Basic logging methods.
     * @param {string} level it can be any string, inner use `LEVELS`
     * @param  {...any} args
     */
    print(level: string, ...args: any[]): void;
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
    verbose(...args: any[]): void;
    exec(...args: any[]): void;
    obtrusive(...args: any[]): void;
    preview({ title, text }: { title: any; text: any }): void;
  }
  export class Shell {
    /**
     *
     * @param {object} container
     * @param {Logger} container.log
     */
    constructor(container?: { log: Logger });
    config: any;
    cache: Map<any, any>;
    log: Logger;
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
    exec(
      command: string | object,
      options?: {
        silent: boolean;
        env: object;
      },
      context?: Record<string, any>
    ): Promise<any> | undefined;

    execFormattedCommand(
      command: any,
      options?: Record<string, any>
    ): Promise<any>;

    execStringCommand(command: any, options: any): Promise<any>;
    execWithArguments(command: any, options: any): Promise<string>;
  }
}
