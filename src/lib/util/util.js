const { promisify } = require('util');
const { exec } = require('child_process');
const zws = String.fromCharCode(8203);
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
	 * @param {string} str The string to titlecaseify
	 * @returns {string}
	 */
	static toTitleCase(str) {
		return str.replace(/[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

	/**
	 * Generates an error object used for argument reprompting
	 * @since 0.0.1
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
	 * @since 0.0.1
	 * @param {string} str The string to clean
	 * @returns {string}
	 */
	static regExpEsc(str) {
		return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	/**
	 * Applies an interface to a class|
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
	 * @since 0.5.0
	 * @param {Function} func The function to verify.
	 * @returns {boolean}
	 */
	static isFunction(func) {
		return typeof func === 'function';
	}

	/*
	 * Verify if a number is a finite number.
	 * @since 0.5.0
	 * @param {number} input The number to verify.
	 * @returns {boolean}
	 */
	static isNumber(input) {
		return typeof input === 'number' && !isNaN(input) && Number.isFinite(input);
	}

	/**
	 * Try parse a stringified JSON string.
	 * @since 0.5.0
	 * @param {string} value The value to parse.
	 * @returns {*}
	 */
	static tryParse(value) {
		try {
			return JSON.parse(value);
		} catch (err) {
			return value;
		}
	}

	/*
	 * Get the type of value. A better version of the `typeof` operator, basically
	 * @since 0.4.0
	 * @param {*} value The object or primitive whose type is to be returned
	 * @returns {string}
	 */
	static getType(value) {
		if (value == null) return String(value); // eslint-disable-line eqeqeq
		return typeof value;
	}

	/**
	 * Get the class (constructor) name of value
	 * @since 0.4.0
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
	 * @since 0.4.0
	 * @param {*} value The object or primitive whose complex type is to be returned
	 * @returns {{basicType: string, type: string}}
	 */
	static getComplexType(value) {
		const basicType = this.getType(value);
		if (basicType === 'object' || basicType === 'function') return { basicType, type: this.getClass(value) };
		return { basicType, type: basicType };
	}

	/**
	 * Determines whether the passed value is a promise
	 * @since 0.4.0
	 * @param {*} value The value to be checked.
	 * @returns {boolean}
	 */
	static isThenable(value) {
		return value && typeof value.then === 'function';
	}

	/**
	 * @typedef deepTypeOptions
	 * @property {number} depth The depth limit
	 * @property {number} wait How long to await promises (0 for no awaiting)
	 * @property {Promise} [surrogatePromise] The promise to await, if different from `value`;
	 *  this allows, e.g., a promise from `this.timeoutPromise` to be awaited instead of `value`
	 */

	/**
	 * @typedef deepType
	 * @property {"none"|"values"|"keys&values"|"arity"|"emptiness"|"unknown-depths"|"unknown-value"} has
	 * @property {string} [type] Not present if depth limit reached in previous recursion (`has` is "unknown-depths")
	 *  or if empty (`has` is "emptiness")
	 * @property {deepType} [keys] If present and `keys.has` is "unknown-depths", depth limit reached in current recursion
	 * @property {deepType} [values] If present and `values.has` is "unknown-depths", depth limit reached in current recursion
	 * @property {?number} [arity] If present and `arity` is null, depth limit reached in current recursion
	 */

	/**
	 * Returns the deep type of `value`, as a JSDoc-like string
	 * @since 0.4.0
	 * @param {*} value The value to get the deep type of
	 * @param {deepTypeOptions} options Options
	 * @returns {Promise<string>}
	 */
	static async getJSDocString(value, options) {
		return Util.deepTypeToJSDoc(await Util.getDeepType(value, options));
	}

	/**
	 * Takes a deep type object and returns a JSDoc-like string representation of it
	 * @since 0.4.0
	 * @private
	 * @param {deepType} deepType The deep type to parse
	 * @returns {string}
	 */
	static deepTypeToJSDoc(deepType) {
		return {
			none: () => deepType.type,
			values: () => {
				if (deepType.values.has === 'emptiness') return `${deepType.type}<>`;
				if (deepType.values.has === 'unknown-depths') return deepType.type;
				if (deepType.values.has === 'unknown-value') return `${deepType.type}<?>`;
				return `${deepType.type}<${Util.deepTypeToJSDoc(deepType.values)}>`;
			},
			'keys&values': () => {
				if (deepType.values.has === 'emptiness') return `${deepType.type}<>`;
				if (deepType.values.has === 'unknown-depths') return deepType.type;
				if (deepType.values.has === 'unknown-value') {
					console.error(`I didn't think this could happen.${deepType.keys.has === 'unknown-value' ? ' deepType.keys.has is also "unknown-value".' : ''}`);
					return `${deepType.type}<?, ?>`;
				}
				return `${deepType.type}<${Util.deepTypeToJSDoc(deepType.keys)}, ${Util.deepTypeToJSDoc(deepType.values)}>`;
			},
			arity: () => {
				if (deepType.arity === null) return deepType.type;
				return deepType.arity > 0 ?
					`${deepType.type}(${deepType.arity})` :
					`${deepType.type}()`;
			}
		}[deepType.has]();
	}

	/**
	 * Returns the deep type of `value`, as nested objects
	 * @since 0.4.0
	 * @param {*} value The value to get the deep type of
	 * @param {deepTypeOptions} options Options
	 * @returns {Promise<deepType>}
	 */
	static async getDeepType(value, options) {
		if (!options) throw new TypeError('`options` is a required argument');
		if (typeof options.depth !== 'number') throw new TypeError('`options.depth` is a required argument');
		if (typeof options.wait !== 'number') throw new TypeError('`options.wait` is a required argument');

		const valuelessObjects = [Error, Date];
		const newOptions = Object.assign({}, options, { depth: options.depth - 1 });
		const recur = val => Util.getDeepType(val, newOptions);

		const { type, basicType } = Util.getComplexType(value);
		// I'm not sure if syntax exists to name a function/class like this, but might as well do a sanity check
		if (type === '*' || type[0] === '?') throw new TypeError('ffs, why would you name a class or function that?!');

		const deepType = { has: 'none', type };

		if (basicType === 'object' && !valuelessObjects.some(klass => value instanceof klass)) {
			if (Util.isThenable(value) || Array.isArray(value) || value instanceof Set) {
				// Objects whose values should be displayed
				await Util._getDeepTypeValuedObj(recur, deepType, value, options);
			} else {
				// Objects whose keys and values should be displayed
				await Util._getDeepTypeKeyedObject(recur, deepType, value, options);
			}
		} else if (basicType === 'function') {
			// Callable objects will just have their arity displayed
			await Util._getDeepTypeFn(recur, deepType, value, options);
		}

		return deepType;
	}

	/**
	 * @since 0.2.0
	 * @private
	 * @param {Function} recur The function to call to continue recursion
	 * @param {deepType} deepType The deep type to mutate
	 * @param {Promise|Array|Set} value The value to get the deep type of
	 * @param {deepTypeOptions} options Options
	 */
	static async _getDeepTypeValuedObj(recur, deepType, value, options) {
		// Objects whose values should be displayed

		deepType.has = 'values';

		if (options.depth < 1) {
			deepType.values = { has: 'unknown-depths' };
		} else if (Util.isThenable(value)) {
			const awaitedValue = await (options.surrogatePromise || Util.timeoutPromise(value, options.wait));
			deepType.values = awaitedValue instanceof Util.TimeoutError ?
				{ has: 'unknown-value' } :
				await recur(awaitedValue);
		} else if (Array.isArray(value)) {
			deepType.values = value.length === 0 ?
				{ has: 'emptiness' } :
				Util.mergeDeepTypeArray(await Promise.all(value.map(recur)));
		} else if (value instanceof Set) {
			deepType.values = value.size === 0 ?
				{ has: 'emptiness' } :
				Util.mergeDeepTypeArray(await Promise.all(Array.from(value.values()).map(recur)));
		}
	}

	/**
	 * @since 0.2.0
	 * @private
	 * @param {Function} recur The function to call to continue recursion
	 * @param {deepType} deepType The deep type to mutate
	 * @param {Map|Object} value The value to get the deep type of
	 * @param {deepTypeOptions} options Options
	 */
	static async _getDeepTypeKeyedObject(recur, deepType, value, options) {
		// Objects whose keys and values should be displayed

		deepType.has = 'keys&values';

		if (options.depth < 1) {
			deepType.keys = { has: 'unknown-depths' };
			deepType.values = { has: 'unknown-depths' };
		} else if (value instanceof Map) {
			if (value.size === 0) {
				deepType.keys = { has: 'emptiness' };
				deepType.values = { has: 'emptiness' };
			} else {
				deepType.keys = Util.mergeDeepTypeArray(await Promise.all(Array.from(value.keys()).map(recur)));
				deepType.values = Util.mergeDeepTypeArray(await Promise.all(Array.from(value.values()).map(recur)));
			}
			// Plain objects and others
		} else if (Object.keys(value).length === 0) {
			deepType.keys = { has: 'emptiness' };
			deepType.values = { has: 'emptiness' };
		} else {
			deepType.keys = Util.mergeDeepTypeArray(await Promise.all(Object.keys(value).map(recur)));
			deepType.values = Util.mergeDeepTypeArray(await Promise.all(Object.values(value).map(recur)));
		}
	}

	/**
	 * @since 0.2.0
	 * @private
	 * @param {Function} recur The function to call to continue recursion
	 * @param {deepType} deepType The deep type to mutate
	 * @param {Function} value The value to get the deep type of
	 * @param {deepTypeOptions} options Options
	 */
	static async _getDeepTypeFn(recur, deepType, value, options) {
		// Callable objects will just have their arity displayed
		deepType.has = 'arity';
		if (options.depth < 1) deepType.arity = null;
		else deepType.arity = value.length;
	}

	/**
	 * Reduce an array of deepType objects into a simgle one
	 * @since 0.4.0
	 * @private
	 * @param {Array<deepType>} deepTypes Array of the deep types of value's contents
	 * @returns {deepType} The merged deep type of value's contents
	 */
	static mergeDeepTypeArray(deepTypes) {
		if (deepTypes.length === 0) throw new TypeError('`deepTypes` cannot be empty');

		/**
  	 * @type {deepType}
  	 * `mergedDeepType._nullType` should be "", "null", "undefined", or "null|undefined" if it exists at all
  	 */
		const mergedDeepType = deepTypes.reduce(Util.mergeTwoDeepTypes);

		if (mergedDeepType._nullType) mergedDeepType.type = `?${mergedDeepType.type}`;
		delete mergedDeepType._nullType;

		return mergedDeepType;
	}

	/**
	 * Merges `b` into `a`, intelligently comparing their types
	 *
	 * Not guaranteed to modify `a` in-place. Use the return value.
	 * @since 0.4.0
	 * @private
	 * @param {deepType} a The first deep type (the target)
	 * @param {deepType} b The second deep type (the source)
	 * @returns {deepType}
	 */
	static mergeTwoDeepTypes(a, b) {
		if (['emptiness', 'unknown-depths', 'unknown-value'].indexOf(a.has) !== -1 || a.type === '*') return a;

		if (Util.nullOrUndefinedRE.test(b.type)) {
			if (!a._nullType) a._nullType = b.type;
			else if (a._nullType !== b.type) a._nullType = 'null|undefined';
		} else if (!a.type) {
			// Deep clone the object
			return JSON.parse(JSON.stringify(b));
		} else if (a.has === b.has && a.type === b.type) {
			({
				none: () => undefined,
				values: () => {
					a.values = Util.mergeTwoDeepTypes(a.values, b.values);
				},
				'keys&values': () => {
					a.keys = Util.mergeTwoDeepTypes(a.keys, b.keys);
					a.values = Util.mergeTwoDeepTypes(a.values, b.values);
				},
				arity: () => {
					if (a.arity !== b.arity) a.arity = null;
				}
			}[a.has])();
		} else {
			return { has: 'none', type: '*' };
		}

		if (!a.type) a.type = a._nullType;

		return a;
	}

	/**
	 * Wrap a promise in a promise that will timeout in a certain amount of time.
	 *
	 * Whichever promise (the inputted one or the timeout one) resolves first will have its value be
	 * the resolved value of the returned promise.
	 * @since 0.4.0
	 * @param {Promise} promise The promise to wrap.
	 * @param {number} timeout How long the new promise should wait before timing out.
	 * @returns {Promise}
	 */
	static timeoutPromise(promise, timeout) {
		return Promise.race([promise, this.sleep(timeout, new this.TimeoutError('Promise timed out'))]);
	}

}

/**
 * @typedef {Object} ExecOptions
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
 * @since 0.3.0
 * @param {string} command The command to run
 * @param {ExecOptions} [options] The options to pass to exec
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
Util.exec = promisify(exec);

/**
 * Promisified version of setTimeout for use with await
 * @method
 * @since 0.3.0
 * @param {number} delay The amount of time in ms to delay
 * @param {*} [args] Any args to pass to the .then (mostly pointless in this form)
 * @returns {Promise<*>} The args value passed in
 */
Util.sleep = promisify(setTimeout);

/**
 * Used to mark when a promise has timed out
 * @since 0.4.0
 */
Util.TimeoutError = class TimeoutError extends Error {};

/**
 * Test if string is exactly "null" or "undefined"
 * @since 0.4.0
 */
Util.nullOrUndefinedRE = /^null$|^undefined$/;

module.exports = Util;
