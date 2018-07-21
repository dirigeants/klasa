const { promisify } = require('util');
const { exec } = require('child_process');
const zws = String.fromCharCode(8203);
let sensitivePattern;
const TOTITLECASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;
const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

/**
 * Contains static methods to be used throughout klasa
 */
class Util {

	/**
	 * @typedef {(string|*)} Stringable
	 */

	/**
	 * This class may not be initiated with new
	 * @since 0.0.1
	 * @throws {Error}
	 * @private
	 */
	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	/**
	 * Makes a codeblock markup string
	 * @since 0.0.1
	 * @param {string} lang The codeblock language
	 * @param {Stringable} expression The expression to be wrapped in the codeblock
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
		return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
	}

	/**
	 * Initializes the sensitive patterns for clean()
	 * @since 0.0.1
	 * @private
	 * @param {KlasaClient} client The Klasa client
	 */
	static initClean(client) {
		sensitivePattern = new RegExp(Util.regExpEsc(client.token), 'gi');
	}

	/**
	 * Converts a string to Title Case
	 * @since 0.0.1
	 * @param {string} str The string to title case
	 * @returns {string}
	 */
	static toTitleCase(str) {
		return str.replace(TOTITLECASE, (txt) => Util.titleCaseVariants[txt] || txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

	/**
	 * Cleans a string from regex injection
	 * @since 0.0.1
	 * @param {string} str The string to clean
	 * @returns {string}
	 */
	static regExpEsc(str) {
		return str.replace(REGEXPESC, '\\$&');
	}

	/**
	 * Splits up an array into chunks
	 * @since 0.5.0
	 * @param {any[]} entries The object to be merged
	 * @param {number} chunkSize The object to merge
	 * @returns {any[]}
	 */
	static chunk(entries, chunkSize) {
		if (!Array.isArray(entries)) throw new TypeError('entries is not an array.');
		if (!Number.isInteger(chunkSize)) throw new TypeError('chunkSize is not an integer.');
		const clone = entries.slice();
		const chunks = [];
		while (clone.length) chunks.push(clone.splice(0, chunkSize));
		return chunks;
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
	 * Deep clone a value
	 * @since 0.5.0
	 * @param {*} source The object to clone
	 * @returns {*}
	 */
	static deepClone(source) {
		// Check if it's a primitive (with exception of function and null, which is typeof object)
		if (source === null || Util.isPrimitive(source)) return source;
		if (Array.isArray(source)) {
			const output = [];
			for (const value of source) output.push(Util.deepClone(value));
			return output;
		}
		if (Util.isObject(source)) {
			const output = {};
			for (const [key, value] of Object.entries(source)) output[key] = Util.deepClone(value);
			return output;
		}
		if (source instanceof Map) {
			const output = new source.constructor();
			for (const [key, value] of source.entries()) output.set(key, Util.deepClone(value));
			return output;
		}
		if (source instanceof Set) {
			const output = new source.constructor();
			for (const value of source.values()) output.add(Util.deepClone(value));
			return output;
		}
		return source;
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
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class';
	}

	/**
	 * Verify if the input is an object literal (or class).
	 * @since 0.5.0
	 * @param {Object} input The object to verify
	 * @returns {boolean}
	 */
	static isObject(input) {
		return input && input.constructor === Object;
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
	 * Check whether a value is a primitive
	 * @since 0.5.0
	 * @param {*} value The value to check
	 * @returns {boolean}
	 */
	static isPrimitive(value) {
		return Util.PRIMITIVE_TYPES.includes(typeof value);
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
	 * Get the identifier of a value.
	 * @since 0.5.0
	 * @param {*} value The value to get the identifier from
	 * @returns {?(string|number|boolean)}
	 */
	static getIdentifier(value) {
		if (Util.isPrimitive(value)) return value;
		if (Util.isObject(value)) {
			if ('id' in value) return value.id;
			if ('name' in value) return value.name;
		}
		return null;
	}

	/**
	 * Turn a dotted path into a json object.
	 * @since 0.5.0
	 * @param {string} path The dotted path
	 * @param {*} value The value
	 * @param {Object<string, *>} [obj = {}] The object to edit
	 * @returns {*}
	 */
	static makeObject(path, value, obj = {}) {
		if (path.indexOf('.') === -1) {
			obj[path] = value;
		} else {
			const route = path.split('.');
			const lastKey = route.pop();
			let reference = obj;
			for (const key of route) {
				if (!reference[key]) reference[key] = {};
				reference = reference[key];
			}
			reference[lastKey] = value;
		}
		return obj;
	}

	/**
	 * Convert an object to a tuple
	 * @since 0.5.0
	 * @param {Object<string, *>} object The object to convert
	 * @param {{ keys: string[], values: any[] }} [entries={}] The initial entries
	 * @param {string} [prefix=''] The prefix for the key
	 * @returns {Array<Array<*>>}
	 */
	static objectToTuples(object, { keys = [], values = [] } = {}, prefix = '') {
		for (const key of Object.keys(object)) {
			if (Util.isObject(object[key])) {
				Util.objectToTuples(object[key], { keys, values }, `${prefix}${key}.`);
			} else {
				keys.push(`${prefix}${key}`);
				values.push(object[key]);
			}
		}
		return [keys, values];
	}

	/**
	 * Compare if both arrays are strictly equal
	 * @since 0.5.0
	 * @param {any[]} arr1 The first array to compare
	 * @param {any[]} arr2 The second array to compare
	 * @returns {boolean}
	 */
	static arraysStrictEquals(arr1, arr2) {
		if (arr1 === arr2) return true;
		if (arr1.length !== arr2.length) return false;

		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) return false;
		}
		return true;
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
		if (!given) return Util.deepClone(def);
		for (const key in def) {
			if (typeof given[key] === 'undefined') given[key] = Util.deepClone(def[key]);
			else if (Util.isObject(given[key])) given[key] = Util.mergeDefault(def[key], given[key]);
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
 * @property {number} [timeout=0] The maximum execution time
 * @property {number} [maxBuffer=200*1024] Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated
 * @property {string|number} [killSignal='SIGTERM'] The kill signal
 * @property {number} [uid] Sets the user identity of the process
 * @property {number} [gid] Sets the group identity of the process
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

/**
 * Object with certain title case variants for words
 * @since 0.5.0
 * @type {Object}
 * @static
 */
Util.titleCaseVariants = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

/**
 * The primitive types
 * @since 0.5.0
 * @type {string[]}
 * @static
 */
Util.PRIMITIVE_TYPES = ['string', 'bigint', 'number', 'boolean'];

module.exports = Util;
