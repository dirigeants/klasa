declare module 'klasa' {

	import {
		Client,
		ClientApplication,
		ClientOptions,
		Collection,
		Snowflake,
		MessageEmbed,
		MessageCollector,
		WebhookClient,
		ClientUserGuildSettings,
		ClientUserSettings,
		Emoji,
		User as DiscordUser,
		Message as DiscordMessage,
		MessageReaction,
		GuildMember,
		Guild as DiscordGuild,
		UserResolvable,
		Role,
		Channel,
		TextChannel as DiscordTextChannel,
		VoiceChannel as DiscordVoiceChannel,
		DMChannel as DiscordDMChannel,
		GroupDMChannel as DiscordGroupDMChannel,
		MessageOptions,
		ReactionCollector,

		StringResolvable,
		MessageAttachment,
		BufferResolvable
	} from 'discord.js';

	export const version: string;

	class KlasaClient extends Client {
		public constructor(options?: KlasaClientConfig);
		public config: KlasaClientConfig;
		public coreBaseDir: string;
		public clientBaseDir: string;
		public console: Console;
		public argResolver: ArgResolver;
		public commands: CommandStore;
		public inhibitors: InhibitorStore;
		public finalizers: FinalizerStore;
		public monitors: MonitorStore;
		public languages: LanguageStore;
		public providers: ProviderStore;
		public events: EventStore;
		public extendables: ExtendableStore;
		public pieceStores: Collection<string, any>;
		public commandMessages: Collection<Snowflake, CommandMessage>;
		public permissionLevels: PermissionLevels;
		public commandMessageLifetime: number;
		public commandMessageSweep: number;
		public ready: boolean;
		public methods: {
			Collection: typeof Collection;
			Embed: typeof MessageEmbed;
			MessageCollector: typeof MessageCollector;
			Webhook: typeof WebhookClient;
			CommandMessage: typeof CommandMessage;
			util: Util;
		};
		public settings: StringMappedType<SettingGateway<string>>;
		public application: ClientApplication;

		public readonly invite: string;
		public readonly owner: ExtendedUser;
		public validatePermissionLevels(): PermissionLevels;
		public registerStore(store: Store): KlasaClient;
		public unregisterStore(store: Store): KlasaClient;

		public registerPiece(pieceName: string, store: Store): KlasaClient;
		public unregisterPiece(pieceName: string): KlasaClient;

		public login(token: string): Promise<string>;
		private _ready(): void;

		public sweepCommandMessages(lifetime?: number): number;
		public defaultPermissionLevels: PermissionLevels;

		// Discord.js events
		public on(event: string, listener: Function): this;
		public on(event: 'channelCreate' | 'channelDelete', listener: (channel: Channel) => void): this;
		public on(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public on(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public on(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public on(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void): this;
		public on(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public on(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public on(event: 'disconnect', listener: (event: any) => void): this;
		public on(event: 'emojiCreate | emojiDelete', listener: (emoji: Emoji) => void): this;
		public on(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: ExtendedGuild, user: ExtendedUser) => void): this;
		public on(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: ExtendedGuild) => void): this;
		public on(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: ExtendedGuild) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public on(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: ExtendedGuild, newGuild: ExtendedGuild) => void): this;
		public on(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: CommandMessage) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, CommandMessage>) => void): this;
		public on(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: ExtendedUser) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: CommandMessage, newMessage: CommandMessage) => void): this;
		public on(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public on(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public on(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: ExtendedUser) => void): this;
		public on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: ExtendedUser, newUser: ExtendedUser) => void): this;

		// Klasa Command Events
		public on(event: 'commandError', listener: (msg: CommandMessage, command: Command, params: any[], error: Error) => void): this;
		public on(event: 'commandInhibited', listener: (msg: CommandMessage, command: Command, response: string|Error) => void): this;
		public on(event: 'commandRun', listener: (msg: CommandMessage, command: Command, params: any[], response: any) => void): this;
		public on(event: 'commandUnknown', listener: (msg: ExtendedMessage, command: string) => void): this;

		// Klasa Console Custom Events
		public on(event: 'log', listener: (data: any, type: string) => void): this;
		public on(event: 'wtf', listener: (failure: Error) => void): this;
		public on(event: 'verbose', listener: (data: any) => void): this;

		// Klasa Piece Events
		public on(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
		public on(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;
		public on(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
		public on(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
		public on(event: 'pieceDisabled', listener: (piece: Piece) => void): this;

		// Discord.js events
		public once(event: string, listener: Function): this;
		public once(event: 'channelCreate' | 'channelDelete', listener: (channel: Channel) => void): this;
		public once(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public once(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public once(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public once(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void): this;
		public once(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public once(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public once(event: 'disconnect', listener: (event: any) => void): this;
		public once(event: 'emojiCreate | emojiDelete', listener: (emoji: Emoji) => void): this;
		public once(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: ExtendedGuild, user: ExtendedUser) => void): this;
		public once(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: ExtendedGuild) => void): this;
		public once(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: ExtendedGuild) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public once(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: ExtendedGuild, newGuild: ExtendedGuild) => void): this;
		public once(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: CommandMessage) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, CommandMessage>) => void): this;
		public once(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: ExtendedUser) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: CommandMessage, newMessage: CommandMessage) => void): this;
		public once(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public once(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public once(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: ExtendedUser) => void): this;
		public once(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: ExtendedUser, newUser: ExtendedUser) => void): this;

		// Klasa Command Events
		public once(event: 'commandError', listener: (msg: CommandMessage, command: Command, params: any[], error: Error) => void): this;
		public once(event: 'commandInhibited', listener: (msg: CommandMessage, command: Command, response: string|Error) => void): this;
		public once(event: 'commandRun', listener: (msg: CommandMessage, command: Command, params: any[], response: any) => void): this;
		public once(event: 'commandUnknown', listener: (msg: ExtendedMessage, command: string) => void): this;

		// Klasa Console Custom Events
		public once(event: 'log', listener: (data: any, type: string) => void): this;
		public once(event: 'wtf', listener: (failure: Error) => void): this;
		public once(event: 'verbose', listener: (data: any) => void): this;

		// Klasa Piece Events
		public once(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
		public once(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;
		public once(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
		public once(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
		public once(event: 'pieceDisabled', listener: (piece: Piece) => void): this;

	}

	export { KlasaClient as Client };

	export class ReactionHandler extends ReactionCollector {
		public constructor(msg: ExtendedMessage, filter: Function, options: ReactionHandlerOptions, display: RichDisplay|RichMenu, emojis: emoji[]);
		public display: RichDisplay|RichMenu;
		public methodMap: Map<string, emoji>;
		public currentPage: number;
		public prompt: string;
		public time: number;
		public awaiting: boolean;
		public selection: Promise<number?>;
		public reactionsDone: boolean;

		public first(): void;
		public back(): void;
		public forward(): void;
		public last(): void;
		public jump(): Promise<void>;
		public info(): void;
		public stop(): void;
		public zero(): void;
		public one(): void;
		public two(): void;
		public three(): void;
		public four(): void;
		public five(): void;
		public six(): void;
		public seven(): void;
		public eight(): void;
		public nine(): void;
		public update(): void;

		private _queueEmojiReactions(emojis: emoji[]): Promise<null>;
	}

	export class RichDisplay {
		public constructor(embed: MessageEmbed);
		public embedTemplate: MessageEmbed;
		public pages: MessageEmbed[];
		public infoPage?: MessageEmbed;
		public emojis: RichDisplayEmojisObject;
		public footered: boolean;

		public readonly template: MessageEmbed;
		public setEmojis(emojis: RichDisplayEmojisObject): RichDisplay;
		public setInfoPage(embed: MessageEmbed): RichDisplay;
		public run(msg: ExtendedMessage, options?: RichDisplayRunOptions): Promise<ReactionHandler>;
		private _footer(): void;
		protected _determineEmojis(emojis: emoji[], stop: boolean, jump: boolean, firstLast: boolean): emoji[];
		private _handlePageGeneration(cb: Function|MessageEmbed): MessageEmbed;
	}

	export class RichMenu extends RichDisplay {
		public constructor(embed: MessageEmbed);
		public emojis: RichMenuEmojisObject;
		public paginated: boolean;
		public options: MenuOption[];

		public addOption(name: string, body: string, inline?: boolean): RichMenu;
		public run(msg: ExtendedMessage, options?: RichMenuRunOptions): Promise<ReactionHandler>;

		protected _determineEmojis(emojis: emoji[], stop: boolean): emoji[];
		private _paginate(): void;
	}

	export class Util {
		public static codeBlock(lang: string, expression: string): string;
		public static clean(text: string): string;
		private static initClean(client: KlasaClient): void;
		public static toTitleCase(str: string): string;
		public static newError(error: Error, code: number): Error;
		public static regExpEsc(str: string): string;
		public static applyToClass(base: object, structure: object, skips?: string[]): void;
	}

	export class Resolver {
		public constructor(client: KlasaClient);
		public client: KlasaClient;

		public msg(input: CommandMessage|Snowflake, channel: Channel): Promise<CommandMessage>;
		public user(input: ExtendedUser|GuildMember|CommandMessage|Snowflake): Promise<ExtendedUser>;
		public member(input: ExtendedUser|GuildMember|Snowflake, guild: ExtendedGuild): Promise<GuildMember>;
		public channel(input: Channel|Snowflake): Promise<Channel>;
		public guild(input: ExtendedGuild|Snowflake): Promise<ExtendedGuild>;
		public role(input: Role|Snowflake, guild: ExtendedGuild): Promise<Role>;
		public boolean(input: boolean|string): Promise<boolean>;
		public string(input: string): Promise<string>;
		public integer(input: string|number): Promise<number>;
		public float(input: string|number): Promise<number>;
		public url(input: string): Promise<string>;

		public static readonly regex: {
			userOrMember: RegExp,
			channel: RegExp,
			role: RegExp,
			snowflake: RegExp,
		};
	}

	export class ArgResolver extends Resolver {
		public piece(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Piece>;
		public store(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Store>;

		public cmd(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Command>;
		public command(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Command>;
		public event(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Event>;
		public extendable(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Extendable>;
		public finalizer(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Finalizer>;
		public inhibitor(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Inhibitor>;
		public monitor(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Monitor>;
		public language(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Language>;
		public provider(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Provider>;

		public msg(input: string|CommandMessage, channel: Channel): Promise<CommandMessage>;
		public msg(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<CommandMessage>;
		public message(input: string|CommandMessage, channel: Channel): Promise<CommandMessage>;
		public message(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<CommandMessage>;

		public user(input: ExtendedUser|GuildMember|CommandMessage|Snowflake): Promise<ExtendedUser>;
		public user(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<ExtendedUser>;
		public mention(input: ExtendedUser|GuildMember|CommandMessage|Snowflake): Promise<ExtendedUser>;
		public mention(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<ExtendedUser>;

		public member(input: ExtendedUser|GuildMember|Snowflake, guild: ExtendedGuild): Promise<GuildMember>;
		public member(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<GuildMember>;

		public channel(input: Channel|Snowflake): Promise<Channel>;
		public channel(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Channel>;

		public guild(input: ExtendedGuild|Snowflake): Promise<ExtendedGuild>;
		public guild(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<ExtendedGuild>;

		public role(input: Role|Snowflake, guild: ExtendedGuild): Promise<Role>;
		public role(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<Role>;

		public literal(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;

		public bool(input: boolean|string): Promise<boolean>;
		public bool(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<boolean>;
		public boolean(input: boolean|string): Promise<boolean>;
		public boolean(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<boolean>;

		public str(input: string): Promise<string>;
		public str(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;
		public string(input: string): Promise<string>;
		public string(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;

		public int(input: string|number): Promise<number>;
		public int(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<number>;
		public integer(input: string|number): Promise<number>;
		public integer(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<number>;

		public num(input: string|number): Promise<number>;
		public num(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<number>;
		public number(input: string|number): Promise<number>;
		public number(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<number>;
		public float(input: string|number): Promise<number>;
		public float(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<number>;

		public reg(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;
		public regex(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;
		public regexp(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;

		public url(input: string): Promise<string>;
		public url(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage): Promise<string>;

		public static minOrMax(value: number, min: number, max: number, currentUsage: object, possible: number, repeat: boolean, msg: CommandMessage, suffix: string): boolean;
	}

	export class SettingResolver extends Resolver {
		public command(data: any, guild: ExtendedGuild, name: string): Promise<Command>;
		public language(data: any, guild: ExtendedGuild, name: string): Promise<Language>;

		public user(input: ExtendedUser|GuildMember|CommandMessage|Snowflake): Promise<ExtendedUser>;
		public user(data: any, guild: ExtendedGuild, name: string): Promise<ExtendedUser>;

		public channel(input: Channel|Snowflake): Promise<Channel>;
		public channel(data: any, guild: ExtendedGuild, name: string): Promise<Channel>;

		public textchannel(data: any, guild: ExtendedGuild, name: string): Promise<ExtendedTextChannel>;
		public voicechannel(data: any, guild: ExtendedGuild, name: string): Promise<ExtendedVoiceChannel>;

		public guild(input: ExtendedGuild|Snowflake): Promise<ExtendedGuild>;
		public guild(data: any, guild: ExtendedGuild, name: string): Promise<ExtendedGuild>;

		public role(input: Role|Snowflake, guild: ExtendedGuild): Promise<Role>;
		public role(data: any, guild: ExtendedGuild, name: string): Promise<Role>;

		public boolean(input: boolean|string): Promise<boolean>;
		public boolean(data: any, guild: ExtendedGuild, name: string): Promise<boolean>;

		public string(input: string): Promise<string>;
		public string(data: any, guild: ExtendedGuild, name: string, minMax: { min: number, max: number }): Promise<string>;

		public integer(input: string|number): Promise<number>;
		public integer(data: any, guild: ExtendedGuild, name: string, minMax: { min: number, max: number }): Promise<number>;

		public float(input: string|number): Promise<number>;
		public float(data: any, guild: ExtendedGuild, name: string, minMax: { min: number, max: number }): Promise<number>;

		public url(input: string): Promise<string>;
		public url(data: any, guild: ExtendedGuild, name: string): Promise<string>;

		public static maxOrMin(guild: ExtendedGuild, value: number, min: number, max: number, name: string, suffix: string): boolean;
	}

	export class PermissionLevels extends Collection<number, PermissionLevel> {
		public constructor(levels?: number);
		public requiredLevels: number;

		public addLevel(level: number, brk: boolean, check: Function);
		public set(level: number, obj: PermissionLevel): this;
		public isValid(): boolean;
		public debug(): string;

		public run(msg: CommandMessage, min: number): permissionLevelResponse;
	}

	// Usage
	export class ParsedUsage {
		public constructor(client: KlasaClient, command: Command);
		public readonly client: KlasaClient;
		public names: string[];
		public commands: string;
		public deliminatedUsage: string;
		public usageString: string;
		public parsedUsage: Tag[];
		public nearlyFullUsage: string;

		public fullUsage(msg: CommandMessage): string;
		public static parseUsage(usageString: string): Tag[];
		public static tagOpen(usage: object, char: string): object;
		public static tagClose(usage: object, char: string): object;
		public static tagSpace(usage: object, char: string): object;
	}

	export class Possible {
		public constructor(regexResults: string[]);
		public name: string;
		public type: string;
		public min: number;
		public max: number;
		public regex: RegExp;

		public static resolveLimit(limit: string, type: string): number;
	}

	export class Tag {
		public constructor(members: string, count: number, required: boolean);
		public type: string;
		public possibles: Possible[];

		public static parseMembers(members: string, count: number): Possible[];
		public static parseTrueMembers(members: string): string[];
	}

	// Settings
	export class CacheManager {
		public constructor(client: KlasaClient);
		public readonly cacheEngine: string;
		public data: Collection<string, any>|Provider;

		public get(key: string): object;
		public getAll(): object[];
		public set(key: string, value: object): any;
		public delete(key: string): any;
	}

	export class SchemaManager extends CacheManager {
		public constructor(client: KlasaClient);
		public schema: object;
		public defaults: object;

		public initSchema(): Promise<void>;
		public validateSchema(schema: object): void;
		public add(key: string, options: AddOptions, force?: boolean): Promise<void>;
		public remove(key: string, force?: boolean): Promise<void>;
		private force(action: string, key: string): Promise<void>;
	}

	export class SettingGateway<T> extends SchemaManager {
		public constructor(store: SettingCache, type: T, validateFunction: Function, schema: object);
		public readonly store: SettingCache;
		public type: T;
		public engine: string;
		public sql?: SQL;
		public validate: Function;
		public defaultDataSchema: object;

		public initSchema(): Promise<void>;
		public create(input: object|string): Promise<void>;
		public destroy(input: string): Promise<void>;
		public get(input: string): object;
		public getResolved(input: object|string, guild?: SettingGatewayGuildResolvable): Promise<object>;
		public sync(input?: object|string): Promise<void>;
		public reset(input: object|string, key: string): Promise<any>;
		public update(input: object|string, object: object, guild?: SettingGatewayGuildResolvable): object;
		public ensureCreate(target: object|string): true;
		public updateArray(input: object|string, action: 'add'|'remove', key: string, data: any): Promise<boolean>;
		private _resolveGuild(guild: ExtendedGuild|ExtendedTextChannel|ExtendedVoiceChannel|Snowflake): ExtendedGuild;

		public readonly client: KlasaClient;
		public readonly resolver: Resolver;
		public readonly provider: Provider;
	}

	export class SettingCache {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public resolver: SettingResolver;
		public guilds: SettingGateway<'guilds'>;

		public add<T>(name: T, validateFunction: Function, schema?: object): Promise<SettingGateway<T>>;
		public validate(resolver: SettingResolver, guild: object|string);

		public readonly defaultDataSchema: {
			prefix: SchemaPiece,
			language: SchemaPiece,
			disabledCommands: SchemaPiece
		};
	}

	export class SQL {
		public constructor(client: KlasaClient, gateway: SettingGateway<string>);
		public readonly client: KlasaClient;
		public readonly gateway: SettingGateway<string>;

		public buildSingleSQLSchema(value: SchemaPiece): string;
		public buildSQLSchema(schema: object): string[];

		public initDeserialize(): void;
		public deserializer(data: SchemaPiece): void;
		public updateColumns(schema: object, defaults: object, key: string): Promise<boolean>;

		public readonly constants: object;
		public readonly sanitizer: Function;
		public readonly schema: object;
		public readonly defaults: object;
		public readonly provider: Provider;
	}

	// Util
	export class Colors {
		public constructor();
		public CLOSE: ColorsClose;
		public STYLES: ColorsStyles;
		public TEXTS: ColorsTexts;
		public BACKGROUNDS: ColorsBackgrounds;

		public static hexToRGB(hex: string): number[];
		public static hueToRGB(p: number, q: number, t: number): number;
		public static hslToRGB([h, s, l]: [number|string, number|string, number|string]): number[];
		public static formatArray([pos1, pos2, pos3]: [number|string, number|string, number|string]): string;

		public format(input: string, type?: ColorsFormatOptions): string;
	}

	class KlasaConsole extends Console {
		public constructor(options: KlasaConsoleConfig);
		public readonly stdout: NodeJS.WritableStream;
		public readonly stderr: NodeJS.WritableStream;
		public timestaamps: boolean|string;
		public useColors: boolean;
		public colors: KlasaConsoleColorsOption;

		public write(data: any, type?: string): void;
		public log(...data: any[]): void;
		public warn(...data: any[]): void;
		public error(...data: any[]): void;
		public debug(...data: any[]): void;
		public verbose(...data: any[]): void;
		public wtf(...data: any[]): void;

		public timestamp(timestamp: Date, time: string): string;
		public messages(input: string, message: string): string;

		public static flatten(data: any, useColors: boolean): string;
	}

	export class Stopwatch {
		public constructor(digits?: number);
		private _start: number;
		private _end?: number;
		public digits: number;

		public readonly duration: number;
		public readonly friendlyDuration: string;
		public readonly running: boolean;
		public restart(): this;
		public reset(): this;
		public start(): this;
		public stop(): this;
		public toString(): string;
	}

	export { KlasaConsole as Console };

	// Structures
	export class CommandMessage {
		public constructor(msg: CommandMessage, cmd: Command, prefix: string, prefixLength: number);
		public readonly client: KlasaClient;
		public msg: CommandMessage;
		public cmd: Command;
		public prefix: string;
		public prefixLength: number;
		public args: string[];
		public params: any[];
		public reprompted: false;
		private _currentUsage: object;
		private _repeat: boolean;

		private validateArgs(): Promise<any[]>;
		private multiPossibles(possible: number, validated: boolean): Promise<any[]>;

		public static getArgs(cmdMsg: CommandMessage): string[];
		public static getQuotedStringArgs(cmdMsg: CommandMessage): string[];
	}

	export class Piece {
		public reload(): Promise<Piece>;
		public unload(): void;
		public enable(): Piece;
		public disable(): Piece;
		public toString(): string;

		public static applyToClass(structure: object, skips?: string[]): void;
	}

	export abstract class Command implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: CommandOptions);
		public client: KlasaClient;
		public type: 'command';

		public enabled: boolean;
		public name: string;
		public aliases: string[];
		public runIn: string[];
		public botPerms: string[];
		public requiredSettings: string[];
		public cooldown: number;
		public permLevel: number;
		public description: string;
		public usageDelim: string;
		public extendedHelp: string;
		public quotedStringSupport: boolean;

		public fullCategory: string[];
		public category: string;
		public subCategory: string;
		public usage: ParsedUsage;
		private cooldowns: Map<Snowflake, number>;

		public abstract run(msg: MessageCommandProxy, params: any[]): Promise<SentMessage | any>;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Event implements Piece  {
		public constructor(client: KlasaClient, dir: string, file: string[], options: EventOptions);
		public client: KlasaClient;
		public type: 'event';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		private _run(param: any): void;

		public abstract run(...params: any[]): void;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Extendable implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: ExtendableOptions);
		public client: KlasaClient;
		public type: 'extendable';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public appliesTo: string[];
		public target: boolean;

		public abstract extend(...params: any[]): any;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Finalizer implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: FinalizerOptions);
		public client: KlasaClient;
		public type: 'finalizer';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(msg: CommandMessage, mes: ExtendedMessage, start: Stopwatch): void;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Inhibitor implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: InhibitorOptions);
		public client: KlasaClient;
		public type: 'inhibitor';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(msg: CommandMessage, cmd: Command): Promise<void|string>;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Language implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: LanguageOptions);
		public client: KlasaClient;
		public type: 'language';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public get(term: string, ...args: any[]): string|Function;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Monitor implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: MonitorOptions);
		public client: KlasaClient;
		public type: 'monitor';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public ignoreBots: boolean;
		public ignoreSelf: boolean;
		public ignoreOthers: boolean;
		public abstract run(msg: ExtendedMessage): void;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export abstract class Provider implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: ProviderOptions);
		public client: KlasaClient;
		public type: 'monitor';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public description: string;
		public sql: boolean;

		public abstract init(): any;
		public abstract shutdown(): Promise<void>;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
		public abstract toString(): string;
	}

	export class Store {
		public init(): Promise<any[]>;
		public load(dir: string, file: string|string[]): Piece;
		public loadAll(): Promise<number>;
		public resolve(name: Piece|string): Piece;
		public toString(): string;

		public static applyToClass(structure: object, skips?: string[]): void;
	}

	export class CommandStore extends Collection<string, Command> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public aliases: Collection<string, Command>;
		public coreDir: string;
		public userDir: string;
		public holds: Command;
		public name: 'commands';

		public get(name: string): Command;
		public has(name: string): boolean;
		public set(key: string, value: Command): this;
		public set(command: Command): Command;
		public delete(name: Command|string): boolean;
		public clear(): void;
		public load(dir: string, file: string[]): Command;
		public loadAll(): Promise<number>;
		public toString(): string;

		public init(): any;
		public resolve(): any;

		public static walk(store: CommandStore, dir: string, subs?: string[]): Promise<void>;
	}

	export class EventStore extends Collection<string, Event> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Event;
		public name: 'events';

		public clear(): void;
		public delete(name: Event|string): boolean;
		public set(key: string, value: Event): this;
		public set(event: Event): Event;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export class ExtendableStore extends Collection<string, Extendable> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Extendable;
		public name: 'extendables';

		public delete(name: Extendable|string): boolean;
		public clear(): void;
		public set(key: string, value: Extendable): this;
		public set(extendable: Extendable): Extendable;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export class FinalizerStore extends Collection<string, Finalizer> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Finalizer;
		public name: 'finalizers';

		public delete(name: Finalizer|string): boolean;
		public run(msg: CommandMessage, mes: ExtendedMessage, start: number): void;
		public set(key: string, value: Finalizer): this;
		public set(finalizer: Finalizer): Finalizer;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export class InhibitorStore extends Collection<string, Inhibitor> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Inhibitor;
		public name: 'inhibitors';

		public delete(name: Inhibitor|string): boolean;
		public run(msg: ExtendedMessage, cmd: Command, selective: boolean): void;
		public set(key: string, value: Inhibitor): this;
		public set(inhibitor: Inhibitor): Inhibitor;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export class LanguageStore extends Collection<string, Language> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Language;
		public name: 'languages';

		public readonly default: Language;
		public delete(name: Language|string): boolean;
		public set(key: string, value: Language): this;
		public set(language: Language): Language;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export class MonitorStore extends Collection<string, Monitor> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Monitor;
		public name: 'monitors';

		public delete(name: Monitor|string): boolean;
		public run(msg: ExtendedMessage): void;
		public set(key: string, value: Monitor): this;
		public set(monitor: Monitor): Monitor;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export class ProviderStore extends Collection<string, Provider> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Provider;
		public name: 'providers';

		public delete(name: Provider|string): boolean;
		public set(key: string, value: Provider): this;
		public set(provider: Provider): Provider;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
		public toString(): string;
	}

	export type KlasaClientConfig = {
		clientOptions?: ClientOptions;
		prefix?: string;
		permissionLevels?: PermissionLevels;
		clientBaseDir?: string;
		commandMessageLifetime?: number;
		commandMessageSweep?: number;
		provider?: { engine: string, cache: string };
		console?: KlasaConsoleConfig;
		consoleEvents?: KlasaConsoleEvents;
		language?: string;
		promptTime?: number;
		ignoreBots?: boolean;
		ignoreSelf?: boolean;
		cmdPrompt?: boolean;
		cmdEditing?: boolean;
		cmdLogging?: boolean;
		typing?: boolean;
		quotedStringSupport?: boolean;
		readyMessage?: string|Function;
		ownerID?: string;
	};

	export type KlasaConsoleConfig = {
		stdout?: NodeJS.WritableStream;
		stderr?: NodeJS.WritableStream;
		useColor?: boolean;
		colors?: Colors;
		timestamps?: boolean|string;
	};

	export type KlasaConsoleEvents = {
		log?: boolean;
		warn?: boolean;
		error?: boolean;
		debug?: boolean;
		verbose?: boolean;
		wtf?: boolean;
	};

	export type PermissionLevel = {
		break: boolean;
		check: Function;
	};

	export type permissionLevelResponse = {
		broke: boolean;
		permission: boolean;
	};

	export type MessageCommandProxy = CommandMessage & ExtendedMessage;

	export type CommandOptions = {
		enabled?: boolean;
		name?: string;
		aliases?: string[];
		runIn?: string[];
		botPerms?: string[];
		requiredSettings?: string[];
		cooldown?: number;
		permLevel?: number;
		description?: string;
		usage?: string;
		usageDelim?: string;
		extendedHelp?: string;
		quotedStringSupport?: boolean;
	};

	export type EventOptions = {
		enabled?: boolean;
		name?: string;
	};

	export type ExtendableOptions = {
		enabled?: boolean;
		name?: string;
		klasa?: boolean;
	};

	export type FinalizerOptions = {
		enabled?: boolean;
		name?: string;
	};

	export type InhibitorOptions = {
		enabled?: boolean;
		name?: string;
		spamProtection?: boolean;
	};

	export type LanguageOptions = {
		enabled?: boolean;
		name?: string;
	};

	export type MonitorOptions = {
		enabled?: boolean;
		name?: string;
		ignoreBots?: boolean;
		ignoreSelf?: boolean;
	};

	export type ProviderOptions = {
		enabled?: boolean;
		name?: string;
		description?: string;
		sql?: boolean;
	};

	export type AddOptions = {
		type: string;
		default?: any;
		min?: number;
		max?: number;
		array?: boolean;
		sql?: string;
	};

	export type SchemaPiece = {
		type: string;
		default: any;
		min: number;
		max: number;
		array: boolean;
		sql: string;
	};

	export type SettingGatewayGuildResolvable = ExtendedGuild|Channel|ExtendedMessage|Role|Snowflake;

	export type emoji = string;

	export type RichDisplayEmojisObject = {
		first: emoji;
		back: emoji;
		forward: emoji;
		last: emoji;
		jump: emoji;
		info: emoji;
		stop: emoji;
	};

	export type RichMenuEmojisObject = {
		zero: emoji;
		one: emoji;
		two: emoji;
		three: emoji;
		four: emoji;
		five: emoji;
		six: emoji;
		seven: emoji;
		eight: emoji;
		nine: emoji;
	} & RichDisplayEmojisObject;

	export type RichDisplayRunOptions = {
		filter?: Function;
		stop?: boolean;
		jump?: boolean;
		firstLast?: boolean;
		prompt?: string;
		startPage?: number;
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
		time?: number;
	};

	export type MenuOption = {
		name: string;
		body: string;
		inline?: boolean;
	};

	export type RichMenuRunOptions = {
		filter?: Function;
		stop?: boolean;
		prompt?: string;
		startPage?: number;
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
		time?: number;
	};

	export type ReactionHandlerOptions = {
		filter?: Function;
		stop?: boolean;
		prompt?: string;
		startPage?: number;
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
		time?: number;
	};

	export type ColorsClose = {
		normal: 0;
		bold: 22;
		dim: 22;
		italic: 23;
		underline: 24;
		inverse: 27;
		hidden: 28;
		strikethrough: 29;
		text: 39;
		background: 49;
	};

	export type ColorsStyles = {
		normal: 0;
		bold: 1;
		dim: 2;
		italic: 3;
		underline: 4;
		inverse: 7;
		hidden: 8;
		strikethrough: 9;
	};

	export type ColorsTexts = {
		black: 30;
		red: 31;
		green: 32;
		yellow: 33;
		blue: 34;
		magenta: 35;
		cyan: 36;
		lightgray: 37;
		lightgrey: 37;
		gray: 90;
		grey: 90;
		lightred: 91;
		lightgreen: 92;
		lightyellow: 93;
		lightblue: 94;
		lightmagenta: 95;
		lightcyan: 96;
		white: 97;
	};

	export type ColorsBackgrounds = {
		black: 40;
		red: 41;
		green: 42;
		yellow: 43;
		blue: 44;
		magenta: 45;
		cyan: 46;
		gray: 47;
		grey: 47;
		lightgray: 100;
		lightgrey: 100;
		lightred: 101;
		lightgreen: 102;
		lightyellow: 103;
		lightblue: 104;
		lightmagenta: 105;
		lightcyan: 106;
		white: 107;
	};

	export type ColorsFormatOptions = {
		style: string|string[];
		background: string|number|string[];
		text: string|number|string[]
	};

	export type KlasaConsoleColorsOption = boolean | StringMappedType<KlasaConsoleColorObjects> | KlasaConsoleColors;

	export type KlasaConsoleColors = {
		debug: KlasaConsoleColorObjects;
		error: KlasaConsoleColorObjects;
		log: KlasaConsoleColorObjects;
		verbose: KlasaConsoleColorObjects;
		warn: KlasaConsoleColorObjects;
		wtf: KlasaConsoleColorObjects;
	};

	export type KlasaConsoleColorObjects = {
		log?: string;
		message?: KlasaConsoleMessageObject;
		time?: KlasaConsoleTimeObject;
	};

	export type KlasaConsoleMessageObject = {
		background?: BackgroundColorTypes;
		text?: TextColorTypes;
		style?: StyleTypes;
	};

	export type KlasaConsoleTimeObject = {
		background?: BackgroundColorTypes;
		text?: TextColorTypes;
		style?: StyleTypes;
	};

	export type TextColorTypes = 'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray'|'grey'|'lightgray'|'lightgrey'|'lightred'|'lightgreen'|'lightyellow'|'lightblue'|'lightmagenta'|'lightcyan'|'white'|number[]|string[];

	export type BackgroundColorTypes = 'black'|'red'|'green'|'blue'|'magenta'|'cyan'|'gray'|'grey'|'lightgray'|'lightgrey'|'lightred'|'lightgreen'|'lightyellow'|'lightblue'|'lightmagenta'|'lightcyan'|'white'|number[]|string[];

	export type StyleTypes = 'normal'|'bold'|'dim'|'italic'|'underline'|'inverse'|'hidden'|'strikethrough';

	type StringMappedType<T> = { [key: string]: T };

	export type GuildSettings = StringMappedType<any>;
	export type SchemaObject = StringMappedType<SchemaPiece>;
	export type SchemaDefaults = StringMappedType<any>;

	// Extended classes
	export type ExtendedMessage = {
		guild?: ExtendedGuild;
		guildSettings: GuildSettings;
		hasAtLeastPermissionLevel: Promise<boolean>;
		language: Language;
		reactable: boolean;
		send(content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		send(options: MessageOptions): Promise<SentMessage>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(content?: string, options?: MessageOptions): Promise<SentMessage>;
	} & DiscordMessage;

	export type ExtendedGuild = {
		language: Language;
		settings: GuildSettings;
	} & DiscordGuild;

	export type ExtendedUser = {
		send(content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		send(options: MessageOptions): Promise<SentMessage>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<ExtendedMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(options: MessageOptions): Promise<SentMessage>;
	} & DiscordUser;

	export type ExtendedTextChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		guild: ExtendedGuild;
		send(content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		send(options: MessageOptions): Promise<SentMessage>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<ExtendedMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(options: MessageOptions): Promise<SentMessage>;
	} & DiscordTextChannel;

	export type ExtendedVoiceChannel = {
		guild: ExtendedGuild;
	} & DiscordVoiceChannel;

	export type ExtendedDMChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		send(content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		send(options: MessageOptions): Promise<SentMessage>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<ExtendedMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(options: MessageOptions): Promise<SentMessage>;
	} & DiscordDMChannel;

	export type ExtendedGroupDMChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		send(content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		send(options: MessageOptions): Promise<SentMessage>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<ExtendedMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(content?: string, options?: MessageOptions): Promise<SentMessage>;
		sendMessage(options: MessageOptions): Promise<SentMessage>;
	} & DiscordGroupDMChannel;

	export type SentMessage = ExtendedMessage | ExtendedMessage[];

}
