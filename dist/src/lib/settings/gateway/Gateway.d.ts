import { RequestHandler, IdKeyed } from '@klasa/request-handler';
import { GatewayStorage, GatewayStorageOptions } from './GatewayStorage';
import { Settings } from '../Settings';
import type { KlasaClient } from '../../Client';
export declare class Gateway extends GatewayStorage {
    /**
     * The cached entries for this Gateway or the external datastore to get the settings from.
     * @since 0.6.0
     */
    readonly cache: ProxyMap;
    /**
     * The request handler that manages the synchronization queue.
     * @since 0.6.0
     */
    readonly requestHandler: RequestHandler<string, IdKeyed<string>>;
    constructor(client: KlasaClient, name: string, options?: GatewayStorageOptions);
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
    acquire(target: IdKeyed<string>, id?: string): Settings;
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
    get(id: string): Settings | null;
    /**
     * Create a new Settings instance for this gateway.
     * @param target The target that will hold this instance alive
     * @param id The settings' identificator
     */
    create(target: IdKeyed<string>, id?: string): Settings;
    /**
     * Runs a synchronization task for the gateway.
     */
    sync(): Promise<this>;
}
export interface ProxyMapEntry {
    settings: Settings;
}
export declare type ProxyMap = Map<string, ProxyMapEntry>;
