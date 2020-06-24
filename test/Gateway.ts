/* eslint-disable dot-notation */
import unknownTest, { TestInterface } from 'ava';
import { RequestHandler } from '@klasa/request-handler';
import { UserStore } from '@klasa/core';
import { createClient } from './lib/SettingsClient';
import {
	Gateway,
	KlasaClient,
	Provider,
	Settings,
	SettingsExistenceStatus,
	Schema
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient,
	schema: Schema
}>;

ava.beforeEach(async (test): Promise<void> => {
	test.context = {
		client: createClient(),
		schema: new Schema()
	};
});

ava('Gateway Properties', (test): void => {
	test.plan(9);

	const gateway = new Gateway(test.context.client, 'MockGateway');
	test.is(gateway.client, test.context.client);
	test.is(gateway.name, 'MockGateway');
	test.is(gateway.provider, test.context.client.providers.get('json'));
	test.is(gateway.ready, false);
	test.true(gateway.requestHandler instanceof RequestHandler);
	test.true(gateway.requestHandler.available);

	test.true(gateway.schema instanceof Schema);
	test.is(gateway.schema.size, 0);
	test.deepEqual(gateway.toJSON(), {
		name: 'MockGateway',
		provider: 'json',
		schema: {}
	});
});

ava('Gateway#schema', (test): void => {
	const gateway = new Gateway(test.context.client, 'MockGateway', { schema: test.context.schema });
	test.is(gateway.schema, test.context.schema);
});

ava('Gateway#init', async (test): Promise<void> => {
	test.plan(7);

	const gateway = new Gateway(test.context.client, 'MockGateway', { schema: test.context.schema });
	const provider = gateway.provider as Provider;

	// Uninitialized gateway
	test.false(gateway.ready);
	test.false(gateway.schema.ready);
	test.false(await provider.hasTable(gateway.name));

	// Initialize gateway
	test.is(await gateway.init(), undefined);

	// Initialized gateway
	test.true(gateway.ready);
	test.true(gateway.schema.ready);
	test.true(await provider.hasTable(gateway.name));
});

ava('Gateway#init (No Provider)', async (test): Promise<void> => {
	test.plan(2);

	const gateway = new Gateway(test.context.client, 'MockGateway', { schema: test.context.schema });
	test.context.client.providers.clear();

	test.is(gateway.provider, null);
	await test.throwsAsync(() => gateway.init(), { message: 'The gateway "MockGateway" could not find the provider "json".' });
});

ava('Gateway#init (Ready)', async (test): Promise<void> => {
	const gateway = new Gateway(test.context.client, 'MockGateway', { schema: test.context.schema });
	await gateway.init();
	await test.throwsAsync(() => gateway.init(), { message: 'The gateway "MockGateway" has already been initialized.' });
});

ava('Gateway#init (Broken Schema)', async (test): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	test.context.schema.add('key', 'String', { array: null });

	const gateway = new Gateway(test.context.client, 'MockGateway', { schema: test.context.schema });

	await test.throwsAsync(() => gateway.init(), {
		message: [
			'[SCHEMA] There is an error with your schema.',
			"[KEY] key - Parameter 'array' must be a boolean."
		].join('\n')
	});
});

ava('Gateway#sync', async (test): Promise<void> => {
	const gateway = new Gateway(test.context.client, 'MockGateway', { schema: test.context.schema });
	test.is(await gateway.sync(), gateway);
});

ava('Gateway (Reverse Proxy Sync)', (test): void => {
	test.plan(2);

	const gateway = new Gateway(test.context.client, 'users');

	test.true(gateway.cache instanceof UserStore);
	test.is(gateway.cache.size, 0);
});

ava('Gateway#get', (test): void => {
	const gateway = new Gateway(test.context.client, 'test');
	test.is(gateway.get('id'), null);
});

ava('Gateway#create', (test): void => {
	test.plan(2);

	const gateway = new Gateway(test.context.client, 'test');

	const created = gateway.create({ id: 'id' });
	test.true(created instanceof Settings);
	test.is(created.id, 'id');
});

ava('Gateway#acquire', (test): void => {
	test.plan(2);

	const gateway = new Gateway(test.context.client, 'test');

	const acquired = gateway.acquire({ id: 'id' });
	test.true(acquired instanceof Settings);
	test.is(acquired.id, 'id');
});

ava('Gateway#init (Table Existence In Database)', async (test): Promise<void> => {
	test.plan(2);

	const gateway = new Gateway(test.context.client, 'test');
	const provider = gateway.provider as Provider;

	test.false(await provider.hasTable(gateway.name));

	await gateway.init();
	test.true(await provider.hasTable(gateway.name));
});

ava('Gateway (Direct Sync | No Provider)', async (test): Promise<void> => {
	test.plan(2);

	const { client } = test.context;
	client.providers.clear();

	const gateway = client.gateways.get('users') as Gateway;
	test.is(gateway.provider, null);

	const settings = new Settings(gateway, { id: 'Mock' }, 'Mock');
	await test.throwsAsync(() => settings.sync(), { message: 'Cannot run requests without a provider available.' });
});

ava('Gateway (Multiple Direct Sync | No Provider)', async (test): Promise<void> => {
	test.plan(2);

	const { client } = test.context;
	client.providers.clear();

	const gateway = client.gateways.get('users') as Gateway;
	test.is(gateway.provider, null);

	const settings = [
		new Settings(gateway, { id: 'Mock1' }, 'Mock1'),
		new Settings(gateway, { id: 'Mock2' }, 'Mock2'),
		new Settings(gateway, { id: 'Mock3' }, 'Mock3')
	];
	await test.throwsAsync(() => Promise.all(settings.map(instance => instance.sync())), { message: 'Cannot run requests without a provider available.' });
});

ava('Gateway (Reverse Proxy Sync | With Data)', (test): void => {
	test.plan(2);

	const { client } = test.context;
	const gateway = client.gateways.get('users') as Gateway;

	client.users['_add']({
		id: '339942739275677727',
		username: 'Dirigeants',
		avatar: null,
		discriminator: '0000'
	});

	const retrieved = gateway.get('339942739275677727') as Settings;
	test.true(retrieved instanceof Settings);
	test.is(retrieved.id, '339942739275677727');
});

ava('Gateway (Multiple Reverse Proxy Sync | With Data)', async (test): Promise<void> => {
	test.plan(6);

	const { client } = test.context;
	const gateway = client.gateways.get('users') as Gateway;
	const provider = gateway.provider as Provider;
	gateway.schema.add('value', 'String');

	await provider.createTable('users');
	await Promise.all([
		provider.create('users', 'foo', { value: 'bar' }),
		provider.create('users', 'hello', { value: 'world' })
	]);

	const user1 = client.users['_add']({ id: 'foo', username: 'Dirigeants', avatar: null, discriminator: '0000' });
	const user2 = client.users['_add']({ id: 'hello', username: 'Dirigeants', avatar: null, discriminator: '0001' });
	const user3 = client.users['_add']({ id: 'bar', username: 'Dirigeants', avatar: null, discriminator: '0002' });

	const settings1 = user1.settings as unknown as Settings;
	const settings2 = user2.settings as unknown as Settings;
	const settings3 = user3.settings as unknown as Settings;

	test.is(settings1.existenceStatus, SettingsExistenceStatus.Unsynchronized);
	test.is(settings2.existenceStatus, SettingsExistenceStatus.Unsynchronized);
	test.is(settings3.existenceStatus, SettingsExistenceStatus.Unsynchronized);

	await gateway.sync();

	test.is(settings1.existenceStatus, SettingsExistenceStatus.Exists);
	test.is(settings2.existenceStatus, SettingsExistenceStatus.Exists);
	test.is(settings3.existenceStatus, SettingsExistenceStatus.NotExists);
});
