const { isObject, objectToTuples, arraysStrictEquals, deepClone, toTitleCase } = require('../../util/util');
const Type = require('../../util/Type');

class SettingsFolder extends Map {

	constructor(schema) {
		super();
		this.base = null;
		Object.defineProperty(this, 'schema', { value: schema });
	}

	get gateway() {
		return this.base.gateway;
	}

	get(path) {
		return path.split('.').reduce((folder, key) => folder.get(key), this);
	}

	has(path) {
		return typeof this.get(path) !== 'undefined';
	}

	// eslint-disable-next-line complexity
	async reset(paths, { throwOnError, onlyConfigurable } = {}) {
		const status = this.base.existenceStatus;
		// If this entry is out of sync, sync it first
		if (status === null) await this.base.sync();
		// If this entry does not exist, it is not possible for it to have an entry reset
		if (status === false) return { errors: [], updated: [] };

		if (typeof paths === 'string') paths = [paths];
		else if (isObject(paths)) paths = objectToTuples(paths).map(tuple => tuple[0]);

		const errors = [];

		// Resolve schema values
		const values = [];
		const { schema } = this;
		for (const path of paths) {
			try {
				const piece = schema.get(path);
				if (!piece) throw `The key ${path} does not exist in the schema.`;
				if (piece.type === 'Folder') {
					const valuesLength = values.length;
					const prefixLength = this.schema.path ? this.schema.path.length + 1 : 0;
					// Recurse to all sub-pieces
					for (const value of piece.values(true)) {
						if (onlyConfigurable && !value.configurable) continue;
						values.push([value.path.slice(prefixLength), piece]);
					}
					if (values.length === valuesLength) throw 'This group is not configurable.';
				} else if (onlyConfigurable && !piece.configurable) {
					throw 'This group is not configurable.';
				} else {
					values.push([path, piece]);
				}
			} catch (error) {
				if (throwOnError) throw typeof error === 'string' ? new Error(error) : error;
				errors.push(error);
			}
		}

		// Queue updates
		const results = [];
		for (const [path, piece] of values) {
			if (piece.array ? arraysStrictEquals(this.get(path), piece.default) : this.get(path) === piece.default) continue;
			results.push({
				key: path,
				value: deepClone(piece.default),
				piece
			});
		}

		if (results.length) await this._save(results);
		return { errors, updated: results };
	}

	async update(paths, ...args) {
		let options;
		if (typeof paths === 'string') [paths, options] = [[paths, args[0]], args[1]];
		else if (isObject(paths)) [paths, options] = [objectToTuples(paths), args[0]];
		else [options] = args;

		const errors = [];

		// Resolve schema values
		const values = [];
		const promises = [];
		const { schema } = this;

		const onError = options.throwOnError ? (error) => { throw error; } : (error) => errors.push(error);
		for (const value of paths) {
			try {
				if (value.length !== 2) throw new TypeError(`Invalid value. Expected object, string or Array<[string, Schema | SchemaPiece | string]>. Got: ${new Type(value)}`);
				const piece = schema.get(value[0]);
				if (!piece) throw `The key ${piece} does not exist in the schema.`;
				if (piece.type === 'Folder') {
					const keys = options.onlyConfigurable ? piece.configurableKeys : [...piece.keys()];
					throw keys.length ? `Please, choose one of the following keys: '${keys.join('\', \'')}'` : 'This group is not configurable.';
				}
				if (!piece.array && Array.isArray(value[1])) {
					throw options.guild ?
						options.guild.language.get('SETTING_GATEWAY_KEY_NOT_ARRAY', value[0]) :
						`The path ${value[0]} does not store multiple values.`;
				}

				promises.push(this._parse(piece, value[0], value[1], options)
					.then((parsed) => values.push([piece.path, parsed, piece]))
					.catch(onError));
			} catch (error) {
				if (options.throwOnError) throw error;
				errors.push(error);
			}
		}

		// Run all the operations
		if (promises.length) await Promise.all(promises);

		// Queue updates
		const results = [];
		for (const [path, value, piece] of values) {
			if (piece.array ? arraysStrictEquals(value, piece.default) : value === piece.default) continue;
			results.push({
				key: path,
				value: deepClone(piece.default),
				piece
			});
		}

		if (results.length) await this._save(results);
		return { errors, updated: results };
	}

	display(message, path) {
		const piece = path ? this.schema.get(path) : this;

		if (piece.type !== 'Folder') {
			const value = path ? this.get(path) : this;
			if (value === null) return 'Not set';
			if (piece.array) return value.length ? `[ ${value.map(val => piece.serializer.stringify(val, message)).join(' | ')} ]` : 'None';
			return piece.serializer.stringify(value, message);
		}

		const array = [];
		const folders = [];
		const sections = new Map();
		let longest = 0;
		for (const [key, value] of piece.entries()) {
			if (value.type === 'Folder') {
				if (value.configurableKeys.length) folders.push(`// ${key}`);
			} else if (value.configurable) {
				if (key.length > longest) longest = key.length;
				const values = sections.get(value.type) || [];
				if (!values.length) sections.set(value.type, values);
				values.push(key);
			}
		}
		if (folders.length) array.push('= Folders =', ...folders.sort(), '');
		if (sections.size) {
			for (const keyType of [...sections.keys()].sort()) {
				array.push(`= ${toTitleCase(keyType)}s =`,
					...sections.get(keyType).sort().map(key => `${key.padEnd(longest)} :: ${this.display(message, piece.get(key))}`),
					'');
			}
		}
		return array.join('\n');
	}

	async _save(results) {
		const status = this.base.existenceStatus;
		if (status === null) throw new Error('Cannot update out of sync.');
		if (status === false) {
			await this.gateway.provider.create(this.gateway.name, this.base.id, results);
			this.base.existenceStatus = true;
			this.client.emit('settingsCreateEntry', this.base);
		} else {
			await this.gateway.provider.update(this.gateway.type, this.id, results);
			this.client.emit('settingsUpdateEntry', this, results);
		}

		this._patch(Object.assign({}, ...results.map(res => ({ [res.key]: res.value }))));
	}

	async _parse(piece, key, value, options) {
		if (value === null) return deepClone(piece.default);

		const isArray = Array.isArray(value);
		if (isArray) value = await Promise.all(value.map(val => piece.parse(val, options.guild)));
		else value = await piece.parse(value, options.guild);

		if (!piece.array) return value;
		if (!isArray) value = [value];

		const { arrayAction = 'auto', arrayIndex = null } = options;
		if (arrayAction === 'overwrite') return value;

		const array = this.get(key);
		const clone = array.slice();
		if (arrayIndex !== null) {
			if (arrayIndex < 0 || arrayIndex > array.length + 1) {
				throw `The index ${arrayIndex} is bigger than the current array. It must be a value in the range of 0..${array.length + 1}.`;
			}
			[clone[arrayIndex]] = value;
		} else if (arrayAction === 'auto') {
			// Array action auto must add or remove values, depending on their existence
			for (const val of value) {
				const index = clone.indexOf(val);
				if (index === -1) clone.push(val);
				else clone.splice(index, 1);
			}
		} else if (arrayAction === 'add') {
			// Array action add must add values, throw on existent
			for (const val of value) {
				if (clone.includes(val)) throw `The value ${val} for the key ${piece.path} already exists.`;
				clone.push(val);
			}
		} else if (arrayAction === 'remove') {
			// Array action remove must add values, throw on non-existent
			for (const val of value) {
				const index = clone.indexOf(val);
				if (index === -1) throw `The value ${val} for the key ${piece.path} does not exist.`;
				clone.splice(index, 1);
			}
		} else {
			throw `The ${arrayAction} array action is not a valid SettingsUpdateArrayAction.`;
		}

		return clone;
	}

	_patch(data) {
		if (!isObject(data)) return;
		for (const [key, value] of Object.entries(data)) {
			// Undefined values are invalid values, skip
			if (typeof value === 'undefined') continue;
			const subkey = super.get(key);

			// If the key doesn't exist, it's not in this schema, skip
			if (typeof subkey === 'undefined') continue;

			// Patch recursively if the key is a folder, set otherwise
			if (subkey instanceof SettingsFolder) subkey._patch(value);
			else super.set(key, value);
		}
	}

	toJSON() {
		const object = {};
		for (const [key, value] of this.entries()) {
			object[key] = value instanceof SettingsFolder ? value.toJSON() : value;
		}

		return object;
	}

	toString() {
		return `Settings[${this.gateway.name}:${this.base.id}]`;
	}

}

module.exports = SettingsFolder;
