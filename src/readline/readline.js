import { createInterface } from "readline";

export function readline() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = prompt => {
    return new Promise(resolve => {
      rl.question(`${prompt}: `, input => resolve(input.trim()));
    });
  };

  const menu = async (options, text = "Choose Option") => {
    function getValue(item) {
      if (typeof item !== "object") return item;
      if (item.value === undefined) return item;
      return item.value;
    }

    function getLabel(item) {
      if (typeof item !== "object") return item;
      if (item.label === undefined) return item;
      return `${item.label}`;
    }

    if (options.length === 0) return;
    if (options.length < 2) {
      return getValue(options[0]);
    }

    const list = options.map((option, idx) => `  ${idx}) ${getLabel(option)}`);
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
