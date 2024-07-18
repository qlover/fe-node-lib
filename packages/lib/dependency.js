import { Logger } from './Logger.js';
import { Shell } from './Shell.js';

const log = new Logger();
const shell = new Shell();
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
  static async checkDependency(packageName, global = false) {
    const result = {};

    const exec = async (cmd) => {
      try {
        const output = await shell.exec(cmd, { silent: true });
        // Check if the package is listed in the output
        const regex = new RegExp(`\\b${packageName}@`);
        const finded = regex.test(output);
        return finded ? { version: output.split('@').pop() } : undefined;
      } catch {
        return undefined;
      }
    };

    result.local = await exec(`npm list ${packageName}`);

    if (!result.local && global) {
      result.global = await exec(`npm list -g ${packageName}`);
    }

    return result;
  }

  static async checkWithInstall(packageName) {
    const hasDeep = await Dependency.checkDependency(packageName, true);
    if (!(hasDeep.local || hasDeep.global)) {
      log.error(`${packageName} not found, installing ${packageName}`);
      await shell.exec(`npm i -g ${packageName}`, { silent: true });
    }
    const version = await Dependency.getDependencyVersion(packageName);
    log.log(`${packageName} version is: v${version.version}`);
  }
}
