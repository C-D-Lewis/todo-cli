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
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var fs_1 = require("fs");
var version = require(__dirname + "/../package.json").version;
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
 * Add a todo.
 *
 * @param {string} message - New item to add.
 */
var add = function (message) {
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
    console.log('');
    if (!state.todos.length) {
        console.log('  There are no items to show.\n');
        return;
    }
    state.todos.forEach(function (_a, index) {
        var message = _a.message, timestamp = _a.timestamp;
        console.log("  " + index + ": " + message + " (" + timestamp + ")");
    });
    console.log('');
};
/**
 * Update a todo.
 *
 * @param {number} index = Index of the item to update.
 * @param {string} newMessage - New message content.
 */
var update = function (index, newMessage) {
    console.log({ index: index, newMessage: newMessage });
    if (!index || index > state.todos.length - 1) {
        console.log('Invalid index');
        return;
    }
    var found = state.todos[index];
    var newItem = __assign(__assign({}, found), { message: newMessage });
    state.todos.splice(index, 1, newItem);
    save();
};
/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
var _delete = function (index) {
    state.todos.splice(index, 1);
    save();
};
/**
 * Print help content.
 */
var printHelp = function () { return console.log("\n  node-todo v" + version + "\n\n  Commands:\n    $ todo add|a $message\n    $ todo list\n    $ todo update|u $index $newMessage\n    $ todo delete|d $index\n"); };
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
        delete: _delete,
        d: _delete,
    };
    if (!commandMap[command]) {
        printHelp();
        return;
    }
    commandMap[command].apply(commandMap, args);
};
main();
