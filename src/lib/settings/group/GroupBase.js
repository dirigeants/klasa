class GroupBase {

	constructor(entry) {
		Object.defineProperty(this, 'base', { value: null, writable: true });

		// The Entry this SettingArray refers to
		Object.defineProperty(this, 'entry', { value: entry });

		this.data = entry.default;
	}

	get gateway() {
		return this.base.gateway;
	}

	async _save(results) {
		const status = this.base.existenceStatus;
		if (status === null) throw new Error('Cannot update out of sync.');

		// Update DB

		this._patch(results[0].value);
	}

	*keys() {
		yield* this.data.keys();
	}

	*values() {
		yield* this.data.values();
	}

	*entries() {
		yield* this.data.entries();
	}

	*[Symbol.iterator]() {
		yield* this.data[Symbol.iterator]();
	}

	// This should work fine in all 3 cases
	toJSON() {
		return [...this[Symbol.iterator]()];
	}

}

module.exports = GroupBase;
