import 'colors';
import pkg from '../package.json';
import { CommandList } from './types';
import {
  getConfig,
  getTodos,
  load,
  setConfig,
  setTodos,
} from './state';
import { spacePad, formatTimeAgo } from './util';

/** Runtime arguments */
const ARGV = process.argv.slice(2);

/**
 * Add a todo.
 *
 * @param {Array<string>} words - Words of new item to add.
 */
const add = (...words: Array<string>) => {
  const newItem = { message: words.join(' '), timestamp: Date.now() };

  setTodos([...getTodos(), newItem]);
};

/**
 * List existing todos.
 */
const list = () => {
  const todos = getTodos();
  if (!todos.length) {
    console.log('There are no todo items to show.'.grey);
    return;
  }

  // Calculate max linelength for alignment
  const maxLength = todos.reduce((acc, p) => (p.message.length > acc ? p.message.length : acc), 0);

  // Print each item
  todos.forEach((item, index) => {
    const { message, timestamp } = item;
    const padLength = maxLength - message.length;
    const paddedMessage = `${message}${' '.repeat(padLength)}`;

    // Decide color based on overdue time
    const timeAgoStr = formatTimeAgo(timestamp);
    let color = 'grey';
    if (timeAgoStr.includes('day')) {
      const [daysAgo] = timeAgoStr.replace('(', '').split(' ');
      if (parseInt(daysAgo, 10) > parseInt(getConfig().overdueDays, 10)) {
        color = 'red';
      }
    }

    console.log(`${`${spacePad(index)}:`.grey} ${paddedMessage} ${`(${timeAgoStr})`[<any>color]}`);
  });
};

/**
 * Update a todo.
 *
 * @param {number} index = Index of the item to update.
 * @param {Array<string>} words - Words of the new message content.
 */
const update = (index: number, ...words: Array<string>) => {
  const todos = getTodos();
  if (!index || index > todos.length - 1) throw new Error('Invalid index');
  if (!words || !words.length) throw new Error('$newMessage must be provided');

  const newItem = { ...todos[index], message: words.join(' ') };
  todos.splice(index, 1, newItem);
  setTodos(todos);
};

/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
const deleteItem = (index: number) => {
  const todos = getTodos();
  if (!index || index > todos.length - 1) throw new Error('Invalid index');

  todos.splice(index, 1);
  setTodos(todos);
};

/**
 * Configure an option.
 *
 * @param {string} option - Option name.
 * @param {string} value - Option value from params.
 */
const configOption = (option: string, value: string) => {
  const config = getConfig();

  // Days until an item is overdue
  if (option === 'overdueDays') {
    config.overdueDays = value;
    setConfig(config);
  }

  // Print options
  console.log(
    `Available options:
  - overdueDays`,
  );
};

/**
 * Print help content.
 */
const printHelp = () => console.log(
  `${pkg.name} v${pkg.version} - ${pkg.description}

Commands:
  ${'$'.grey} todo add|a ${'$message'.grey}
  ${'$'.grey} todo list
  ${'$'.grey} todo update|u ${'$index'.grey} ${'$newMessage'.grey}
  ${'$'.grey} todo delete|d ${'$index'.grey}
  ${'$'.grey} todo config ${'$name'.grey} ${'$index'.grey}`,
);

/**
 * The main function.
 */
const main = () => {
  load();

  const command: keyof CommandList = ARGV[0];
  const commandMap: CommandList = {
    add,
    a: add,
    list,
    l: list,
    update,
    u: update,
    delete: deleteItem,
    d: deleteItem,
    config: configOption,
  };

  // If nothing provided, show help
  if (!commandMap[command]) {
    printHelp();
    return;
  }

  // Select command and run
  try {
    const params = ARGV.slice(1);
    commandMap[command](...params);
  } catch (err) {
    console.log(`Error: ${(err as Error).message}`.red);
  }
};

main();
