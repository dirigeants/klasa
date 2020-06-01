import ava from 'ava';
import {
	Schema,
	SchemaEntry,
	SchemaFolder,
	SettingsFolder
} from '../src';

ava('SchemaFolder Properties', (test): void => {
	test.plan(5);

	const schema = new Schema();
	const schemaFolder = new SchemaFolder(schema, 'someFolder');

	test.is(schemaFolder.parent, schema);
	test.is(schemaFolder.key, 'someFolder');
	test.true(schemaFolder.defaults instanceof SettingsFolder);
	test.is(schemaFolder.defaults.size, 0);
	test.deepEqual(schemaFolder.toJSON(), {});
});

ava('SchemaFolder (Child)', (test): void => {
	test.plan(4);

	const schema = new Schema();
	const schemaFolder = new SchemaFolder(schema, 'someFolder')
		.add('someKey', 'textchannel');

	test.is(schemaFolder.defaults.size, 1);
	test.is(schemaFolder.defaults.get('someKey'), null);
	test.is((schemaFolder.get('someKey') as SchemaEntry).parent, schemaFolder);
	test.deepEqual(schemaFolder.toJSON(), {
		someKey: {
			array: false,
			configurable: true,
			default: null,
			inclusive: false,
			maximum: null,
			minimum: null,
			resolve: true,
			type: 'textchannel'
		}
	});
});
