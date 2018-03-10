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
	}

	/**
	 * Set the datatype.
	 * @since 0.5.0
	 * @param {string} type The type to set
	 * @returns {this}
	 * @chainable
	 */
	setType(type) {
		type = type.toUpperCase();
		if (!(type in this.queryBuilder.types)) throw new TypeError('The type does not exist in this QueryBuilder.');
		this.type = type;
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

	toString() {
		if (!this.type) throw new TypeError('You cannot construct the QueryType without setting up the type.');
		return this.type.name +
			(this.notNull ? 'NOT NULL ' : '') +
			(this.unique ? 'UNIQUE ' : '') +
			(this.default !== null && !this.notNull ? `DEFAULT ${this.queryBuilder._parseValue(this.default)}` : '');
	}

}

module.exports = QueryType;
