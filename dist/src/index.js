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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var package_json_1 = __importDefault(require("../package.json"));
var state_1 = require("./state");
var util_1 = require("./util");
/** Runtime arguments */
var ARGV = process.argv.slice(2);
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
    var newItem = { message: words.join(' '), timestamp: Date.now() };
    (0, state_1.setTodos)(__spreadArray(__spreadArray([], (0, state_1.getTodos)(), true), [newItem], false));
    (0, state_1.save)();
};
/**
 * List existing todos.
 */
var list = function () {
    var todos = (0, state_1.getTodos)();
    if (!todos.length) {
        console.log('There are no todo items to show.'.grey);
        return;
    }
    // Calculate max linelength for alignment
    var maxLength = todos.reduce(function (acc, p) { return (p.message.length > acc ? p.message.length : acc); }, 0);
    // Print each item
    todos.forEach(function (item, index) {
        var message = item.message, timestamp = item.timestamp;
        var padLength = maxLength - message.length;
        var paddedMessage = "" + message + ' '.repeat(padLength);
        // Decide color based on overdue time
        var timeAgoStr = (0, util_1.formatTimeAgo)(timestamp);
        var color = 'grey';
        if (timeAgoStr.includes('day')) {
            var daysAgo = timeAgoStr.replace('(', '').split(' ')[0];
            if (parseInt(daysAgo, 10) > (0, state_1.getConfig)().overdueDays) {
                color = 'red';
            }
        }
        console.log(((0, util_1.spacePad)(index) + ":").grey + " " + paddedMessage + " " + ("(" + timeAgoStr + ")")[color]);
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
    var todos = (0, state_1.getTodos)();
    if (!index || index > todos.length - 1)
        throw new Error('Invalid index');
    if (!words || !words.length)
        throw new Error('$newMessage must be provided');
    var newItem = __assign(__assign({}, todos[index]), { message: words.join(' ') });
    todos.splice(index, 1, newItem);
    (0, state_1.setTodos)(todos);
    (0, state_1.save)();
};
/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
var deleteItem = function (index) {
    var todos = (0, state_1.getTodos)();
    if (!index || index > todos.length - 1)
        throw new Error('Invalid index');
    todos.splice(index, 1);
    (0, state_1.setTodos)(todos);
    (0, state_1.save)();
};
/**
 * Print help content.
 */
var printHelp = function () { return console.log(package_json_1.default.name + " v" + package_json_1.default.version + " - " + package_json_1.default.description + "\n\nCommands:\n  " + '$'.grey + " todo add|a " + '$message'.grey + "\n  " + '$'.grey + " todo list\n  " + '$'.grey + " todo update|u " + '$index'.grey + " " + '$newMessage'.grey + "\n  " + '$'.grey + " todo delete|d " + '$index'.grey); };
/**
 * The main function.
 */
var main = function () {
    (0, state_1.load)();
    var command = ARGV[0];
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
    // If nothing provided, show help
    if (!commandMap[command]) {
        printHelp();
        return;
    }
    // Select command and run
    try {
        var params = ARGV.slice(1);
        commandMap[command].apply(commandMap, params);
    }
    catch (err) {
        console.log(("Error: " + err.message).red);
    }
};
main();
