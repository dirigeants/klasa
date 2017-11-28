/**
 * The Settings class that stores the cache for each entry in SettingGateway.
 */
class Settings {

	/**
	 * @since 0.5.0
	 * @param {(Gateway|GatewaySQL)} manager The Gateway that manages this settings instance.
	 * @param {Object} data The data that is cached in this Settings instance.
	 */
	constructor(manager, data) {
		/**
		 * The Gateway that manages this Settings instance.
		 * @since 0.5.0
		 * @type {(Gateway|GatewaySQL)}
		 * @name Settings#manager
		 * @readonly
		 */
		Object.defineProperty(this, 'manager', { value: manager });

		/**
		 * The type of the Gateway.
		 * @since 0.5.0
		 * @type {string}
		 * @name Settings#type
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: manager.type });

		/**
		 * The ID that identifies this instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name Settings#id
		 * @readonly
		 */
		Object.defineProperty(this, 'id', { value: data.id });

		const { schema } = this.manager;
		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			this[key] = Settings._merge(data[key], schema[key]);
		}
	}

	/**
	 * Get a value from the settings. Admits nested objects separating by comma.
	 * @param {string} key The key to get from this instance.
	 * @returns {any}
	 */
	get(key) {
		if (!key.includes('.')) {
			const value = this[key];
			if (value) return value;
			throw `The key ${key} does no exist in the configuration.`;
		}
		const path = key.split('.');
		let refSetting = this; // eslint-disable-line consistent-this
		let refSchema = this.manager.schema;
		for (let i = 0; i < path.length; i++) {
			const currKey = path[i];
			if (refSchema.type !== 'Folder' || !refSchema.hasKey(currKey)) throw `The key ${path.slice(0, i + 1)} does no exist in the configuration.`;
			refSetting = refSetting[currKey];
			refSchema = refSchema[currKey];
		}

		return refSetting;
	}

	/**
	 * Clone this instance.
	 * @since 0.5.0
	 * @returns {Settings}
	 */
	clone() {
		return new Settings(this.manager, Settings._clone(this, this.manager.schema));
	}

	/**
	 * Update this entry.
	 * @since 0.5.0
	 * @param {(string|Object)} key The key to update.
	 * @param {any} value The value for the key.
	 * @returns {Promise<Settings>}
	 * @example
	 * // Editing a single value
	 * // You can edit a single value in a very similar way to Gateway#updateOne.
	 * update('channels.modlogs', '340713281972862976');
	 *
	 * // However, you can also update it by passing an object (slower).
	 * update({ channels: { modlogs: '340713281972862976' } });
	 *
	 * // Editing multiple values
	 * // As Settings#update can also work as an alias of Gateway#updateMany, it also accepts an entire object with multiple values.
	 * update({ prefix: 'k!', roles: { administrator: '339959033937264641' } });
	 * @see {@link SettingGateway.updateOne}
	 * @see {@link SettingGateway.updateMany}
	 */
	async update(key, value) {
		if (typeof value === 'undefined' && typeof key === 'object') {
			await this.manager.updateMany(this.id, key);
		} else if (typeof key === 'string' && typeof value !== 'undefined') {
			await this.manager.updateOne(this.id, key, value);
		} else {
			throw new Error(`Expected an object as first parameter or a string and a non-undefined value. Got: ${typeof key} and ${typeof value}`);
		}

		return this;
	}

	/**
	 * Sync the data from the database with the cache.
	 * @since 0.5.0
	 * @returns {Promise<Settings>}
	 */
	async sync() {
		await this.manager.sync(this.id);
		return this;
	}

	/**
	 * Delete this entry from the database and cache.
	 * @since 0.5.0
	 * @returns {Promise<Settings>}
	 */
	async destroy() {
		await this.manager.deleteEntry(this.id);
		return this;
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return Settings._clone(this, this.manager.schema);
	}

	/**
	 * Returns a better string when an instance of this class gets stringified.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `Settings(${this.type}:${this.id})`;
	}

	/**
	 * The client this settings was created with.
	 * @since 0.5.0
	 * @type {KlasaClient}
	 * @readonly
	 */
	get client() {
		return this.manager.client;
	}

	/**
	 * Assign data to the settings.
	 * @since 0.5.0
	 * @param {Object} data The data contained in the group.
	 * @param {(Schema|SchemaPiece)} schema A Schema or a SchemaPiece instance.
	 * @returns {Object}
	 * @private
	 * @static
	 */
	static _merge(data, schema) {
		if (schema.type === 'Folder') {
			if (typeof data === 'undefined') data = {};
			for (let i = 0; i < schema.keyArray.length; i++) {
				const key = schema.keyArray[i];
				data[key] = Settings._merge(data[key], schema[key]);
			}
		} else if (typeof data === 'undefined') {
			// It's a SchemaPiece instance, so it has a property of 'key'.
			data = schema.default;
		}

		return data;
	}

	/**
	 * Clone settings.
	 * @since 0.5.0
	 * @param {Object} data The data to clone.
	 * @param {(Schema|SchemaPiece)} schema A Schema or a SchemaPiece instance.
	 * @returns {Object}
	 * @private
	 * @static
	 */
	static _clone(data, schema) {
		const clone = {};

		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			if (schema[key].type === 'Folder') {
				clone[key] = Settings._clone(data[key], schema[key]);
			} else {
				clone[key] = schema[key].array ? data[key].slice(0) : data[key];
			}
		}

		return clone;
	}

}

module.exports = Settings;
