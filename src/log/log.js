import picocolors from "picocolors";

const log = (text, level = "log") => {
  console[level](typeof text === "object" ? text : `[LOG] ${text}`);
};

// pre-colored loggers
log.error = text => console.error(picocolors.red(`[ERROR] ${text}`));
log.warn = text => console.warn(picocolors.yellow(`[WARN] ${text}`));
log.completed = text => console.log(picocolors.cyan(`[DONE] ${text}`));
log.success = text => console.log(picocolors.green(`[DONE] ${text}`));

// info table logger
log.table = arg => {
  if (typeof arg !== "object") {
    return log(arg);
  }

  const temp = {};
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
