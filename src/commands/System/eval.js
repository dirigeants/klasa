const now = require('performance-now');
const { MessageAttachment } = require('discord.js');
const { Command, util: { sleep } } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			description: 'Evaluates arbitrary JavaScript. Reserved for bot owner.',
			usage: '<expression:str>'
		});

		// The depth to inspect the evaled output to, if it's not a string
		this.inspectionDepth = 0;
		// this.getTypeStr shouldn't recurse more than once, but just in case
		this.typeRecursionLimit = 2;
		// How long to wait for promises to resolve
		this.timeout = 10000;
	}

	async run(msg, [code]) {
		try {
			const [evaled, topLine] = await this.handleEval(code, msg);

			if (this.isTooLong(evaled, topLine)) {
				// Upload as a file attachment and send to channel
				return msg.channel.send(`\`${topLine}\``, new MessageAttachment(Buffer.from(`// ${topLine}\n${evaled}`), 'eval.js'));
			}

			return msg.send(`\`${topLine}\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(evaled))}`);
		} catch (error) {
			if (error && error.stack) this.client.emit('error', error.stack);
			return msg.send(`\`ERROR\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(error))}`);
		}
	}

	/**
	 * Eval the code and get info on the type of the result
	 * @param {string} code The code obvs
	 * @param {DiscordMessage} msg The message, so it's available to the eval
	 * @returns {Array<string>}
	 */
	async handleEval(code, msg) { // eslint-disable-line no-unused-vars
		const start = now();
		const evaledOriginal = eval(code); // eslint-disable-line no-eval
		const syncEnd = now();
		const evaledTimeout = this.timeoutPromise(evaledOriginal, this.timeout);
		// Awaiting a non-promise returns the non-promise
		let evaledValue = await evaledTimeout;
		const asyncEnd = now();

		const evaledIsThenable = this.isThenable(evaledOriginal);

		// We're doing this checking here so it's not counted in the performance-now timeing
		// And if the promise timed out, just show the promise
		if (!evaledIsThenable || evaledValue instanceof TimeoutError) evaledValue = evaledOriginal;

		const time = evaledIsThenable ?
			`⏱${this.getNiceDuration(syncEnd - start)}<${this.getNiceDuration(asyncEnd - syncEnd)}>` :
			`⏱${this.getNiceDuration(syncEnd - start)}`;

		const topLine = `${await this.getTypeStr(
			evaledOriginal,
			evaledIsThenable ? evaledTimeout : null
		)} ${time}`;

		if (typeof evaledValue !== 'string') evaledValue = inspect(evaledValue, { depth: this.inspectionDepth });

		return [evaledValue, topLine];
	}

	/**
	 * Checks if the output will be more than 2,000 characters
	 * @param {string} evaled The evaled output (as a string)
	 * @param {string} topLine The line with the type and time info
	 * @returns {boolean}
	 */
	isTooLong(evaled, topLine) {
		// 1988 is 2000 - 12 (the chars that are added, "`...`\n```js\n...```")
		return evaled.length > 1988 - topLine.length;
	}

	/**
	 * Get the type string of the evaled result
	 * @param {*} value The value to get the type string for
	 * @param {?Promise} [awaitedPromise] The promise that was already `await`ed earlier; this also acts
	 *  as a surrogate, so that if the original promise was wrapped in a timeout promise, the original
	 *  promise can be examined, while the already-awaited surrogate is awaited
	 * @param {number} [i=0] Just an iteration count to prevent infinite loops
	 * @returns {string}
	 */
	async getTypeStr(value, awaitedPromise = null, i = 0) {
		if (value instanceof TimeoutError) return '?';

		const { basicType, type } = this.getComplexType(value);
		if (basicType === 'object') {
			if (this.isThenable(value)) {
				return i <= this.typeRecursionLimit ?
				// But we're gonna await the already-awaited promise, for efficiency
					`${type}<${await this.getTypeStr(await awaitedPromise, null, i + 1)}>` :
					`${type}<?>`;
			}
			if (Array.isArray(value)) return `${type}${this.getArrayType(value)}`;
			if (value instanceof Map) return `${type}${this.getMapType(value)}`;
			if (value instanceof Set) return `${type}${this.getSetType(value)}`;
			return `${type}${this.getObjectType(value)}`;
		}
		if (basicType === 'function') return `${type}${this.getFunctionType(value)}`;
		return type;
	}

	/**
	 * Get the type of value
	 * 
	 * A better version of the `typeof` operator, basically.
	 * @param {*} value The object or primitive whose type is to be returned
	 * @returns {string}
	 */
	getType(value) {
		if (value == null) return String(value); // eslint-disable-line eqeqeq
		return typeof value;
	}
	/**
	 * Get the class (constructor) name of value
	 * @param {*} value The object whose class name is to be returned
	 * @returns {string}
	 */
	getClass(value) {
		return value && value.constructor && value.constructor.name ?
			value.constructor.name :
			{}.toString.call(value).match(/\[object (\w+)\]/)[1];
	}
	/**
	 * Get the type info for value
	 * @param {*} value The object or primitive whose complex type is to be returned
	 * @returns {{basicType: string, type: string}}
	 */
	getComplexType(value) {
		const basicType = this.getType(value);
		if (basicType === 'object' || basicType === 'function') return { basicType, type: this.getClass(value) };
		return { basicType, type: basicType };
	}

	/**
	 * Get the arity of fn
	 * @param {Function} fn The function whose arity is to be returned
	 * @returns {string}
	 */
	getFunctionType(fn) {
		return `(${fn.length}-arity)`;
	}
	/**
	 * Get the type of array's elements
	 * @param {Array} array The array whose element type is to be returned
	 * @param {number} [i=0] Just an iteration count to prevent infinite loops
	 * @returns {string}
	 */
	getArrayType(array, i = 0) {
		return `<${this._getObjType(array, i)}>`;
	}
	/**
	 * Get the type of obj's elements
	 * @param {Object} obj The object whose element type is to be returned
	 * @param {number} [i=0] Just an iteration count to prevent infinite loops
	 * @returns {string}
	 */
	getObjectType(obj, i = 0) {
		const type = this._getObjType(Object.values(obj), i);
		return type.length > 0 ? `<${this.getComplexType('').type}, ${type}>` : '<>';
	}
	/**
	 * Get the type of map's values
	 * @param {Map} map The map whose value type is to be returned
	 * @param {number} [i=0] Just an iteration count to prevent infinite loops
	 * @returns {string}
	 */
	getMapType(map, i = 0) {
		const keyType = this._getObjType(Array.from(map.keys()), i);
		const valueType = this._getObjType(Array.from(map.values()), i);
		return valueType.length > 0 ? `<${keyType}, ${valueType}>` : '<>';
	}
	/**
	 * Get the type of set's values
	 * @param {Set} set The set whose value type is to be returned
	 * @param {number} [i=0] Just an iteration count to prevent infinite loops
	 * @returns {string}
	 */
	getSetType(set, i = 0) {
		return `<${this._getObjType(Array.from(set.values()), i)}>`;
	}
	/**
	 * Get the type of values's elements
	 * @param {Array} values The array whose element type is to be returned
	 * @param {number} i Just an iteration count to prevent infinite loops
	 * @returns {string}
	 */
	_getObjType(values, i) {
		if (!Array.isArray(values)) throw new TypeError("You're using this function wrong; `values` must be an array");
		if (typeof i !== 'number') throw new TypeError('`i` is missing');
		// Collections have useful methods, which work on Sets.
		const Coll = this.client.methods.Collection.prototype;

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
			if (i < this.typeRecursionLimit) {
				if (nestedType.basicType === 'object') {
					if (Array.isArray(value)) nestedTypeStr = this.getArrayType(value, i + 1);
					if (value instanceof Map) nestedTypeStr = this.getMapType(value, i + 1);
					if (value instanceof Set) nestedTypeStr = this.getSetType(value, i + 1);
					else nestedTypeStr = this.getObjectType(value, i + 1);
				} else if (nestedType.basicType === 'function') { nestedTypeStr = this.getFunctionType(value); }
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
	 * Present time duration in a nice way
	 * @param {number} time A duration in milliseconds
	 * @returns {string}
	 */
	getNiceDuration(time) {
		if (time >= 1000) return `${(time / 1000).toFixed(2)}s`;
		if (time >= 1) return `${time.toFixed(2)}ms`;
		return `${(time * 1000).toFixed(2)}μs`;
	}

	/**
	 * Determines whether the passed value is an Array
	 * @param {*} value The value to be checked
	 * @returns {boolean}
	 */
	isThenable(value) {
		return value && typeof value.then === 'function';
	}

	/**
	 * Wrap a promise in a promise that will timeout in a certain amount of time
	 * 
	 * Whichever promise (the inputted one or the timeout one) resolves first will have its value be
	 * the resolved value of the returned promise.
	 * @param {Promise} promise The promise to wrap
	 * @param {number} timeout How long the new promise should wait before timing out
	 * @returns {Promise}
	 */
	timeoutPromise(promise, timeout) {
		return Promise.race([promise, sleep(timeout, new TimeoutError('Promise timed out'))]);
	}

};

class TimeoutError extends Error {}
