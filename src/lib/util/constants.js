const { dirname } = require('path');
const { Guild, User, Client } = require('discord.js');

exports.DEFAULTS = {

	CLIENT: {
		clientBaseDir: dirname(require.main.filename),
		cmdDeleting: false,
		cmdEditing: false,
		cmdLogging: false,
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
		ignoreBots: true,
		ignoreSelf: true,
		language: 'en-US',
		prefix: '!',
		preserveConfigs: true,
		provider: { engine: 'json' },
		readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`,
		typing: false,
		customPromptDefaults: {
			promptTime: 30000,
			promptLimit: Infinity,
			quotedStringSupport: false
		},
		pieceDefaults: {
			commands: {
				aliases: [],
				autoAliases: true,
				botPerms: [],
				cooldown: 0,
				description: '',
				enabled: true,
				guarded: false,
				nsfw: false,
				permLevel: 0,
				promptLimit: 0,
				promptTime: 30000,
				requiredConfigs: [],
				runIn: ['text', 'dm', 'group'],
				usage: '',
				quotedStringSupport: false,
				deletable: false
			},
			events: { enabled: true },
			extendables: {
				enabled: true,
				klasa: false
			},
			finalizers: { enabled: true },
			inhibitors: {
				enabled: true,
				spamProtection: false
			},
			languages: { enabled: true },
			monitors: {
				enabled: true,
				ignoreBots: true,
				ignoreSelf: true,
				ignoreOthers: true
			},
			providers: {
				enabled: true,
				sql: false,
				cache: false,
				description: ''
			}
		}
	},

	CONSOLE: {
		stdout: process.stdout,
		stderr: process.stderr,
		timestamps: true,
		colors: {
			debug: {
				type: 'log',
				shard: { background: 'cyan', text: 'black', style: null },
				message: { background: null, text: null, style: null },
				time: { background: 'magenta', text: null, style: null }
			},
			error: {
				type: 'error',
				shard: { background: 'cyan', text: 'black', style: null },
				message: { background: null, text: null, style: null },
				time: { background: 'red', text: null, style: null }
			},
			log: {
				type: 'log',
				shard: { background: 'cyan', text: 'black', style: null },
				message: { background: null, text: null, style: null },
				time: { background: 'blue', text: null, style: null }
			},
			verbose: {
				type: 'log',
				shard: { background: 'cyan', text: 'black', style: null },
				message: { background: null, text: 'gray', style: null },
				time: { background: null, text: 'gray', style: null }
			},
			warn: {
				type: 'warn',
				shard: { background: 'cyan', text: 'black', style: null },
				message: { background: null, text: null, style: null },
				time: { background: 'lightyellow', text: 'black', style: null }
			},
			wtf: {
				type: 'error',
				shard: { background: 'cyan', text: 'black', style: null },
				message: { background: null, text: 'red', style: null },
				time: { background: 'red', text: null, style: null }
			}
		}
	}

};

exports.GATEWAYS = {

	GUILDS: {
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
					default: this.options.prefix,
					min: null,
					max: 10,
					array: this.options.prefix.constructor.name === 'Array',
					configurable: true,
					sql: `VARCHAR(10) NOT NULL DEFAULT '${this.options.prefix.constructor.name === 'Array' ? JSON.stringify(this.options.prefix) : this.options.prefix}'`
				},
				language: {
					type: 'language',
					default: this.options.language,
					min: null,
					max: null,
					array: false,
					configurable: true,
					sql: `VARCHAR(5) NOT NULL DEFAULT '${this.options.language}'`
				},
				disableNaturalPrefix: {
					type: 'boolean',
					default: false,
					min: null,
					max: null,
					array: false,
					configurable: Boolean(this.options.regexPrefix),
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

	USERS: {
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

	CLIENT_STORAGE: {
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
