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
	 * Check whether this Settings is being synchronized in the Gateway's sync queue.
	 * @since 0.5.0
	 * @type {boolean}
	 */
	get synchronizing() {
		return this.gateway.syncMap.has(this);
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
	sync(force = this.existenceStatus === null) {
		// Await current sync status from the sync queue
		const syncStatus = this.gateway.syncMap.get(this);
		if (!force || syncStatus) return syncStatus || Promise.resolve(this);

		// If it's not currently synchronizing, create a new sync status for the sync queue
		const sync = this.gateway.provider.get(this.gateway.name, this.id).then(data => {
			this.existenceStatus = Boolean(data);
			if (data) {
				this._patch(data);
				this.gateway.client.emit('settingsSync', this);
			}
			this.gateway.syncMap.delete(this);
			return this;
		});

		this.gateway.syncMap.set(this, sync);
		return sync;
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
