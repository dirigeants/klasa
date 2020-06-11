"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = exports.DATATYPES = exports.MENTION_REGEX = exports.KlasaClientDefaults = exports.version = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Package = require('../../../../package.json');
const utils_1 = require("@klasa/utils");
const core_1 = require("@klasa/core");
require("@klasa/dapi-types");
const Client = require("../Client");
exports.version = Package.version;
exports.KlasaClientDefaults = utils_1.mergeDefault(core_1.ClientOptionsDefaults, {
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
                extendedHelp: (language) => language.get('COMMAND_HELP_NO_EXTENDED'),
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
                runIn: [0 /* GuildText */, 1 /* DM */],
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
                allowedTypes: [0 /* Default */]
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
                schema: () => Client.KlasaClient.defaultClientSchema
            },
            users: {
                schema: () => Client.KlasaClient.defaultUserSchema
            },
            guilds: {
                schema: () => Client.KlasaClient.defaultGuildSchema
            }
        },
        preserve: true
    }
});
exports.MENTION_REGEX = {
    userOrMember: /^(?:<@!?)?(\d{17,19})>?$/,
    channel: /^(?:<#)?(\d{17,19})>?$/,
    emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
    role: /^(?:<@&)?(\d{17,19})>?$/,
    snowflake: /^(\d{17,19})$/
};
exports.DATATYPES = [
    ['json', { type: 'JSON', serializer: (value) => `'${JSON.stringify(value).replace(/'/g, "''")}'` }],
    ['any', { extends: 'json' }],
    ['boolean', { type: 'BOOLEAN', serializer: (value) => `${value}` }],
    ['bool', { extends: 'boolean' }],
    ['snowflake', { type: 'VARCHAR(19)', serializer: (value) => `'${value}'` }],
    ['channel', { extends: 'snowflake' }],
    ['textchannel', { extends: 'channel' }],
    ['voicechannel', { extends: 'channel' }],
    ['categorychannel', { extends: 'channel' }],
    ['guild', { extends: 'snowflake' }],
    ['number', { type: 'FLOAT', serializer: (value) => `${value}` }],
    ['float', { extends: 'number' }],
    ['integer', { extends: 'number', type: 'INTEGER' }],
    ['command', { type: 'TEXT' }],
    ['language', { type: 'VARCHAR(5)' }],
    ['role', { extends: 'snowflake' }],
    ['string', { type: ({ maximum }) => maximum ? `VARCHAR(${maximum})` : 'TEXT' }],
    ['url', { type: 'TEXT' }],
    ['user', { extends: 'snowflake' }]
];
exports.OPTIONS = {
    array: () => 'TEXT',
    arraySerializer: (values) => `'${JSON.stringify(values).replace(/'/g, "''")}'`,
    formatDatatype: (name, datatype, def = null) => `${name} ${datatype}${def !== null ? ` NOT NULL DEFAULT ${def}` : ''}`,
    serializer: (value) => `'${(utils_1.isObject(value) ? JSON.stringify(value) : String(value)).replace(/'/g, "''")}'`
};
//# sourceMappingURL=constants.js.map