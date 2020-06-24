import unknownTest, { TestInterface } from 'ava';
import { createClient } from './lib/SettingsClient';
import {
	KlasaClient,
	Provider,
	ProviderStore
} from '../src';

const ava = unknownTest as TestInterface<{
	client: KlasaClient
}>;

ava.beforeEach(async (test): Promise<void> => {
	test.context = {
		client: createClient()
	};
});

ava('ProviderStore Properties', (test): void => {
	test.plan(6);

	const { providers } = test.context.client;

	// Test the store's properties
	test.true(providers instanceof ProviderStore);
	test.is(providers.client, test.context.client);
	test.is(providers.Holds, Provider);
	test.is(providers.name, 'providers');

	// Mock provider from tests
	test.is(providers.size, 1);
	test.true(providers.has('json'));
});

ava('ProviderStore#default', (test): void => {
	test.plan(2);

	const { providers } = test.context.client;

	test.context.client.options.providers.default = 'json';
	test.is(providers.default, providers.get('json'));
	providers.clear();
	test.is(providers.default, null);
});

ava('ProviderStore#clear', (test): void => {
	test.plan(2);

	const { providers } = test.context.client;

	test.is(providers.size, 1);
	providers.clear();
	test.is(providers.size, 0);
});

ava('ProviderStore#delete (From Name)', (test): void => {
	test.plan(2);

	const { providers } = test.context.client;

	test.true(providers.remove('json'));
	test.is(providers.size, 0);
});

ava('ProviderStore#delete (From Instance)', (test): void => {
	test.plan(2);

	const { providers } = test.context.client;

	test.true(providers.remove(providers.get('json') as Provider));
	test.is(providers.size, 0);
});

ava('ProviderStore#delete (Invalid)', (test): void => {
	test.plan(2);

	const { providers } = test.context.client;

	test.false(providers.remove('DoesNotExist'));
	test.is(providers.size, 1);
});
