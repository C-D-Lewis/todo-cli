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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
/** Max completed items to show */
var MAX_COMPLETED = 5;
/**
 * Get max length of all items in a list.
 *
 * @param {Array<ToDoItem>} items - All items.
 * @returns {number} Length of the longest item.
 */
var getMaxItemLength = function (items) { return items.reduce(function (acc, p) { return (p.message.length > acc ? p.message.length : acc); }, 0); };
/**
 * Render an item.
 *
 * @param {ToDoItem} item - Item to render.
 * @param {number} index - List index.
 * @param {number} maxLength - Max length of all items in the list.
 * @param {boolean} isCompleted - If the item is completed.
 */
var renderItem = function (item, index, maxLength, isCompleted) {
    if (isCompleted === void 0) { isCompleted = false; }
    var message = item.message, timestamp = item.timestamp;
    var padLength = maxLength - message.length;
    var paddedMessage = ("" + message + ' '.repeat(padLength))[isCompleted ? 'gray' : 'white'];
    // Decide color based on overdue time
    var timeAgoStr = (0, util_1.formatTimeAgo)(timestamp);
    var color = 'grey';
    if (timeAgoStr.includes('day')) {
        var daysAgo = timeAgoStr.replace('(', '').split(' ')[0];
        if (parseInt(daysAgo, 10) > parseInt((0, state_1.getConfig)().overdueDays, 10) && !isCompleted) {
            color = 'red';
        }
    }
    var prefix = isCompleted ? '-' : (0, util_1.spacePad)(index) + ":";
    console.log(("" + prefix).grey + " " + paddedMessage + " " + ("(" + timeAgoStr + ")")[color]);
};
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
    console.log('Added:'.green + " " + newItem.message);
};
/**
 * List existing todos.
 */
var list = function () {
    var todos = (0, state_1.getTodos)();
    // Print each item
    console.log('\nOutstanding:');
    var maxTodoLength = getMaxItemLength(todos);
    if (!todos.length) {
        console.log('  There are no outstanding todos.'.green);
    }
    todos.forEach(function (item, index) { return renderItem(item, index, maxTodoLength); });
    if (ARGV.includes('--no-recent'))
        return;
    // Print most recent completed items
    console.log('\nRecently completed:'.gray);
    var completed = (0, state_1.getCompleted)();
    var start = completed.length > MAX_COMPLETED ? completed.length - MAX_COMPLETED : 0;
    var recent = completed.slice(start, completed.length);
    recent.reverse();
    var maxCompletedLength = getMaxItemLength(recent);
    recent.forEach(function (item, index) { return renderItem(item, index, maxCompletedLength, true); });
};
/**
 * Update a todo.
 *
 * @param {number} index = Index of the item to update.
 */
var update = function (index) { return __awaiter(void 0, void 0, void 0, function () {
    var todos, updated, newItem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                todos = (0, state_1.getTodos)();
                if (!index || index > todos.length - 1)
                    throw new Error('Invalid index');
                console.log(("Updating " + index + ": " + todos[index].message).yellow);
                return [4 /*yield*/, (0, util_1.getValue)('New text')];
            case 1:
                updated = _a.sent();
                newItem = __assign(__assign({}, todos[index]), { message: updated });
                todos.splice(index, 1, newItem);
                (0, state_1.setTodos)(todos);
                console.log('Updated:'.green + " " + updated);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Delete a todo.
 *
 * @param {number} index - Index of the item to delete.
 */
var deleteItem = function (index) {
    var todos = (0, state_1.getTodos)();
    if (!index || index > todos.length - 1)
        throw new Error('Invalid index');
    var deleted = todos.splice(index, 1)[0];
    (0, state_1.setTodos)(todos);
    console.log('Done:'.green + " " + deleted.message);
    // Place in completed history
    var completed = (0, state_1.getCompleted)();
    completed.push(deleted);
    (0, state_1.setCompleted)(completed);
};
/**
 * Configure an option.
 *
 * @param {string} option - Option name.
 * @param {string} value - Option value from params.
 */
var configOption = function (option, value) {
    var config = (0, state_1.getConfig)();
    // Days until an item is overdue
    if (option === 'overdueDays') {
        config.overdueDays = value;
        (0, state_1.setConfig)(config);
    }
    // Print options
    console.log("Available options:\n  - overdueDays");
};
/**
 * Print help content.
 */
var printHelp = function () { return console.log(package_json_1.default.name + " v" + package_json_1.default.version + " - " + package_json_1.default.description + "\n\nCommands:\n  " + '$'.grey + " todo add|a " + '$message'.grey + "\n  " + '$'.grey + " todo list|l\n  " + '$'.grey + " todo update|u " + '$index'.grey + "\n  " + '$'.grey + " todo done|d " + '$index'.grey + "\n  " + '$'.grey + " todo config " + '$name'.grey + " " + '$value'.grey); };
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
        done: deleteItem,
        d: deleteItem,
        config: configOption,
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
