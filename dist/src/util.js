"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.spacePad = void 0;
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
