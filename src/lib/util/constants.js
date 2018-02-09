const { dirname } = require('path');

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
		language: 'en-US',
		prefix: '!',
		preserveConfigs: true,
		readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`,
		typing: false,
		customPromptDefaults: {
			promptTime: 30000,
			promptLimit: Infinity,
			quotedStringSupport: false
		},
		gateways: {
			guilds: {},
			users: {},
			clientStorage: {}
		},
		providers: { default: 'json' },
		pieceDefaults: {
			commands: {
				aliases: [],
				autoAliases: true,
				botPerms: [],
				bucket: 1,
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
				subcommands: false,
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
				ignoreOthers: true,
				ignoreWebhooks: true
			},
			providers: {
				enabled: true,
				sql: false,
				cache: false
			},
			tasks: { enabled: true }
		},
		schedule: { interval: 60000 }
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

exports.TIME = {
	SECOND: 1000,
	MINUTE: 1000 * 60,
	HOUR: 1000 * 60 * 60,
	DAY: 1000 * 60 * 60 * 24,

	DAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

	TIMESTAMP: {
		TOKENS: {
			/* eslint-disable id-length */
			Y: 4,
			Q: 1,
			M: 4,
			D: 4,
			d: 4,
			X: 1,
			x: 1,
			H: 2,
			h: 2,
			a: 1,
			A: 1,
			m: 2,
			s: 2,
			S: 3,
			Z: 2
			/* eslint-enable id-length */
		}
	},

	CRON: {
		partRegex: /^(?:(\*)|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/,
		allowedNum: [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]],
		predefined: {
			'@annually': '0 0 1 1 *',
			'@yearly': '0 0 1 1 *',
			'@monthly': '0 0 1 * *',
			'@weekly': '0 0 * * 0',
			'@daily': '0 0 * * *',
			'@hourly': '0 * * * *'
		},
		tokens: {
			jan: 1,
			feb: 2,
			mar: 3,
			apr: 4,
			may: 5,
			jun: 6,
			jul: 7,
			aug: 8,
			sep: 9,
			oct: 10,
			nov: 11,
			dec: 12,
			sun: 0,
			mon: 1,
			tue: 2,
			wed: 3,
			thu: 4,
			fri: 5,
			sat: 6
		}
	}

};

exports.TIME.CRON.tokensRegex = new RegExp(Object.keys(exports.TIME.CRON.tokens).join('|'), 'g');
