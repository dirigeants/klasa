// eslint-disable-next-line @typescript-eslint/no-var-requires
const Package = require('../../../../package.json');
import { mergeDefault, isObject } from '@klasa/utils';
import { ClientOptionsDefaults } from '@klasa/core';
import { MessageType, ChannelType } from '@klasa/dapi-types';
import * as Client from '../Client';

import type { Language, LanguageValue } from '../structures/Language';
import type { Schema } from '../settings/schema/Schema';
import type { QueryBuilderEntryOptions, QueryBuilderDatatype } from './QueryBuilder';

export const { version } = Package;

export const KlasaClientDefaults = mergeDefault(ClientOptionsDefaults, {
	commands: {
		editing: false,
		logging: false,
		messageLifetime: 1800,
		noPrefixDM: false,
		prefix: null,
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
		useColor: true
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
	permissionLevels: () => Client.KlasaClient.defaultPermissionLevels,
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
				runIn: [ChannelType.GuildText, ChannelType.DM],
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
				allowedTypes: [MessageType.Default]
			},
			providers: { enabled: true },
			serializers: {
				enabled: true,
				aliases: []
			},
			tasks: { enabled: true }
		},
		createFolders: true
	},
	schedule: { interval: 60000 },
	settings: {
		gateways: {
			clientStorage: {
				schema: (): Schema => Client.KlasaClient.defaultClientSchema
			},
			users: {
				schema: (): Schema => Client.KlasaClient.defaultUserSchema
			},
			guilds: {
				schema: (): Schema => Client.KlasaClient.defaultGuildSchema
			}
		},
		preserve: true
	}
});

export const MENTION_REGEX = {
	userOrMember: /^(?:<@!?)?(\d{17,19})>?$/,
	channel: /^(?:<#)?(\d{17,19})>?$/,
	emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
	role: /^(?:<@&)?(\d{17,19})>?$/,
	snowflake: /^(\d{17,19})$/
};

export const DATATYPES: [string, QueryBuilderDatatype][] = [
	['json', { type: 'JSON', serializer: (value: unknown): string => `'${JSON.stringify(value).replace(/'/g, "''")}'` }],
	['any', { extends: 'json' }],
	['boolean', { type: 'BOOLEAN', serializer: (value: unknown): string => `${value}` }],
	['bool', { extends: 'boolean' }],
	['snowflake', { type: 'VARCHAR(19)', serializer: (value: unknown): string => `'${value}'` }],
	['channel', { extends: 'snowflake' }],
	['textchannel', { extends: 'channel' }],
	['voicechannel', { extends: 'channel' }],
	['categorychannel', { extends: 'channel' }],
	['guild', { extends: 'snowflake' }],
	['number', { type: 'FLOAT', serializer: (value: unknown): string => `${value}` }],
	['float', { extends: 'number' }],
	['integer', { extends: 'number', type: 'INTEGER' }],
	['command', { type: 'TEXT' }],
	['language', { type: 'VARCHAR(5)' }],
	['role', { extends: 'snowflake' }],
	['string', { type: ({ maximum }): string => maximum ? `VARCHAR(${maximum})` : 'TEXT' }],
	['url', { type: 'TEXT' }],
	['user', { extends: 'snowflake' }]
];

export const OPTIONS: Required<QueryBuilderEntryOptions> = {
	array: () => 'TEXT',
	arraySerializer: (values) => `'${JSON.stringify(values).replace(/'/g, "''")}'`,
	formatDatatype: (name, datatype, def = null) => `${name} ${datatype}${def !== null ? ` NOT NULL DEFAULT ${def}` : ''}`,
	serializer: (value) => `'${(isObject(value) ? JSON.stringify(value) : String(value)).replace(/'/g, "''")}'`
};
