export class Env {
  /**
   * Function to clear environment variable
   * @param {string} variable
   */
  static clear(variable) {
    if (process.env[variable]) {
      delete process.env[variable];
    }
  }

  /**
   * Destroy after obtaining a variable
   * @param {string} varname
   * @returns
   */
  static get(varname, destory) {
    const value = process.env[varname];

    destory && Env.clear(varname);

    return value;
  }
}
