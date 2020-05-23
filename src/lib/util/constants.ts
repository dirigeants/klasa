import { DeepRequired, mergeDefault } from '@klasa/utils';
import { ClientOptionsDefaults } from '@klasa/core';
import { KlasaClient, KlasaClientOptions } from '../Client';
import { Language, LanguageValue } from '../structures/Language';
import { MessageType } from '@klasa/dapi-types';
import { Schema } from '../settings/schema/Schema';

export const KlasaClientDefaults: DeepRequired<KlasaClientOptions> = mergeDefault(ClientOptionsDefaults, {
	commands: {
		editing: false,
		logging: false,
		messageLifetime: 1800,
		noPrefixDM: false,
		prefix: null,
		regexPrefix: null,
		slowmode: 0,
		slowmodeAggressive: false,
		typing: false,
		prefixCaseInsensitive: false,
		prompts: {
			limit: Infinity,
			time: 30000,
			quotedStringSupport: false,
			flagSupport: false
		}
	},
	console: {
		colors: true
	},
	consoleEvents: {
		debug: false,
		error: true,
		log: true,
		verbose: false,
		warn: true,
		wtf: true
	},
	language: 'en-US',
	permissionLevels: () => KlasaClient.defaultPermissionLevels,
	readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guild${client.guilds.size === 1 ? '' : 's'}.`,

	owners: [],
	// eslint-disable-next-line no-process-env
	production: process.env.NODE_ENV === 'production',
	providers: { default: 'json' },
	pieces: {
		defaults: {
			arguments: {
				enabled: true,
				aliases: []
			},
			commands: {
				aliases: [],
				autoAliases: true,
				bucket: 1,
				cooldown: 0,
				cooldownLevel: 'author',
				description: '',
				extendedHelp: (language: Language): LanguageValue => language.get('COMMAND_HELP_NO_EXTENDED'),
				enabled: true,
				flagSupport: true,
				guarded: false,
				hidden: false,
				nsfw: false,
				permissionLevel: 0,
				promptLimit: 0,
				promptTime: 30000,
				requiredSettings: [],
				requiredPermissions: 0,
				runIn: ['text', 'dm'],
				subcommands: false,
				usage: '',
				usageDelim: '',
				quotedStringSupport: false,
				deletable: false
			},
			events: {
				enabled: true,
				once: false
			},
			extendables: {
				enabled: true,
				appliesTo: []
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
				ignoreWebhooks: true,
				ignoreEdits: true,
				ignoreBlacklistedUsers: true,
				ignoreBlacklistedGuilds: true,
				allowedTypes: [MessageType.Default]
			},
			providers: { enabled: true },
			serializers: {
				enabled: true,
				aliases: []
			},
			tasks: { enabled: true }
		},
		disabledStores: [],
		createFolders: true
	},
	schedule: { interval: 60000 },
	settings: {
		gateways: {
			clientStorage: {
				schema: (): Schema => KlasaClient.defaultClientSchema
			},
			users: {
				schema: (): Schema => KlasaClient.defaultUserSchema
			},
			guilds: {
				schema: (): Schema => KlasaClient.defaultGuildSchema
			}
		},
		preserve: true
	}
});

// Kyra wanna fix this kthxs, nah fix this idk why its happening
// All yours (Jacz)
export const MENTION_REGEX = {
	userOrMember: /^(?:<@!?)?(\d{17,19})>?$/,
	channel: /^(?:<#)?(\d{17,19})>?$/,
	emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
	role: /^(?:<@&)?(\d{17,19})>?$/,
	snowflake: /^(\d{17,19})$/
};
