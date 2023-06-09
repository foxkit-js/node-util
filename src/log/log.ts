import picocolors from "picocolors";

type LogLevel = "log" | "warn" | "error" | "table";

const log = (text: unknown, level: LogLevel = "log") => {
  console[level](typeof text === "object" ? text : `[LOG] ${text}`);
};

// pre-colored loggers
log.error = (text: string) => console.error(picocolors.red(`[ERROR] ${text}`));
log.warn = (text: string) => console.warn(picocolors.yellow(`[WARN] ${text}`));
log.completed = (text: string) =>
  console.log(picocolors.cyan(`[DONE] ${text}`));
log.success = (text: string) => console.log(picocolors.green(`[DONE] ${text}`));

// info table logger
// eslint-disable-next-line @typescript-eslint/no-explicit-any
log.table = (arg: any) => {
  if (typeof arg !== "object" || arg === null) {
    return log(arg);
  }

  const temp: { [key: string]: string } = {};
  for (const key in arg) {
    temp[key] =
      typeof arg[key] === "object"
        ? arg[key] instanceof Array
          ? "array"
          : "object"
        : arg[key];
  }

  log(temp, "table");
};

export { log };
