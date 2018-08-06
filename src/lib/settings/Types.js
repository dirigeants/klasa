const SchemaType = require('./types/Type');

class SchemaTypes extends Map {

	constructor(client) {
		super();
		Object.defineProperty(this, 'client', { value: client });
		this.add('boolean', require('./types/Boolean'))
			.add('channel', require('./types/Channel'))
			.add('textchannel', require('./types/Channel'))
			.add('voicechannel', require('./types/Channel'))
			.add('categorychannel', require('./types/Channel'))
			.add('guild', require('./types/Guild'))
			.add('number', require('./types/Number'))
			.add('integer', require('./types/Number'))
			.add('float', require('./types/Number'))
			.add('role', require('./types/Role'))
			.add('string', require('./types/String'))
			.add('url', require('./types/Url'))
			.add('user', require('./types/User'))
			.add('any', require('./types/Type'));
	}

	add(name, Type) {
		if (!(Type instanceof SchemaType)) throw new TypeError('The type you are trying to add does not extend the SchemaType class');
		name = name.toLowerCase();
		if (this.has(name)) throw new Error(`The type ${name} has already been added.`);
		this.set(name, new Type(this));
		return this;
	}

	get(name) {
		return super.get(name.toLowerCase());
	}

}

module.exports = SchemaTypes;
