import picocolors from "picocolors";

type LogLevel = "log" | "warn" | "error" | "table";

const log = (text: any, level: LogLevel = "log") => {
  console[level](typeof text === "object" ? text : `[LOG] ${text}`);
};

// pre-colored loggers
log.error = (text: string) => console.error(picocolors.red(`[ERROR] ${text}`));
log.warn = (text: string) => console.warn(picocolors.yellow(`[WARN] ${text}`));
log.completed = (text: string) =>
  console.log(picocolors.cyan(`[DONE] ${text}`));
log.success = (text: string) => console.log(picocolors.green(`[DONE] ${text}`));

// info table logger
log.table = (arg: any) => {
  if (typeof arg !== "object") {
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
