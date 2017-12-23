module.exports = {
	Client: require('./lib/Client'),
	KlasaGuild: require('./lib/extensions/KlasaGuild'),
	KlasaMessage: require('./lib/extensions/KlasaMessage'),
	KlasaUser: require('./lib/extensions/KlasaUser'),
	util: require('./lib/util/util'),
	Colors: require('./lib/util/Colors'),
	Console: require('./lib/util/Console'),
	constants: require('./lib/util/constants'),
	RichDisplay: require('./lib/util/RichDisplay'),
	RichMenu: require('./lib/util/RichMenu'),
	ReactionHandler: require('./lib/util/ReactionHandler'),
	Stopwatch: require('./lib/util/Stopwatch'),
	Timestamp: require('./lib/util/Timestamp'),
	Command: require('./lib/structures/Command'),
	Event: require('./lib/structures/Event'),
	Extendable: require('./lib/structures/Extendable'),
	Finalizer: require('./lib/structures/Finalizer'),
	Inhibitor: require('./lib/structures/Inhibitor'),
	Language: require('./lib/structures/Language'),
	Monitor: require('./lib/structures/Monitor'),
	Configuration: require('./lib/structures/Configuration'),
	PermissionLevels: require('./lib/structures/PermissionLevels'),
	Provider: require('./lib/structures/Provider'),
	CommandStore: require('./lib/structures/CommandStore'),
	EventStore: require('./lib/structures/EventStore'),
	ExtendableStore: require('./lib/structures/ExtendableStore'),
	FinalizerStore: require('./lib/structures/FinalizerStore'),
	InhibitorStore: require('./lib/structures/InhibitorStore'),
	LanguageStore: require('./lib/structures/LanguageStore'),
	MonitorStore: require('./lib/structures/MonitorStore'),
	ProviderStore: require('./lib/structures/ProviderStore'),
	Piece: require('./lib/structures/interfaces/Piece'),
	Store: require('./lib/structures/interfaces/Store'),
	Gateway: require('./lib/settings/Gateway'),
	GatewayDriver: require('./lib/settings/GatewayDriver'),
	GatewayStorage: require('./lib/settings/GatewayStorage'),
	Schema: require('./lib/settings/Schema'),
	SchemaFolder: require('./lib/settings/SchemaFolder'),
	SchemaPiece: require('./lib/settings/SchemaPiece'),
	ArgResolver: require('./lib/parsers/ArgResolver'),
	Resolver: require('./lib/parsers/Resolver'),
	SettingResolver: require('./lib/parsers/SettingResolver'),
	CommandPrompt: require('./lib/usage/CommandPrompt'),
	CommandUsage: require('./lib/usage/CommandUsage'),
	ParsedUsage: require('./lib/usage/ParsedUsage'),
	Possible: require('./lib/usage/Possible'),
	Tag: require('./lib/usage/Tag'),
	TextPrompt: require('./lib/usage/TextPrompt'),
	version: require('../package').version
};

/**
 * @external Channel
 * @see {@link https://discord.js.org/#/docs/main/master/class/Channel}
 */
/**
 * @external Client
 * @see {@link https://discord.js.org/#/docs/main/master/class/Client}
 */
/**
 * @external DiscordJSConfig
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/ClientOptions}
 */
/**
 * @external ClientApplication
 * @see {@link https://discord.js.org/#/docs/main/master/class/ClientApplication}
 */
/**
 * @external Collection
 * @see {@link https://discord.js.org/#/docs/main/master/class/Collection}
 */
/**
 * @external DMChannel
 * @see {@link https://discord.js.org/#/docs/main/master/class/DMChannel}
 */
/**
 * @external GroupDMChannel
 * @see {@link https://discord.js.org/#/docs/main/master/class/GroupDMChannel}
 */
/**
 * @external Guild
 * @see {@link https://discord.js.org/#/docs/main/master/class/Guild}
 */
/**
 * @external GuildMember
 * @see {@link https://discord.js.org/#/docs/main/master/class/GuildMember}
 */
/**
 * @external GuildResolvable
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/GuildResolvable}
 */
/**
 * @external Message
 * @see {@link https://discord.js.org/#/docs/main/master/class/Message}
 */
/**
 * @external MessageAttachment
 * @see {@link https://discord.js.org/#/docs/main/master/class/MessageAttachment}
 */
/**
 * @external MessageEmbed
 * @see {@link https://discord.js.org/#/docs/main/master/class/MessageEmbed}
 */
/**
 * @external MessageReaction
 * @see {@link https://discord.js.org/#/docs/main/master/class/MessageReaction}
 */
/**
 * @external MessageOptions
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/MessageOptions}
 */
/**
 * @external Role
 * @see {@link https://discord.js.org/#/docs/main/master/class/Role}
 */
/**
 * @external StringResolvable
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/StringResolvable}
 */
/**
 * @external TextChannel
 * @see {@link https://discord.js.org/#/docs/main/master/class/TextChannel}
 */
/**
 * @external User
 * @see {@link https://discord.js.org/#/docs/main/master/class/User}
 */
/**
 * @external UserResolvable
 * @see {@link https://discord.js.org/#/docs/main/master/class/UserResolvable}
 */
/**
 * @external Emoji
 * @see {@link https://discord.js.org/#/docs/main/master/class/Emoji}
 */
/**
 * @external ReactionEmoji
 * @see {@link https://discord.js.org/#/docs/main/master/class/ReactionEmoji}
 */
/**
 * @external Webhook
 * @see {@link https://discord.js.org/#/docs/main/master/class/Webhook}
 */
/**
 * @external MessageEmbed
 * @see {@link https://discord.js.org/#/docs/main/master/class/MessageEmbed}
 */
/**
 * @external ShardingManager
 * @see {@link https://discord.js.org/#/docs/main/master/class/ShardingManager}
 */
