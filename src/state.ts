import { homedir } from 'os';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { AppState, AppStateConfig, ToDoItem } from './types';

/** State file location */
const STATE_FILE = `${homedir()}/.todo-cli-config`;
/** Default config */
const DEFAULT_CONFIG: AppStateConfig = {
  overdueDays: '3',
};
/** Initial state */
const INITIAL_STATE: AppState = {
  todos: [],
  config: DEFAULT_CONFIG,
  completed: [],
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
  if (!state.completed) {
    state.completed = [];
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
  save();
};

/**
 * Get the app state config.
 *
 * @returns {AppStateConfig} The config.
 */
export const getConfig = (): AppStateConfig => state.config;

/**
 * Set the config.
 *
 * @param {AppStateConfig} newConfig - New updated config.
 */
export const setConfig = (newConfig: AppStateConfig) => {
  state.config = { ...newConfig };
  save();
};

/**
 * Get the list of completed items.
 *
 * @returns {Array<ToDoItem>}
 */
export const getCompleted = (): Array<ToDoItem> => state.completed;

/**
 * Set the completed list.
 *
 * @param {Array<ToDoItem> items - New items list.
 */
export const setCompleted = (items: Array<ToDoItem>) => {
  state.completed = [...items];
  save();
};
