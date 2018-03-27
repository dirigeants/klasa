const util = require('./util');
const { getPromiseDetails } = process.binding('util');

/**
 * The class for checking Types
 */
class Type {

	/**
	 * @param {*} value The value to generate a deep Type of
	 * @param {Type} [parent] The parent value used in recursion
	 */
	constructor(value, parent = null) {
		/**
		 * The value to generate a deep Type of
		 * @since 0.5.0
		 * @type {*}
		 */
		this.value = value;

		/**
		 * The parent of this type
		 * @since 0.5.0
		 * @type {?Type}
		 */
		this.parent = parent;

		/**
		 * The shallow type of this
		 * @since 0.5.0
		 * @type {string}
		 */
		this.is = this.constructor.resolve(value);

		/**
		 * The child keys of this Type
		 * @since 0.5.0
		 * @type {Map}
		 */
		this.childKeys = new Map();

		/**
		 * The child values of this Type
		 * @since 0.5.0
		 * @type {Map}
		 */
		this.childValues = new Map();

		this._getDeepTypeName();
	}

	/**
	 * The type string for the children of this Type.
	 * @since 0.5.0
	 * @type {string}
	 * @readonly
	 * @private
	 */
	get childTypes() {
		if (!this.childValues.size) return '';
		return `<${(this.childKeys.size ? `${this.constructor.list(this.childKeys)}, ` : '') + this.constructor.list(this.childValues)}>`;
	}

	/**
	 * The subtype to create based on this.value's sub value.
	 * @since 0.5.0
	 * @param {*} value The sub value
	 * @private
	 */
	addValue(value) {
		const child = new this.constructor(value, this);
		this.childValues.set(child.is, child);
	}

	/**
	 * The subtype to create based on this.value's entries.
	 * @since 0.5.0
	 * @param {Array<string, *>} entry the entry
	 * @private
	 */
	addEntry([key, value]) {
		const child = new this.constructor(key, this);
		this.childKeys.set(child.is, child);
		this.addValue(value);
	}

	/**
	 * Checks if the value of this Type is a circular reference to any parent.
	 * @since 0.5.0
	 * @returns {boolean}
	 */
	isCircular() {
		for (const parent of this.parents()) if (parent.value === this.value) return true;
		return false;
	}

	/**
	 * Defines the toString behavior of Type.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return this.is + this.childTypes;
	}

	/**
	 * Walks the linked list backwards, for checking circulars.
	 * @since 0.5.0
	 * @yields {?Type}
	 * @private
	 */
	*parents() {
		// eslint-disable-next-line consistent-this
		let current = this;
		// eslint-disable-next-line no-cond-assign
		while (current = current.parent) yield current;
	}

	/**
	 * Get the deep type name that defines the input.
	 * @since 0.5.0
	 * @private
	 */
	_getDeepTypeName() {
		if (typeof this.value === 'object' && this.isCircular()) this.is = `[circular:${this.is}]`;
		else if (util.isThenable(this.value) && getPromiseDetails(this.value)[0]) this.addValue(getPromiseDetails(this.value)[1]);
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
		const type = typeof value;
		switch (type) {
			case 'object': return value === null ? 'null' : value.constructor ? value.constructor.name : 'any';
			case 'function': return `${value.constructor.name}(${value.length}-arity)`;
			case 'undefined': return 'void';
			default: return type;
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
