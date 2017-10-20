const { promisify } = require('util');
const { exec } = require('child_process');
const { Collection } = require('discord.js');
const zws = String.fromCharCode(8203);
let sensitivePattern;

/**
 * Contains static methods to be used throughout klasa
 */
class Util {

	/**
	 * This class may not be initiated with new
	 */
	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	/**
	 * Makes a codeblock markup string
	 * @param {string} lang The codeblock language
	 * @param {string} expression The expression to be wrapped in the codeblock
	 * @returns {string}
	 */
	static codeBlock(lang, expression) {
		return `\`\`\`${lang}\n${expression || '\u200b'}\`\`\``;
	}

	/**
	 * Cleans sensitive info from strings
	 * @param {string} text The text to clean
	 * @returns {string}
	 */
	static clean(text) {
		if (typeof text === 'string') return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
		return text;
	}

	/**
	 * Initializes the sensitive patterns for clean()
	 * @private
	 * @param {KlasaClient} client The Klasa client
	 */
	static initClean(client) {
		const patterns = [];
		if (client.token) patterns.push(client.token);
		if (client.user.email) patterns.push(client.user.email);
		if (client.password) patterns.push(client.password);
		sensitivePattern = new RegExp(patterns.join('|'), 'gi');
	}

	/**
	 * Converts a string to Title Case
	 * @param {string} str The string to titlecaseify
	 * @returns {string}
	 */
	static toTitleCase(str) {
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

	/**
	 * Generates an error object used for argument reprompting
	 * @param {Error} error An error object
	 * @param {number} code The status code to assign to the error
	 * @returns {Error}
	 */
	static newError(error, code) {
		if (error.status) {
			this.statusCode = error.response.res.statusCode;
			this.statusMessage = error.response.res.statusMessage;
			this.code = error.response.body.code;
			this.message = error.response.body.message;
			return this;
		}
		this.code = code || null;
		this.message = error;
		this.stack = error.stack || null;
		return this;
	}

	/**
	 * Cleans a string from regex injection
	 * @param {string} str The string to clean
	 * @returns {string}
	 */
	static regExpEsc(str) {
		return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	/**
	 * Applies an interface to a class
	 * @param {Object} base The interface to apply to a structure
	 * @param {Object} structure The structure to apply the interface to
	 * @param {string[]} [skips=[]] The methods to skip when applying this interface
	 */
	static applyToClass(base, structure, skips = []) {
		for (const method of Object.getOwnPropertyNames(base.prototype)) {
			if (!skips.includes(method)) Object.defineProperty(structure.prototype, method, Object.getOwnPropertyDescriptor(base.prototype, method));
		}
	}

	/**
   * Get the type of value. A better version of the `typeof` operator, basically
   * @param {*} value The object or primitive whose type is to be returned
   * @returns {string}
   */
	static getType(value) {
		if (value == null) return String(value); // eslint-disable-line eqeqeq
		return typeof value;
	}

	/**
   * Get the class (constructor) name of value
   * @param {*} value The object whose class name is to be returned
   * @returns {string}
   */
	static getClass(value) {
		return value && value.constructor && value.constructor.name ?
			value.constructor.name :
			{}.toString.call(value).match(/\[object (\w+)\]/)[1];
	}

	/**
   * Get the type info for value
   * @param {*} value The object or primitive whose complex type is to be returned
   * @returns {{basicType: string, type: string}}
   */
	static getComplexType(value) {
		const basicType = this.getType(value);
		if (basicType === 'object' || basicType === 'function') return { basicType, type: this.getClass(value) };
		return { basicType, type: basicType };
	}

	/**
   * Get the arity of fn
   * @param {Function} fn The function whose arity is to be returned
   * @returns {string}
   */
	static getFunctionType(fn) {
		return `(${fn.length}-arity)`;
	}

	/**
   * Get the type of array's elements
   * @param {Array} array The array whose element type is to be returned
   * @param {number} depth The depth to get the type, recursively
   * @param {number} [i=0] Just an iteration count to prevent infinite loops
   * @returns {string}
   */
	static getArrayType(array, depth, i = 0) {
		if (typeof depth !== 'number') throw new TypeError('`depth` is missing, or not a number');
		return `<${this._getObjType(array, depth, i)}>`;
	}

	/**
   * Get the type of obj's elements
   * @param {Object} obj The object whose element type is to be returned
   * @param {number} depth The depth to get the type, recursively
   * @param {number} [i=0] Just an iteration count to prevent infinite loops
   * @returns {string}
   */
	static getObjectType(obj, depth, i = 0) {
		if (typeof depth !== 'number') throw new TypeError('`depth` is missing, or not a number');
		const type = this._getObjType(Object.values(obj), depth, i);
		return type.length > 0 ? `<${this.getComplexType('').type}, ${type}>` : '<>';
	}

	/**
   * Get the type of map's values
   * @param {Map} map The map whose value type is to be returned
   * @param {number} depth The depth to get the type, recursively
   * @param {number} [i=0] Just an iteration count to prevent infinite loops
   * @returns {string}
   */
	static getMapType(map, depth, i = 0) {
		if (typeof depth !== 'number') throw new TypeError('`depth` is missing, or not a number');
		const keyType = this._getObjType(Array.from(map.keys()), depth, i);
		const valueType = this._getObjType(Array.from(map.values()), depth, i);
		return valueType.length > 0 ? `<${keyType}, ${valueType}>` : '<>';
	}

	/**
   * Get the type of set's values
   * @param {Set} set The set whose value type is to be returned
   * @param {number} depth The depth to get the type, recursively
   * @param {number} [i=0] Just an iteration count to prevent infinite loops
   * @returns {string}
   */
	static getSetType(set, depth, i = 0) {
		if (typeof depth !== 'number') throw new TypeError('`depth` is missing, or not a number');
		return `<${this._getObjType(Array.from(set.values()), depth, i)}>`;
	}

	/**
   * Get the type of values's elements
   * @private
   * @param {Array} values The array whose element type is to be returned
   * @param {number} depth The depth to get the type, recursively
   * @param {number} i Just an iteration count to prevent infinite loops
   * @returns {string}
   */
	static _getObjType(values, depth, i) {
		if (!Array.isArray(values)) throw new TypeError("You're using this function wrong; `values` must be an array");
		if (typeof depth !== 'number') throw new TypeError('`depth` is missing, or not a number');
		if (typeof i !== 'number') throw new TypeError('`i` is missing, or not a number');
		// Collections have useful methods, which work on Sets.
		const Coll = Collection.prototype;

		const objTypes = new Set(values.map(val => this.getComplexType(val).type));
		const nonNullTypes = new Set();
		const nullTypes = new Set();
		for (const type of objTypes.values()) {
			if (['null', 'undefined'].includes(type)) nullTypes.add(type);
			else nonNullTypes.add(type);
		}

		if (nonNullTypes.size > 1) return '*';
		if (nonNullTypes.size === 1) {
			const type = Coll.first.call(nonNullTypes);
			const value = values.find(val => val != null); // eslint-disable-line eqeqeq
			const nestedType = this.getComplexType(value);
			let nestedTypeStr = '';
			if (i < depth) {
				if (nestedType.basicType === 'object') {
					if (Array.isArray(value)) nestedTypeStr = this.getArrayType(value, depth, i + 1);
					else if (value instanceof Map) nestedTypeStr = this.getMapType(value, depth, i + 1);
					else if (value instanceof Set) nestedTypeStr = this.getSetType(value, depth, i + 1);
					else nestedTypeStr = this.getObjectType(value, depth, i + 1);
				} else if (nestedType.basicType === 'function') {
					nestedTypeStr = this.getFunctionType(value, depth, i + 1);
				}
			}
			if (nullTypes.size > 0) return `?${type}${nestedTypeStr}`;
			return `${type}${nestedTypeStr}`;
		}

		// No types besides, possibly, "null" and "undefined"
		if (nullTypes.size > 1) return 'null|undefined';
		if (nullTypes.size === 1) return Coll.first.call(nullTypes);

		// No types at all, i.e. no elements at all
		return '';
	}

	/**
   * Determines whether the passed value is an Array.
   * @param {*} value The value to be checked.
   * @returns {boolean}
   */
	static isThenable(value) {
		return value && typeof value.then === 'function';
	}

	/**
   * Wrap a promise in a promise that will timeout in a certain amount of time.
   * 
   * Whichever promise (the inputted one or the timeout one) resolves first will have its value be
   * the resolved value of the returned promise.
   * @param {Promise} promise The promise to wrap.
   * @param {number} timeout How long the new promise should wait before timing out.
   * @returns {Promise}
   */
	static timeoutPromise(promise, timeout) {
		return Promise.race([promise, this.sleep(timeout, new this.TimeoutError('Promise timed out'))]);
	}

	/**
   * Present time duration in a nice way
   * @param {number} time A duration in milliseconds
   * @returns {string}
   */
	static getNiceDuration(time) {
		if (time >= 1000) return `${(time / 1000).toFixed(2)}s`;
		if (time >= 1) return `${time.toFixed(2)}ms`;
		return `${(time * 1000).toFixed(2)}μs`;
	}

}

/**
 * @typedef {Object} execOptions
 * @memberof {Util}
 * @property {string} [cwd=process.cwd()] Current working directory of the child process
 * @property {Object} [env={}] Environment key-value pairs
 * @property {string} [encoding='utf8'] encoding to use
 * @property {string} [shell=os === unix ? '/bin/sh' : process.env.ComSpec] Shell to execute the command with
 * @property {number} [timeout=0] 
 * @property {number} [maxBuffer=200*1024] Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated.
 * @property {string|number} [killSignal='SIGTERM'] <string> | <integer> (Default: 'SIGTERM')
 * @property {number} [uid] Sets the user identity of the process.
 * @property {number} [gid] Sets the group identity of the process.
 */

/**
 * Promisified version of child_process.exec for use with await
 * @method
 * @param {string} command The command to run
 * @param {execOptions} options The options to pass to exec
 * @returns {string}
 */
Util.exec = promisify(exec);

/**
 * Promisified version of setTimeout for use with await
 * @method
 * @param {number} delay The amount of time in ms to delay
 * @param {any} args Any args to pass to the .then (mostly pointless in this form)
 * @returns {Promise<any>} The args value passed in
 */
Util.sleep = promisify(setTimeout);

/**
 * Used to mark when a promise has timed out
 */
Util.TimeoutError = class TimeoutError extends Error {};

module.exports = Util;
