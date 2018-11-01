const { deepClone } = require('../../util/util');
const SettingsFolder = require('./SettingsFolder');

class Settings extends SettingsFolder {

	constructor(gateway, id) {
		super(gateway.schema);
		Object.defineProperty(this, 'id', { value: id, enumerable: true });
		Object.defineProperty(this, 'gateway', { value: gateway });
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
		return new this.constructor(this.gateway, this.id);
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

	init(folder, schema) {
		folder.base = this;
		for (const [key, value] of schema.entries()) {
			if (value.type === 'Folder') {
				const settings = new SettingsFolder(value);
				folder.set(key, settings);
				this.init(settings, value);
			} else {
				folder.set(key, deepClone(value));
			}
		}
	}

}

module.exports = Settings;
