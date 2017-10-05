class SchemaPiece {

	constructor(client, manager, options, path, key) {
		Object.defineProperty(this, 'client', { value: client, enumerable: false });
		Object.defineProperty(this, 'manager', { value: manager, enumerable: false });
		Object.defineProperty(this, 'path', { value: path, enumerable: false });
		Object.defineProperty(this, 'key', { value: key, enumerable: false });

		this.configurable = typeof options.configurable !== 'undefined' ? options.configurable : true;
		this.type = options.type.toLowerCase();
		this.array = typeof options.array !== 'undefined' ? options.array : false;
		this.default = typeof options.default !== 'undefined' ? options.default : this.type === 'boolean' ? false : null;
		this.min = typeof options.min !== 'undefined' && isNaN(options.min) === false ? options.min : null;
		this.max = typeof options.max !== 'undefined' && isNaN(options.max) === false ? options.max : null;

		this.init();
	}

	sql(value = null) {
		if (typeof value.id !== 'undefined') value = value.id;
		return `'${this.path}' = ${this._parseSQLValue(value)}`;
	}

	_parseSQLValue(value) {
		const type = typeof value;
		if (type === 'boolean' || type === 'number' || value === null) return String(value);
		if (type === 'string') return `'${value.replace(/'/g, "''")}'`;
		if (type === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
		return '';
	}

	async parse(value, guild) {
		const data = await this.manager.resolver[this.type](value, guild, this.key, { min: this.min, max: this.max });
		return { data, sql: this.manager.sql ? this.sql(data && data.id ? data.id : data) : null };
	}

	getDefault() {
		return { data: this.default, sql: this.manager.sql ? this.sql(this.default) : null };
	}

	toJSON() {
		return {
			type: this.type,
			array: this.array,
			default: this.default,
			min: this.min,
			max: this.max
		};
	}

	init() {
		if (typeof this.type !== 'string') throw new TypeError(`[KEY] ${this.path} - Parameter type must be a string.`);
		if (typeof this.array !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter array must be a boolean.`);
		if (this.min !== null && typeof this.min !== 'number') throw new TypeError(`[KEY] ${this.path} - Parameter min must be a number or null.`);
		if (this.max !== null && typeof this.max !== 'number') throw new TypeError(`[KEY] ${this.path} - Parameter max must be a number or null.`);
		if (this.min !== null && this.max !== null && this.min > this.max) throw new TypeError(`[KEY] ${this.path} - Parameter min must contain a value lower than the parameter max.`);

		const value = [this.key, (this.type === 'integer' || this.type === 'float' ? 'INTEGER' : 'TEXT') +
				(this.default !== null ? ` DEFAULT ${this._parseSQLValue(this.default)}` : '')];

		Object.defineProperty(this, 'sqlSchema', { value, enumerable: false });
	}

	getSQL(array = null) {
		return array === null ? this.sqlSchema : array.push(this.sqlSchema);
	}

	getKeys(array = null) {
		return array === null ? this.path : array.push(this.path);
	}

	toString(value) {
		if (typeof value === 'undefined') return 'SchemaPiece';
		if (value === null) return 'Not set';
		switch (this.type) {
			case 'user': return `@${value.username}`;
			case 'textchannel':
			case 'voicechannel':
			case 'channel': return `#${value.name}`;
			case 'role': return `@${value.name}`;
			case 'guild':
			case 'command':
			case 'language': return value.name;
			default: return String(value);
		}
	}

}

module.exports = SchemaPiece;
