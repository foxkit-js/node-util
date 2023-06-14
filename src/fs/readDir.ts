import { readdir } from "fs/promises";
import { join, relative, resolve } from "path";

interface ReadDirOptions {
  /**
   * Whether to include files from subdirectories (default: `false`)
   * Note: Node.js 20+ has this option on fs.promises.readdir already. You may not need foxkit's version unless you use filters or path transformations.
   */
  recursive?: boolean;
  /**
   * Whether to return file paths are relative to the directory or absolute path. (default: `"relative"`)
   */
  pathStyle?: "relative" | "absolute";
  /**
   * Overrides which directory paths are relative to if `pathStyle` is set to `"relative"`
   */
  relativeTo?: string;
  /**
   * Callback function to filter which files are included in the output. Paths will be relative or absolute according to the `pathStyle` and `relativeTo` options
   * @param filePath Path to file
   * @returns `true` if file should be included in output.
   */
  filter?: (filePath: string) => boolean;
}

/**
 * Lists all files within a directory. See doc comments on `options` for more information.
 * @param dirPath
 * @param {ReadDirOptions} options
 */
export async function readDir(dirPath: string, options?: ReadDirOptions) {
  // resolve options
  const recursive = options?.recursive ?? false;
  const pathStyle = options?.pathStyle ?? "relative";
  const relativeTo = resolve(options?.relativeTo ?? dirPath);
  const filter = options?.filter;

  const files = new Array<string>();
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const dirent of entries) {
    if (dirent.isFile()) {
      const filePath = resolve(join(dirPath, dirent.name));

      if (pathStyle == "absolute") {
        if (!filter || filter(filePath)) files.push(filePath);
        continue;
      }

      const relFilePath = relative(relativeTo, filePath);
      if (!filter || filter(relFilePath)) files.push(relFilePath);
      continue;
    }

    if (dirent.isDirectory() && recursive) {
      files.push(
        ...(await readDir(
          join(dirPath, dirent.name),
          Object.assign({}, options, {
            relativeTo: options?.relativeTo ?? dirPath
          })
        ))
      );
    }
  }

  return files;
}
