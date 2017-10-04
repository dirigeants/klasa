const SchemaPiece = require('./SchemaPiece');

class Schema {

	constructor(client, manager, object, path) {
		Object.defineProperty(this, 'client', { value: client, enumerable: false });
		Object.defineProperty(this, 'manager', { value: manager, enumerable: false });
		Object.defineProperty(this, 'path', { value: path, enumerable: false });
		Object.defineProperty(this, 'type', { value: 'Folder', enumerable: false });

		this.defaults = {};
		this.keys = new Set();

		this._patch(object);
	}

	has(key) {
		return typeof this[key] !== 'undefined';
	}

	async addKey(key, options = null, force = true) {
		if (typeof this[key] !== 'undefined') throw `The key ${key} already exists in the current schema.`;
		if (options === null) throw 'You must pass an options argument to this method.';
		if (typeof options.type !== 'string') throw 'The option type is required and must be a string.';
		options.type = options.type.toLowerCase();
		if (this.client.settings.types.includes(options.type) === false) throw `The type ${options.type} is not supported.`;
		if (typeof options.min !== 'undefined' && isNaN(options.min)) throw 'The option min must be a number.';
		if (typeof options.max !== 'undefined' && isNaN(options.max)) throw 'The option max must be a number.';
		if (typeof options.array !== 'undefined' && typeof options.array !== 'boolean') throw 'The option array must be a boolean.';

		if (options.array === true) {
			if (typeof options.default === 'undefined') options.default = [];
			else if (Array.isArray(options.default) === false) throw 'The option default must be an array if the array option is set to true.';
		} else {
			if (typeof options.default === 'undefined') options.default = options.type === 'boolean' ? false : null;
			options.array = false;
		}
		this._addKey(key, options);

		if (force) await this.force('add', key);
		return this.manager.schema;
	}

	_addKey(key, options) {
		this[key] = new SchemaPiece(this.client, this.manager, options, `${this.path}.${key}`, key);
		this.defaults[key] = options.default;

		if (this.manager.sql) this.manager.sql.addKey(key, options);
	}

	async removeKey(key, force = true) {
		if (this.keys.has(key) === false) throw `The key ${key} does not exist in the current schema.`;
		this._removeKey(key);

		if (force) await this.force('delete', key);
		return this.manager.schema;
	}

	_removeKey(key) {
		delete this[key];
		delete this.defaults[key];

		if (this.manager.sql) this.manager.sql.removeKey(key);
	}

	async force(action, key) {
		if (this.manager.sql) await this.manager.updateColumns(key);
		const data = await this.manager.cache.getAll(this.type);
		const value = action === 'add' ? this.defaults[key] : null;
		const path = this.path.split('.');

		return Promise.all(data.map(async (obj) => {
			let object = obj;
			for (let i = 0; i < path.length; i++) object = object[path[i]];
			if (action === 'delete') delete object[key];
			else object[key] = value;

			if (obj.id) return this.manager.provider.replace(this.type, obj.id, obj);
			return true;
		}));
	}

	toJSON() {
		return Object.assign({}, ...Array.from(this.keys).map(key => ({ [key]: this[key].toJSON() })));
	}

	getSQL(array = []) {
		return Array.from(this.keys).map(key => this[key].getSQL(array));
	}

	getKeys(array = []) {
		return Array.from(this.keys).map(key => this[key].getKeys(array));
	}

	_patch(object) {
		for (const key of Object.keys(object)) {
			if (typeof object[key] !== 'object') continue;
			if (object[key].type === 'Folder') {
				const folder = new Schema(this.client, object[key], `${this.path}.${key}`);
				this[key] = folder;
				this.defaults[key] = folder.defaults;
			} else {
				const piece = new SchemaPiece(this.client, this.manager, object[key], `${this.path}.${key}`, key);
				this[key] = piece;
				this.defaults[key] = piece.default;
			}
			this.keys.add(key);
		}
	}

}

module.exports = Schema;
