import 'colors';
import pkg from '../package.json';
import { CommandList } from './types';
import {
  getTodos, load, save, setTodos,
} from './state';
import { formatDate, spacePad } from './util';

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
  save();
};

/**
 * List existing todos.
 */
const list = () => {
  const todos = getTodos();
  if (!todos.length) throw new Error('There are no items to show.');

  const maxLength = todos.reduce((acc, p) => (p.message.length > acc ? p.message.length : acc), 0);

  todos.forEach((item, index) => {
    const { message, timestamp } = item;
    const difference = maxLength - message.length;
    const paddedMessage = `${message}${' '.repeat(difference)}`;
    console.log(`${`${spacePad(index)}:`.grey} ${paddedMessage} ${`(${formatDate(timestamp)})`.grey}`);
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
  if (!words || !words.length) throw new Error('newMessage must be provided');

  const newItem = { ...todos[index], message: words.join(' ') };
  todos.splice(index, 1, newItem);
  setTodos(todos);
  save();
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
  save();
};

/**
 * Print help content.
 */
const printHelp = () => console.log(
  `${pkg.name} v${pkg.version}
${pkg.description}

Commands:
  ${'$'.grey} todo add|a ${'$message'.grey}
  ${'$'.grey} todo list
  ${'$'.grey} todo update|u ${'$index'.grey} ${'$newMessage'.grey}
  ${'$'.grey} todo delete|d ${'$index'.grey}`,
);

/**
 * The main function.
 */
const main = () => {
  load();

  const command: keyof CommandList = ARGV[0];
  const args = ARGV.slice(1);

  const commandMap: CommandList = {
    add,
    a: add,
    list,
    l: list,
    update,
    u: update,
    delete: deleteItem,
    d: deleteItem,
  };
  if (!commandMap[command]) {
    printHelp();
    return;
  }

  try {
    commandMap[command](...args);
  } catch (err) {
    console.log(`Error: ${(err as Error).message}`.red);
  }
};

main();
