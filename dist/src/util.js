"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfirmation = exports.getValue = exports.formatTimeAgo = exports.formatDate = exports.spacePad = void 0;
var readline_1 = __importDefault(require("readline"));
/**
 * Pad a number with a space.
 *
 * @param {number} v - Value to pad.
 * @returns {string} Padded value.
 */
var spacePad = function (v) { return (v < 10 ? " " + v : v); };
exports.spacePad = spacePad;
/**
 * Format a todo item date.
 *
 * @param {number} timestamp - Timestamp to format.
 * @returns {string} Formatted date.
 */
var formatDate = function (timestamp) {
    var str = new Date(timestamp).toISOString();
    var _a = str.split('T'), date = _a[0], time = _a[1];
    return date + " " + time.split(':').slice(0, 2).join(':');
};
exports.formatDate = formatDate;
/**
 * Format 'x ago' string.
 *
 * @param {number} timestamp - Timestamp in the past.
 * @returns {string} Format string.
 */
var formatTimeAgo = function (timestamp) {
    var now = Date.now();
    var then = new Date(timestamp).getTime();
    var minsAgo = Math.round((now - then) / 60000);
    if (minsAgo < 60)
        return minsAgo + " minutes ago";
    var hoursAgo = Math.round(minsAgo / 60);
    if (hoursAgo < 24)
        return hoursAgo + " hours ago";
    var daysAgo = Math.round(hoursAgo / 24);
    return daysAgo + " days ago";
};
exports.formatTimeAgo = formatTimeAgo;
/**
 * Get a value with a prompt.
 *
 * @param {string} label - Label to show in the prompt.
 * @returns {Promise<string>} Promise that resolves with the input value.
 */
var getValue = function (label) { return new Promise(function (resolve) {
    var int = readline_1.default.createInterface(process.stdin, process.stdout);
    int.question(label + ": ", function (newText) {
        int.close();
        resolve(newText);
    });
}); };
exports.getValue = getValue;
/**
 * Get a yes/no confirmation from the user.
 *
 * @returns {Promise<boolean>} Promise that resolves with true if the user confirmed.
 */
var getConfirmation = function () { return __awaiter(void 0, void 0, void 0, function () {
    var input;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getValue)('Confirm (yes/no)')];
            case 1:
                input = _a.sent();
                return [2 /*return*/, input === 'yes'];
        }
    });
}); };
exports.getConfirmation = getConfirmation;
