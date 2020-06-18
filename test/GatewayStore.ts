import unknownTest, { TestInterface } from 'ava';
import { Cache } from '@klasa/cache';
import { createClient } from './lib/SettingsClient';
import {
	Gateway,
	GatewayStore,
	KlasaClient
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient
}>;

ava.beforeEach(async (test): Promise<void> => {
	test.context = {
		client: createClient()
	};
});

ava('GatewayDriver Properties', (test): void => {
	test.plan(3);

	const { client } = test.context;
	const gatewayDriver = new GatewayStore(client);

	test.true(gatewayDriver instanceof Cache);
	test.is(gatewayDriver.client, client);

	// No gateway is registered
	test.is(gatewayDriver.size, 0);
});

ava('GatewayDriver (From Client)', (test): void => {
	test.plan(6);

	const { client } = test.context;

	test.true(client.gateways instanceof Cache);
	test.is(client.gateways.client, client);

	// clientStorage, guilds, users
	test.is(client.gateways.size, 3);
	test.true(client.gateways.get('clientStorage') instanceof Gateway);
	test.true(client.gateways.get('guilds') instanceof Gateway);
	test.true(client.gateways.get('users') instanceof Gateway);
});

ava('GatewayDriver#register', (test): void => {
	test.plan(2);

	const client = createClient();
	const gateway = new Gateway(client, 'someCustomGateway');

	test.is(client.gateways.register(gateway), client.gateways);
	test.is(client.gateways.get('someCustomGateway'), gateway);
});

ava('GatewayDriver#init', async (test): Promise<void> => {
	test.plan(7);

	const client = createClient();

	test.false((client.gateways.get('guilds') as Gateway).ready);
	test.false((client.gateways.get('users') as Gateway).ready);
	test.false((client.gateways.get('clientStorage') as Gateway).ready);

	test.is(await client.gateways.init(), undefined);

	test.true((client.gateways.get('guilds') as Gateway).ready);
	test.true((client.gateways.get('users') as Gateway).ready);
	test.true((client.gateways.get('clientStorage') as Gateway).ready);
});

ava('GatewayDriver#toJSON', (test): void => {
	const client = createClient();
	test.deepEqual(client.gateways.toJSON(), {
		guilds: {
			name: 'guilds',
			provider: 'json',
			schema: {}
		},
		users: {
			name: 'users',
			provider: 'json',
			schema: {}
		},
		clientStorage: {
			name: 'clientStorage',
			provider: 'json',
			schema: {}
		}
	});
});
