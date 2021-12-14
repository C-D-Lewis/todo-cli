import { homedir } from 'os';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { AppState, AppStateConfig, ToDoItem } from './types';

/** State file location */
const STATE_FILE = `${homedir()}/.todo-cli-config`;
/** Default config */
const DEFAULT_CONFIG = {
  overdueDays: 3,
};
/** Initial state */
const INITIAL_STATE: AppState = {
  todos: [],
  config: DEFAULT_CONFIG,
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

  // Migrations
  if (!state.config) {
    state.config = { ...DEFAULT_CONFIG };
  }
  if (!state.config.overdueDays) {
    state.config.overdueDays = DEFAULT_CONFIG.overdueDays;
  }
  save();
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

/**
 * Get the app state config.
 *
 * @returns {AppStateConfig} The config.
 */
export const getConfig = (): AppStateConfig => state.config;
