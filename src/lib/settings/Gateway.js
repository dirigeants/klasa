const GatewayStorage = require('./GatewayStorage');
const Settings = require('./Settings');
const { Collection, Guild, GuildChannel, Message } = require('discord.js');
const { getIdentifier } = require('../util/util');
const SatelliteStore = require('./cache/SatelliteStore');
const SettingsStore = require('./cache/SettingsStore');

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
	 * @typedef {Object} GatewayOptions
	 * @property {boolean} [satellite=false] Whether this Gateway's first cache level should be a SatelliteStore or not
	 * @property {Map} [datastore=new Collection()] The datastore to proxy
	 */

	/**
	 * @since 0.0.1
	 * @param {GatewayDriver} store The GatewayDriver instance which initiated this instance
	 * @param {string} type The name of this Gateway
	 * @param {GatewayOptions} schema The schema for this gateway
	 * @param {string} provider The provider's name for this gateway
	 * @param {GatewayOptions} [options={}] This gateway's options
	 */
	constructor(store, type, schema, provider, { satellite = false, datastore } = {}) {
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
		 * @type {SatelliteStore|SettingsStore}
		 */
		this.cache = satellite ? new SatelliteStore(datastore) : new SettingsStore(datastore);

		/**
		 * The synchronization queue for all Settings instances
		 * @since 0.5.0
		 * @type {external:Collection<string, Promise<Settings>>}
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
	 * The Settings that this class should make.
	 * @since 0.5.0
	 * @type {Settings}
	 * @readonly
	 * @private
	 */
	get Settings() {
		return Settings;
	}

	/**
	 * Create a new Settings for this gateway
	 * @since 0.5.0
	 * @param {string|string[]} id The id for this instance
	 * @param {Object<string, *>} [data={}] The data for this Settings instance
	 * @returns {Settings}
	 */
	create(id, data = {}) {
		const settings = new this.Settings(this, { id: typeof id === 'string' ? id : id.join('.'), ...data });
		if (this._synced) settings.sync();
		return settings;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Array<string>|string)} [input=Array<string>] An object containing a id property, like discord.js objects, or a string
	 * @returns {?(Gateway|Settings)}
	 */
	async sync(input = [...this.cache.keys()]) {
		if (Array.isArray(input)) {
			if (!this._synced) this._synced = true;
			const entries = await this.provider.getAll(this.type, input);
			for (const entry of entries) {
				if (!entry) continue;

				// Get the entry from the cache
				const cache = this.cache.get(entry.id);
				if (!cache) continue;

				cache._existsInDB = true;
				cache._patch(entry);
			}

			// Set all the remaining settings from unknown status in DB to not exists.
			for (const settings of this.cache.values()) if (settings._existsInDB === null) settings._existsInDB = false;
			return this;
		}

		const target = getIdentifier(input);
		if (!target) throw new TypeError('The selected target could not be resolved to a string.');

		const cache = this.cache.get(target);
		return cache ? cache.sync() : null;
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
			cache: this.cache.constructor.name,
			provider: this.providerName,
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
