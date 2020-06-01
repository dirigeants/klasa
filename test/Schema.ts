import ava from 'ava';
import {
	Schema,
	SchemaEntry,
	SchemaFolder,
	SettingsFolder
} from '../src';

ava('Schema Properties', (test): void => {
	test.plan(13);

	const schema = new Schema();

	test.is(schema.path, '');
	test.is(schema.type, 'Folder');

	test.true(schema instanceof Map);
	test.is(schema.size, 0);

	test.true(schema.defaults instanceof SettingsFolder);
	test.is(schema.defaults.size, 0);

	test.deepEqual(schema.toJSON(), {});

	test.deepEqual([...schema.keys()], []);
	test.deepEqual([...schema.keys(true)], []);
	test.deepEqual([...schema.values()], []);
	test.deepEqual([...schema.values(true)], []);
	test.deepEqual([...schema.entries()], []);
	test.deepEqual([...schema.entries(true)], []);
});

ava('Schema#add', (test): void => {
	test.plan(20);

	const schema = new Schema();
	test.is(schema.add('test', 'String'), schema);

	test.true(schema instanceof Schema, '"add" method must be chainable.');
	test.is(schema.path, '');
	test.is(schema.type, 'Folder');

	test.is(schema.defaults.size, 1);
	const settingsEntry = schema.defaults.get('test');
	test.is(settingsEntry, null);

	test.is(schema.size, 1);
	const schemaEntry = schema.get('test') as SchemaEntry;
	test.true(schemaEntry instanceof SchemaEntry);
	test.is(schemaEntry.key, 'test');
	test.is(schemaEntry.parent, schema);
	test.is(schemaEntry.path, 'test');
	test.is(schemaEntry.type, 'string');
	test.deepEqual(schemaEntry.toJSON(), {
		array: false,
		configurable: true,
		default: null,
		inclusive: false,
		maximum: null,
		minimum: null,
		resolve: true,
		type: 'string'
	});

	test.deepEqual(schema.toJSON(), {
		test: {
			array: false,
			configurable: true,
			default: null,
			inclusive: false,
			maximum: null,
			minimum: null,
			resolve: true,
			type: 'string'
		}
	});

	test.deepEqual([...schema.keys()], ['test']);
	test.deepEqual([...schema.keys(true)], ['test']);
	test.deepEqual([...schema.values()], [schemaEntry]);
	test.deepEqual([...schema.values(true)], [schemaEntry]);
	test.deepEqual([...schema.entries()], [['test', schemaEntry]]);
	test.deepEqual([...schema.entries(true)], [['test', schemaEntry]]);
});

ava('Schema#add (Edit | Entry To Entry)', (test): void => {
	test.plan(5);

	const schema = new Schema().add('subkey', 'String');
	test.is(schema.defaults.get('subkey'), null);
	test.is((schema.get('subkey') as SchemaEntry).default, null);

	test.is(schema.add('subkey', 'String', { default: 'Hello' }), schema);
	test.is(schema.defaults.get('subkey'), 'Hello');
	test.is((schema.get('subkey') as SchemaEntry).default, 'Hello');
});

ava('Schema#add (Edit | Entry To Folder)', (test): void => {
	const schema = new Schema().add('subkey', folder => folder.add('nested', 'String'));
	test.throws(() => schema.add('subkey', 'String'), { message: 'The type for "subkey" conflicts with the previous value, expected a non-Folder, got "Folder".' });
});

ava('Schema#add (Edit | Folder To Entry)', (test): void => {
	const schema = new Schema().add('subkey', 'String');
	test.throws(() => schema.add('subkey', folder => folder), { message: 'The type for "subkey" conflicts with the previous value, expected type "Folder", got "string".' });
});

ava('Schema#add (Edit | Folder To Folder)', (test): void => {
	test.plan(5);

	const schema = new Schema().add('subkey', folder => folder.add('nested', 'String'));
	test.is(schema.add('subkey', folder => folder.add('another', 'Number')), schema);
	test.is(schema.size, 1);

	const inner = schema.get('subkey') as SchemaFolder;
	test.is(inner.size, 2);
	test.truthy(inner.get('nested'));
	test.truthy(inner.get('another'));
});

ava('Schema#add (Ready)', (test): void => {
	const schema = new Schema();
	schema.ready = true;

	test.throws(() => schema.add('subkey', 'String'), { message: 'Cannot modify the schema after being initialized.' });
});

ava('Schema#get (Entry)', (test): void => {
	const schema = new Schema().add('subkey', 'String');
	test.true(schema.get('subkey') instanceof SchemaEntry);
});

ava('Schema#get (Folder)', (test): void => {
	const schema = new Schema().add('subkey', folder => folder);
	test.true(schema.get('subkey') instanceof SchemaFolder);
});

ava('Schema#get (Folder Nested)', (test): void => {
	const schema = new Schema().add('subkey', folder => folder.add('nested', 'String'));
	test.true(schema.get('subkey.nested') instanceof SchemaEntry);
});

ava('Schema#get (Folder Double Nested)', (test): void => {
	const schema = new Schema().add('subkey', folder => folder
		.add('nested', subFolder => subFolder
			.add('double', 'String')));
	test.true(schema.get('subkey.nested.double') instanceof SchemaEntry);
});

ava('Schema#get (Folder From Entry)', (test): void => {
	const schema = new Schema().add('key', 'String');
	test.is(schema.get('key.non.existent.path'), undefined);
});

ava('SchemaFolder (Empty)', (test): void => {
	test.plan(22);

	const schema = new Schema()
		.add('test', () => {
			// noop
		});

	test.true(schema instanceof Schema, '"add" method must be chainable.');
	test.is(schema.path, '');
	test.is(schema.type, 'Folder');

	test.is(schema.defaults.size, 1);
	const settingsFolder = schema.defaults.get('test') as SettingsFolder;
	test.true(settingsFolder instanceof SettingsFolder);
	test.is(settingsFolder.size, 0);

	test.is(schema.size, 1);
	const schemaFolder = schema.get('test') as SchemaFolder;
	test.true(schemaFolder instanceof SchemaFolder);
	test.is(schemaFolder.size, 0);
	test.is(schemaFolder.key, 'test');
	test.is(schemaFolder.parent, schema);
	test.is(schemaFolder.path, 'test');
	test.is(schemaFolder.type, 'Folder');
	test.true(schemaFolder.defaults instanceof SettingsFolder);
	test.is(schemaFolder.defaults.size, 0);

	test.deepEqual(schema.toJSON(), {
		test: {}
	});

	test.deepEqual([...schema.keys()], ['test']);
	test.deepEqual([...schema.keys(true)], []);
	test.deepEqual([...schema.values()], [schemaFolder]);
	test.deepEqual([...schema.values(true)], []);
	test.deepEqual([...schema.entries()], [['test', schemaFolder]]);
	test.deepEqual([...schema.entries(true)], []);
});

ava('SchemaFolder (Filled)', (test): void => {
	test.plan(29);

	const schema = new Schema()
		.add('someFolder', folder => folder
			.add('someKey', 'TextChannel'));

	test.is(schema.defaults.size, 1);
	const settingsFolder = schema.defaults.get('someFolder') as SettingsFolder;
	test.true(settingsFolder instanceof SettingsFolder);
	test.is(settingsFolder.size, 1);
	test.is(settingsFolder.get('someKey'), null);
	test.is(schema.defaults.get('someFolder.someKey'), null);

	test.is(schema.size, 1);
	const schemaFolder = schema.get('someFolder') as SchemaFolder;
	test.true(schemaFolder instanceof SchemaFolder);
	test.is(schemaFolder.size, 1);
	test.is(schemaFolder.key, 'someFolder');
	test.is(schemaFolder.parent, schema);
	test.is(schemaFolder.path, 'someFolder');
	test.is(schemaFolder.type, 'Folder');
	test.true(schemaFolder.defaults instanceof SettingsFolder);
	test.is(schemaFolder.defaults.size, 1);

	const innerSettingsFolder = schemaFolder.defaults.get('someKey');
	test.is(innerSettingsFolder, null);

	const schemaEntry = schemaFolder.get('someKey') as SchemaEntry;
	test.true(schemaEntry instanceof SchemaEntry);
	test.is(schemaEntry.key, 'someKey');
	test.is(schemaEntry.parent, schemaFolder);
	test.is(schemaEntry.path, 'someFolder.someKey');
	test.is(schemaEntry.type, 'textchannel');
	test.deepEqual(schemaEntry.toJSON(), {
		array: false,
		configurable: true,
		default: null,
		inclusive: false,
		maximum: null,
		minimum: null,
		resolve: true,
		type: 'textchannel'
	});

	test.is(schema.get('someFolder.someKey'), schemaFolder.get('someKey'));

	test.deepEqual(schema.toJSON(), {
		someFolder: {
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
		}
	});

	test.deepEqual([...schema.keys()], ['someFolder']);
	test.deepEqual([...schema.keys(true)], ['someKey']);
	test.deepEqual([...schema.values()], [schemaFolder]);
	test.deepEqual([...schema.values(true)], [schemaEntry]);
	test.deepEqual([...schema.entries()], [['someFolder', schemaFolder]]);
	test.deepEqual([...schema.entries(true)], [['someKey', schemaEntry]]);
});

ava('Schema#delete', (test): void => {
	test.plan(3);

	const schema = new Schema().add('subkey', 'String');
	test.is(schema.defaults.get('subkey'), null);

	test.true(schema.delete('subkey'));
	test.is(schema.defaults.get('subkey'), undefined);
});

ava('Schema#delete (Not Exists)', (test): void => {
	const schema = new Schema();
	test.false(schema.delete('subkey'));
});

ava('Schema#delete (Ready)', (test): void => {
	const schema = new Schema();
	schema.ready = true;

	test.throws(() => schema.delete('subkey'), { message: 'Cannot modify the schema after being initialized.' });
});
