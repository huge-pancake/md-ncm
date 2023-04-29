export default class Logger {
  static get debug() {
    return localStorage.getItem('debug') === 'true';
  }
  static set debug(value: boolean) {
    localStorage.setItem('debug', value ? 'true' : 'false');
  }

  static info(unitName: string, ...contents: any[]) {
    if (this.debug) console.log(`[${unitName}]`, ...contents);
  }
  static warn(unitName: string, ...contents: any[]) {
    console.warn(`[${unitName}]`, ...contents);
  }
  static error(unitName: string, ...contents: any[]) {
    console.error(`[${unitName}]`, ...contents);
  }
}
