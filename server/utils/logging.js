// logging.js
import fs from 'fs';
import path from 'path';
import { format } from 'util';

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor(options = {}) {
    this.logDirectory = options.logDirectory || path.join(__dirname, 'logs');
    this.logToConsole = options.logToConsole ?? true;
    this.logToFile = options.logToFile ?? false;
    this.logLevel = options.logLevel || LOG_LEVELS.INFO;
    this.environment = options.environment || process.env.NODE_ENV || 'development';

    if (this.logToFile && !fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    this.logFilePath = path.join(this.logDirectory, `application.log`);
    this.levelPriority = {
      [LOG_LEVELS.ERROR]: 0,
      [LOG_LEVELS.WARN]: 1,
      [LOG_LEVELS.INFO]: 2,
      [LOG_LEVELS.DEBUG]: 3,
    };
  }

  log(level, message, ...args) {
    if (this.levelPriority[level] > this.levelPriority[this.logLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} [${level.toUpperCase()}]: ${format(
      message,
      ...args
    )}`;

    if (this.logToConsole) {
      this._logToConsole(level, formattedMessage);
    }

    if (this.logToFile) {
      this._logToFile(formattedMessage);
    }
  }

  _logToConsole(level, message) {
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(message);
        break;
      case LOG_LEVELS.WARN:
        console.warn(message);
        break;
      case LOG_LEVELS.INFO:
        console.info(message);
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(message);
        break;
      default:
        console.log(message);
    }
  }

  _logToFile(message) {
    fs.appendFileSync(this.logFilePath, message + '\n');
  }

  error(message, ...args) {
    this.log(LOG_LEVELS.ERROR, message, ...args);
  }

  warn(message, ...args) {
    this.log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this.log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this.log(LOG_LEVELS.DEBUG, message, ...args);
  }
}

const logger = new Logger({
  logDirectory: path.join(__dirname, 'logs'),
  logToConsole: true,
  logToFile: true,
  logLevel: LOG_LEVELS.DEBUG,
  environment: process.env.NODE_ENV || 'development',
});

export default logger;
