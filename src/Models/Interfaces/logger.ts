interface Logger {
  success(message: string, time: number): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  log(message: string): void;
}
export default Logger;
