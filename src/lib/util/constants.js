const { dirname } = require('path');

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
	}

};
