const SettingsFolder = require('./SettingsFolder');

/**
 * The class that manages Settings
 * @extends SettingsFolder
 */
class Settings extends SettingsFolder {

	/**
	 * @since 0.5.0
	 * @param {Gateway} gateway The gateway that manages this settings instance
	 * @param {*} target The target that holds this instance
	 * @param {string} id The id of this entry
	 */
	constructor(gateway, target, id) {
		super(gateway.schema);

		/**
		 * The ID that identifies this instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name Settings#id
		 * @readonly
		 */
		Object.defineProperty(this, 'id', { value: id });

		/**
		 * The Gateway that manages this Settings instance.
		 * @since 0.5.0
		 * @type {Gateway}
		 * @name Settings#gateway
		 * @readonly
		 */
		Object.defineProperty(this, 'gateway', { value: gateway });

		/**
		 * The object that holds this instance
		 * @since 0.5.0
		 * @type {*}
		 * @name Settings#target
		 * @readonly
		 */
		Object.defineProperty(this, 'target', { value: target });

		/**
		 * Whether this entry exists in the DB or not, null if it's not synchronized.
		 * @since 0.5.0
		 * @type {?boolean}
		 * @name Settings#existenceStatus
		 * @private
		 */
		Object.defineProperty(this, 'existenceStatus', { value: null, writable: true });
		this.init(this, this.schema);
	}

	/**
	 * Clone this instance.
	 * @since 0.5.0
	 * @returns {Settings}
	 */
	clone() {
		const clone = new this.constructor(this.gateway, this.target, this.id);
		clone._patch(this.toJSON());
		return clone;
	}

	/**
	 * Sync the data from the database with the cache.
	 * @since 0.5.0
	 * @param {boolean} [force=false] Whether the sync should download from the database
	 * @returns {Promise<this>}
	 */
	async sync(force = this.existenceStatus === null) {
		// If not force and the instance has already been synchronized with the database, return this
		if (!force && this.existenceStatus !== null) return this;

		// Push a synchronization task to the request handler queue
		const data = await this.gateway.requestHandler.push(this.id);
		if (data) {
			this.existenceStatus = true;
			this._patch(data);
			this.gateway.client.emit('settingsSync', this);
		} else {
			this.existenceStatus = false;
		}

		return this;
	}

	/**
	 * Delete this entry from the database and cache.
	 * @since 0.5.0
	 * @returns {this}
	 */
	async destroy() {
		await this.sync();
		if (this.existenceStatus) {
			await this.gateway.provider.delete(this.gateway.name, this.id);
			this.gateway.client.emit('settingsDelete', this);
			this.init(this, this.schema);
			this.existenceStatus = false;
		}
		return this;
	}

}

module.exports = Settings;
