import fs from 'fs';

export class Files {
  /**
   * Used replace import json file
   * @param {string} filepath 
   * @returns 
   */
  static readJSON(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
}
