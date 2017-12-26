const { promisify } = require('util');
const { exec } = require('child_process');
const zws = String.fromCharCode(8203);
const has = (ob, ke) => Object.prototype.hasOwnProperty.call(ob, ke);
let sensitivePattern;

/**
 * Contains static methods to be used throughout klasa
 */
class Util {

	/**
	 * This class may not be initiated with new
	 * @since 0.0.1
	 */
	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	/**
	 * Makes a codeblock markup string
	 * @since 0.0.1
	 * @param {string} lang The codeblock language
	 * @param {string} expression The expression to be wrapped in the codeblock
	 * @returns {string}
	 */
	static codeBlock(lang, expression) {
		return `\`\`\`${lang}\n${expression || zws}\`\`\``;
	}

	/**
	 * Cleans sensitive info from strings
	 * @since 0.0.1
	 * @param {string} text The text to clean
	 * @returns {string}
	 */
	static clean(text) {
		if (typeof text === 'string') return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
		return text;
	}

	/**
	 * Initializes the sensitive patterns for clean()
	 * @since 0.0.1
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
	 * @since 0.0.1
	 * @param {string} str The string to title case
	 * @returns {string}
	 */
	static toTitleCase(str) {
		return str.replace(/[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

	/**
	 * Cleans a string from regex injection
	 * @since 0.0.1
	 * @param {string} str The string to clean
	 * @returns {string}
	 */
	static regExpEsc(str) {
		return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	/**
	 * Merges two objects
	 * @since 0.5.0
	 * @param {*} objTarget The object to be merged
	 * @param {*} objSource The object to merge
	 * @returns {*}
	 */
	static mergeObjects(objTarget = {}, objSource) {
		for (const key in objSource) objTarget[key] = Util.isObject(objSource[key]) ? Util.mergeObjects(objTarget[key], objSource[key]) : objSource[key];
		return objTarget;
	}

	/**
	 * Applies an interface to a class
	 * @since 0.1.1
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
	 * Verify if the input is a function.
	 * @since 0.5.0
	 * @param {Function} input The function to verify
	 * @returns {boolean}
	 */
	static isFunction(input) {
		return typeof input === 'function';
	}

	/**
	 * Verify if the input is a class constructor.
	 * @since 0.5.0
	 * @param {Function} input The function to verify
	 * @returns {boolean}
	 */
	static isClass(input) {
		return typeof input === 'function' &&
			typeof input.constructor !== 'undefined' &&
			typeof input.constructor.constructor.toString === 'function' &&
			input.prototype.constructor.toString().substring(0, 5) === 'class';
	}

	/**
	 * Verify if the input is an object literal (or class).
	 * @since 0.5.0
	 * @param {Object} input The object to verify
	 * @returns {boolean}
	 */
	static isObject(input) {
		return Object.prototype.toString.call(input) === '[object Object]';
	}

	/**
	 * Verify if a number is a finite number.
	 * @since 0.5.0
	 * @param {number} input The number to verify
	 * @returns {boolean}
	 */
	static isNumber(input) {
		return typeof input === 'number' && !isNaN(input) && Number.isFinite(input);
	}

	/**
	 * Verify if an object is a promise.
	 * @since 0.5.0
	 * @param {Promise} input The promise to verify
	 * @returns {boolean}
	 */
	static isThenable(input) {
		return (input instanceof Promise) || (Boolean(input) && Util.isFunction(input.then) && Util.isFunction(input.catch));
	}

	/**
	 * Get the type name that defines the input.
	 * @since 0.5.0
	 * @param {*} input The value to get the type from
	 * @returns {string}
	 */
	static getTypeName(input) {
		switch (typeof input) {
			case 'object': return input === null ? 'null' : input.constructor ? input.constructor.name : 'any';
			case 'function': return `${input.constructor.name}(${input.length}-arity)`;
			case 'undefined': return 'void';
			default: return typeof input;
		}
	}

	/**
	 * Get the deep type name that defines the input.
	 * @since 0.5.0
	 * @param {*} input The value to get the deep type from
	 * @returns {string}
	 */
	static getDeepTypeName(input) {
		const basic = Util.getTypeName(input);
		switch (basic) {
			case 'Map':
			case 'Collection':
			case 'WeakMap':
				return Util.getDeepTypeMap(input, basic);
			case 'Set':
			case 'Array':
			case 'WeakSet':
				return Util.getDeepTypeSetOrArray(input, basic);
			case 'Proxy':
				return Util.getDeepTypeProxy(input);
			case 'Object':
				return 'any';
			default:
				return basic;
		}
	}

	/**
	 * Get the deep type name that defines a Map, WeakMap, or a discord.js' Collection.
	 * @since 0.5.0
	 * @param {(Map|WeakMap|external:Collection)} input The value to get the deep type from
	 * @param {string} [basic] The basic type
	 * @returns {string}
	 */
	static getDeepTypeMap(input, basic = Util.getTypeName(input)) {
		if (!(input instanceof Map || input instanceof WeakMap)) return basic;
		const typeKeys = new Set(),
			typeValues = new Set();
		for (const [key, value] of input) {
			const typeKey = Util.getDeepTypeName(key);
			if (!typeKeys.has(typeKey)) typeKeys.add(typeKey);
			const typeValue = Util.getDeepTypeName(value);
			if (!typeValues.has(typeValue)) typeValues.add(typeValue);
		}
		const typeK = typeKeys.size === 0 || typeKeys.has('any') ? 'any' : Array.from(typeKeys).sort().join(' | ');
		const typeV = typeValues.size === 0 || typeValues.has('any') ? 'any' : Array.from(typeValues).sort().join(' | ');

		return `${basic}<${typeK}, ${typeV}>`;
	}

	/**
	 * Get the deep type name that defines an Array, Set, or a WeakSet.
	 * @since 0.5.0
	 * @param {(Array|Set|WeakSet)} input The value to get the deep type from
	 * @param {string} [basic] The basic type
	 * @returns {string}
	 */
	static getDeepTypeSetOrArray(input, basic = Util.getTypeName(input)) {
		if (!(input instanceof Array || input instanceof Set || input instanceof WeakSet)) return basic;
		const types = new Set();
		for (const value of input) {
			const type = Util.getDeepTypeName(value);
			if (!types.has(type)) types.add(type);
		}
		const typeV = types.size === 0 || types.has('Object') ? 'any' : Array.from(types).sort().join(' | ');

		return `${basic}<${typeV}>`;
	}

	/**
	 * Get the deep type name that defines a Proxy.
	 * @since 0.5.0
	 * @param {Proxy} input The value to get the deep type from
	 * @returns {string}
	 */
	static getDeepTypeProxy(input) {
		const proxy = process.binding('util').getProxyDetails(input);
		if (proxy) return `Proxy<${Util.getDeepTypeName(proxy)}>`;
		return 'any';
	}

	/**
	 * Try parse a stringified JSON string.
	 * @since 0.5.0
	 * @param {string} value The value to parse
	 * @returns {*}
	 */
	static tryParse(value) {
		try {
			return JSON.parse(value);
		} catch (err) {
			return value;
		}
	}

	/**
	 * Turn a dotted path into a json object.
	 * @since 0.5.0
	 * @param {string} path The dotted path
	 * @param {*} value The value
	 * @returns {*}
	 */
	static makeObject(path, value) {
		if (path.indexOf('.') === -1) return { [path]: value };
		const object = {};
		const route = path.split('.');
		const lastKey = route.pop();
		let reference = object;
		for (const key of route) reference = reference[key] = {};
		reference[lastKey] = value;
		return object;
	}

	/**
	 * Sets default properties on an object that aren't already specified.
	 * @since 0.5.0
	 * @param {Object} def Default properties
	 * @param {Object} [given] Object to assign defaults to
	 * @returns {Object}
	 * @private
	 */
	static mergeDefault(def, given) {
		if (!given) return def;
		for (const key in def) {
			if (!has(given, key) || given[key] === undefined) {
				given[key] = def[key];
			} else if (given[key] === Object(given[key])) {
				given[key] = Util.mergeDefault(def[key], given[key]);
			}
		}

		return given;
	}

}

/**
 * @typedef {Object} ExecOptions
 * @property {string} [cwd=process.cwd()] Current working directory of the child process
 * @property {Object} [env={}] Environment key-value pairs
 * @property {string} [encoding='utf8'] encoding to use
 * @property {string} [shell=os === unix ? '/bin/sh' : process.env.ComSpec] Shell to execute the command with
 * @property {number} [timeout=0]
 * @property {number} [maxBuffer=200*1024] Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated
 * @property {string|number} [killSignal='SIGTERM'] <string> | <integer> (Default: 'SIGTERM')
 * @property {number} [uid] Sets the user identity of the process
 * @property {number} [gid] Sets the group identity of the process
 * @memberof Util
 */

/**
 * Promisified version of child_process.exec for use with await
 * @since 0.3.0
 * @param {string} command The command to run
 * @param {ExecOptions} [options] The options to pass to exec
 * @returns {Promise<{ stdout: string, stderr: string }>}
 * @method
 * @static
 */
Util.exec = promisify(exec);

/**
 * Promisified version of setTimeout for use with await
 * @since 0.3.0
 * @param {number} delay The amount of time in ms to delay
 * @param {*} [args] Any args to pass to the .then (mostly pointless in this form)
 * @returns {Promise<*>} The args value passed in
 * @method
 * @static
 */
Util.sleep = promisify(setTimeout);

module.exports = Util;
