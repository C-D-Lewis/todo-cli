/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { homedir } from 'os';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import pkg from '../package.json';
import { AppState, CommandList } from './types';
import 'colors';

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
 * Pad a number with a space.
 *
 * @param {number} v - Value to pad.
 * @returns {string} Padded value.
 */
const spacePad = (v: number) => (v < 10 ? ` ${v}` : v);

/**
 * Add a todo.
 *
 * @param {Array<string>} words - Words of new item to add.
 */
const add = (...words: Array<string>) => {
  const message = words.join(' ');

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
  if (!state.todos.length) throw new Error('There are no items to show.');

  state.todos.forEach((item, index) => {
    const { message, timestamp } = item;
    console.log(`${`${spacePad(index)}:`.grey} ${message} ${`(${timestamp})`.grey}`);
  });
};

/**
 * Update a todo.
 *
 * @param {number} index = Index of the item to update.
 * @param {Array<string>} words - Words of the new message content.
 */
const update = (index: number, ...words: Array<string>) => {
  if (!index || index > state.todos.length - 1) throw new Error('Invalid index');
  if (!words || !words.length) throw new Error('newMessage must be provided');

  const newItem = { ...state.todos[index], message: words.join(' ') };
  state.todos.splice(index, 1, newItem);
  save();
};

/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
const deleteItem = (index: number) => {
  if (!index || index > state.todos.length - 1) throw new Error('Invalid index');

  state.todos.splice(index, 1);
  save();
};

/**
 * Print help content.
 */
const printHelp = () => console.log(
  `${pkg.name} v${pkg.version}

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
