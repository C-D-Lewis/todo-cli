"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.setCompleted = exports.getCompleted = exports.setConfig = exports.getConfig = exports.setTodos = exports.getTodos = exports.load = void 0;
var os_1 = require("os");
var fs_1 = require("fs");
/** State file location */
var STATE_FILE = (0, os_1.homedir)() + "/.todo-cli-config";
/** Default config */
var DEFAULT_CONFIG = {
    overdueDays: '3',
};
/** Initial state */
var INITIAL_STATE = {
    todos: [],
    config: DEFAULT_CONFIG,
    completed: [],
};
var state;
/**
 * Save the state.
 */
var save = function () {
    (0, fs_1.writeFileSync)(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
};
/**
 * Load the state.
 */
var load = function () {
    if (!(0, fs_1.existsSync)(STATE_FILE)) {
        state = INITIAL_STATE;
        save();
    }
    state = JSON.parse((0, fs_1.readFileSync)(STATE_FILE, 'utf8'));
    // Migrations
    if (!state.config) {
        state.config = __assign({}, DEFAULT_CONFIG);
    }
    if (!state.config.overdueDays) {
        state.config.overdueDays = DEFAULT_CONFIG.overdueDays;
    }
    if (!state.completed) {
        state.completed = [];
    }
    save();
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
    save();
};
exports.setTodos = setTodos;
/**
 * Get the app state config.
 *
 * @returns {AppStateConfig} The config.
 */
var getConfig = function () { return state.config; };
exports.getConfig = getConfig;
/**
 * Set the config.
 *
 * @param {AppStateConfig} newConfig - New updated config.
 */
var setConfig = function (newConfig) {
    state.config = __assign({}, newConfig);
    save();
};
exports.setConfig = setConfig;
/**
 * Get the list of completed items.
 *
 * @returns {Array<ToDoItem>}
 */
var getCompleted = function () { return state.completed; };
exports.getCompleted = getCompleted;
/**
 * Set the completed list.
 *
 * @param {Array<ToDoItem> items - New items list.
 */
var setCompleted = function (items) {
    state.completed = __spreadArray([], items, true);
    save();
};
exports.setCompleted = setCompleted;
