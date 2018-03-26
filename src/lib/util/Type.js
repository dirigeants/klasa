const util = require('./util');

class Type {

	constructor(value, parent = null) {
		this.value = value;
		this.parent = parent;
		this.is = this._getTypeName();
		this.childKeys = new Map();
		this.childValues = new Map();
		this._getDeepTypeName();
	}

	async then(cb) {
		if (util.isThenable(this.value)) {
			try {
				await this.value.then(this.addValue.bind(this));
			} catch (err) {
				this.addValue(err);
			}
		}
		return cb(undefined);
	}

	get childTypes() {
		let retVal = '';
		if (this.childKeys.size) retVal += `${this.constructor.list(this.childKeys)}, `;
		return retVal + this.constructor.list(this.childValues);
	}

	addValue(value) {
		const child = new this.constructor(value, this);
		this.childValues.set(child.is, child);
	}

	addKey(key) {
		const child = new this.constructor(key, this);
		this.childKeys.set(child.is, child);
	}

	*parents() {
		// eslint-disable-next-line consistent-this
		let current = this;
		// eslint-disable-next-line no-cond-assign
		while (current = current.parent) yield current.parent;
	}

	isCircular() {
		for (const parent of this.parents()) if (parent && parent.value === this.value) return true;
		return false;
	}

	toString() {
		if (this.childValues.size) return `${this.is}<${this.childTypes}>`;
		return this.is;
	}

	/**
	 * Get the type name that defines the input.
	 * @since 0.5.0
	 * @returns {string}
	 * @private
	 */
	_getTypeName() {
		switch (typeof this.value) {
			case 'object': return this.value === null ? 'null' : this.value.constructor ? this.value.constructor.name : 'any';
			case 'function': return `${this.value.constructor.name}(${this.value.length}-arity)`;
			case 'undefined': return 'void';
			default: return typeof this.value;
		}
	}

	/**
	 * Get the deep type name that defines the input.
	 * @since 0.5.0
	 * @private
	 */
	_getDeepTypeName() {
		if (this.isCircular()) {
			this.is = `[circular:${this.is}]`;
		} else {
			switch (this.is) {
				case 'Map':
				case 'Collection':
				case 'WeakMap':
					this._getDeepTypeMap();
					break;
				case 'Set':
				case 'Array':
				case 'WeakSet':
					this._getDeepTypeSetOrArray();
					break;
				case 'Proxy':
					this._getDeepTypeProxy();
					break;
				case 'Object':
					this.is = 'any';
			}
		}
	}

	/**
	 * Get the deep type name that defines a Map, WeakMap, or a discord.js' Collection.
	 * @since 0.5.0
	 * @private
	 */
	_getDeepTypeMap() {
		if (!(this.value instanceof Map || this.value instanceof WeakMap)) return;
		for (const [key, value] of this.value) {
			this.addKey(key);
			this.addValue(value);
		}
	}

	/**
	 * Get the deep type name that defines an Array, Set, or a WeakSet.
	 * @since 0.5.0
	 * @private
	 */
	_getDeepTypeSetOrArray() {
		if (!(Array.isArray(this.value) || this.value instanceof Set || this.value instanceof WeakSet)) return;
		for (const value of this.value) this.addValue(value);
	}

	/**
	 * Get the deep type name that defines a Proxy.
	 * @since 0.5.0
	 * @param {Proxy} input The value to get the deep type from
	 * @private
	 */
	_getDeepTypeProxy(input) {
		const proxy = process.binding('util').getProxyDetails(input);
		if (proxy) this.addValue(proxy);
		else this.is = 'any';
	}

	static list(values) {
		return values.has('any') ? 'any' : [...values.values()].sort().join(' | ');
	}

}

module.exports = Type;
