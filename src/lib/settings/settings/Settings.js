const SettingsFolder = require('./SettingsFolder');

class Settings extends SettingsFolder {

	constructor(id, gateway) {
		super('');
		this.base = this;
		Object.defineProperty(this, 'id', { value: id, enumerable: true });
		Object.defineProperty(this, 'gateway', { value: gateway });
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
		return new this.constructor(this.gateway, this);
	}

	sync(force = this.existenceStatus === null) {
		// Await current sync status from the sync queue
		const syncStatus = this.gateway.syncMap.get(this);
		if (!force || syncStatus) return syncStatus || Promise.resolve(this);

		// If it's not currently synchronizing, create a new sync status for the sync queue
		const sync = this.gateway.provider.get(this.gateway.type, this.id).then(data => {
			this.existenceStatus = Boolean(data);
			if (data) this._patch(data);
			this.gateway.syncMap.delete(this);
			return this;
		});

		this.gateway.syncMap.set(this, sync);
		return sync;
	}

	async destroy() {
		await this.sync();
		if (this.existenceStatus) {
			await this.gateway.provider.delete(this.gateway.type, this.id);
			this.client.emit('settingsDeleteEntry', this);
		}
		return this;
	}

}

module.exports = Settings;
