import unknownTest, { TestInterface } from 'ava';
import { createClient } from './lib/SettingsClient';
import {
	Gateway,
	KlasaClient,
	Provider,
	Schema,
	Settings,
	SettingsExistenceStatus,
	SchemaEntry,
	KeyedObject,
	SettingsUpdateContext
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient,
	gateway: Gateway,
	schema: Schema,
	settings: Settings,
	provider: Provider
}>;

ava.beforeEach(async (test): Promise<void> => {
	const client = createClient();
	const schema = new Schema()
		.add('count', 'number')
		.add('messages', 'string', { array: true });
	const gateway = new Gateway(client, 'settings-test', {
		provider: 'json',
		schema
	});
	const provider = gateway.provider as Provider;

	client.gateways.register(gateway);
	await gateway.init();

	const id = '1';
	const settings = new Settings(gateway, { id }, id);

	test.context = {
		client,
		gateway,
		schema,
		settings,
		provider
	};
});

ava('Settings Properties', (test): void => {
	test.plan(5);

	const id = '1';
	const target = { id };
	const settings = new Settings(test.context.gateway, target, id);
	test.is(settings.id, id);
	test.is(settings.gateway, test.context.gateway);
	test.is(settings.target, target);
	test.is(settings.existenceStatus, SettingsExistenceStatus.Unsynchronized);
	test.deepEqual(settings.toJSON(), {
		count: null,
		messages: []
	});
});

ava('Settings#clone', (test): void => {
	test.plan(4);

	const { settings } = test.context;
	const clone = settings.clone();
	test.true(clone instanceof Settings);
	test.is(settings.id, clone.id);
	test.is(settings.target, clone.target);
	test.deepEqual(clone.toJSON(), settings.toJSON());
});

ava('Settings#sync (Not Exists)', async (test): Promise<void> => {
	test.plan(2);

	const { settings } = test.context;

	test.is(await settings.sync(), settings);
	test.is(settings.existenceStatus, SettingsExistenceStatus.NotExists);
});

ava('Settings#sync (Exists)', async (test): Promise<void> => {
	test.plan(7);

	const { settings } = test.context;
	await test.context.provider.create(test.context.gateway.name, settings.id, { count: 60 });
	settings.client.once('settingsSync', (...args) => {
		test.is(args.length, 1);

		const emittedSettings = args[0] as unknown as Settings;
		test.is(emittedSettings, settings);
		test.is(emittedSettings.existenceStatus, SettingsExistenceStatus.Exists);
		test.is(emittedSettings.get('count'), 60);
	});

	test.is(await settings.sync(), settings);
	test.is(settings.existenceStatus, SettingsExistenceStatus.Exists);
	test.is(settings.get('count'), 60);
});

ava('Settings#destroy (Not Exists)', async (test): Promise<void> => {
	test.plan(2);

	const { settings } = test.context;

	test.is(await settings.destroy(), settings);
	test.is(settings.existenceStatus, SettingsExistenceStatus.NotExists);
});

ava('Settings#destroy (Exists)', async (test): Promise<void> => {
	test.plan(9);

	const { settings } = test.context;
	await test.context.provider.create(test.context.gateway.name, settings.id, { count: 120 });
	settings.client.once('settingsDelete', (...args) => {
		test.is(args.length, 1);

		// The emitted settings are the settings before getting reset synchronously.
		// To keep the state a little longer, synchronous code is required. Otherwise
		// the user must clone it.
		const emittedSettings = args[0] as unknown as Settings;
		test.is(emittedSettings, settings);
		test.is(emittedSettings.get('count'), 120);
		test.is(emittedSettings.existenceStatus, SettingsExistenceStatus.Exists);
	});

	test.is(await settings.sync(), settings);
	test.is(settings.get('count'), 120);
	test.is(await settings.destroy(), settings);
	test.is(settings.existenceStatus, SettingsExistenceStatus.NotExists);
	test.is(settings.get('count'), null);
});

ava('Settings#pluck', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;

	await provider.create(gateway.name, settings.id, { count: 65 });
	await settings.sync();

	test.deepEqual(settings.pluck('count'), [65]);
	test.deepEqual(settings.pluck('messages'), [[]]);
	test.deepEqual(settings.pluck('invalid.path'), [undefined]);
	test.deepEqual(settings.pluck('count', 'messages'), [65, []]);
	test.deepEqual(settings.pluck('count', 'messages', 'invalid.path'), [65, [], undefined]);
});

ava('Settings#resolve', async (test): Promise<void> => {
	test.plan(4);

	const { settings, gateway, provider } = test.context;

	await provider.create(gateway.name, settings.id, { count: 65 });
	await settings.sync();

	// Check if single value from root's folder is resolved correctly
	test.deepEqual(await settings.resolve('count'), [65]);

	// Check if multiple values are resolved correctly
	test.deepEqual(await settings.resolve('count', 'messages'), [65, []]);

	// Update and give it an actual value
	await provider.update(gateway.name, settings.id, { messages: ['Hello'] });
	await settings.sync(true);
	test.deepEqual(await settings.resolve('messages'), [['Hello']]);

	// Invalid path
	test.deepEqual(await settings.resolve('invalid.path'), [undefined]);
});

ava('Settings#reset (Single | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;

	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset('count'), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('Settings#reset (Single | Exists)', async (test): Promise<void> => {
	test.plan(7);

	const { settings, gateway, provider } = test.context;

	await provider.create(gateway.name, settings.id, { count: 64 });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 64 });
	const results = await settings.reset('count');
	test.is(results.length, 1);
	test.is(results[0].previous, 64);
	test.is(results[0].next, null);
	test.is(results[0].entry, gateway.schema.get('count'));
	test.is(settings.get('count'), null);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: null });
});

ava('Settings#reset (Multiple[Array] | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset(['count', 'messages']), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('Settings#reset (Multiple[Array] | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['world'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['world'] });
	const results = await settings.reset(['count', 'messages']);
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['world']);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, gateway.schema.get('messages'));
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#reset (Multiple[Object] | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset({ count: true, messages: true }), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('Settings#reset (Multiple[Object] | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['world'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['world'] });
	const results = await settings.reset({ count: true, messages: true });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['world']);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, gateway.schema.get('messages'));
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#reset (Multiple[Object-Deep] | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset({ count: true, messages: true }), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('Settings#reset (Multiple[Object-Deep] | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['world'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['world'] });
	const results = await settings.reset({ count: true, messages: true });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['world']);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, gateway.schema.get('messages'));
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#reset (Root | Not Exists)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	test.deepEqual(await settings.reset(), []);
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('Settings#reset (Root | Exists)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['world'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['world'] });
	const results = await settings.reset();
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['world']);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, gateway.schema.get('messages'));
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#reset (Array | Empty)', async (test): Promise<void> => {
	test.plan(3);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, {});
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id });
	const results = await settings.reset('messages');
	test.is(results.length, 0);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id });
});

ava('Settings#reset (Array | Filled)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
	const results = await settings.reset('messages');
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.is(results[0].next, (schema.get('messages') as SchemaEntry).default);
	test.is(results[0].entry, schema.get('messages') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#reset (Events | Not Exists)', async (test): Promise<void> => {
	test.plan(1);

	const { client, settings } = test.context;
	await settings.sync();

	client.once('settingsCreate', () => test.fail());
	client.once('settingsUpdate', () => test.fail());
	test.deepEqual(await settings.reset('count'), []);
});

ava('Settings#reset (Events | Exists)', async (test): Promise<void> => {
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

ava('Settings#reset (Events + Extra | Exists)', async (test): Promise<void> => {
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

ava('Settings#reset (Unsynchronized)', async (test): Promise<void> => {
	test.plan(1);

	const { settings } = test.context;
	await test.throwsAsync(() => settings.reset(), { message: 'Cannot reset keys from an unsynchronized settings instance. Perhaps you want to call `sync()` first.' });
});

ava('Settings#reset (Invalid Key)', async (test): Promise<void> => {
	test.plan(1);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['world'] });
	await settings.sync();

	await test.throwsAsync(() => settings.reset('invalid.path'), { message: '[SETTING_GATEWAY_KEY_NOEXT]: invalid.path' });
});

ava('Settings#update (Single)', async (test): Promise<void> => {
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

ava('Settings#update (Multiple)', async (test): Promise<void> => {
	test.plan(8);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const results = await settings.update([['count', 6], ['messages', [4]]]);
	test.is(results.length, 2);

	// count
	test.is(results[0].previous, null);
	test.is(results[0].next, 6);
	test.is(results[0].entry, schema.get('count') as SchemaEntry);

	// messages
	test.deepEqual(results[1].previous, []);
	test.deepEqual(results[1].next, ['4']);
	test.is(results[1].entry, schema.get('messages') as SchemaEntry);

	// persistence
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 6, messages: ['4'] });
});

ava('Settings#update (Multiple | Object)', async (test): Promise<void> => {
	test.plan(8);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const results = await settings.update({ count: 6, messages: [4] });
	test.is(results.length, 2);

	// count
	test.is(results[0].previous, null);
	test.is(results[0].next, 6);
	test.is(results[0].entry, schema.get('count') as SchemaEntry);

	// messages
	test.deepEqual(results[1].previous, []);
	test.deepEqual(results[1].next, ['4']);
	test.is(results[1].entry, schema.get('messages') as SchemaEntry);

	// persistence
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, count: 6, messages: ['4'] });
});

ava('Settings#update (Not Exists | Default Value)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	test.is(await provider.get(gateway.name, settings.id), null);
	await settings.update('messages', null);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#update (ArrayAction | Empty | Default)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2']);
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, ['1', '2']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2'] });
});

ava('Settings#update (ArrayAction | Filled | Default)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
	const results = await settings.update('messages', ['1', '2', '4']);
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, schema.get('messages') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#update (ArrayAction | Empty | Auto)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2'], { arrayAction: 'auto' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, ['1', '2']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2'] });
});

ava('Settings#update (ArrayAction | Filled | Auto)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
	const results = await settings.update('messages', ['1', '2', '4'], { arrayAction: 'auto' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, schema.get('messages') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#update (ArrayAction | Empty | Add)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2'], { arrayAction: 'add' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, ['1', '2']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2'] });
});

ava('Settings#update (ArrayAction | Filled | Add)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
	const results = await settings.update('messages', ['3', '5', '6'], { arrayAction: 'add' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, ['1', '2', '4', '3', '5', '6']);
	test.is(results[0].entry, schema.get('messages') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4', '3', '5', '6'] });
});

ava('Settings#update (ArrayAction | Empty | Remove)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, provider, gateway } = test.context;
	await settings.sync();
	await test.throwsAsync(() => settings.update('messages', ['1', '2'], { arrayAction: 'remove' }), { message: '[SETTING_GATEWAY_MISSING_VALUE]: messages 1' });
	test.is(await provider.get(gateway.name, settings.id), null);
});

ava('Settings#update (ArrayAction | Filled | Remove)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	const schemaEntry = gateway.schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2'], { arrayAction: 'remove' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, ['4']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['4'] });
});

ava('Settings#update (ArrayAction | Filled | Remove With Nulls)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '3', '4'] });
	await settings.sync();

	const schemaEntry = gateway.schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', [null, null], { arrayAction: 'remove', arrayIndex: 1 });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '3', '4']);
	test.deepEqual(results[0].next, ['1', '4']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '4'] });
});

ava('Settings#update (ArrayAction | Empty | Overwrite)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, provider } = test.context;
	await settings.sync();

	const schemaEntry = gateway.schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2', '4'], { arrayAction: 'overwrite' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, ['1', '2', '4']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
});

ava('Settings#update (ArrayAction | Filled | Overwrite)', async (test): Promise<void> => {
	test.plan(6);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
	const results = await settings.update('messages', ['3', '5', '6'], { arrayAction: 'overwrite' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, ['3', '5', '6']);
	test.is(results[0].entry, schema.get('messages') as SchemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['3', '5', '6'] });
});

ava('Settings#update (ArrayIndex | Empty | Auto)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2', '3'], { arrayIndex: 0 });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, ['1', '2', '3']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '3'] });
});

ava('Settings#update (ArrayIndex | Filled | Auto)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	const schemaEntry = schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['5', '6'], { arrayIndex: 0 });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, ['5', '6', '4']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['5', '6', '4'] });
});

ava('Settings#update (ArrayIndex | Empty | Add)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2', '3'], { arrayIndex: 0, arrayAction: 'add' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, ['1', '2', '3']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '3'] });
});

ava('Settings#update (ArrayIndex | Filled | Add)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	const schemaEntry = schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['5', '6'], { arrayIndex: 0, arrayAction: 'add' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, ['5', '6', '1', '2', '4']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['5', '6', '1', '2', '4'] });
});

ava('Settings#update (ArrayIndex | Filled | Add | Error)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	await test.throwsAsync(() => settings.update('messages', '4', { arrayAction: 'add' }), { message: '[SETTING_GATEWAY_DUPLICATE_VALUE]: messages 4' });
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
});

ava('Settings#update (ArrayIndex | Empty | Remove)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await settings.sync();

	const schemaEntry = schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2'], { arrayIndex: 0, arrayAction: 'remove' });
	test.is(results.length, 1);
	test.is(results[0].previous, schemaEntry.default);
	test.deepEqual(results[0].next, []);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: [] });
});

ava('Settings#update (ArrayIndex | Filled | Remove)', async (test): Promise<void> => {
	test.plan(5);

	const { settings, gateway, schema, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	const schemaEntry = schema.get('messages') as SchemaEntry;
	const results = await settings.update('messages', ['1', '2'], { arrayIndex: 1, arrayAction: 'remove' });
	test.is(results.length, 1);
	test.deepEqual(results[0].previous, ['1', '2', '4']);
	test.deepEqual(results[0].next, ['1']);
	test.is(results[0].entry, schemaEntry);
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1'] });
});

ava('Settings#update (ArrayIndex | Filled | Remove | Error)', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['1', '2', '4'] });
	await settings.sync();

	await test.throwsAsync(() => settings.update('messages', 3, { arrayAction: 'remove' }), { message: '[SETTING_GATEWAY_MISSING_VALUE]: messages 3' });
	test.deepEqual(await provider.get(gateway.name, settings.id), { id: settings.id, messages: ['1', '2', '4'] });
});

ava('Settings#update (Events | Not Exists)', async (test): Promise<void> => {
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

ava('Settings#update (Events | Exists | Simple)', async (test): Promise<void> => {
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

ava('Settings#update (Events | Exists | Array Overload | Options)', async (test): Promise<void> => {
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

ava('Settings#update (Events | Exists | Object Overload | Options)', async (test): Promise<void> => {
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

ava('Settings#update (Events + Extra | Not Exists)', async (test): Promise<void> => {
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

ava('Settings#update (Events + Extra | Exists)', async (test): Promise<void> => {
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

ava('Settings#update (Uninitialized)', async (test): Promise<void> => {
	test.plan(1);

	const { settings } = test.context;
	await test.throwsAsync(() => settings.update('count', 6), { message: 'Cannot update values from an unsynchronized settings instance. Perhaps you want to call `sync()` first.' });
});

ava('Settings#update (Unsynchronized)', async (test): Promise<void> => {
	test.plan(1);

	const { settings } = test.context;
	await test.throwsAsync(() => settings.update('count', 6), { message: 'Cannot update values from an unsynchronized settings instance. Perhaps you want to call `sync()` first.' });
});

ava('Settings#update (Invalid Key)', async (test): Promise<void> => {
	test.plan(1);

	const { settings, gateway, provider } = test.context;
	await provider.create(gateway.name, settings.id, { messages: ['world'] });
	await settings.sync();

	await test.throwsAsync(() => settings.update('invalid.path', 420), { message: '[SETTING_GATEWAY_KEY_NOEXT]: invalid.path' });
});

ava('Settings#toJSON', async (test): Promise<void> => {
	test.plan(2);

	const { settings, gateway, provider } = test.context;

	// Non-synced entry should have schema defaults
	test.deepEqual(settings.toJSON(), { messages: [], count: null });

	await provider.create(gateway.name, settings.id, { count: 123, messages: [] });
	await settings.sync();

	// Synced entry should use synced values or schema defaults
	test.deepEqual(settings.toJSON(), { messages: [], count: 123 });
});
