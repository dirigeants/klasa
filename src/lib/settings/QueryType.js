class QueryType {

	/**
	 * Create a new instance of QueryType to create SQL constraints.
	 * @since 0.5.0
	 * @param {QueryBuilder} queryBuilder The QueryGuilder instance that manages this constraint creator
	 */
	constructor(queryBuilder) {
		/**
		 * The QueryBuilder instance that manages this constraint creator
		 * @type {QueryBuilder}
		 * @since 0.5.0
		 */
		this.queryBuilder = queryBuilder;

		/**
		 * The type of this key
		 * @type {?QueryBuilderType}
		 * @since 0.5.0
		 */
		this.type = null;

		/**
		 * The size or length for the type in fixed-variable types
		 * @type {?number}
		 * @since 0.5.0
		 */
		this.size = null;

		/**
		 * Whether this constraint is nullable
		 * @type {boolean}
		 * @since 0.5.0
		 */
		this.notNull = false;

		/**
		 * Whether this constraint is unique
		 * @type {boolean}
		 * @since 0.5.0
		 */
		this.unique = false;

		/**
		 * The default value for this key
		 * @type {*}
		 * @since 0.5.0
		 */
		this.default = null;

		/**
		 * Set this type to store an array
		 * @type {boolean}
		 * @since 0.5.0
		 */
		this.array = false;
	}

	/**
	 * Set the datatype.
	 * @since 0.5.0
	 * @param {string|string[]} type The type to set
	 * @param {number} [size] The size for variable-length types
	 * @returns {this}
	 * @chainable
	 */
	setType(type, size = null) {
		if (Array.isArray(type)) {
			for (let i = 0; i < type.length; i++) {
				const typename = type[i].toUpperCase();
				if (!(typename in this.queryBuilder.types)) continue;
				this.type = this.queryBuilder.types[typename];
				if (this.type.size !== null) this.size = size;
				return this;
			}
			throw new TypeError(`None of the datatypes (${type.join(' | ')}) are supported.`);
		}
		type = type.toUpperCase();
		if (!(type in this.queryBuilder.types)) throw new TypeError(`The datatype ${type} is not supported by this QueryBuilder.`);
		this.type = this.queryBuilder.types[type];
		if (this.type.size !== null) this.size = size;
		return this;
	}

	/**
	 * Set whether this constraint can be nullable.
	 * @since 0.5.0
	 * @param {boolean} [notNull = true] Whether this constraint should be nullable
	 * @returns {this}
	 * @chainable
	 */
	setNotNull(notNull = true) {
		this.notNull = notNull;
		return this;
	}

	/**
	 * Set whether this constraint is unique.
	 * @since 0.5.0
	 * @param {boolean} [unique = true] Whether this constraint should be unique
	 * @returns {this}
	 * @chainable
	 */
	setUnique(unique = true) {
		this.unique = unique;
		return this;
	}

	/**
	 * Set the default value for this constraint.
	 * @since 0.5.0
	 * @param {*} value The default value for this constraint
	 * @returns {this}
	 * @chainable
	 */
	setDefault(value) {
		this.default = value;
		return this;
	}

	/**
	 * Set whether this datatype should be stored as an array.
	 * @since 0.5.0
	 * @returns {this}
	 * @chainable
	 */
	setArray() {
		this.array = Boolean(this.queryBuilder.arrayWrap);
		return this;
	}

	toString() {
		if (!this.type) throw new TypeError('You cannot construct the QueryType without setting up the type.');
		return this.array ? this.queryBuilder.arrayWrap(this.type.name) : this.type.name +
			(this.size !== null ? `(${this.size}) ` : ' ') +
			(this.notNull ? 'NOT NULL ' : '') +
			(this.unique ? 'UNIQUE ' : '') +
			(this.default !== null && !this.notNull ? `DEFAULT ${this.queryBuilder._parseValue(this.default, this.type.name)}` : '');
	}

}

module.exports = QueryType;
