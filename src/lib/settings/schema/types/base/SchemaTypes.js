const SchemaType = require('./SchemaType');
const { isClass } = require('../../../../util/util');

/**
 * @since 0.5.0
 * @extends Map
 */
class SchemaTypes extends Map {

	/**
	 * @param {Array<Array<string, SchemaType>>} types Types to initialize this with
	 */
	constructor(types) {
		super();
		for (const [name, Type] of types) this.add(name, Type);
	}

	/**
	 * Add a new SchemaType to this map
	 * @since 0.5.0
	 * @param {string} name The name of the schema type to add
	 * @param {Function} Type A class that extends SchemaType to build
	 * @returns {this}
	 * @chainable
	 */
	add(name, Type) {
		name = name.toLowerCase();
		if (super.has(name)) throw new Error(`The type ${name} has already been added.`);

		// TypeScript compatibility
		if ('default' in Type) Type = Type.default;

		if (!isClass(Type)) throw new TypeError(`Failed to add type '${name}'. The exported structure is not a class.`);

		const type = new Type(this);
		if (!(type instanceof SchemaType)) throw new TypeError('The type you are trying to add does not extend the SchemaType class');
		this.set(name, type);
		return this;
	}

	/**
	 * Check the existence of the type in this map
	 * @since 0.5.0
	 * @param {string} name The name of the type to look for
	 * @returns {boolean}
	 */
	has(name) {
		return super.has(name.toLowerCase());
	}

	/**
	 * Get a type from this map
	 * @since 0.5.0
	 * @param {string} name The name of the type to get
	 * @returns {?SchemaType}
	 */
	get(name) {
		return super.get(name.toLowerCase());
	}

}

module.exports = SchemaTypes;
