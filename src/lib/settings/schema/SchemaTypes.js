const SchemaType = require('../types/Type');

/**
 * @since 0.5.0
 * @extends Map<string, SchemaType>
 */
class SchemaTypes extends Map {

	add(name, Type) {
		if (!(Type instanceof SchemaType)) throw new TypeError('The type you are trying to add does not extend the SchemaType class');
		name = name.toLowerCase();
		if (this.has(name)) throw new Error(`The type ${name} has already been added.`);
		this.set(name, new Type(this));
		return this;
	}

	has(name) {
		return super.has(name.toLowerCase());
	}

	get(name) {
		return super.get(name.toLowerCase());
	}


}

module.exports = SchemaTypes;
