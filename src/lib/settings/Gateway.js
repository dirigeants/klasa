const GatewayStorage = require('./GatewayStorage');
const Configuration = require('./Configuration');
const SchemaPiece = require('./SchemaPiece');
const SchemaFolder = require('./SchemaFolder');
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
	 * @param {GatewayDriverRegisterOptions} options The options for this schema
	 */
	constructor(store, type, { provider }) {
		super(store.client, type, provider);

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
	 * @since 0.0.1
	 * @type {SettingResolver}
	 * @name Gateway#resolver
	 * @readonly
	 */
	get resolver() {
		return this.store.resolver;
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
			if (this._synced && this.schema.keyArray.length) configs.sync().catch(err => this.client.emit('error', err));
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
		let piece = this.schema;

		for (let i = 0; i < route.length; i++) {
			const currKey = route[i];
			if (!piece.has(currKey)) {
				if (!errors) return null;
				throw `The key ${route.slice(0, i + 1).join('.')} does not exist in the current schema.`;
			}

			piece = piece[currKey];

			// There is no more to iterate if the current piece is not a SchemaFolder
			if (piece.type !== 'Folder') break;
		}

		if (piece.type === 'Folder') {
			// If it's a Folder and a Piece is requested, throw
			if (requestPiece === true) {
				if (!errors) return null;
				const keys = avoidUnconfigurable ? piece.configurableKeys : [...piece.keys()];
				throw keys.length ? `Please, choose one of the following keys: '${keys.join('\', \'')}'` : `This group is not configurable.`;
			}
		} else if (requestPiece === false) {
			// Else it will always be a Piece, if a folder is requested, get parent
			piece = piece.parent;
		} else if (avoidUnconfigurable && !piece.configurable) {
			// If the Piece is unconfigurable and avoidUnconfigurable is requested, throw
			if (!errors) return null;
			throw `The key ${piece.path} is not configurable.`;
		}

		return { piece, route: piece.path.split('.') };
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
	 * Sync this shard's schema.
	 * @since 0.5.0
	 * @param {string[]} path The key's path
	 * @param {Object} data The data to insert
	 * @param {('add'|'delete'|'update')} action Whether the piece got added or removed
	 * @private
	 */
	async _shardSync(path, data, action) {
		if (!this.client.shard) return;
		const parsed = typeof data === 'string' ? JSON.parse(data) : data;
		let route = this.schema;
		const key = path.pop();
		for (const pt of path) route = route[pt];
		let piece;
		if (action === 'add') {
			piece = route._add(key, parsed, parsed.type === 'Folder' ? SchemaFolder : SchemaPiece);
		} else if (action === 'delete') {
			piece = route[key];
			delete route[key];
		} else {
			route[key]._patch(parsed);
		}
		await route.force(action, piece);
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
