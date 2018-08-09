const GatewayStorage = require('./GatewayStorage');
const Configuration = require('./Configuration');
const SchemaPiece = require('./schema/SchemaPiece');
const SchemaFolder = require('./schema/SchemaFolder');
const { Collection, Guild, GuildChannel, Message } = require('discord.js');
const { getIdentifier } = require('../util/util');

/**
 * <danger>You should never create a Gateway instance by yourself.
 * Please check {@link UnderstandingSettingsGateway} about how to construct your own Gateway.</danger>
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class Gateway extends GatewayStorage {

	/**
	 * @typedef {Object} GatewayGetPathOptions
	 * @property {boolean} [avoidUnconfigurable=false] Whether the getPath should avoid unconfigurable keys
	 * @property {boolean} [piece=true] Whether the getPath should return pieces or folders
	 */

	/**
	 * @typedef {Object} GatewayGetPathResult
	 * @property {SchemaPiece} piece The piece resolved from the path
	 * @property {string[]} route The resolved path split by dots
	 */

	/**
	 * @typedef {(KlasaGuild|KlasaMessage|external:GuildChannel)} GuildResolvable
	 */

	/**
	 * @typedef {Object} GatewayJSON
	 * @property {string} type The name of this gateway
	 * @property {GatewayDriverRegisterOptions} options The options for this gateway
	 * @property {Object} schema The current schema
	 */

	/**
	 * @since 0.0.1
	 * @param {GatewayDriver} store The GatewayDriver instance which initiated this instance
	 * @param {string} type The name of this Gateway
	 * @param {Schema} schema The schema for this gateway
	 * @param {string} provider The provider's name for this gateway
	 */
	constructor(store, type, schema, provider) {
		super(store.client, type, schema, provider);

		/**
		 * The GatewayDriver that manages this Gateway
		 * @since 0.0.1
		 * @type {GatewayDriver}
		 */
		this.store = store;

		/**
		 * The cached entries for this Gateway
		 * @since 0.0.1
		 * @type {external:Collection<string, Configuration>}
		 */
		this.cache = new Collection();

		/**
		 * The synchronization queue for all Configuration instances
		 * @since 0.5.0
		 * @type {external:Collection<string, Promise<Configuration>>}
		 */
		this.syncQueue = new Collection();

		/**
		 * @since 0.5.0
		 * @type {boolean}
		 * @private
		 */
		Object.defineProperty(this, '_synced', { value: false, writable: true });
	}

	/**
	 * The configuration that this class should make.
	 * @since 0.5.0
	 * @type {Configuration}
	 * @readonly
	 * @private
	 */
	get Configuration() {
		return Configuration;
	}


	/**
	 * Get an entry from the cache.
	 * @since 0.5.0
	 * @param {string} id The key to get from the cache
	 * @param {boolean} [create = false] Whether SG should create a new instance of Configuration in the background, if the entry does not already exist.
	 * @returns {?Configuration}
	 */
	get(id, create = false) {
		const entry = this.cache.get(id);
		if (entry) return entry;
		if (create) {
			const configs = new this.Configuration(this, { id });
			this.cache.set(id, configs);
			if (this._synced && this.schema.size) configs.sync().catch(err => this.client.emit('error', err));
			return configs;
		}
		return null;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Array<string>|string)} [input=Array<string>] An object containing a id property, like discord.js objects, or a string
	 * @returns {?(Gateway|Configuration)}
	 */
	async sync(input = [...this.cache.keys()]) {
		if (Array.isArray(input)) {
			if (!this._synced) this._synced = true;
			const entries = await this.provider.getAll(this.type, input);
			for (const entry of entries) {
				if (!entry) continue;
				const cache = this.cache.get(entry.id);
				if (cache) {
					if (!cache._existsInDB) cache._existsInDB = true;
					cache._patch(entry);
				} else {
					const configs = new this.Configuration(this, entry);
					configs._existsInDB = true;
					this.cache.set(entry.id, configs);
				}
			}

			// Set all the remaining configs from unknown status in DB to not exists.
			for (const configs of this.cache.values()) if (configs._existsInDB === null) configs._existsInDB = false;
			return this;
		}
		const target = getIdentifier(input);
		if (!target) throw new TypeError('The selected target could not be resolved to a string.');

		const cache = this.cache.get(target);
		if (cache) return cache.sync();

		const configs = new this.Configuration(this, { id: target });
		this.cache.set(target, configs);
		return configs.sync();
	}

	/**
	 * Resolve a path from a string.
	 * @since 0.5.0
	 * @param {string} [key=null] A string to resolve
	 * @param {GatewayGetPathOptions} [options={}] Whether the Gateway should avoid configuring the selected key
	 * @returns {?GatewayGetPathResult}
	 */
	getPath(key = '', { avoidUnconfigurable = false, piece: requestPiece = true, errors = true } = {}) {
		if (key === '' || key === '.') return { piece: this.schema, route: [] };
		const route = key.split('.');
		const piece = this.schema.get(route);

		// The piece does not exist (invalid or non-existant path)
		if (!piece) {
			if (!errors) return null;
			throw `The key ${key} does not exist in the schema.`;
		}

		if (requestPiece === null) requestPiece = piece.type !== 'Folder';

		// GetPath expects a piece
		if (requestPiece) {
			// The piece is a key
			if (piece.type !== 'Folder') {
				// If the Piece is unconfigurable and avoidUnconfigurable is requested, throw
				if (avoidUnconfigurable && !piece.configurable) {
					if (!errors) return null;
					throw `The key ${piece.path} is not configurable.`;
				}
				return { piece, route };
			}

			// The piece is a folder
			if (!errors) return null;
			const keys = avoidUnconfigurable ? piece.configurableKeys : [...piece.keys()];
			throw keys.length ? `Please, choose one of the following keys: '${keys.join('\', \'')}'` : 'This group is not configurable.';
		}

		// GetPath does not expect a piece
		if (piece.type !== 'Folder') {
			// Remove leading key from the path
			route.pop();
			return { piece: piece.parent, route };
		}

		return { piece, route };
	}

	/**
	 * Resolves a guild
	 * @since 0.5.0
	 * @param {GuildResolvable} guild A guild resolvable
	 * @returns {?KlasaGuild}
	 * @private
	 */
	_resolveGuild(guild) {
		const type = typeof guild;
		if (type === 'object' && guild !== null) {
			if (guild instanceof Guild) return guild;
			if ((guild instanceof GuildChannel) ||
				(guild instanceof Message)) return guild.guild;
		} else if (type === 'string' && /^\d{17,19}$/.test(guild)) {
			return this.client.guilds.get(guild) || null;
		}
		return null;
	}

	/**
	 * Get a JSON object containing the schema and options.
	 * @since 0.5.0
	 * @returns {GatewayJSON}
	 */
	toJSON() {
		return {
			type: this.type,
			options: { provider: this.providerName },
			schema: this.schema.toJSON()
		};
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `Gateway(${this.type})`;
	}

}

module.exports = Gateway;
