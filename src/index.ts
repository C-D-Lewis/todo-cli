import 'colors';
import pkg from '../package.json';
import { CommandList, ToDoItem } from './types';
import {
  getCompleted,
  getConfig,
  getTodos,
  load,
  setCompleted,
  setConfig,
  setTodos,
} from './state';
import { spacePad, formatTimeAgo } from './util';

/** Runtime arguments */
const ARGV = process.argv.slice(2);
/** Max completed items to show */
const MAX_COMPLETED = 5;

/**
 * Get max length of all items in a list.
 *
 * @param {Array<ToDoItem>} items - All items.
 * @returns {number} Length of the longest item.
 */
const getMaxItemLength = (items: Array<ToDoItem>) => items.reduce(
  (acc, p) => (p.message.length > acc ? p.message.length : acc),
  0,
);

/**
 * Render an item.
 *
 * @param {ToDoItem} item - Item to render.
 * @param {number} index - List index.
 * @param {number} maxLength - Max length of all items in the list.
 * @param {boolean} isCompleted - If the item is completed.
 */
const renderItem = (item: ToDoItem, index: number, maxLength: number, isCompleted = false) => {
  const { message, timestamp } = item;
  const padLength = maxLength - message.length;
  const paddedMessage = `${message}${' '.repeat(padLength)}`[isCompleted ? 'gray' : 'white'];

  // Decide color based on overdue time
  const timeAgoStr = formatTimeAgo(timestamp);
  let color = 'grey';
  if (timeAgoStr.includes('day')) {
    const [daysAgo] = timeAgoStr.replace('(', '').split(' ');
    if (parseInt(daysAgo, 10) > parseInt(getConfig().overdueDays, 10) && !isCompleted) {
      color = 'red';
    }
  }

  const prefix = isCompleted ? '-' : `${spacePad(index)}:`;
  console.log(`${`${prefix}`.grey} ${paddedMessage} ${`(${timeAgoStr})`[<any>color]}`);
};

/**
 * Add a todo.
 *
 * @param {Array<string>} words - Words of new item to add.
 */
const add = (...words: Array<string>) => {
  const newItem = { message: words.join(' '), timestamp: Date.now() };

  setTodos([...getTodos(), newItem]);
  console.log(`${'Added:'.grey} ${newItem.message}`);
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

  // Print each item
  console.log('\nOutstanding:');
  const maxTodoLength = getMaxItemLength(todos);
  todos.forEach((item, index) => renderItem(item, index, maxTodoLength));

  if (ARGV.includes('--no-recent')) return;

  // Print most recent completed items
  console.log('\nRecently completed:'.gray);
  const completed = getCompleted();
  const start = completed.length > MAX_COMPLETED ? completed.length - MAX_COMPLETED : 0;
  const recent = completed.slice(start, completed.length);
  recent.reverse();
  const maxCompletedLength = getMaxItemLength(recent);
  recent.forEach((item, index) => renderItem(item, index, maxCompletedLength, true));
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

  const updated = words.join(' ');
  const newItem = { ...todos[index], message: updated };
  todos.splice(index, 1, newItem);
  setTodos(todos);
  console.log(`${'Updated:'.yellow} ${updated}`);
};

/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
const deleteItem = (index: number) => {
  const todos = getTodos();
  if (!index || index > todos.length - 1) throw new Error('Invalid index');

  const [deleted] = todos.splice(index, 1);
  setTodos(todos);
  console.log(`${'Done:'.green} ${deleted.message}`);

  // Place in completed history
  const completed = getCompleted();
  completed.push(deleted);
  setCompleted(completed);
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
  ${'$'.grey} todo list|l
  ${'$'.grey} todo update|u ${'$index'.grey} ${'$newMessage'.grey}
  ${'$'.grey} todo done|d ${'$index'.grey}
  ${'$'.grey} todo config ${'$name'.grey} ${'$value'.grey}`,
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
    done: deleteItem,
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
