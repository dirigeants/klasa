const SettingGateway = require('./SettingGateway');
const SettingResolver = require('../parsers/SettingResolver');

/**
 * SettingGateway's driver to make new instances of it, with the purpose to handle different databases simultaneously.
 */
class SettingsCache {

	/**
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		/**
		 * The client this SettingsCache was created with.
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The resolver instance this SettingGateway uses to parse the data.
		 * @type {SettingResolver}
		 */
		this.resolver = new SettingResolver(client);

		/**
		 * The SettingGateway instance created to handle guild settings.
		 * @type {SettingGateway}
		 */
		this.guilds = new SettingGateway(this, 'guilds', this.validate.bind(null, this.resolver), this.defaultDataSchema);
	}

	/**
	 * Add a new instance of SettingGateway, with its own validateFunction and schema.
	 * @param {string} name The name for the new instance.
	 * @param {Function} validateFunction The function that validates the input.
	 * @param {Object} [schema={}] The schema.
	 * @returns {SettingGateway}
	 * @example
	 * // Add a new SettingGateway instance, called 'users', which input takes users, and stores a quote which is a string between 2 and 140 characters.
	 * const validate = async function(resolver, user) {
	 *	 const result = await resolver.user(user);
	 *	 if (!result) throw 'The parameter <User> expects either a User ID or a User Object.';
	 *	 return result;
	 * };
	 * const schema = {
	 *	 quote: {
	 *		 type: 'String',
	 *		 default: null,
	 *		 array: false,
	 *		 min: 2,
	 *		 max: 140,
	 *	 },
	 * };
	 * SettingsCache.add('users', validate, schema);
	 */
	async add(name, validateFunction, schema = {}) {
		if (!name || typeof name !== 'string') throw 'You must pass a name for your new gateway and it must be a string.';
		if (name in this) throw 'There is already a Gateway with that name.';
		if (typeof validateFunction !== 'function') throw 'You must pass a validate function.';
		validateFunction = validateFunction.bind(null, this.resolver);
		if (schema.constructor.name !== 'Object') throw 'Schema must be a valid object or left undefined for an empty object.';
		this[name] = new SettingGateway(this, name, validateFunction, schema);
		await this[name].init();
		return this[name];
	}

	/**
	 * The validator function Klasa uses for guild settings.
	 * @param {SettingResolver} resolver The resolver instance this SettingGateway uses to parse the data.
	 * @param {(Object|string)} guild The data to validate.
	 * @returns {any}
	 */
	async validate(resolver, guild) { // eslint-disable-line class-methods-use-this
		const result = await resolver.guild(guild);
		if (!result) throw 'The parameter <Guild> expects either a Guild ID or a Guild Object.';
		return result;
	}

	/**
	 * The data schema Klasa uses for guild settings.
	 * @readonly
	 * @returns {Object}
	 */
	get defaultDataSchema() {
		return {
			prefix: {
				type: 'String',
				default: this.client.config.prefix,
				array: this.client.config.prefix.constructor.name === 'Array',
				sql: `TEXT NOT NULL DEFAULT '${this.client.config.prefix.constructor.name === 'Array' ? JSON.stringify(this.client.config.prefix) : this.client.config.prefix}'`
			},
			language: {
				type: 'Language',
				default: this.client.config.language,
				array: false,
				sql: `TEXT NOT NULL DEFAULT '${this.client.config.language}'`
			},
			disabledCommands: {
				type: 'Command',
				default: [],
				array: true,
				sql: 'TEXT DEFAULT \'[]\''
			}
		};
	}

}

module.exports = SettingsCache;
