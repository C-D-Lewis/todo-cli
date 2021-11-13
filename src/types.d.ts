/**
 * Todo item type.
 */
export interface ToDoItem {
  message: string;
  timestamp: number;
}

/**
 * App state type.
 */
export interface AppState {
  todos: Array<ToDoItem>;
}

/**
 * Command list type.
 */
export interface CommandList {
  [p: string]: Function;
}
