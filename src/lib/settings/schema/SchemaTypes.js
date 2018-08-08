const SchemaType = require('../types/SchemaType');
const { isClass } = require('../../util/util');

/**
 * @since 0.5.0
 * @extends Map
 */
class SchemaTypes extends Map {

	add(name, Type) {
		name = name.toLowerCase();
		if (this.has(name)) throw new Error(`The type ${name} has already been added.`);

		// TypeScript compatibility
		if ('default' in Type) Type = Type.default;

		if (!isClass(Type)) throw new TypeError(`Failed to add type '${name}'. The exported structure is not a class.`);

		const type = new Type(this);
		if (!(type instanceof SchemaType)) throw new TypeError('The type you are trying to add does not extend the SchemaType class');
		this.set(name, type);
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
