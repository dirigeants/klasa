import { Cache } from '@klasa/cache';

import type { Client } from '@klasa/core';
import type { Gateway, GatewayJson } from './Gateway';

export class GatewayStore extends Cache<string, Gateway> {

	/**
	 * The client this GatewayDriver was created with.
	 * @since 0.6.0
	 */
	public readonly client: Client;

	/**
	 * Constructs a new instance of GatewayDriver.
	 * @param client The client that manages this instance
	 */
	public constructor(client: Client) {
		super();
		this.client = client;
	}

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
	 *     .register(new Gateway(client, 'moderations', { provider: 'postgres' }));
	 */
	public register(gateway: Gateway): this {
		this.set(gateway.name, gateway);
		return this;
	}

	/**
	 * Initializes all gateways.
	 */
	public async init(): Promise<void> {
		await Promise.all(this.map(gateway => gateway.init()));
	}

	/**
	 * The gateway driver with all serialized gateways.
	 */
	public toJSON(): GatewayDriverJson {
		return Object.fromEntries(this.map((value, key) => [key, value.toJSON()]));
	}

}

export type GatewayDriverJson = Record<string, GatewayJson>;
