import { RequestHandler, IdKeyed } from '@klasa/request-handler';
import { GatewayStorage, GatewayStorageOptions } from './GatewayStorage';
import { Settings } from '../Settings';
import { Cache } from '@klasa/cache';
import type { KlasaClient } from '../../Client';

export class Gateway extends GatewayStorage {

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

	public constructor(client: KlasaClient, name: string, options: GatewayStorageOptions = {}) {
		super(client, name, options);
		this.cache = (this.name in this.client) && (this.client[this.name as keyof KlasaClient] instanceof Map) ?
			this.client[this.name as keyof KlasaClient] as Map<string, ProxyMapEntry> :
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
			/* istanbul ignore next: Hard to coverage test the catch */
			settings.sync(true).catch(error => this.client.emit('wtf', error));
		}
		return settings;
	}

	/**
	 * Runs a synchronization task for the gateway.
	 */
	public async sync(): Promise<this> {
		await this.requestHandler.wait();
		return this;
	}

}

export interface ProxyMapEntry {
	settings: Settings;
}

export type ProxyMap = Map<string, ProxyMapEntry>;
