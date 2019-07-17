const { resolveGuild, arraysStrictEquals, isNumber } = require('../../util/util');
const Type = require('../../util/Type');

const checkForIndex = (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number';

class SettingsArray {

	constructor(entry) {
		Object.defineProperty(this, 'base', { value: null, writable: true });

		// The Entry this SettingArray refers to
		Object.defineProperty(this, 'entry', { value: entry });

		this.data = entry.default;
	}

	get gateway() {
		return this.base.gateway;
	}

	get(index) {
		if (index !== undefined && index !== null) {
			if (isNumber(index)) return this.data[index];
			throw new TypeError(`The value for index must be of type 'number'. Got: ${new Type(index)}`);
		}
		return this.data.slice();
	}

	includes(value) {
		return this.data.includes(value);
	}

	find(...args) {
		return this.data.slice().find(...args);
	}

	async update(values, options) {
		if (!Array.isArray(values)) values = [values];

		const guild = resolveGuild(this.base.gateway.client, 'guild' in options ? options.guild : this.base.target);
		const { entry } = this;
		let indexing = false;

		// Not sure of a better way to do this, come back at a later time
		if (values.some(checkForIndex)) {
			if (!values.every(checkForIndex)) throw 'Indexing found. You must only use straight indexing or no indexing, not a mixture of both.';
			indexing = true;
		}

		const { errors, clone } = await this._parse(values, options, guild, indexing);
		// This might need to be changed/adjusted to give the user better throw behavior.
		if (errors.length) throw { errors, updated: [] };
		if (arraysStrictEquals(this.data, clone)) return { errors: [], updated: [] };

		const result = [{ key: entry.path, value: clone, entry }];
		this._save(result);

		return { errors, updated: result };
	}

	async _parse(values, options, guild, indexing) {
		const { entry } = this;
		const { serializer: { serialize } } = entry;

		if (indexing) {
			values = await Promise.all(values.map(async ([i, v]) => [i, serialize(await entry.parse(v, guild))]));
		} else if (!Array.isArray(values)) {
			values = serialize(await entry.parse(values, guild));
		} else {
			values = await Promise.all(values.map(async val => serialize(await entry.parse(val, guild))));
		}

		const { action = 'auto' } = options;
		if (!indexing && action.toLowerCase() === 'overwrite') return values;

		const clone = this.get();

		// Errors are given back in the order that values were sent in
		const errors = [];

		// This value has an index paired with it
		if (indexing) {
			for (const val of values) {
				const [index, value] = val;
				if (clone.length === 0 && index > 0) {
					errors.push({ input: val, message: 'The current array is empty. The index must start at 0.' });
				} else if (index < 0 || index > clone.length + 1) {
					errors.push({ input: val, message: `The index ${index} is bigger than the current array. It must be a value in the range of 0..${clone.length + 1}.` });
				} else {
					clone[index] = value;
				}
			}
		} else if (action.toLowerCase() === 'auto') {
			for (const val of values) {
				const index = clone.indexOf(val);
				if (index === -1) clone.push(val);
				else clone.splice(index, 1);
			}
		} else if (action.toLowerCase() === 'add') {
			for (const val of values) {
				if (clone.includes(val)) errors.push({ input: val, message: `The value ${val} for the key ${entry.path} already exists.` });
				else clone.push(val);
			}
		} else if (action.toLowerCase() === 'remove') {
			for (const val of values) {
				const index = clone.indexOf(val);
				if (index === -1) errors.push({ input: val, message: `The value ${val} for the key ${entry.path} does not exist.` });
				else clone.splice(index, 1);
			}
		} else {
			throw `The "${action}" array action is not a valid SettingsUpdateArrayAction.`;
		}

		return { errors, clone };
	}

	async _save(results) {
		const status = this.base.existenceStatus;
		if (status === null) throw new Error('Cannot update out of sync.');

		// Update DB

		this._patch(results[0].value);
	}

	_patch(data) {
		if (!Array.isArray(data)) return;

		// Our Array was completely removed, so reset to schema default
		if (data.length === 0) this.data = this.entry.default;

		// Will probably be removed for a better option of only patching indexes that are updated or if new values are added (which would be denoted by index === -1)
		// For now, this will suffice
		this.data = [...data];
	}

	*keys() {
		yield* this.data.keys();
	}

	*values() {
		yield* this.data.values();
	}

	*entries() {
		yield* this.data.values();
	}

	*[Symbol.iterator]() {
		yield* this.values();
	}

}

module.exports = SettingsArray;
