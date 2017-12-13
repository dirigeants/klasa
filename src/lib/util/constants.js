const { dirname } = require('path');
const { Guild, User, Client } = require('discord.js');

exports.DEFAULTS = {

	CLIENT: {
		clientBaseDir: dirname(require.main.filename),
		commandMessageLifetime: 1800,
		console: {},
		consoleEvents: {
			debug: false,
			error: true,
			log: true,
			verbose: false,
			warn: true,
			wtf: true
		},
		language: 'en-US',
		prompTime: 30000,
		ignoreBots: true,
		ignoreSelf: true,
		cmdPrompt: false,
		cmdEditing: false,
		cmdLogging: false,
		typing: false,
		preserveConfigs: true,
		provider: {},
		quotedStringSupport: false,
		readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
	},

	COMMAND: {
		enabled: true,
		runIn: ['text', 'dm', 'group'],
		cooldown: 0,
		deletable: false,
		nsfw: false,
		guarded: false,
		aliases: [],
		autoAliases: true,
		permLevel: 0,
		botPerms: [],
		requiredConfigs: [],
		description: '',
		usage: ''
	},

	GATEWAY_GUILDS: {
		name: 'guilds',
		resolver: async function validateGuild(guildResolvable) {
			if (guildResolvable) {
				let value;

				if (typeof guildResolvable === 'string' && /^\d{17,19}$/.test(guildResolvable)) value = this.client.guilds.get(guildResolvable);
				else if (guildResolvable instanceof Guild) value = guildResolvable;
				if (value) return value;
			}

			throw new Error('The parameter <Guild> expects either a Guild ID or a Guild Instance.');
		},
		// eslint-disable-next-line func-names
		getSchema: function () {
			return {
				prefix: {
					type: 'string',
					default: this.client.options.prefix,
					min: null,
					max: 10,
					array: this.client.options.prefix.constructor.name === 'Array',
					configurable: true,
					sql: `VARCHAR(10) NOT NULL DEFAULT '${this.client.options.prefix.constructor.name === 'Array' ? JSON.stringify(this.client.options.prefix) : this.client.options.prefix}'`
				},
				language: {
					type: 'language',
					default: this.client.options.language,
					min: null,
					max: null,
					array: false,
					configurable: true,
					sql: `VARCHAR(5) NOT NULL DEFAULT '${this.client.options.language}'`
				},
				disableNaturalPrefix: {
					type: 'boolean',
					default: false,
					min: null,
					max: null,
					array: false,
					configurable: Boolean(this.client.options.regexPrefix),
					sql: `BIT(1) NOT NULL DEFAULT 0`
				},
				disabledCommands: {
					type: 'command',
					default: [],
					min: null,
					max: null,
					array: true,
					configurable: true,
					sql: 'TEXT'
				}
			};
		},
		options: undefined,
		download: false
	},

	GATEWAY_USERS: {
		name: 'users',
		resolver: async function validateUser(userResolvable) {
			if (userResolvable) {
				let value;

				if (typeof userResolvable === 'string' && /^\d{17,19}$/.test(userResolvable)) value = await this.client.users.fetch(userResolvable);
				else if (userResolvable instanceof User) value = userResolvable;
				if (value) return value;
			}

			throw new Error('The parameter <User> expects either a User ID or a User Instance.');
		},
		// eslint-disable-next-line func-names
		getSchema: function () {
			return undefined;
		},
		options: undefined,
		download: false
	},

	GATEWAY_CLIENTSTORAGE: {
		name: 'clientStorage',
		resolver: async function validateClient(clientResolvable) {
			if (typeof clientResolvable === 'string' && clientResolvable === this.client.user.id) return this.client.user;
			if (clientResolvable instanceof Client) return clientResolvable.user;
			if (typeof clientResolvable === 'object' &&
				typeof clientResolvable.client !== 'undefined' &&
				clientResolvable.client instanceof Client) return clientResolvable.client.user;

			throw new Error('The parameter <Client> expects either a Client Instance.');
		},
		// eslint-disable-next-line func-names
		getSchema: function () {
			return {
				userBlacklist: {
					type: 'user',
					default: [],
					min: null,
					max: null,
					array: true,
					configurable: true,
					sql: 'TEXT'
				},
				guildBlacklist: {
					type: 'guild',
					default: [],
					min: null,
					max: null,
					array: true,
					configurable: true,
					sql: 'TEXT'
				}
			};
		},
		options: undefined,
		download: false
	}

};
