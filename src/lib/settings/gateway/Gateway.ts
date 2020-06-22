import { RequestHandler, IdKeyed } from '@klasa/request-handler';
import { Cache } from '@klasa/cache';
import { Settings } from '../Settings';
import { Schema } from '../schema/Schema';

import type { Client } from '@klasa/core';
import type { Provider } from 'klasa';
import type { SchemaEntryJson } from '../schema/SchemaEntry';

export class Gateway {

	/**
	 * The client this gateway was created with.
	 */
	public readonly client: Client;

	/**
	 * The name of this gateway.
	 */
	public readonly name: string;

	/**
	 * The schema for this gateway.
	 */
	public readonly schema: Schema;

	/**
	 * The cached entries for this Gateway or the external datastore to get the settings from.
	 * @since 0.6.0
	 */
	public readonly cache: ProxyMap;

	/**
	 * The request handler that manages the synchronization queue.
	 * @since 0.6.0
	 */
	public readonly requestHandler: RequestHandler<string, IdKeyed<string>>;

	/**
	 * Whether or not this gateway has been initialized.
	 */
	public ready = false;

	/**
	 * The provider's name that manages this gateway.
	 */
	readonly #provider: string;

	public constructor(client: Client, name: string, options: GatewayOptions = {}) {
		this.client = client;
		this.name = name;
		this.schema = options.schema || new Schema();
		this.#provider = options.provider ?? client.options.providers.default;
		this.cache = (this.name in this.client) && (this.client[this.name as keyof Client] instanceof Map) ?
			this.client[this.name as keyof Client] as Map<string, ProxyMapEntry> :
			new Cache<string, ProxyMapEntry>();
		this.requestHandler = new RequestHandler(
			(id): Promise<IdKeyed<string>> => {
				const { provider } = this;
				return provider === null ?
					Promise.reject(new Error('Cannot run requests without a provider available.')) :
					provider.get(this.name, id) as Promise<IdKeyed<string>>;
			}, (ids): Promise<IdKeyed<string>[]> => {
				const { provider } = this;
				return provider === null ?
					Promise.reject(new Error('Cannot run requests without a provider available.')) :
					provider.getAll(this.name, ids) as Promise<IdKeyed<string>[]>;
			}
		);
	}

	/**
	 * Gets an entry from the cache or creates one if it does not exist
	 * @param target The target that holds a Settings instance of the holder for the new one
	 * @param id The settings' identificator
	 * @example
	 * // Retrieve a members gateway
	 * const gateway = this.client.gateways.get('members');
	 *
	 * // Acquire a settings instance belonging to a member
	 * gateway.acquire(message.member);
	 */
	public acquire(target: IdKeyed<string>, id = target.id): Settings {
		return this.get(id) || this.create(target, id);
	}

	/**
	 * Get an entry from the cache.
	 * @param id The key to get from the cache
	 * @example
	 * // Retrieve a members gateway
	 * const gateway = this.client.gateways.get('members');
	 *
	 * // Retrieve a settings instance belonging to a member's id
	 * const settings = gateway.get(someMemberID);
	 *
	 * // Do something with it, be careful as it can return null
	 * if (settings === null) {
	 *     // settings is null
	 * } else {
	 *     // console.log(settings);
	 * }
	 */
	public get(id: string): Settings | null {
		const entry = this.cache.get(id);
		return (entry && entry.settings) || null;
	}

	/**
	 * Create a new Settings instance for this gateway.
	 * @param target The target that will hold this instance alive
	 * @param id The settings' identificator
	 */
	public create(target: IdKeyed<string>, id = target.id): Settings {
		const settings = new Settings(this, target, id);
		if (this.schema.size !== 0) {
			// istanbul ignore next: Hard to coverage test the catch
			settings.sync(true).catch(error => this.client.emit('wtf', error));
		}
		return settings;
	}

	/**
	 * The provider that manages this gateway's persistent data.
	 */
	public get provider(): Provider | null {
		return this.client.providers.get(this.#provider) ?? null;
	}

	/**
	 * Initializes the gateway.
	 */
	public async init(): Promise<void> {
		// Gateways must not initialize twice.
		if (this.ready) throw new Error(`The gateway "${this.name}" has already been initialized.`);

		// Check the provider's existence.
		const { provider } = this;
		if (provider === null) throw new Error(`The gateway "${this.name}" could not find the provider "${this.#provider}".`);
		this.ready = true;

		const errors = [...this._initializeSchemaEntries(this.schema)];
		if (errors.length) throw new Error(`[SCHEMA] There is an error with your schema.\n${errors.join('\n')}`);

		// Initialize the defaults
		// eslint-disable-next-line dot-notation
		this.schema.defaults['_init']();

		// Init the table
		const hasTable = await provider.hasTable(this.name);
		if (!hasTable) await provider.createTable(this.name);

		// Add any missing columns (NoSQL providers return empty array)
		const columns = await provider.getColumns(this.name);
		if (columns.length) {
			const promises = [];
			for (const entry of this.schema.values()) {
				if (!columns.includes(entry.key)) promises.push(provider.addColumn(this.name, entry));
			}
			await Promise.all(promises);
		}

		await this.sync();
	}

	/**
	 * Runs a synchronization task for the gateway.
	 */
	public async sync(): Promise<this> {
		await this.requestHandler.wait();
		return this;
	}

	/**
	 * Get A JSON object containing the schema and the options.
	 */
	public toJSON(): GatewayJson {
		return {
			name: this.name,
			provider: this.#provider,
			schema: this.schema.toJSON()
		};
	}

	private *_initializeSchemaEntries(schema: Schema): IterableIterator<string> {
		// Iterate over all the schema's values
		for (const value of schema.values()) {
			// Set the client and check if it is valid, afterwards freeze,
			// otherwise delete it from its parent and yield error message
			value.client = this.client;
			try {
				value._check();
				Object.freeze(value);
			} catch (error) {
				// If errored, delete the key from its parent
				value.parent.delete(value.key);
				yield error.message;
			}
		}

		// Set the schema as ready
		schema.ready = true;
	}

}

export interface GatewayOptions {
	schema?: Schema;
	provider?: string;
}

export interface GatewayJson {
	name: string;
	provider: string;
	schema: Record<string, SchemaEntryJson>;
}

export interface ProxyMapEntry {
	settings: Settings;
}

export type ProxyMap = Map<string, ProxyMapEntry>;
