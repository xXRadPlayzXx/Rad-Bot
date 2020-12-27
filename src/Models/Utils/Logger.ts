import chalk from "chalk";
import symbols from "log-symbols";
import Logger from "../Interfaces/logger";

export class clientLogger implements Logger {
  private static instance: clientLogger;

  success(message: string): void {
    console.log(`${symbols.success} ${chalk.greenBright.bold(message)}`);
  }

  error(message: string): void {
    console.log(`${symbols.error} ${chalk.redBright.bold(message)}`);
  }

  warning(message: string): void {
    console.log(`${symbols.warning} ${chalk.gray.bold(message)}`);
  }

  info(message: string): void {
    const spaces =
      244 - chalk.redBright.bold(`${symbols.info} ${message}`).length;
    let infoLog: string = chalk.redBright.bold(
      `${symbols.info} ${message}${" ".repeat(spaces)}`
    );

    infoLog += chalk.whiteBright.bold(
      `${new Date().getHours()}:${new Date().getMinutes()}`
    );
    console.log(infoLog);
  }

  log(message: string): void {
    console.log(chalk.white.bold(message));
  }

  static getclientLogger(): clientLogger {
    if (!clientLogger.instance) {
      clientLogger.instance = new clientLogger();
    }
    return clientLogger.instance;
  }
}
export default clientLogger;
