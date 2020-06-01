import unknownTest, { TestInterface } from 'ava';
import { createClient } from './lib/SettingsClient';
import {
	Gateway,
	KeyedObject,
	KlasaClient,
	Provider,
	Schema,
	SchemaEntry,
	Settings,
	SettingsExistenceStatus,
	SettingsFolder,
	SettingsUpdateContext
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient,
	gateway: Gateway,
	schema: Schema,
	provider: Provider,
	settings: Settings
}>;

ava.beforeEach(async (test): Promise<void> => {
	const client = createClient();
	const schema = new Schema()
		.add('uses', 'number', { array: true })
		.add('count', 'number', { configurable: false })
		.add('messages', messages => messages
			.add('ignoring', ignoring => ignoring
				.add('amount', 'number'))
			.add('hello', 'object'));

	const gateway = new Gateway(client, 'settings-test', { schema });
	client.gateways.register(gateway);
	await gateway.init();

	test.context = {
		client,
		gateway,
		schema,
		provider: gateway.provider as Provider,
		settings: new Settings(gateway, { id: 'MockTest' }, 'MockTest')
	};
});

ava('SettingsFolder (Basic)', (test): void => {
	test.plan(4);

	const { schema } = test.context;
	const settingsFolder = new SettingsFolder(schema);

	test.is(settingsFolder.base, null);
	test.is(settingsFolder.schema, schema);
	test.is(settingsFolder.size, 0);
	test.throws(() => settingsFolder.client, { message: /Cannot retrieve gateway from a non-ready settings instance/i });
});

ava('SettingsFolder#{base,client}', (test): void => {
	test.plan(2);

	const { settings } = test.context;
	const settingsFolder = settings.get('messages') as SettingsFolder;

	test.notThrows(() => settingsFolder.client);
	test.is(settingsFolder.base, settings);
});

ava('SettingsFolder#get', (test): void => {
	test.plan(9);

	const { settings, schema } = test.context;

	// Retrieve key from root folder
	test.is(settings.size, 3);
	test.is(settings.get('uses'), (schema.get('uses') as SchemaEntry).default);
	test.is(settings.get('count'), null);
	test.is(settings.get('messages.hello'), null);

	// Retrieve nested folder from root folder
	const settingsFolder = settings.get('messages') as SettingsFolder;
	test.true(settingsFolder instanceof SettingsFolder);
	test.is(settingsFolder.size, 2);
	test.is(settingsFolder.get('hello'), null);

	// Invalid paths should return undefined
	test.is(settings.get('fake.path'), undefined);
	// Invalid parameter to get should return undefined
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	test.is(settings.get(null), undefined);
});

ava('SettingsFolder#pluck', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;

	await provider.create(gateway.name, settings.id, { count: 65 });
	await settings.sync();

	test.deepEqual(settings.pluck('count'), [65]);
	test.deepEqual(settings.pluck('messages.hello'), [null]);
	test.deepEqual(settings.pluck('invalid.path'), [undefined]);
	test.deepEqual(settings.pluck('count', 'messages.hello', 'invalid.path'), [65, null, undefined]);
	test.deepEqual(settings.pluck('count', 'messages'), [65, { hello: null, ignoring: { amount: null } }]);
});

ava('SettingsFolder#resolve', async (test): Promise<void> => {
	test.plan(4);

	const { settings, gateway, provider } = test.context;

	await provider.create(gateway.name, settings.id, { count: 65 });
	await settings.sync();

	// Check if single value from root's folder is resolved correctly
	test.deepEqual(await settings.resolve('count'), [65]);

	// Check if multiple values are resolved correctly
	test.deepEqual(await settings.resolve('count', 'messages'), [65, { hello: null, ignoring: { amount: null } }]);

	// Update and give it an actual value
	await provider.update(gateway.name, settings.id, { messages: { hello: 'Hello' } });
	await settings.sync(true);
	test.deepEqual(await settings.resolve('messages.hello'), [{ data: 'Hello' }]);

	// Invalid path
	test.deepEqual(await settings.resolve('invalid.path'), [undefined]);
});

ava('SettingsFolder#resolve (Folder)', async (test): Promise<void> => {
	const { settings } = test.context;
	test.deepEqual(await settings.resolve('messages'), [{ hello: null, ignoring: { amount: null } }]);
});

ava('SettingsFolder#resolve (Not Ready)', async (test): Promise<void> => {
	test.plan(2);

	const settingsFolder = new SettingsFolder(test.context.schema);
	test.is(settingsFolder.base, null);
	await test.throwsAsync(() => settingsFolder.resolve('uses'), { message: 'Cannot retrieve guild from a non-ready settings instance.' });
});

ava('SettingsFolder#reset (Single | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;

	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset('count'), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Single | Exists)', async (test): Promise<void> => {
	test.plan(7);

	const { settings, gateway, provider } = test.context;

	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 64 });
	const results = await settings.reset('count');
	test.is(results.length, 1);
	test.is(results[0].previous, 64);
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('count') as SchemaEntry);
	test.is(settings.get('count'), null);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: null });
});

ava('SettingsFolder#reset (Multiple[Array] | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset(['count', 'messages.hello']), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Multiple[Array] | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
	const results = await settings.reset(['count', 'messages.hello']);
	test.is(results.length, 1);
	test.is(results[0].previous, 'world');
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#reset (Multiple[Object] | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset({ count: true, 'messages.hello': true }), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Multiple[Object] | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
	const results = await settings.reset({ count: true, 'messages.hello': true });
	test.is(results.length, 1);
	test.is(results[0].previous, 'world');
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#reset (Multiple[Object-Deep] | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset({ count: true, messages: { hello: true } }), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Multiple[Object-Deep] | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
	const results = await settings.reset({ count: true, messages: { hello: true } });
	test.is(results.length, 1);
	test.is(results[0].previous, 'world');
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#reset (Root | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset(), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Root | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
	const results = await settings.reset();
	test.is(results.length, 1);
	test.is(results[0].previous, 'world');
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#reset (Folder | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset('messages'), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Folder | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
	const results = await settings.reset('messages');
	test.is(results.length, 1);
	test.is(results[0].previous, 'world');
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#reset (Inner-Folder | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	const settingsFolder = settings.get('messages') as SettingsFolder;
	test.deepEqual(await settingsFolder.reset(), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#reset (Inner-Folder | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
	const settingsFolder = settings.get('messages') as SettingsFolder;
	const results = await settingsFolder.reset();
	test.is(results.length, 1);
	test.is(results[0].previous, 'world');
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#reset (Array | Empty)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, {});
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id });
	const results = await settings.reset('uses');
	test.is(results.length, 0);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id });
});

ava('SettingsFolder#reset (Array | Filled)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
	const results = await settings.reset('uses');
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.is(results[0].next, (schema.get('uses') as SchemaEntry).default);
	test.is(results[0].entry, schema.get('uses') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [] });
});

ava('SettingsFolder#reset (Events | Not Exists)', async (test): Promise<void> => {
	test.plan(1);

	const { client, settings } = test.context;
	await settings.sync();

	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', () => test.fail());
	test.deepEqual(await settings.reset('count'), []);
});

ava('SettingsFolder#reset (Events | Exists)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, gateway, provider, schema } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: null });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, 64);
		test.is(context.changes[0].next, schemaEntry.default);
		test.is(context.extraContext, undefined);
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	await settings.reset('count');
});

ava('SettingsFolder#reset (Events + Extra | Exists)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, gateway, provider, schema } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	const extraContext = Symbol('Hello!');
	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: null });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, 64);
		test.is(context.changes[0].next, schemaEntry.default);
		test.is(context.extraContext, extraContext);
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	await settings.reset('count', { extraContext });
});

ava('SettingsFolder#reset (Uninitialized)', async (test): Promise<void> => {
	test.plan(1);

	const settings = new SettingsFolder(new Schema());
	await test.throwsAsync(() => settings.reset(), { message: 'Cannot reset keys from a non-ready settings instance.' });
});

ava('SettingsFolder#reset (Unsynchronized)', async (test): Promise<void> => {
	test.plan(1);

	const { settings } = test.context;
	await test.throwsAsync(() => settings.reset(), { message: 'Cannot reset keys from a pending to synchronize settings instance. Perhaps you want to call `sync()` first.' });
});

ava('SettingsFolder#reset (Invalid Key)', async (test): Promise<void> => {
	test.plan(1);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();
	try {
		await settings.reset('invalid.path');
		test.fail('This Settings#reset call must error.');
	} catch (error) {
		test.is(error, '[SETTING_GATEWAY_KEY_NOEXT]: invalid.path');
	}
});

ava('SettingsFolder#reset (Unconfigurable)', async (test): Promise<void> => {
	test.plan(1);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();
	try {
		await settings.reset('count', { onlyConfigurable: true });
		test.fail('This Settings#reset call must error.');
	} catch (error) {
		test.is(error, '[SETTING_GATEWAY_UNCONFIGURABLE_KEY]: count');
	}
});

ava('SettingsFolder#update (Single)', async (test): Promise<void> => {
	test.plan(8);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	test.is(settings.existenceStatus, SettingsExistenceStatus.NotExists);
	const results = await settings.update('count', 2);
	test.is(results.length, 1);
	test.is(results[0].previous, null);
	test.is(results[0].next, 2);
	test.is(results[0].entry, schema.get('count') as SchemaEntry);
	test.is(settings.get('count'), 2);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 2 });
	test.is(settings.existenceStatus, SettingsExistenceStatus.Exists);
});

ava('SettingsFolder#update (Multiple)', async (test): Promise<void> => {
	test.plan(8);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const results = await settings.update([['count', 6], ['uses', [4]]]);
	test.is(results.length, 2);

	// count
	test.is(results[0].previous, null);
	test.is(results[0].next, 6);
	test.is(results[0].entry, schema.get('count') as SchemaEntry);

	// uses
	test.deepEqual(results[1].previous, []);
	test.deepEqual(results[1].next, [4]);
	test.is(results[1].entry, schema.get('uses') as SchemaEntry);

	// persistence
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 6, uses: [4] });
});

ava('SettingsFolder#update (Multiple | Object)', async (test): Promise<void> => {
	test.plan(8);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const results = await settings.update({ count: 6, uses: [4] });
	test.is(results.length, 2);

	// count
	test.is(results[0].previous, null);
	test.is(results[0].next, 6);
	test.is(results[0].entry, schema.get('count') as SchemaEntry);

	// uses
	test.deepEqual(results[1].previous, []);
	test.deepEqual(results[1].next, [4]);
	test.is(results[1].entry, schema.get('uses') as SchemaEntry);

	// persistence
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 6, uses: [4] });
});

ava('SettingsFolder#update (Folder)', async (test): Promise<void> => {
	test.plan(1);

	const { settings } = test.context;
	await settings.sync();

	try {
		await settings.update('messages', 420);
		test.fail('This Settings#update call must error.');
	} catch (error) {
		test.is(error, '[SETTING_GATEWAY_CHOOSE_KEY]: ignoring hello');
	}
});

ava('SettingsFolder#update (Not Exists | Default Value)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	await settings.update('uses', null);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [] });
});

ava('SettingsFolder#update (Inner-Folder | Not Exists | Default Value)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	const settingsFolder = settings.get('messages') as SettingsFolder;
	await settingsFolder.update('hello', null);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: null } });
});

ava('SettingsFolder#update (Inner-Folder | Exists)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const settingsFolder = settings.get('messages') as SettingsFolder;
	const results = await settingsFolder.update('hello', 'world');
	test.is(results.length, 1);
	test.is(results[0].previous, null);
	test.is(results[0].next, 'world');
	test.is(results[0].entry, gateway.schema.get('messages.hello') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: { hello: 'world' } });
});

ava('SettingsFolder#update (ArrayAction | Empty | Default)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2]);
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, [1, 2]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2] });
});

ava('SettingsFolder#update (ArrayAction | Filled | Default)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
	const results = await settings.update('uses', [1, 2, 4]);
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, schema.get('uses') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [] });
});

ava('SettingsFolder#update (ArrayAction | Empty | Auto)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2], { arrayAction: 'auto' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, [1, 2]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2] });
});

ava('SettingsFolder#update (ArrayAction | Filled | Auto)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
	const results = await settings.update('uses', [1, 2, 4], { arrayAction: 'auto' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, schema.get('uses') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [] });
});

ava('SettingsFolder#update (ArrayAction | Empty | Add)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2], { arrayAction: 'add' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, [1, 2]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2] });
});

ava('SettingsFolder#update (ArrayAction | Filled | Add)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
	const results = await settings.update('uses', [3, 5, 6], { arrayAction: 'add' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, [1, 2, 4, 3, 5, 6]);
	test.is(results[0].entry, schema.get('uses') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4, 3, 5, 6] });
});

ava('SettingsFolder#update (ArrayAction | Empty | Remove)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, provider, gateway } = test.context;
	await settings.sync();
	await test.throwsAsync(() => settings.update('uses', [1, 2], { arrayAction: 'remove' }), { message: '[SETTING_GATEWAY_MISSING_VALUE]: uses 1' });
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('SettingsFolder#update (ArrayAction | Filled | Remove)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	const schemaEntry = gateway.schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2], { arrayAction: 'remove' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, [4]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [4] });
});

ava('SettingsFolder#update (ArrayAction | Filled | Remove With Nulls)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 3, 4] });
	await settings.sync();

	const schemaEntry = gateway.schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [null, null], { arrayAction: 'remove', arrayIndex: 1 });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 3, 4]);
	test.deepEqual(results[0].next, [1, 4]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 4] });
});

ava('SettingsFolder#update (ArrayAction | Empty | Overwrite)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2, 4], { arrayAction: 'overwrite' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, [1, 2, 4]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
});

ava('SettingsFolder#update (ArrayAction | Filled | Overwrite)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
	const results = await settings.update('uses', [3, 5, 6], { arrayAction: 'overwrite' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, [3, 5, 6]);
	test.is(results[0].entry, schema.get('uses') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [3, 5, 6] });
});

ava('SettingsFolder#update (ArrayIndex | Empty | Auto)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2, 3], { arrayIndex: 0 });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, [1, 2, 3]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 3] });
});

ava('SettingsFolder#update (ArrayIndex | Filled | Auto)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	const schemaEntry = schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [5, 6], { arrayIndex: 0 });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, [5, 6, 4]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [5, 6, 4] });
});

ava('SettingsFolder#update (ArrayIndex | Empty | Add)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2, 3], { arrayIndex: 0, arrayAction: 'add' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, [1, 2, 3]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 3] });
});

ava('SettingsFolder#update (ArrayIndex | Filled | Add)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	const schemaEntry = schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [5, 6], { arrayIndex: 0, arrayAction: 'add' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, [5, 6, 1, 2, 4]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [5, 6, 1, 2, 4] });
});

ava('SettingsFolder#update (ArrayIndex | Filled | Add | Error)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	await test.throwsAsync(() => settings.update('uses', 4, { arrayAction: 'add' }), { message: '[SETTING_GATEWAY_DUPLICATE_VALUE]: uses 4' });
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
});

ava('SettingsFolder#update (ArrayIndex | Empty | Remove)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2], { arrayIndex: 0, arrayAction: 'remove' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [] });
});

ava('SettingsFolder#update (ArrayIndex | Filled | Remove)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	const schemaEntry = schema.get('uses') as SchemaEntry;
	const results = await settings.update('uses', [1, 2], { arrayIndex: 1, arrayAction: 'remove' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, [1, 2, 4]);
	test.deepEqual(results[0].next, [1]);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1] });
});

ava('SettingsFolder#update (ArrayIndex | Filled | Remove | Error)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { uses: [1, 2, 4] });
	await settings.sync();

	await test.throwsAsync(() => settings.update('uses', 3, { arrayAction: 'remove' }), { message: '[SETTING_GATEWAY_MISSING_VALUE]: uses 3' });
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, uses: [1, 2, 4] });
});

ava('SettingsFolder#update (Events | Not Exists)', async (test): Promise<void> => {
	test.plan(9);

	const { client, schema, settings } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: 64 });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, schemaEntry.default);
		test.is(context.changes[0].next, 64);
		test.is(context.extraContext, undefined);
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	client.once('settingsUpdate', () => test.fail());
	await settings.update('count', 64);
});

ava('SettingsFolder#update (Events | Exists | Simple)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, gateway, provider, schema } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: 420 });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, 64);
		test.is(context.changes[0].next, 420);
		test.is(context.extraContext, undefined);
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	await settings.update('count', 420);
});

ava('SettingsFolder#update (Events | Exists | Array Overload | Options)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, gateway, provider, schema } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: 420 });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, 64);
		test.is(context.changes[0].next, 420);
		test.is(context.extraContext, 'Hello!');
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	await settings.update([['count', 420]], { extraContext: 'Hello!' });
});

ava('SettingsFolder#update (Events | Exists | Object Overload | Options)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, gateway, provider, schema } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: 420 });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, 64);
		test.is(context.changes[0].next, 420);
		test.is(context.extraContext, 'Hello!');
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	await settings.update({ count: 420 }, { extraContext: 'Hello!' });
});

ava('SettingsFolder#update (Events + Extra | Not Exists)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, schema } = test.context;
	await settings.sync();

	const extraContext = Symbol('Hello!');
	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: 420 });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, schemaEntry.default);
		test.is(context.changes[0].next, 420);
		test.is(context.extraContext, extraContext);
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	client.once('settingsUpdate', () => test.fail());
	await settings.update('count', 420, { extraContext });
});

ava('SettingsFolder#update (Events + Extra | Exists)', async (test): Promise<void> => {
	test.plan(9);

	const { client, settings, gateway, provider, schema } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	const extraContext = Symbol('Hello!');
	const schemaEntry = schema.get('count') as SchemaEntry;
	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', (emittedSettings: Settings, changes: KeyedObject, context: SettingsUpdateContext) => {
		test.is(emittedSettings, settings);
		test.deepEqual(changes, { count: 420 });
		test.is(context.changes.length, 1);
		test.is(context.changes[0].entry, schemaEntry);
		test.is(context.changes[0].previous, 64);
		test.is(context.changes[0].next, 420);
		test.is(context.extraContext, extraContext);
		test.is(context.guild, null);
		test.is(context.language, client.languages.get('en-US'));
	});
	await settings.update('count', 420, { extraContext });
});

ava('SettingsFolder#update (Uninitialized)', async (test): Promise<void> => {
	test.plan(1);

	const settings = new SettingsFolder(new Schema());
	await test.throwsAsync(() => settings.update('count', 6), { message: 'Cannot update keys from a non-ready settings instance.' });
});

ava('SettingsFolder#update (Unsynchronized)', async (test): Promise<void> => {
	test.plan(1);

	const { settings } = test.context;
	await test.throwsAsync(() => settings.update('count', 6), { message: 'Cannot update keys from a pending to synchronize settings instance. Perhaps you want to call `sync()` first.' });
});

ava('SettingsFolder#update (Invalid Key)', async (test): Promise<void> => {
	test.plan(1);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: { hello: 'world' } });
	await settings.sync();
	try {
		await settings.update('invalid.path', 420);
		test.fail('This Settings#update call must error.');
	} catch (error) {
		test.is(error, '[SETTING_GATEWAY_KEY_NOEXT]: invalid.path');
	}
});

ava('SettingsFolder#update (Unconfigurable)', async (test): Promise<void> => {
	test.plan(1);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();
	try {
		await settings.update('count', 4, { onlyConfigurable: true });
		test.fail('This Settings#update call must error.');
	} catch (error) {
		test.is(error, '[SETTING_GATEWAY_UNCONFIGURABLE_KEY]: count');
	}
});

ava('SettingsFolder#toJSON', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;

	// Non-synced entry should have schema defaults
	test.deepEqual(settings.toJSON(), { uses: [], count: null, messages: { hello: null, ignoring: { amount: null } } });

	await provider.create(gateway.name, settings.id, { count: 123, messages: { ignoring: { amount: 420 } } });
	await settings.sync();

	// Synced entry should use synced values or schema defaults
	test.deepEqual(settings.toJSON(), { uses: [], count: 123, messages: { hello: null, ignoring: { amount: 420 } } });
});
