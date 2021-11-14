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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
var os_1 = require("os");
var fs_1 = require("fs");
var package_json_1 = __importDefault(require("../package.json"));
require("colors");
/** Runtime arguments */
var ARGV = process.argv.slice(2);
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
/**
 * Load the state.
 */
var load = function () {
    if (!(0, fs_1.existsSync)(STATE_FILE)) {
        state = INITIAL_STATE;
        save();
    }
    state = JSON.parse((0, fs_1.readFileSync)(STATE_FILE, 'utf8'));
};
/**
 * Pad a number with a space.
 *
 * @param {number} v - Value to pad.
 * @returns {string} Padded value.
 */
var spacePad = function (v) { return (v < 10 ? " " + v : v); };
/**
 * Add a todo.
 *
 * @param {Array<string>} words - Words of new item to add.
 */
var add = function () {
    var words = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        words[_i] = arguments[_i];
    }
    var message = words.join(' ');
    state.todos.push({
        message: message,
        timestamp: Date.now(),
    });
    save();
};
/**
 * List existing todos.
 */
var list = function () {
    if (!state.todos.length)
        throw new Error('There are no items to show.');
    state.todos.forEach(function (item, index) {
        var message = item.message, timestamp = item.timestamp;
        console.log((spacePad(index) + ":").grey + " " + message + " " + ("(" + timestamp + ")").grey);
    });
};
/**
 * Update a todo.
 *
 * @param {number} index = Index of the item to update.
 * @param {Array<string>} words - Words of the new message content.
 */
var update = function (index) {
    var words = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        words[_i - 1] = arguments[_i];
    }
    if (!index || index > state.todos.length - 1)
        throw new Error('Invalid index');
    if (!words || !words.length)
        throw new Error('newMessage must be provided');
    var newItem = __assign(__assign({}, state.todos[index]), { message: words.join(' ') });
    state.todos.splice(index, 1, newItem);
    save();
};
/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
var deleteItem = function (index) {
    if (!index || index > state.todos.length - 1)
        throw new Error('Invalid index');
    state.todos.splice(index, 1);
    save();
};
/**
 * Print help content.
 */
var printHelp = function () { return console.log(package_json_1.default.name + " v" + package_json_1.default.version + "\n\nCommands:\n  " + '$'.grey + " todo add|a " + '$message'.grey + "\n  " + '$'.grey + " todo list\n  " + '$'.grey + " todo update|u " + '$index'.grey + " " + '$newMessage'.grey + "\n  " + '$'.grey + " todo delete|d " + '$index'.grey); };
/**
 * The main function.
 */
var main = function () {
    load();
    var command = ARGV[0];
    var args = ARGV.slice(1);
    var commandMap = {
        add: add,
        a: add,
        list: list,
        l: list,
        update: update,
        u: update,
        delete: deleteItem,
        d: deleteItem,
    };
    if (!commandMap[command]) {
        printHelp();
        return;
    }
    try {
        commandMap[command].apply(commandMap, args);
    }
    catch (err) {
        console.log(("Error: " + err.message).red);
    }
};
main();
