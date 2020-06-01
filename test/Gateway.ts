/* eslint-disable dot-notation */
import unknownTest, { TestInterface } from 'ava';
import { RequestHandler } from '@klasa/request-handler';
import { UserStore } from '@klasa/core';
import { createClient } from './lib/SettingsClient';
import {
	Gateway,
	GatewayStorage,
	KlasaClient,
	Provider,
	Settings,
	SettingsExistenceStatus
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient
}>;

ava.beforeEach(async (test): Promise<void> => {
	test.context = {
		client: createClient()
	};
});

ava('Gateway Properties', (test): void => {
	const gateway = new Gateway(test.context.client, 'test');

	test.true(gateway instanceof GatewayStorage);
	test.true(gateway.requestHandler instanceof RequestHandler);
	test.true(gateway.requestHandler.available);
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
