const GatewayStorage = require('./GatewayStorage');
const Gateway = require('./Gateway');
const Type = require('../../util/Type');
const { Collection } = require('discord.js');

/**
 * <warning>GatewayDriver is a singleton, use {@link KlasaClient#gateways} instead.</warning>
 * Gateway's driver to make new instances of it, with the purpose to handle different databases simultaneously.
 */
class GatewayDriver extends Collection {

	/**
	 * @typedef {Object} GatewayDriverRegisterOptions
	 * @property {string} [provider = this.client.options.providers.default] The name of the provider to use
	 * @property {Schema} [schema] The schema to use for this gateway.
	 * @property {string|string[]|true} [syncArg] The sync args to pass to Gateway#sync during Gateway init
	 */

	/**
	 * @typedef {Object} GatewayDriverGuildsSchema
	 * @property {SchemaPieceOptions} prefix The per-guild's configurable prefix key
	 * @property {SchemaPieceOptions} language The per-guild's configurable language key
	 * @property {SchemaPieceOptions} disableNaturalPrefix The per-guild's configurable disableNaturalPrefix key
	 * @property {SchemaPieceOptions} disabledCommands The per-guild's configurable disabledCommands key
	 * @private
	 */

	/**
	 * @typedef {Object} GatewayDriverClientStorageSchema
	 * @property {SchemaPieceOptions} userBlacklist The client's configurable user blacklist key
	 * @property {SchemaPieceOptions} guildBlacklist The client's configurable guild blacklist key
	 * @property {SchemaPieceOptions} schedules The schedules where {@link ScheduledTask}s are stored at
	 * @private
	 */

	/**
	 * @since 0.3.0
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();

		/**
		 * The client this GatewayDriver was created with.
		 * @since 0.3.0
		 * @name GatewayDriver#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		// Setup default gateways and adjust client options as necessary
		const { guilds, users, clientStorage } = client.options.gateway;
		guilds.schema = 'schema' in guilds ? guilds.schema : client.constructor.defaultGuildSchema;
		users.schema = 'schema' in users ? users.schema : client.constructor.defaultUserSchema;
		clientStorage.schema = 'schema' in clientStorage ? clientStorage.schema : client.constructor.defaultClientSchema;

		const prefix = guilds.schema.get('prefix');
		const language = guilds.schema.get('language');

		if (!prefix || prefix.default === null) {
			guilds.schema.add('prefix', 'string', { array: Array.isArray(client.options.prefix), default: client.options.prefix });
		}

		if (!language || language.default === null) {
			guilds.schema.add('language', 'language', { default: client.options.language });
		}

		guilds.schema.add('disableNaturalPrefix', 'boolean', { configurable: Boolean(client.options.regexPrefix) });

		this
			.register(new Gateway(client, 'guilds', guilds))
			.register(new Gateway(client, 'users', users))
			.register(new Gateway(client, 'clientStorage', clientStorage));
	}


	/**
	 * Registers a new Gateway.
	 * @since 0.5.0
	 * @param {GatewayStorage} gateway The gateway to register
	 * @returns {this}
	 * @chainable
	 */
	register(gateway) {
		if (!(gateway instanceof GatewayStorage)) throw new TypeError(`You must pass a GatewayStorage instance, received: ${new Type(gateway)}`);
		if (!(gateway.name in this.client.options.gateways)) this.client.options.gateways[gateway.name] = {};
		this.set(gateway.name, gateway);
		return this;
	}

	/**
	 * Initializes all gateways from the queue
	 * @since 0.5.0
	 */
	async init() {
		await Promise.all([...this.values()].map(gateway => gateway.init()));
	}

	/**
	 * Sync all gateways
	 * @since 0.5.0
	 * @param {(string|string[])} [input] The arguments to pass to each Gateway#sync
	 * @returns {Promise<Array<Gateway>>}
	 */
	sync(input) {
		return Promise.all([...this].map(([key, gateway]) => gateway.sync(typeof input === 'undefined' ? this.client.options.gateways[key].syncArg : input)));
	}

	/**
	 * The GatewayDriver with all gateways, types and keys as JSON.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return {
			ready: this.ready,
			...Object.assign({}, [...this].map(([key, value]) => ({ [key]: value.toJSON() })))
		};
	}

	/**
	 * The stringified GatewayDriver with all the managed gateways.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `GatewayDriver(${[...this.keys()].join(', ')})`;
	}

}

module.exports = GatewayDriver;
