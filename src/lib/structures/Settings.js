/**
 * The Settings class that stores the cache for each entry in SettingGateway.
 */
class Settings {

	/**
	 * @since 0.4.0
	 * @param {(Gateway|GatewaySQL)} manager The Gateway that manages this settings instance.
	 * @param {Object} data The data that is cached in this Settings instance.
	 */
	constructor(manager, data) {
		/**
		 * The Gateway that manages this Settings instance.
		 * @since 0.4.0
		 * @type {(Gateway|GatewaySQL)}
		 * @name Settings#manager
		 * @readonly
		 */
		Object.defineProperty(this, 'manager', { value: manager });

		/**
		 * The type of the Gateway.
		 * @since 0.4.0
		 * @type {string}
		 * @name Settings#type
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: manager.type });

		/**
		 * The ID that identifies this instance.
		 * @since 0.4.0
		 * @type {string}
		 * @name Settings#id
		 * @readonly
		 */
		Object.defineProperty(this, 'id', { value: data.id });

		const { schema } = this.manager;
		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			this[key] = this._merge(data[key], schema[key]);
		}
	}

	/**
	 * Update this entry.
	 * @since 0.4.0
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
	 * @since 0.4.0
	 * @returns {Promise<Settings>}
	 */
	async sync() {
		await this.manager.sync(this.id);
		return this;
	}

	/**
	 * Delete this entry from the database and cache.
	 * @since 0.4.0
	 * @returns {Promise<Settings>}
	 */
	async destroy() {
		await this.manager.deleteEntry(this.id);
		return this;
	}

	/**
	 * Returns a better string when an instance of this class gets stringified.
	 * @since 0.4.0
	 * @returns {string}
	 */
	toString() {
		return `Settings(${this.type}:${this.id})`;
	}

	/**
	 * The client this settings was created with.
	 * @since 0.4.0
	 * @type {KlasaClient}
	 * @readonly
	 */
	get client() {
		return this.manager.client;
	}

	/**
	 * Assign data to the settings.
	 * @since 0.4.0
	 * @param {Object} data The data contained in the group.
	 * @param {(Schema|SchemaPiece)} folder A Schema or a SchemaPiece instance.
	 * @returns {Object}
	 * @private
	 */
	_merge(data, folder) {
		if (folder.type === 'Folder') {
			for (let i = 0; i < folder.keyArray.length; i++) {
				const key = folder.keyArray[i];
				if (folder[key].type === 'Folder') data = this._merge(data[key] || {}, folder[key]);
				else if (typeof data[key] === 'undefined') data = folder[key].default;
			}
		} else if (typeof data === 'undefined') {
			// It's a SchemaPiece instance, so it has a property of 'key'.
			data = folder.default;
		}

		return data;
	}

}

module.exports = Settings;
