import * as Winston from "winston";
import config from "../../config/index";

const { combine, timestamp } = Winston.format;

export class LoggerService {
  private readonly logger: Winston.Logger;

  constructor() {
    this.logger = Winston.createLogger({
      format: combine(timestamp(), Winston.format.json()),
      transports: [new Winston.transports.Console()],
      level: config.logLevel,
    });
  }

  log(message: string, structure?: unknown): void {
    this.logger.info(message, structure);
  }

  error(message: string, structure?: unknown): void {
    this.logger.error(message, structure);
  }

  warn(message: string, structure?: unknown): void {
    this.logger.warn(message, structure);
  }

  debug(message: string, structure?: unknown): void {
    this.logger.debug(message, structure);
  }

  verbose(message: string, structure?: unknown): void {
    this.logger.verbose(message, structure);
  }
}
