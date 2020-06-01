import unknownTest, { TestInterface } from 'ava';
import { createClient } from './lib/SettingsClient';
import {
	Gateway,
	KlasaClient,
	Provider,
	Schema,
	Settings,
	SettingsExistenceStatus
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient,
	gateway: Gateway,
	schema: Schema,
	provider: Provider
}>;

ava.before(async (test): Promise<void> => {
	const client = createClient();
	const schema = new Schema()
		.add('count', 'number')
		.add('messages', folder => folder
			.add('hello', 'string'));
	const gateway = new Gateway(client, 'settings-test', {
		provider: 'json',
		schema
	});
	const provider = gateway.provider as Provider;

	client.gateways.register(gateway);
	await gateway.init();

	test.context = {
		client,
		gateway,
		schema,
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
		messages: {
			hello: null
		}
	});
});

ava('Settings#clone', (test): void => {
	test.plan(4);

	const id = '2';
	const settings = new Settings(test.context.gateway, { id }, id);
	const clone = settings.clone();
	test.true(clone instanceof Settings);
	test.is(settings.id, clone.id);
	test.is(settings.target, clone.target);
	test.deepEqual(clone.toJSON(), settings.toJSON());
});

ava('Settings#sync (Not Exists)', async (test): Promise<void> => {
	test.plan(2);

	const id = '3';
	const settings = new Settings(test.context.gateway, { id }, id);

	test.is(await settings.sync(), settings);
	test.is(settings.existenceStatus, SettingsExistenceStatus.NotExists);
});

ava('Settings#sync (Exists)', async (test): Promise<void> => {
	test.plan(7);

	const id = '4';
	await test.context.provider.create(test.context.gateway.name, id, { count: 60 });
	const settings = new Settings(test.context.gateway, { id }, id);
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

	const id = '5';
	const settings = new Settings(test.context.gateway, { id }, id);

	test.is(await settings.destroy(), settings);
	test.is(settings.existenceStatus, SettingsExistenceStatus.NotExists);
});

ava('Settings#destroy (Exists)', async (test): Promise<void> => {
	test.plan(9);

	const id = '6';
	await test.context.provider.create(test.context.gateway.name, id, { count: 120 });
	const settings = new Settings(test.context.gateway, { id }, id);
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
