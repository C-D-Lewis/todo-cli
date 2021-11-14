"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTodos = exports.getTodos = exports.load = exports.save = void 0;
var os_1 = require("os");
var fs_1 = require("fs");
/** State file location */
var STATE_FILE = (0, os_1.homedir)() + "/.todo";
/** Initial state */
var INITIAL_STATE = {
    todos: [],
};
var state;
/**
 * Save the state.
 */
var save = function () {
    (0, fs_1.writeFileSync)(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
};
exports.save = save;
/**
 * Load the state.
 */
var load = function () {
    if (!(0, fs_1.existsSync)(STATE_FILE)) {
        state = INITIAL_STATE;
        (0, exports.save)();
    }
    state = JSON.parse((0, fs_1.readFileSync)(STATE_FILE, 'utf8'));
};
exports.load = load;
/**
 * Get the current list of todos.
 *
 * @returns {Array<ToDoItem}
 */
var getTodos = function () { return state.todos; };
exports.getTodos = getTodos;
/**
 * Set the todos.
 *
 * @param {Array<ToDoItem> items - New items list.
 */
var setTodos = function (items) {
    state.todos = __spreadArray([], items, true);
};
exports.setTodos = setTodos;
