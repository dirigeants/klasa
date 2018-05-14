This guide extends {@tutorial CreatingProviders} and aims for SQL providers. As mentioned previously, {@link Provider providers} are special pieces designed for database interaction.

## Compatibility

This piece existed during SettingGateway v1 (from 0.0.1 to 0.4.0) but got unified with normal providers after SettingGateway v2, although getting a very different behaviour and inconsistency. {@link SQLProvider SQLProviders} came back after [SettingGateway v2.2.0](https://github.com/dirigeants/klasa/pull/284) aiming to make a more consistent library interface as well as separating the needs from a NoSQL database with SQL databases.

> **NOTE**: This is an **advanced** tutorial, please consider downloading a provider from [klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/providers).

## Base Code

```javascript
const { SQLProvider, QueryBuilder } = require('klasa');

module.exports = class extends SQLProvider {

	constructor(...args) {
		super(...args);

		this.qb = new QueryBuilder();
	}

	// All other Provider methods

	async addColumn() {
		// The addColumn method which inserts/creates a new column to a table from the database.
	}

	async removeColumn() {
		// The removeColumn method which inserts/creates a new column to a table from the database.
	}

	async updateColumn() {
		// The updateColumn method which updates a column's datatype from a table from the database.
	}

};
```

The example above is a boilerplate code for a Klasa SQL Provider, complementing with all the methods from {@tutorial CreatingProviders}, interfacing with the {@link UnderstandingSettingGateway SettingGateway}.

## Helpers

The {@link SQLProvider} class provides several resources to help the developer reduce the code duplication:

- {@link SQLProvider#parseUpdateInput `SQLProvider#parseUpdateInput()`}: Parses SettingGateway's and other overloads' input into an easier format. The TypeScript type for the overloads accepted are `ConfigurationUpdateResultEntry[] | [string, any][] | Object<string, *>`.
- {@link SQLProvider#parseEntry `SQLProvider#parseEntry()`}: Converts plain dotted objects into parsed objects with nested object support. Uses the helper above to parse entries, and is powered by {@link SettingGateway UnderstandingSettingGateway} to improve security and parsing speed.
- {@link SQLProvider#parseValue `SQLProvider#parseValue()`}: Converts a value into standard JavaScript objects, useful for SQL databases that do not cover all JavaScript primitives.

## Configuration

The configuration is inherited by {@link Provider Providers}, SQL Providers only provide extra tools to convert SQL output to compatible JS objects.

## QueryBuilder

The {@link QueryBuilder} class is a very special class. It was added in [PR#306 (SGv2.2.0 QueryBuilder)](https://github.com/dirigeants/klasa/pull/306) and is designed to abstract all SQL from {@tutorial UnderstandingSettingGateway SettingGateway}. The following code is an example of how it is used:

```javascript
// Create a QueryBuilder for PostgreSQL
this.qb = new QueryBuilder({
	// Declare the boolean type for PGSQL, which is 'BOOL'.
	boolean: { type: 'BOOL' },
	// Sometimes, you want adaptative datatypes, if it's not going to store
	// big numbers, you may want to use INTEGER instead of BIGINT. More options
	// are given with smaller units, but depends on the database. For this case,
	// we pass a function instead of a string, said function takes an instance of
	// SchemaPiece.
	integer: { type: ({ max }) => max >= 2 ** 32 ? 'BIGINT' : 'INTEGER' },
	float: { type: 'DOUBLE PRECISION' },
	// You may want to define extra types for custom argument resolvers.
	uuid: { type: 'UUID' },
	any: { type: 'JSON' }
}, {
	// In PGSQL, arrays are supported, and they have the following notation. If it's not
	// supported, it's advised to not use this option, it defaults to `() => 'TEXT'`, which
	// enables the JSON.parse/JSON.stringify mechanism from SQLProvider.

	// The following line converts a datatype, i.e. `INTEGER`, into `INTEGER[]` when the SchemaPiece
	// takes arrays and they are supported by the SQL database.
	array: type => `${type}[]`,
	// The following function wraps the datatype generated with the previous options and the
	// default value from the SchemaPiece instance, plus the name. In PGSQL, names that have
	// uppercase letters are automatically lowercased if they aren't between quotes, giving
	// this option a chance. Normally, you don't need to define this.
	formatDatatype: (name, datatype, def = null) => `"${name}" ${datatype}${def !== null ? ` NOT NULL DEFAULT ${def}` : ''}`
});
```

## QueryBuilder Defaults

To not have to configure all types, we have a predefined set of datatypes in our constants file:

```javascript
exports.DEFAULTS.DATATYPES = {
	user: { type: 'VARCHAR(18)' },
	channel: { type: 'VARCHAR(18)' },
	textchannel: { type: 'VARCHAR(18)' },
	voicechannel: { type: 'VARCHAR(18)' },
	categorychannel: { type: 'VARCHAR(18)' },
	guild: { type: 'VARCHAR(18)' },
	role: { type: 'VARCHAR(18)' },
	boolean: { type: 'BOOLEAN' },
	string: { type: ({ max }) => max ? `VARCHAR(${max})` : 'TEXT', resolver: (value) => `'${String(value).replace(/'/g, "''")}'` },
	integer: { type: 'INTEGER' },
	float: { type: 'FLOAT' },
	url: { type: 'TEXT' },
	command: { type: 'TEXT' },
	language: { type: 'VARCHAR(5)' },
	json: { type: 'JSON' },
	any: { type: 'TEXT' }
};
```

Where the other fields (`array` and `resolver`) are filled by your {@link QueryBuilderOptions} that defaults the other parameters for all keys using `util.mergeDefault`. By default, array support is not provided since not all SQL databases support them.

## Design of QueryBuilder

Until SettingGateway v2.2, the SQL was auto-generated by the schema, however, this was not always efficient because the SQL databases often had different datatypes that are not compatible, and the ones used were "bases" (datatypes supported by the majority of SQL databases). However, the more databases we supported, the more complicated it was to support them. For example, PostgreSQL has `BOOL` where MySQL has `BIT(1)` and SQLite has `INTEGER` (0 for `false`, 1 for `true`).

Another issue with the old design was portability: you can move from NoSQL to NoSQL, or from SQL to NoSQL without issues, because the SQL schema does not change. However, moving from different SQL databases led to issues. To address this, we implemented {@link QueryBuilder} which dynamically generates the datatypes that are **most efficient** for each SQL storage database, allowing them to take advantage of their potential (no more stringified JSON or arrays in PG, yay!).

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}
