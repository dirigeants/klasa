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
		promptTime: 30000,
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

	GATEWAY_GUILDS_RESOLVER: async function validateGuild(guildResolvable) {
		if (guildResolvable) {
			let value;

			if (typeof guildResolvable === 'string' && /^\d{17,19}$/.test(guildResolvable)) value = this.client.guilds.get(guildResolvable);
			else if (guildResolvable instanceof Guild) value = guildResolvable;
			if (value) return value;
		}

		throw new Error('The parameter <Guild> expects either a Guild ID or a Guild Instance.');
	},

	GATEWAY_USERS_RESOLVER: async function validateUser(userResolvable) {
		if (userResolvable) {
			let value;

			if (typeof userResolvable === 'string' && /^\d{17,19}$/.test(userResolvable)) value = await this.client.users.fetch(userResolvable);
			else if (userResolvable instanceof User) value = userResolvable;
			if (value) return value;
		}

		throw new Error('The parameter <User> expects either a User ID or a User Instance.');
	},

	GATEWAY_CLIENTSTORAGE_RESOLVER: async function validateClient(clientResolvable) {
		if (typeof clientResolvable === 'string' && clientResolvable === this.client.user.id) return this.client.user;
		if (clientResolvable instanceof Client) return clientResolvable.user;
		if (typeof clientResolvable === 'object' &&
			typeof clientResolvable.client !== 'undefined' &&
			clientResolvable.client instanceof Client) return clientResolvable.client.user;

		throw new Error('The parameter <Client> expects either a Client Instance.');
	}

};
