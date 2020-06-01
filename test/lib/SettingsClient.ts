import { KlasaClient, KlasaClientOptions, Schema } from '../../src';
import { MockProvider } from './MockProvider';
import { MockLanguage } from './MockLanguage';
import { MockNumberSerializer } from './MockNumberSerializer';
import { MockObjectSerializer } from './MockObjectSerializer';
import { MockStringSerializer } from './MockStringSerializer';

export function createClient(options: Partial<KlasaClientOptions> = {}): KlasaClient {
	const client = new KlasaClient({ settings: {
		gateways: {
			clientStorage: {
				schema: (schema): Schema => schema
			},
			users: {
				schema: (schema): Schema => schema
			},
			guilds: {
				schema: (schema): Schema => schema
			}
		},
		preserve: true
	}, ...options });
	for (const gateway of client.gateways.values()) {
		gateway.schema.clear();
		gateway.schema.defaults.clear();
	}

	Map.prototype.set.call(client.providers, 'json', new MockProvider(client.providers, 'providers', ['json.js'], { name: 'json' }));
	Map.prototype.set.call(client.languages, 'en-US', new MockLanguage(client.languages, 'languages', ['en-US.js']));
	Map.prototype.set.call(client.serializers, 'number', new MockNumberSerializer(client.serializers, 'serializers', ['number.js']));
	Map.prototype.set.call(client.serializers, 'object', new MockObjectSerializer(client.serializers, 'serializers', ['object.js']));
	Map.prototype.set.call(client.serializers, 'string', new MockStringSerializer(client.serializers, 'serializers', ['string.js']));
	return client;
}
