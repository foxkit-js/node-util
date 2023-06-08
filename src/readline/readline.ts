import { createInterface } from "readline";

type OptionsItem = string | { value?: any; label?: string };
type Options = OptionsItem[];

export function readline() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string) => {
    return new Promise<string>(resolve => {
      rl.question(`${prompt}: `, input => resolve(input.trim()));
    });
  };

  const menu = async (options: Options, text = "Choose Option") => {
    function getValue(item: OptionsItem) {
      if (typeof item !== "object") return item;
      if (item.value === undefined) return item;
      return item.value;
    }

    function getLabel(item: OptionsItem) {
      if (typeof item !== "object") return item;
      if (item.label === undefined) return item;
      return `${item.label}`;
    }

    if (options.length === 0) return;
    if (options.length < 2) {
      return getValue(options[0]);
    }

    const list = options.map(
      (option, idx: number) => `  ${idx}) ${getLabel(option)}`
    );
    const input = await question(
      `\n${text}:\n${list.join("\n")}\nOption (0-${list.length - 1})`
    );
    const selection = parseInt(input);

    if (input === "") return null;
    if (isNaN(selection) || selection >= list.length) return false;
    return getValue(options[selection]);
  };

  const close = () => rl.close();

  return { question, menu, close };
}
