import fs from "fs/promises";
import * as esbuild from "esbuild";

/**
 * Base config for esbuild
 */
const config = {
  entryPoints: [
    "src/fs/index.ts",
    "src/fs-extra/index.ts",
    "src/log/index.ts",
    "src/readline/index.ts"
  ],
  outdir: "dist",
  bundle: true,
  platform: "node",
  target: "es2022",
  packages: "external",
  minify: false
};

async function build() {
  // Clean dist directory
  console.log("Cleaning");
  await fs.rm(config.outdir, { recursive: true, force: true });

  // Build esm bundles
  console.log("Building esm bundles");
  await esbuild.build({
    ...config,
    format: "esm"
  });

  // Build cjs bundles
  console.log("Building cjs bundles");
  await esbuild.build({
    ...config,
    format: "cjs",
    outExtension: { ".js": ".cjs" }
  });

  // Copy README file
  console.log("Copying static files");
  await Promise.all([
    fs.cp("./README.md", "dist/README.md", { force: true }),
    fs.cp("./LICENSE", "dist/LICENSE", { force: true })
  ]);
}

build().then(() => {
  console.log("Completed build");
});
