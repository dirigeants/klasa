declare module 'klasa' {

	import {
		Client,
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
		VoiceChannel,
		DMChannel as DiscordDMChannel,
		GroupDMChannel as DiscordGroupDMChannel,
		OAuth2Application
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
		public commandMessages: Collection<Snowflake, Message>;
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
		public application: OAuth2Application;

		public readonly invite: string;
		public readonly owner: User;
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
		public on(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: Guild, user: User) => void): this;
		public on(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: Guild) => void): this;
		public on(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: Guild) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public on(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void): this;
		public on(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		public on(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		public on(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public on(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public on(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: User) => void): this;
		public on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;

		// Klasa Command Events
		public on(event: 'commandError', listener: (msg: Message, command: Command, params: any[], error: Error) => void): this;
		public on(event: 'commandInhibited', listener: (msg: Message, command: Command, response: string|Error) => void): this;

		// Klasa Console Custom Events
		public on(event: 'log', listener: (data: any, type: string) => void): this;
		public on(event: 'wtf', listener: (failure: Error) => void): this;
		public on(event: 'verbose', listener: (data: any) => void): this;

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
		public once(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: Guild, user: User) => void): this;
		public once(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: Guild) => void): this;
		public once(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: Guild) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public once(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void): this;
		public once(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		public once(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		public once(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public once(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public once(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: User) => void): this;
		public once(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;

		// Klasa Command Events
		public once(event: 'commandError', listener: (msg: Message, command: Command, params: any[], error: Error) => void): this;
		public once(event: 'commandInhibited', listener: (msg: Message, command: Command, response: string|Error) => void): this;

		// Klasa Console Custom Events
		public once(event: 'log', listener: (data: any, type: string) => void): this;
		public once(event: 'wtf', listener: (failure: Error) => void): this;
		public once(event: 'verbose', listener: (data: any) => void): this;

	}

	export { KlasaClient as Client };

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

		public msg(input: Message|Snowflake, channel: Channel): Promise<Message>;
		public user(input: User|GuildMember|Message|Snowflake): Promise<User>;
		public member(input: User|GuildMember|Snowflake, guild: Guild): Promise<GuildMember>;
		public channel(input: Channel|Snowflake): Promise<Channel>;
		public guild(input: Guild|Snowflake): Promise<Guild>;
		public role(input: Role|Snowflake, guild: Guild): Promise<Role>;
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
		public piece(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Piece>;
		public store(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Store>;

		public cmd(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Command>;
		public command(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Command>;
		public event(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Event>;
		public extendable(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Extendable>;
		public finalizer(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Finalizer>;
		public inhibitor(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Inhibitor>;
		public monitor(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Monitor>;
		public language(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Language>;
		public provider(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Provider>;

		public msg(input: string|Message, channel: Channel): Promise<Message>;
		public msg(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Message>;
		public message(input: string|Message, channel: Channel): Promise<Message>;
		public message(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Message>;

		public user(input: User|GuildMember|Message|Snowflake): Promise<User>;
		public user(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<User>;
		public mention(input: User|GuildMember|Message|Snowflake): Promise<User>;
		public mention(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<User>;

		public member(input: User|GuildMember|Snowflake, guild: Guild): Promise<GuildMember>;
		public member(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<GuildMember>;

		public channel(input: Channel|Snowflake): Promise<Channel>;
		public channel(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Channel>;

		public guild(input: Guild|Snowflake): Promise<Guild>;
		public guild(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Guild>;

		public role(input: Role|Snowflake, guild: Guild): Promise<Role>;
		public role(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<Role>;

		public literal(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;

		public bool(input: boolean|string): Promise<boolean>;
		public bool(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<boolean>;
		public boolean(input: boolean|string): Promise<boolean>;
		public boolean(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<boolean>;

		public str(input: string): Promise<string>;
		public str(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;
		public string(input: string): Promise<string>;
		public string(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;

		public int(input: string|number): Promise<number>;
		public int(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<number>;
		public integer(input: string|number): Promise<number>;
		public integer(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<number>;

		public num(input: string|number): Promise<number>;
		public num(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<number>;
		public number(input: string|number): Promise<number>;
		public number(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<number>;
		public float(input: string|number): Promise<number>;
		public float(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<number>;

		public reg(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;
		public regex(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;
		public regexp(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;

		public url(input: string): Promise<string>;
		public url(arg: string, currentUsage: object, possible: number, repeat: boolean, msg: Message): Promise<string>;

		public static minOrMax(value: number, min: number, max: number, currentUsage: object, possible: number, repeat: boolean, msg: Message, suffix: string): boolean;
	}

	export class SettingResolver extends Resolver {
		public command(data: any, guild: Guild, name: string): Promise<Command>;
		public language(data: any, guild: Guild, name: string): Promise<Language>;

		public user(input: User|GuildMember|Message|Snowflake): Promise<User>;
		public user(data: any, guild: Guild, name: string): Promise<User>;

		public channel(input: Channel|Snowflake): Promise<Channel>;
		public channel(data: any, guild: Guild, name: string): Promise<Channel>;

		public textchannel(data: any, guild: Guild, name: string): Promise<TextChannel>;
		public voicechannel(data: any, guild: Guild, name: string): Promise<VoiceChannel>;

		public guild(input: Guild|Snowflake): Promise<Guild>;
		public guild(data: any, guild: Guild, name: string): Promise<Guild>;

		public role(input: Role|Snowflake, guild: Guild): Promise<Role>;
		public role(data: any, guild: Guild, name: string): Promise<Role>;

		public boolean(input: boolean|string): Promise<boolean>;
		public boolean(data: any, guild: Guild, name: string): Promise<boolean>;

		public string(input: string): Promise<string>;
		public string(data: any, guild: Guild, name: string, minMax: { min: number, max: number }): Promise<string>;

		public integer(input: string|number): Promise<number>;
		public integer(data: any, guild: Guild, name: string, minMax: { min: number, max: number }): Promise<number>;

		public float(input: string|number): Promise<number>;
		public float(data: any, guild: Guild, name: string, minMax: { min: number, max: number }): Promise<number>;

		public url(input: string): Promise<string>;
		public url(data: any, guild: Guild, name: string): Promise<string>;

		public static maxOrMin(guild: Guild, value: number, min: number, max: number, name: string, suffix: string): boolean;
	}

	export class PermissionLevels extends Collection<number, PermissionLevel> {
		public constructor(levels?: number);
		public requiredLevels: number;

		public addLevel(level: number, brk: boolean, check: Function);
		public set(level: number, obj: PermissionLevel): this;
		public isValid(): boolean;
		public debug(): string;

		public run(msg: Message, min: number): permissionLevelResponse;
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

		public fullUsage(msg: Message): string;
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
		private _resolveGuild(guild: Guild|TextChannel|VoiceChannel|Snowflake): Guild;

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
		public static hslToRGB(hsl: number[]): number[];
		public static hueToRGB(p: number, q: number, t: number): number;
		public static formatArray(array: string[]): string|number[];

		public format(input: string, type?: { style: string|string[], background: string|number|string[], text: string|number|string[] }): string;
	}

	class KlasaConsole extends Console {
		public constructor(options: KlasaConsoleConfig);
		public readonly stdout: NodeJS.WritableStream;
		public readonly stderr: NodeJS.WritableStream;
		public timestaamps: boolean|string;
		public useColors: boolean;
		public colors: boolean|KlasaConsoleColors;

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

	export { KlasaConsole as Console };

	// Structures
	export class CommandMessage {
		public constructor(msg: Message, cmd: Command, prefix: string, prefixLength: number);
		public readonly client: KlasaClient;
		public msg: Message;
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

		public abstract run(msg: ProxyCommand, params: any[]): Promise<Message>;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
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
	}

	export abstract class Finalizer implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: FinalizerOptions);
		public client: KlasaClient;
		public type: 'finalizer';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(msg: CommandMessage, mes: Message, start: number): void;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
	}

	export abstract class Inhibitor implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options: InhibitorOptions);
		public client: KlasaClient;
		public type: 'inhibitor';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(msg: Message, cmd: Command): Promise<void|string>;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
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

		public abstract run(msg: Message): void;
		public abstract init(): any;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
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

		public abstract run(msg: Message): void;
		public abstract init(): any;
		public abstract shutdown(): Promise<void>;

		public abstract enable(): Piece;
		public abstract disable(): Piece;
		public abstract reload(): Promise<any>;
		public abstract unload(): any;
	}

	export class Store {
		public init(): Promise<any[]>;
		public load(dir: string, file: string|string[]): Piece;
		public loadAll(): Promise<number>;
		public resolve(name: Piece|string): Piece;

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
	}

	export class FinalizerStore extends Collection<string, Finalizer> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Finalizer;
		public name: 'finalizers';

		public delete(name: Finalizer|string): boolean;
		public run(msg: CommandMessage, mes: Message, start: number): void;
		public set(key: string, value: Finalizer): this;
		public set(finalizer: Finalizer): Finalizer;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
	}

	export class InhibitorStore extends Collection<string, Inhibitor> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Inhibitor;
		public name: 'inhibitors';

		public delete(name: Inhibitor|string): boolean;
		public run(msg: Message, cmd: Command, selective: boolean): void;
		public set(key: string, value: Inhibitor): this;
		public set(inhibitor: Inhibitor): Inhibitor;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
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
	}

	export class MonitorStore extends Collection<string, Monitor> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Monitor;
		public name: 'monitors';

		public delete(name: Monitor|string): boolean;
		public run(msg: Message): void;
		public set(key: string, value: Monitor): this;
		public set(monitor: Monitor): Monitor;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
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
	}

	type KlasaClientConfig = {
		prefix?: string;
		permissionLevels?: PermissionLevels;
		clientBaseDir?: string;
		commandMessageLifetime?: number;
		commandMessageSweep?: number;
		provider?: { engine: string, cache: string };
		console?: KlasaConsoleConfig;
		consoleEvents?: KlasaConsoleEvents;
		ignoreBots?: boolean;
		ignoreSelf?: boolean;
		prefixMention?: RegExp;
		cmdPrompt?: boolean;
		cmdEditing?: boolean;
		cmdLogging?: boolean;
		typing?: boolean;
		quotedStringSupport?: boolean;
		readyMessage?: string|Function;
		ownerID?: string;
	} & ClientOptions;

	type KlasaConsoleConfig = {
		stdout?: NodeJS.WritableStream;
		stderr?: NodeJS.WritableStream;
		useColor?: boolean;
		colors?: Colors;
		timestamps?: boolean|string;
	};

	type KlasaConsoleEvents = {
		log?: boolean;
		warn?: boolean;
		error?: boolean;
		debug?: boolean;
		verbose?: boolean;
		wtf?: boolean;
	};

	type PermissionLevel = {
		break: boolean;
		check: Function;
	};

	type permissionLevelResponse = {
		broke: boolean;
		permission: boolean;
	};

	type ProxyCommand = CommandMessage & Message;

	type CommandOptions = {
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

	type EventOptions = {
		enabled?: boolean;
		name?: string;
	};

	type ExtendableOptions = {
		enabled?: boolean;
		name?: string;
		klasa?: boolean;
	};

	type FinalizerOptions = {
		enabled?: boolean;
		name?: string;
	};

	type InhibitorOptions = {
		enabled?: boolean;
		name?: string;
		spamProtection?: boolean;
	};

	type LanguageOptions = {
		enabled?: boolean;
		name?: string;
	};

	type MonitorOptions = {
		enabled?: boolean;
		name?: string;
		ignoreBots?: boolean;
		ignoreSelf?: boolean;
	};

	type ProviderOptions = {
		enabled?: boolean;
		name?: string;
		description?: string;
		sql?: boolean;
	};

	type AddOptions = {
		type: string;
		default?: any;
		min?: number;
		max?: number;
		array?: boolean;
		sql?: string;
	};

	type SchemaPiece = {
		type: string;
		default: any;
		min: number;
		max: number;
		array: boolean;
		sql: string;
	};

	type SettingGatewayGuildResolvable = Guild|Channel|Message|Role|Snowflake;

	type ColorsClose = {
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

	type ColorsStyles = {
		normal: 0;
		bold: 1;
		dim: 2;
		italic: 3;
		underline: 4;
		inverse: 7;
		hidden: 8;
		strikethrough: 9;
	};

	type ColorsTexts = {
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

	type ColorsBackgrounds = {
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

	type KlasaConsoleColors = {
		debug: KlasaConsoleColorObjects;
		error: KlasaConsoleColorObjects;
		log: KlasaConsoleColorObjects;
		verbose: KlasaConsoleColorObjects;
		warn: KlasaConsoleColorObjects;
		wtf: KlasaConsoleColorObjects;
	};

	type KlasaConsoleColorObjects = {
		log: string;
		message: KlasaConsoleMessageObject;
		time: KlasaConsoleTimeObject;
	};

	type KlasaConsoleMessageObject = {
		background: BackgroundColorTypes;
		text: TextColorTypes;
		style: StyleTypes;
	};

	type KlasaConsoleTimeObject = {
		background: BackgroundColorTypes;
		text: TextColorTypes;
		style: StyleTypes;
	};

	type TextColorTypes = 'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray'|'grey'|'lightgray'|'lightgrey'|'lightred'|'lightgreen'|'lightyellow'|'lightblue'|'lightmagenta'|'lightcyan'|'white'|number[]|string[];

	type BackgroundColorTypes = 'black'|'red'|'green'|'blue'|'magenta'|'cyan'|'gray'|'grey'|'lightgray'|'lightgrey'|'lightred'|'lightgreen'|'lightyellow'|'lightblue'|'lightmagenta'|'lightcyan'|'white'|number[]|string[];

	type StyleTypes = 'normal'|'bold'|'dim'|'italic'|'underline'|'inverse'|'hidden'|'strikethrough';

	type StringMappedType<T> = { [key: string]: T };

	type GuildSettings = StringMappedType<any>;
	type SchemaObject = StringMappedType<SchemaPiece>;
	type SchemaDefaults = StringMappedType<any>;

	// Extended classes
	export type Message = {
		guild: Guild;
		guildSettings: GuildSettings;
		hasAtLeastPermissionLevel: Promise<Boolean>;
		language: Language;
		reactable: Boolean;
		send: Promise<Message>;
		sendCode: Promise<Message>;
		sendEmbed: Promise<Message>;
		sendMessage: Promise<Message>;
		sendFile: Promise<Message>;
		sendFiles: Promise<Message>;
		usableCommands: Promise<Collection<String, Command>>;
	} & DiscordMessage;

	export type Guild = {
		language: Language;
		settings: GuildSettings;
	} & DiscordGuild;

	export type User = {
		sendCode: Promise<Message>;
		sendEmbed: Promise<Message>;
		sendMessage: Promise<Message>;
		sendFile: Promise<Message>;
		sendFiles: Promise<Message>;
	} & DiscordUser;

	export type TextChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		language: Language;
		sendCode: Promise<Message>;
		sendEmbed: Promise<Message>;
		sendMessage: Promise<Message>;
		sendFile: Promise<Message>;
		sendFiles: Promise<Message>;
	} & DiscordTextChannel;

	export type DMChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		language: Language;
		sendCode: Promise<Message>;
		sendEmbed: Promise<Message>;
		sendMessage: Promise<Message>;
		sendFile: Promise<Message>;
		sendFiles: Promise<Message>;
	} & DiscordDMChannel;

	export type GroupDMChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		language: Language;
		sendCode: Promise<Message>;
		sendEmbed: Promise<Message>;
		sendMessage: Promise<Message>;
		sendFile: Promise<Message>;
		sendFiles: Promise<Message>;
	} & DiscordGroupDMChannel;

}
