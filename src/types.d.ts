/** Todo item type. */
export interface ToDoItem {
  message: string;
  timestamp: number;
}

/** App state config type. */
export interface AppStateConfig {
  overdueDays: string;
}

/** App state type. */
export interface AppState {
  todos: Array<ToDoItem>;
  config: AppStateConfig;
}

/** Command list type. */
export interface CommandList {
  [p: string]: function;
}
