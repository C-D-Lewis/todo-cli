import { homedir } from 'os';
import { readFileSync, writeFileSync, existsSync } from 'fs';
const { version } = require(`${__dirname}/../package.json`);
import { AppState, CommandList } from './types';

/** Runtime arguments */
const ARGV = process.argv.slice(2);

/** State file location */
const STATE_FILE = `${homedir()}/.todo`;
/** Initial state */
const INITIAL_STATE: AppState = {
  todos: [],
};

let state: AppState;

/**
 * Save the state.
 */
 const save = () => {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
};

/**
 * Load the state.
 */
const load = () => {
  if (!existsSync(STATE_FILE)) {
    state = INITIAL_STATE;
    save();
  }
  state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
};

/**
 * Add a todo.
 *
 * @param {string} message - New item to add.
 */
const add = (message: string) => {
  state.todos.push({
    message,
    timestamp: Date.now(),
  });
  save();
};

/**
 * List existing todos.
 */
const list = () => {
  console.log('');

  if (!state.todos.length) {
    console.log('  There are no items to show.\n');
    return;
  }

  state.todos.forEach(({ message, timestamp }, index) => {
    console.log(`  ${index}: ${message} (${timestamp})`);
  });
  console.log('');
};

/**
 * Update a todo.
 *
 * @param {number} index = Index of the item to update.
 * @param {string} newMessage - New message content.
 */
const update = (index: number, newMessage: string) => {
  if (!index || index > state.todos.length - 1) {
    console.log('Invalid index');
    return;
  }

  const found = state.todos[index];
  const newItem = { ...found, message: newMessage };
  state.todos.splice(index, 1, newItem);
  save();
};

/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
const _delete = (index: number) => {
  state.todos.splice(index, 1);
  save();
};

/**
 * Print help content.
 */
const printHelp = () => console.log(`
  node-todo v${version}

  Commands:
    $ todo add|a $message
    $ todo list
    $ todo update|u $index $newMessage
    $ todo delete|d $index
`);

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
    delete: _delete,
    d: _delete,
  };
  if (!commandMap[command]) {
    printHelp();
    return;
  }

  commandMap[command](...args);
};

main();
