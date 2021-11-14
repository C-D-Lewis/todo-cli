import { homedir } from 'os';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { AppState, ToDoItem } from './types';

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
export const save = () => {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
};

/**
 * Load the state.
 */
export const load = () => {
  if (!existsSync(STATE_FILE)) {
    state = INITIAL_STATE;
    save();
  }
  state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
};

/**
 * Get the current list of todos.
 *
 * @returns {Array<ToDoItem}
 */
export const getTodos = (): Array<ToDoItem> => state.todos;

/**
 * Set the todos.
 *
 * @param {Array<ToDoItem> items - New items list.
 */
export const setTodos = (items: Array<ToDoItem>) => {
  state.todos = [...items];
};
