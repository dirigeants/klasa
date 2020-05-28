import { Cache } from '@klasa/cache';
import type { GatewayStorage, GatewayStorageJson } from './GatewayStorage';
import type { Client } from '@klasa/core';
export declare class GatewayDriver extends Cache<string, GatewayStorage> {
    /**
     * The client this GatewayDriver was created with.
     * @since 0.6.0
     */
    readonly client: Client;
    /**
     * Constructs a new instance of GatewayDriver.
     * @param client The client that manages this instance
     */
    constructor(client: Client);
    /**
     * Registers a new gateway.
     * @param gateway The gateway to register
     * @example
     * // Import Client and Gateway from klasa
     * const { Client, Gateway } = require('klasa');
     *
     * // Construct the client and register a gateway named channels
     * const client = new Client();
     * client.register(new Gateway(client, 'channels'));
     *
     * @example
     * // Import Client and Gateway from klasa
     * const { Client, Gateway } = require('klasa');
     * const client = new Client();
     *
     * // register calls can be chained
     * client
     *     .register(new Gateway(client, 'channels'))
     *     .register(new GatewayStorage(client, 'moderations', { provider: 'postgres' }));
     */
    register(gateway: GatewayStorage): this;
    /**
     * Initializes all gateways.
     */
    init(): Promise<void>;
    /**
     * The gateway driver with all serialized gateways.
     */
    toJSON(): GatewayDriverJson;
}
export declare type GatewayDriverJson = Record<string, GatewayStorageJson>;
