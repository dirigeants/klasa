const util = require('./util');

/**
 * The class for checking Types
 */
class Type {

	/**
	 * @param {*} value The value to generate a deep Type of
	 * @param {Type} [parent] The parent value used in recursion
	 */
	constructor(value, parent) {
		/**
		 * The value to generate a deep Type of
		 * @type {*}
		 */
		this.value = value;

		/**
		 * The parent of this type
		 * @type {?Type}
		 */
		this.parent = parent;

		/**
		 * The shallow type of this
		 * @type {string}
		 */
		this.is = this.constructor.resolve(value);

		/**
		 * The child keys of this Type
		 * @type {Map}
		 */
		this.childKeys = new Map();

		/**
		 * The child values of this Type
		 * @type {Map}
		 */
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

	/**
	 * The type string for the children of this Type.
	 * @param {*} value The sub value
	 * @returns {string}
	 * @since 0.5.0
	 * @private
	 */
	get childTypes() {
		if (!this.childValues.size) return '';
		return `<${(this.childKeys.size ? `${this.constructor.list(this.childKeys)}, ` : '') + this.constructor.list(this.childValues)}>`;
	}

	/**
	 * The subtype to create based on this.value's sub value.
	 * @param {*} value The sub value
	 * @since 0.5.0
	 * @private
	 */
	addValue(value) {
		const child = new this.constructor(value, this);
		this.childValues.set(child.is, child);
	}

	/**
	 * The subtype to create based on this.value's entries.
	 * @param {Array<string, *>} entry the entry
	 * @since 0.5.0
	 * @private
	 */
	addEntry([key, value]) {
		const child = new this.constructor(key, this);
		this.childKeys.set(child.is, child);
		this.addValue(value);
	}

	/**
	 * Checks if the value of this Type is a circular reference to any parent.
	 * @returns {boolean}
	 * @since 0.5.0
	 */
	isCircular() {
		for (const parent of this.parents()) if (parent.value === this.value) return true;
		return false;
	}

	/**
	 * Defines the toString behavior of Type.
	 * @returns {string}
	 * @since 0.5.0
	 */
	toString() {
		return this.is + this.childTypes;
	}

	/**
	 * Walks the linked list backwards, for checking circulars.
	 * @yields {?Type}
	 * @since 0.5.0
	 * @private
	 */
	*parents() {
		// eslint-disable-next-line consistent-this
		let current = this;
		// eslint-disable-next-line no-cond-assign
		while (current = current.parent && current) yield current.parent;
	}

	/**
	 * Get the deep type name that defines the input.
	 * @since 0.5.0
	 * @private
	 */
	_getDeepTypeName() {
		if (typeof this.value === 'object' && this.isCircular()) this.is = `[circular:${this.is}]`;
		else if (this.value instanceof Map || this.value instanceof WeakMap) for (const entry of this.value) this.addEntry(entry);
		else if (Array.isArray(this.value) || this.value instanceof Set || this.value instanceof WeakSet) for (const value of this.value) this.addValue(value);
		else if (this.is === 'Object') this.is = 'any';
	}

	/**
	 * Resolves the type name that defines the input.
	 * @since 0.5.0
	 * @param {*} value The value to get the type name of.
	 * @returns {string}
	 */
	static resolve(value) {
		switch (typeof value) {
			case 'object': return value === null ? 'null' : value.constructor ? value.constructor.name : 'any';
			case 'function': return `${value.constructor.name}(${value.length}-arity)`;
			case 'undefined': return 'void';
			default: return typeof value;
		}
	}

	/**
	 * Joins the list of child types.
	 * @since 0.5.0
	 * @param {Map} values The values to list.
	 * @returns {string}
	 * @private
	 */
	static list(values) {
		return values.has('any') ? 'any' : [...values.values()].sort().join(' | ');
	}

}

module.exports = Type;
