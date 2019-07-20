/**
 * The base class for group structs
 */
class GroupBase {

	/**
	 * @since 0.5.0
	 * @param {SchemaEntry} entry The schema entry that manages this instance
	 */
	constructor(entry) {
		/**
		 * The base that owns this instance's data
		 * @since 0.5.0
		 * @name GroupBase#base
		 * @type {?Settings}
		 */
		Object.defineProperty(this, 'base', { value: null, writable: true });

		/**
		 * The schema entry that manage this instance's metadata
		 * @since 0.5.0
		 * @name GroupBase#entry
		 * @type {SchemaEntry}
		 * @readonly
		 */
		Object.defineProperty(this, 'entry', { value: entry });

		/**
		 * The data this instance holds, it is initially initialized as the schema entry's default
		 * @since 0.5.0
		 * @type {*}
		 */
		this.data = entry.default;
	}

	/**
	 * The gateway that manages this instance's table
	 * @since 0.5.0
	 * @type {Gateway}
	 * @readonly
	 */
	get gateway() {
		return this.base.gateway;
	}

	/**
	 * The get method to be overwritten
	 * @since 0.5.0
	 * @param {*} key The key to be retrieved
	 * @abstract
	 */
	get() {
		// Defined in extension Classes
		throw new Error(`[GroupBase] Missing method 'update' of ${this.constructor.name}`);
	}

	/**
	 * The update method to be overwritten
	 * @since 0.5.0
	 * @param {...*} param The parameters to be passed
	 * @abstract
	 */
	update() {
		// Defined in extension Classes
		throw new Error(`[GroupBase] Missing method 'update' of ${this.constructor.name}`);
	}

	/**
	 * The _patch method to be overwritten
	 * @since 0.5.0
	 * @param {*} param The value to be updated
	 * @protected
	 * @abstract
	 */
	_patch() {
		// Defined in extension Classes
		throw new Error(`[GroupBase] Missing method 'update' of ${this.constructor.name}`);
	}

	/**
	 * Save the data to the database and patch the data.
	 * @since 0.5.0
	 * @param {Array<any[]>} results The data to save
	 * @protected
	 */
	async _save(results) {
		const status = this.base.existenceStatus;
		if (status === null) throw new Error('Cannot update out of sync.');

		// Update DB

		this._patch(results[0].value);
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element contained in this group.
	 * Similar to [Map#keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
	 * @since 0.5.0
	 * @yields {*}
	 */
	*keys() {
		yield* this.data.keys();
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this group.
	 * Similar to [Map#values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @since 0.5.0
	 * @yields {*}
	 */
	*values() {
		yield* this.data.values();
	}

	/**
	 * Returns a new Iterator object that contains the entries for each element contained in this group.
	 * Similar to [Map#entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @since 0.5.0
	 * @yields {*}
	 */
	*entries() {
		yield* this.data.entries();
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element contained in this group.
	 * Similar to [Map#[@@iterator]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator)
	 * or to [Array#[@@iterator]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator)
	 * @since 0.5.0
	 * @yields {*}
	 */
	*[Symbol.iterator]() {
		yield* this.data[Symbol.iterator]();
	}

	/**
	 * The serializable JSON array for storage in the database, it uses {@link GroupBase}'s `Symbol.iterator`.
	 * @since 0.5.0
	 * @returns {Array<*[]>}
	 */
	toJSON() {
		return [...this[Symbol.iterator]()];
	}

}

module.exports = GroupBase;
