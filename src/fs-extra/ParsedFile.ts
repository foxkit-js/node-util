import fs from "fs/promises";
import path from "path";
import { isDirectory } from "../fs/isDirectory";

type Stringify<T> = (value: T) => string;
type Parse<T> = (value: string) => T | Promise<T>;

interface FileParserOptions<T> {
  /**
   * Function to serialize to string
   */
  stringify?: Stringify<T>;
  /**
   * Function to parse serialized string
   */
  parse?: Parse<T>;
  /**
   * Limit this parser to a specific file or directory
   */
  limitPath?: string;
  /**
   * List of supported file extensions with leading dot
   * @example [".yml", ".yaml"]
   */
  extensions?: string | string[];
  /**
   * Enable caching of write result or previous reads
   */
  cache?: boolean;
}

export type FileParserResult<T> =
  | { success: false; error: unknown }
  | { success: true; data: T; cacheTime?: number };

export type FileWriteResult =
  | { success: true }
  | { success: false; error: unknown };

interface FileCache<T> {
  data: T;
  cacheTime: number;
}

interface ReadDirOptions {
  /**
   * Whether to include files from subdirectories (default: `false`)
   */
  recursive?: boolean;
  /**
   * Callback function to filter which files are included in the output.
   * Paths will be absolute, but have not yet been checked against the
   * `limitPath` and `extenstions` options passed to the constructor
   * @param filePath Path to file
   * @returns `true` if file should be included in output.
   */
  filter?: (filePath: string) => boolean;
}

type ReadDirResult<T> = Partial<Record<string, FileParserResult<T>>>;

/**
 * Class used to create adapter for parsing specific file types. See comments on
 * FileParserOptions for more information
 */
export class ParsedFile<T> {
  readonly parse?: Parse<T>;
  readonly stringify?: Stringify<T>;
  readonly limitPath?: string;
  readonly extensions?: string[];
  readonly usesCache: boolean;
  private cache = new Map<string, FileCache<T>>();

  /**
   * Create new ParsedFile instance. To enable reading and parsing files provide
   * a `parse` method in the options object, same for writing files which
   * requires a `stringify` method. You can all pass a restriction as to which
   * directory files need to be in (`limitPath`) and a restriction on file
   * extensions (`extentions`)
   *
   * @param options Options Object
   */
  constructor(options: FileParserOptions<T>) {
    this.stringify = options.stringify;
    this.parse = options.parse;
    if (options.limitPath) this.limitPath = path.resolve(options.limitPath);
    if (options.extensions) {
      this.extensions = Array.isArray(options.extensions)
        ? options.extensions
        : [options.extensions];
    }
    this.usesCache = Boolean(options.cache);
  }

  /**
   * Read and parse file
   * @param filePath Path to file
   * @returns {FileParserResult} with either the parsed data or the error that occured
   */
  async readFile(filePath: string): Promise<FileParserResult<T>> {
    try {
      // check that reading is supported by this parser
      if (!this.parse) {
        throw new Error(
          `This ParsedFile does not support reading/parsing files and thus cannot perform read operations`
        );
      }

      // check that file is in specified directory
      const fullPath = path.resolve(filePath);
      if (this.limitPath && !fullPath.startsWith(this.limitPath)) {
        throw new Error(
          `This parser is limited to '${this.limitPath}' but path '${filePath}' was given`
        );
      }

      // check that file has supported extension
      const parsedPath = path.parse(fullPath);
      if (this.extensions && !this.extensions.includes(parsedPath.ext)) {
        throw new Error(
          `File extension ${
            parsedPath.ext
          } is not supported by this parser. Supported extensions: ${this.extensions.join(
            ", "
          )}`
        );
      }

      // attempt to recover file from cache
      if (this.usesCache) {
        const cached = this.cache.get(fullPath);
        if (cached) return Object.assign({ success: true as const }, cached);
      }

      // read and parse file
      const fileContent = await fs.readFile(fullPath, "utf-8");
      const data = await this.parse(fileContent);

      // return immediatly if caching disabled
      if (!this.usesCache) return { success: true, data };

      // set cache and return with cacheTime
      const cached = { data, cacheTime: Date.now() };
      this.cache.set(fullPath, cached);
      return Object.assign({ success: true as const }, cached);
    } catch (error: unknown) {
      {
        return { success: false, error };
      }
    }
  }

  /**
   * Serialize and write file. Note: this is only possible if a stringify method
   * was passed to the constructor!
   * @param filePath Path to file
   * @param data Data to serialize and write to file
   * @returns {FileWriteResult}
   */
  async writeFile(filePath: string, data: T): Promise<FileWriteResult> {
    try {
      // check that writing is supported by this parser
      if (!this.stringify) {
        throw new Error(
          `This parser does not support serialization and thus cannot perform write operations`
        );
      }

      // check that file is in specified directory
      const fullPath = path.resolve(filePath);
      if (this.limitPath && !fullPath.startsWith(this.limitPath)) {
        throw new Error(
          `This parser is limited to '${this.limitPath}' but path '${filePath}' was given`
        );
      }

      // check that file has supported extension
      const parsedPath = path.parse(fullPath);
      if (this.extensions && !this.extensions.includes(parsedPath.ext)) {
        throw new Error(
          `File extension ${
            parsedPath.ext
          } is not supported by this parser. Supported extensions: ${this.extensions.join(
            ", "
          )}`
        );
      }

      // make sure that dir exists
      const dirPath = path.dirname(fullPath);
      if (!(await isDirectory(dirPath))) {
        await fs.mkdir(dirPath, { recursive: true });
      }

      // stringify data
      const fileContent = this.stringify(data);

      // write File
      await fs.writeFile(fullPath, fileContent, "utf-8");

      // set cache if enabled
      if (this.usesCache) {
        this.cache.set(fullPath, { data, cacheTime: Date.now() });
      }

      return { success: true };
    } catch (error: unknown) {
      return { success: false, error };
    }
  }

  private async discoverDir(
    dirPath: string,
    recursive: boolean,
    parentDir: string
  ) {
    const parent = parentDir || dirPath;
    const dir = await fs.readdir(dirPath, { withFileTypes: true });
    const files = new Array<string>();

    for (const dirent of dir) {
      if (dirent.isFile()) {
        files.push(path.relative(parent, path.join(dirPath, dirent.name)));
        continue;
      }
      if (dirent.isDirectory() && recursive) {
        files.push(
          ...(await this.discoverDir(
            path.join(dirPath, dirent.name),
            true,
            parent
          ))
        );
      }
    }

    return files;
  }

  /**
   * Read and parse all files in a directory
   * @param dirPath Path to directory
   * @param options Optional object containing options
   * @returns Record using paths (relative to `dirPath`) as key for results
   */
  async readDir(
    dirPath: string,
    options?: ReadDirOptions
  ): Promise<ReadDirResult<T>> {
    // check that writing is supported by this parser
    if (!this.parse) {
      throw new Error(
        `This parser does not support serialization and thus cannot perform write operations`
      );
    }

    const recursive = options?.recursive ?? false;
    const files = await this.discoverDir(dirPath, recursive, dirPath);
    const result: ReadDirResult<T> = {};

    for (const file of files) {
      const fullPath = path.resolve(dirPath, file);
      if (options?.filter && !options.filter(fullPath)) continue;
      const readResult = await this.readFile(fullPath);
      if (!readResult.success && readResult.error instanceof Error) {
        if (
          readResult.error.message.startsWith("This parser is limited to") ||
          readResult.error.message.startsWith("File extension ")
        ) {
          continue;
        }
      }
      result[path.join(dirPath, file)] = readResult;
    }

    return result;
  }

  /**
   * Destroys memory cache, forcing files to be re-read from file system on next
   * `readFile` or `readDir`.
   */
  resetCache() {
    this.cache = new Map();
  }
}
