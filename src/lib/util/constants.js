const { dirname } = require('path');
const { Guild, User, Client } = require('discord.js');

exports.DEFAULTS = {

	CLIENT: {
		clientBaseDir: dirname(require.main.filename),
		cmdEditing: false,
		cmdLogging: false,
		cmdPrompt: false,
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
		promptTime: 30000,
		provider: { engine: 'json' },
		quotedStringSupport: false,
		readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`,
		typing: false
	},

	COMMAND: {
		aliases: [],
		autoAliases: true,
		botPerms: [],
		cooldown: 0,
		deletable: false,
		description: '',
		enabled: true,
		guarded: false,
		nsfw: false,
		permLevel: 0,
		requiredConfigs: [],
		runIn: ['text', 'dm', 'group'],
		usage: ''
	}

};

exports.GATEWAY_RESOLVERS = {

	GUILDS: async function validateGuild(guildResolvable) {
		if (guildResolvable) {
			let value;

			if (typeof guildResolvable === 'string' && /^\d{17,19}$/.test(guildResolvable)) value = this.client.guilds.get(guildResolvable);
			else if (guildResolvable instanceof Guild) value = guildResolvable;
			if (value) return value;
		}

		throw new Error('The parameter <Guild> expects either a Guild ID or a Guild Instance.');
	},

	USERS: async function validateUser(userResolvable) {
		if (userResolvable) {
			let value;

			if (typeof userResolvable === 'string' && /^\d{17,19}$/.test(userResolvable)) value = await this.client.users.fetch(userResolvable);
			else if (userResolvable instanceof User) value = userResolvable;
			if (value) return value;
		}

		throw new Error('The parameter <User> expects either a User ID or a User Instance.');
	},

	CLIENT_STORAGE: async function validateClient(clientResolvable) {
		if (typeof clientResolvable === 'string' && clientResolvable === this.client.user.id) return this.client.user;
		if (clientResolvable instanceof Client) return clientResolvable.user;
		if (typeof clientResolvable === 'object' &&
			typeof clientResolvable.client !== 'undefined' &&
			clientResolvable.client instanceof Client) return clientResolvable.client.user;

		throw new Error('The parameter <Client> expects either a Client Instance.');
	}

};
