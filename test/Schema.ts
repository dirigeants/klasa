import ava from 'ava';
import { Schema, SchemaEntry, Settings } from '../src';

ava('Schema Properties', (test): void => {
	test.plan(8);

	const schema = new Schema();

	test.true(schema instanceof Map);
	test.is(schema.size, 0);

	test.true(schema.defaults instanceof Settings);
	test.is(schema.defaults.size, 0);

	test.deepEqual(schema.toJSON(), {});

	test.deepEqual([...schema.keys()], []);
	test.deepEqual([...schema.values()], []);
	test.deepEqual([...schema.entries()], []);
});

ava('Schema#add', (test): void => {
	test.plan(14);

	const schema = new Schema();
	test.is(schema.add('test', 'String'), schema);

	test.true(schema instanceof Schema, '"add" method must be chainable.');

	test.is(schema.defaults.size, 1);
	const settingsEntry = schema.defaults.get('test');
	test.is(settingsEntry, null);

	test.is(schema.size, 1);
	const schemaEntry = schema.get('test') as SchemaEntry;
	test.true(schemaEntry instanceof SchemaEntry);
	test.is(schemaEntry.key, 'test');
	test.is(schemaEntry.parent, schema);
	test.is(schemaEntry.type, 'string');
	test.deepEqual(schemaEntry.toJSON(), {
		array: false,
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
			default: null,
			inclusive: false,
			maximum: null,
			minimum: null,
			resolve: true,
			type: 'string'
		}
	});

	test.deepEqual([...schema.keys()], ['test']);
	test.deepEqual([...schema.values()], [schemaEntry]);
	test.deepEqual([...schema.entries()], [['test', schemaEntry]]);
});

ava('Schema#add (Edit | Entry To Entry)', (test): void => {
	test.plan(5);

	const schema = new Schema().add('key', 'String');
	test.is(schema.defaults.get('key'), null);
	test.is((schema.get('key') as SchemaEntry).default, null);

	test.is(schema.add('key', 'String', { default: 'Hello' }), schema);
	test.is(schema.defaults.get('key'), 'Hello');
	test.is((schema.get('key') as SchemaEntry).default, 'Hello');
});

ava('Schema#add (Ready)', (test): void => {
	const schema = new Schema();
	schema.ready = true;

	test.throws(() => schema.add('key', 'String'), { message: 'Cannot modify the schema after being initialized.' });
});

ava('Schema#get (Entry)', (test): void => {
	const schema = new Schema().add('key', 'String');
	test.true(schema.get('key') instanceof SchemaEntry);
});

ava('Schema#get (Folder From Entry)', (test): void => {
	const schema = new Schema().add('key', 'String');
	test.is(schema.get('key.non.existent.path'), undefined);
});

ava('Schema#delete', (test): void => {
	test.plan(3);

	const schema = new Schema().add('key', 'String');
	test.is(schema.defaults.get('key'), null);

	test.true(schema.delete('key'));
	test.is(schema.defaults.get('key'), undefined);
});

ava('Schema#delete (Not Exists)', (test): void => {
	const schema = new Schema();
	test.false(schema.delete('key'));
});

ava('Schema#delete (Ready)', (test): void => {
	const schema = new Schema();
	schema.ready = true;

	test.throws(() => schema.delete('key'), { message: 'Cannot modify the schema after being initialized.' });
});
