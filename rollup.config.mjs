import initConfig from "@foxkit/rollup-config/ts-babel.js";
const makeConfig = initConfig();

const config = [
  makeConfig({ key: "./fs", input: "./src/fs/index.ts" }),
  makeConfig({ key: "./fs-yaml", input: "./src/fs-yaml/index.ts" }),
  makeConfig({ key: "./log", input: "./src/log/index.ts" }),
  makeConfig({ key: "./path", input: "./src/path/index.ts" }),
  makeConfig({ key: "./readline", input: "./src/readline/index.ts" })
];

export default config;
