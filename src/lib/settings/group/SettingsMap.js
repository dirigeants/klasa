import { mapsStrictEquals } from '../../util/util';

const checkForTuples = (value) => Array.isArray(value) && value.length === 2;

class SettingsMap {

	constructor(entry) {
		Object.defineProperty(this, 'base', { value: null, writable: true });
		Object.defineProperty(this, 'entry', { value: entry });

		/**
		 * The data for this map
		 * @since 0.5.0
		 * @type {Map<any, any>}
		 */
		this.data = entry.default;
	}

	get gateway() {
		return this.base.gateway;
	}

	get(key) {
		if (key !== undefined && key !== null) {
			return this.data.get(key);
		}
		return new Map([...this.data.entries()]);
	}

	has(key) {
		return this.data.has(key);
	}

	async update(keyOrEntries, valueOrOptions, options) {
		const isArray = Array.isArray(keyOrEntries);
		if (isArray) {
			if (!keyOrEntries.every(checkForTuples)) throw `Expected an array of tuples as first argument, but it contains a non-tuple.`;
			options = valueOrOptions;
		}
		const guild = options && 'guild' in options ? options.guild : this.base.target;
		const entries = isArray ? entries : [[keyOrEntries, valueOrOptions]];

		const { clone } = await this._parse(clone, entries, guild);

		// The maps were already equal.
		if (mapsStrictEquals(this.data, clone)) return { errors: [], updated: [] };

		const updated = [{ key: this.entry.path, value: clone, entry: this.entry }];
		await this._save(updated);
		return { errors: [], updated };
	}

	async _parse(entries, guild) {
		const { entry } = this;
		const { serializer } = entry;
		const parsedEntries = await Promise.all(entries.map(async ([key, value]) => [key, serializer.serialize(await entry.parse(value, guild))]));
		const clone = this.get();

		for (const [key, value] of parsedEntries) {
			if (!clone.delete(key)) clone.set(key, value);
		}

		return { clone };
	}

	async _save(results) {
		const status = this.base.existenceStatus;
		if (status === null) throw new Error('Cannot update out of sync.');

		// Update DB

		this._patch(results[0].value);
	}

	toJSON() {
		return [...this.data.entries()];
	}

	_patch(data) {
		if (Array.isArray(data) && data.every(checkForTuples)) {
			this.data = data.length ? new Map(data) : this.entry.default;
		} else if (data instanceof Map) {
			this.data = data.size ? new Map([...data.entries()]) : this.entry.default;
		}
	}

}

module.exports = SettingsMap;
