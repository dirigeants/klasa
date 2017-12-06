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
		public console: KlasaConsole;
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
		public permissionLevels: PermissionLevels;
		public ready: boolean;
		public methods: {
			Collection: typeof Collection;
			Embed: typeof MessageEmbed;
			MessageCollector: typeof MessageCollector;
			Webhook: typeof WebhookClient;
			KlasaMessage: typeof KlasaMessage;
			util: typeof Util;
		};
		public gateways: GatewayDriver;
		public application: ClientApplication;

		public readonly invite: string;
		public readonly owner: ExtendedUser;
		public validatePermissionLevels(): PermissionLevels;
		public registerStore(store: Store): KlasaClient;
		public unregisterStore(store: Store): KlasaClient;

		public registerPiece(pieceName: string, store: Store): KlasaClient;
		public unregisterPiece(pieceName: string): KlasaClient;

		public login(token: string): Promise<string>;
		private _ready(): Promise<void>;

		public sweepMessages(lifetime?: number, commandLifeTime?: number): number;
		public static defaultPermissionLevels: PermissionLevels;

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
		public on(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: KlasaGuild, user: ExtendedUser) => void): this;
		public on(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
		public on(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: KlasaGuild) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public on(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
		public on(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
		public on(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: ExtendedUser) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
		public on(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public on(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public on(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: ExtendedUser) => void): this;
		public on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: ExtendedUser, newUser: ExtendedUser) => void): this;

		// Klasa Command Events
		public on(event: 'commandError', listener: (msg: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
		public on(event: 'commandInhibited', listener: (msg: KlasaMessage, command: Command, response: string | Error) => void): this;
		public on(event: 'commandRun', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public on(event: 'commandUnknown', listener: (msg: KlasaMessage, command: string) => void): this;
		public on(event: 'commandSuccess', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;

		public on(event: 'monitorError', listener: (msg: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;

		// SettingGateway Events
		public on(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path: string | ConfigUpdateEntryMany) => void): this;
		public on(event: 'configDeleteEntry', listener: (entry: Configuration) => void): this;
		public on(event: 'configCreateEntry', listener: (entry: Configuration) => void): this;

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
		public once(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: KlasaGuild, user: ExtendedUser) => void): this;
		public once(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
		public once(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: KlasaGuild) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public once(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
		public once(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
		public once(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: ExtendedUser) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
		public once(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public once(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public once(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: ExtendedUser) => void): this;
		public once(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: ExtendedUser, newUser: ExtendedUser) => void): this;

		// Klasa Command Events
		public once(event: 'commandError', listener: (msg: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
		public once(event: 'commandInhibited', listener: (msg: KlasaMessage, command: Command, response: string | Error) => void): this;
		public once(event: 'commandRun', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public once(event: 'commandUnknown', listener: (msg: KlasaMessage, command: string) => void): this;
		public once(event: 'commandSuccess', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;

		public once(event: 'monitorError', listener: (msg: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;

		// SettingGateway Events
		public once(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path?: string) => void): this;
		public once(event: 'configDeleteEntry', listener: (entry: Configuration) => void): this;
		public once(event: 'configCreateEntry', listener: (entry: Configuration) => void): this;

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

	export class KlasaGuild extends DiscordGuild {
		public configs: Configuration;
		public readonly language: Language;
	}

	export class KlasaMessage extends DiscordMessage {
		public guildConfigs: Configuration;
		public language: Language;
		public responses?: KlasaMessage | KlasaMessage[];
		public command?: Command;
		public prefix?: RegExp;
		public prefixLength?: number;
		public args: string[];
		public params: any[];
		public reprompted: boolean;
		private _currentUsage: Object;
		private _repeat: boolean;

		private _registerCommand(commandInfo: { command: Command, prefix: RegExp, prefixLength: number }): void;
		public readonly reactable: boolean;
		public usableCommands(): Promise<CommandStore>;
		public hasAtLeastPermissionLevel(min: number): Promise<boolean>;

		public sendMessage(content?: StringResolvable, options?: MessageOptions | MessageAttachment | MessageEmbed): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(content?: StringResolvable, options?: MessageOptions | MessageAttachment | MessageEmbed): Promise<KlasaMessage | KlasaMessage[]>;

		private validateArgs(): Promise<any[]>;
		private multiPossibles(possible: number, validated: boolean): Promise<any[]>;
		private static getArgs(msg: KlasaMessage): string[];
		private static getQuotedStringArgs(msg: KlasaMessage): string[];
	}

	export class KlasaUser extends DiscordUser {
		public configs: Configuration;
	}

	export class ReactionHandler extends ReactionCollector {
		public constructor(msg: KlasaMessage, filter: Function, options: ReactionHandlerOptions, display: RichDisplay | RichMenu, emojis: emoji[]);
		public display: RichDisplay | RichMenu;
		public methodMap: Map<string, emoji>;
		public currentPage: number;
		public prompt: string;
		public time: number;
		public awaiting: boolean;
		public selection: Promise<number>;
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
		public run(msg: KlasaMessage, options?: RichDisplayRunOptions): Promise<ReactionHandler>;
		private _footer(): void;
		protected _determineEmojis(emojis: emoji[], stop: boolean, jump: boolean, firstLast: boolean): emoji[];
		private _handlePageGeneration(cb: Function | MessageEmbed): MessageEmbed;
	}

	export class RichMenu extends RichDisplay {
		public constructor(embed: MessageEmbed);
		public emojis: RichMenuEmojisObject;
		public paginated: boolean;
		public options: MenuOption[];

		public addOption(name: string, body: string, inline?: boolean): RichMenu;
		public run(msg: KlasaMessage, options?: RichMenuRunOptions): Promise<ReactionHandler>;

		protected _determineEmojis(emojis: emoji[], stop: boolean): emoji[];
		private _paginate(): void;
	}

	class Util {
		public static codeBlock(lang: string, expression: string): string;
		public static clean(text: string): string;
		private static initClean(client: KlasaClient): void;
		public static toTitleCase(str: string): string;
		public static newError(error: Error, code: number): Error;
		public static regExpEsc(str: string): string;
		public static applyToClass(base: Object, structure: Object, skips?: string[]): void;
		public static exec(exec: string, options?: ExecOptions): Promise<{ stdout: string, stderr: string }>;
		public static sleep(delay: number, args?: any): Promise<any>;
		public static isFunction(input: Function): boolean;
		public static isNumber(input: number): boolean;
		public static isObject(input: Object): boolean;
		public static tryParse(value: any): any;
	}

	export { Util as util };

	export class Resolver {
		public constructor(client: KlasaClient);
		public client: KlasaClient;

		public msg(input: KlasaMessage | Snowflake, channel: Channel): Promise<KlasaMessage>;
		public user(input: ExtendedUser | GuildMember | KlasaMessage | Snowflake): Promise<ExtendedUser>;
		public member(input: ExtendedUser | GuildMember | Snowflake, guild: KlasaGuild): Promise<GuildMember>;
		public channel(input: Channel | Snowflake): Promise<Channel>;
		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public role(input: Role | Snowflake, guild: KlasaGuild): Promise<Role>;
		public boolean(input: boolean | string): Promise<boolean>;
		public string(input: string): Promise<string>;
		public integer(input: string | number): Promise<number>;
		public float(input: string | number): Promise<number>;
		public url(input: string): Promise<string>;

		public static readonly regex: {
			userOrMember: RegExp,
			channel: RegExp,
			role: RegExp,
			snowflake: RegExp,
		};
	}

	export class ArgResolver extends Resolver {
		public piece(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Piece>;
		public store(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Store>;

		public cmd(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Command>;
		public command(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Command>;
		public event(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Event>;
		public extendable(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Extendable>;
		public finalizer(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Finalizer>;
		public inhibitor(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Inhibitor>;
		public monitor(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Monitor>;
		public language(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Language>;
		public provider(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Provider>;

		public msg(input: string | KlasaMessage, channel: Channel): Promise<KlasaMessage>;
		public msg(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<KlasaMessage>;
		public message(input: string | KlasaMessage, channel: Channel): Promise<KlasaMessage>;
		public message(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<KlasaMessage>;

		public user(input: ExtendedUser | GuildMember | KlasaMessage | Snowflake): Promise<ExtendedUser>;
		public user(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<ExtendedUser>;
		public mention(input: ExtendedUser | GuildMember | KlasaMessage | Snowflake): Promise<ExtendedUser>;
		public mention(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<ExtendedUser>;

		public member(input: ExtendedUser | GuildMember | Snowflake, guild: KlasaGuild): Promise<GuildMember>;
		public member(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<GuildMember>;

		public channel(input: Channel | Snowflake): Promise<Channel>;
		public channel(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Channel>;

		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public guild(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<KlasaGuild>;

		public role(input: Role | Snowflake, guild: KlasaGuild): Promise<Role>;
		public role(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<Role>;

		public literal(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;

		public bool(input: boolean | string): Promise<boolean>;
		public bool(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<boolean>;
		public boolean(input: boolean | string): Promise<boolean>;
		public boolean(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<boolean>;

		public str(input: string): Promise<string>;
		public str(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;
		public string(input: string): Promise<string>;
		public string(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;

		public int(input: string | number): Promise<number>;
		public int(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<number>;
		public integer(input: string | number): Promise<number>;
		public integer(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<number>;

		public num(input: string | number): Promise<number>;
		public num(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<number>;
		public number(input: string | number): Promise<number>;
		public number(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<number>;
		public float(input: string | number): Promise<number>;
		public float(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<number>;

		public reg(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;
		public regex(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;
		public regexp(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;

		public url(input: string): Promise<string>;
		public url(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage): Promise<string>;

		public static minOrMax(value: number, min: number, max: number, currentUsage: Object, possible: number, repeat: boolean, msg: KlasaMessage, suffix: string): Promise<boolean>;
	}

	export class SettingResolver extends Resolver {
		public command(data: any, guild: KlasaGuild, name: string): Promise<Command>;
		public language(data: any, guild: KlasaGuild, name: string): Promise<Language>;

		public user(input: ExtendedUser | GuildMember | KlasaMessage | Snowflake): Promise<ExtendedUser>;
		public user(data: any, guild: KlasaGuild, name: string): Promise<ExtendedUser>;

		public channel(input: Channel | Snowflake): Promise<Channel>;
		public channel(data: any, guild: KlasaGuild, name: string): Promise<Channel>;

		public textchannel(data: any, guild: KlasaGuild, name: string): Promise<ExtendedTextChannel>;
		public voicechannel(data: any, guild: KlasaGuild, name: string): Promise<ExtendedVoiceChannel>;

		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public guild(data: any, guild: KlasaGuild, name: string): Promise<KlasaGuild>;

		public role(input: Role | Snowflake, guild: KlasaGuild): Promise<Role>;
		public role(data: any, guild: KlasaGuild, name: string): Promise<Role>;

		public boolean(input: boolean | string): Promise<boolean>;
		public boolean(data: any, guild: KlasaGuild, name: string): Promise<boolean>;

		public string(input: string): Promise<string>;
		public string(data: any, guild: KlasaGuild, name: string, minMax: { min: number, max: number }): Promise<string>;

		public integer(input: string | number): Promise<number>;
		public integer(data: any, guild: KlasaGuild, name: string, minMax: { min: number, max: number }): Promise<number>;

		public float(input: string | number): Promise<number>;
		public float(data: any, guild: KlasaGuild, name: string, minMax: { min: number, max: number }): Promise<number>;

		public url(input: string): Promise<string>;
		public url(data: any, guild: KlasaGuild, name: string): Promise<string>;

		public any(data: any): Promise<any>;

		public static maxOrMin(guild: KlasaGuild, value: number, min: number, max: number, name: string, suffix: string): boolean;
	}

	export class PermissionLevels extends Collection<number, PermissionLevel> {
		public constructor(levels?: number);
		public requiredLevels: number;

		public addLevel(level: number, brk: boolean, check: Function);
		public set(level: number, obj: PermissionLevel): this;
		public isValid(): boolean;
		public debug(): string;

		public run(msg: KlasaMessage, min: number): permissionLevelResponse;
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

		public fullUsage(msg: KlasaMessage): string;
		private static parseUsage(usageString: string): Tag[];
		private static tagOpen(usage: Object, char: string): Object;
		private static tagClose(usage: Object, char: string): Object;
		private static tagSpace(usage: Object, char: string): Object;
	}

	export class Possible {
		public constructor([match, name, type, min, max, regex, flags]: [string, string, string, string, string, string, string]);
		public name: string;
		public type: string;
		public min: number;
		public max: number;
		public regex: RegExp;

		private static resolveLimit(limit: string, type: string): number;
	}

	export class Tag {
		public constructor(members: string, count: number, required: boolean);
		public type: string;
		public possibles: Possible[];

		private static parseMembers(members: string, count: number): Possible[];
		private static parseTrueMembers(members: string): string[];
	}

	// Configuration
	export class Gateway {
		public constructor(store: GatewayDriver, type: string, validateFunction: Function, schema: Object, options: GatewayOptions);
		public store: GatewayDriver;
		public type: string;
		public options: GatewayOptions;
		public validate: Function;
		public defaultSchema: Object;
		public schema: Schema;
		public readonly sql: boolean;

		public init(download?: boolean): Promise<void>;
		private initTable(): Promise<void>;
		private initSchema(): Promise<Object>;

		public getEntry(input: string, create?: boolean): Object | Configuration;
		public createEntry(input: string): Promise<Configuration>;
		public insertEntry(id: string, data?: Object): Configuration;
		public deleteEntry(input: string): Promise<boolean>;

		public sync(input?: Object | string, download?: boolean): Promise<any>;

		public getPath(key?: string, options?: ConfigurationPathOptions): ConfigurationPathResult;

		private _resolveGuild(guild: GatewayGuildResolvable): KlasaGuild;
		private _ready(): Promise<Array<Collection<string, Configuration>>>;

		public readonly cache: Provider;
		public readonly provider: Provider;
		public readonly defaults: Object;
		public readonly client: KlasaClient;
		public readonly resolver: Resolver;

		public static throwError(guild: KlasaGuild, code: string | number, error: string | Error): string;
	}

	export class GatewaySQL extends Gateway {
		public readonly sqlSchema: string[];
		private parseEntry(entry: Object, schemaValues: SchemaPiece[]): Object;
		private static _parseSQLValue(value: any, schemaPiece: SchemaPiece): any;
	}

	export class Schema {
		public constructor(client: KlasaClient, manager: Gateway | GatewaySQL, object: Object, parent: Schema, key: string);
		public readonly client: KlasaClient;
		public readonly manager: Gateway | GatewaySQL;
		public readonly parent?: Schema;
		public readonly path: string;
		public readonly key: string;
		public readonly type: 'Folder';
		public defaults: Object;
		public keys: Set<string>;
		public keyArray: string[];

		public addFolder(key: string, object?: Object, force?: boolean): Promise<Schema>;
		public removeFolder(key: string, force?: boolean): Promise<Schema>;
		public hasKey(key: string): boolean;
		public addKey(key: string, options: AddOptions, force?: boolean): Promise<Schema>;
		private _addKey(key: string, options: AddOptions): void;
		public removeKey(key: string, force?: boolean): Promise<Schema>;
		private _removeKey(key: string): void;

		public force(action: 'add' | 'edit' | 'delete', key: string, piece: Schema | SchemaPiece): Promise<any>;
		public getList(msg: KlasaMessage): string;
		public getDefaults(object?: Object): Object;
		public getSQL(array?: string[]): string[];
		public getKeys(array?: string[]): string[];
		public getValues(array?: SchemaPiece[]): SchemaPiece[];
		public resolveString(): string;
		public toJSON(): Object;
		public toString(): string;

		public readonly configurableKeys: string[];

		private _setValue(parsedID: string, path: SchemaPiece, route: string[]): void;
		private _patch(object: Object): void;
	}

	export class SchemaPiece {
		public constructor(client: KlasaClient, manager: Gateway | GatewaySQL, options: AddOptions, parent: Schema, key: string);
		public readonly client: KlasaClient;
		public readonly manager: Gateway | GatewaySQL;
		public readonly parent: Schema;
		public readonly path: string;
		public readonly key: string;
		public type: string;
		public array: boolean;
		public default: any;
		public min?: number;
		public max?: number;
		public sql: [string, string];
		public configurable: boolean;

		public parse(value: any, guild: KlasaGuild): Promise<any>;
		public resolveString(msg: KlasaMessage, value: any): string;
		public modify(options: ModifyOptions): Promise<this>;

		private init(options: AddOptions): void;
		private _schemaCheckType(type: string): void;
		private _schemaCheckArray(array: boolean): void;
		private _schemaCheckDefault(options: AddOptions): void;
		private _schemaCheckLimits(min: number, max: number): void;
		private _schemaCheckConfigurable(configurable: boolean): void;

		public toJSON(): SchemaPieceJSON;
		public toString(): string;

		private static _parseSQLValue(value: any): string;
	}

	export class GatewayDriver {
		public constructor(client: KlasaClient);
		public readonly client: KlasaClient;
		public resolver: SettingResolver;
		public types: string[];
		public caches: string[];
		public ready: boolean;

		public guilds: Gateway | GatewaySQL;
		public users: Gateway | GatewaySQL;

		public add(name: string, validateFunction: Function, schema?: Object, options?: SettingsOptions, download?: boolean): Promise<Gateway | GatewaySQL>;
		private _ready(): Promise<Array<Array<Collection<string, Configuration>>>>;
		private _checkProvider(engine: string): Provider;
		private validateGuild(guildResolvable: Object | string): KlasaGuild;
		private validateUser(userResolvable: Object | string): ExtendedUser;

		public readonly defaultDataSchema: {
			prefix: SchemaPieceJSON,
			language: SchemaPieceJSON,
			disableNaturalPrefix: SchemaPieceJSON,
			disabledCommands: SchemaPieceJSON
		};
	}

	export class Configuration {
		public constructor(manager: Gateway | GatewaySQL, data: Object);
		public readonly client: KlasaClient;
		public readonly gateway: Gateway | GatewaySQL;
		public readonly type: string;
		public readonly id: string;
		public readonly existsInDB: boolean;

		public get(key: string): any;
		public clone(): Configuration;
		public resetConfiguration(): Promise<Configuration>;
		public sync(): Promise<this>;
		public destroy(): Promise<this>;

		public reset(key: string, avoidUnconfigurable?: boolean): Promise<ConfigurationUpdateResult>;
		public updateOne(key: string, value: any, guild?: GatewayGuildResolvable, avoidUnconfigurable?: boolean): Promise<ConfigurationUpdateResult>;
		public updateArray(action: 'add' | 'remove', key: string, value: any, guild?: GatewayGuildResolvable, avoidUnconfigurable?: boolean): Promise<ConfigurationUpdateResult>;
		public updateMany(object: Object, guild?: GatewayGuildResolvable): Promise<ConfigurationUpdateManyResult>;

		private _reset(key: string, guild: GatewayGuildResolvable, avoidUnconfigurable: boolean): Promise<ConfigurationParseResult>;
		private _parseReset(key: string, guild: KlasaGuild, options: ConfigurationParseOptions): Promise<ConfigurationParseResult>;
		private _parseUpdateOne(key: string, value: any, guild: KlasaGuild, options: ConfigurationParseOptions): Promise<ConfigurationParseResult>;
		private _parseUpdateArray(action: 'add' | 'remove', key: string, value: any, guild: KlasaGuild, options: ConfigurationParseOptions): Promise<ConfigurationParseResultArray>;
		private _sharedUpdateSingle(action: 'add' | 'remove', key: string, value: any, guild: KlasaGuild, avoidUnconfigurable: boolean): Promise<ConfigurationParseResult | ConfigurationParseResultArray>;
		private _updateMany(cache: Object, object: Object, schema: Schema, guild: KlasaGuild, list: ConfigurationUpdateManyResult): void;
		private _setValue(parsedID: string, path: SchemaPiece, route: string[]): Promise<void>;
		private _patch(data: Object): void;

		public toJSON(): Object;
		public toString(): string;

		private static _merge(data: any, folder: Schema | SchemaPiece): any;
		private static _clone(data: any, schema: Schema): Object;
		private static _patch(inst: Object, data: Object, schema: Schema): void;
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
		public static hslToRGB([h, s, l]: [number | string, number | string, number | string]): number[];
		public static formatArray([pos1, pos2, pos3]: [number | string, number | string, number | string]): string;

		public format(input: string, type?: ColorsFormatOptions): string;
	}

	class KlasaConsole extends Console {
		public constructor(options: KlasaConsoleConfig);
		public readonly stdout: NodeJS.WritableStream;
		public readonly stderr: NodeJS.WritableStream;
		public timestaamps: boolean | string;
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
	export class Piece {
		public reload(): Promise<Piece>;
		public unload(): void;
		public enable(): Piece;
		public disable(): Piece;
		public toString(): string;

		public static applyToClass(structure: Object, skips?: string[]): void;
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

		public abstract run(msg: KlasaMessage, params: any[]): Promise<KlasaMessage | KlasaMessage[] | any>;
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

		public abstract run(msg: KlasaMessage, mes: KlasaMessage, start: Stopwatch): void;
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

		public abstract run(msg: KlasaMessage, cmd: Command): Promise<void | string>;
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

		public get(term: string, ...args: any[]): string | Function;
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
		public abstract run(msg: KlasaMessage): void;
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
		public cache: boolean;
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
		public load(dir: string, file: string | string[]): Piece;
		public loadAll(): Promise<number>;
		public resolve(name: Piece | string): Piece;
		public toString(): string;

		public static applyToClass(structure: Object, skips?: string[]): void;
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
		public delete(name: Command | string): boolean;
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
		public delete(name: Event | string): boolean;
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

		public delete(name: Extendable | string): boolean;
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

		public delete(name: Finalizer | string): boolean;
		public run(msg: KlasaMessage, mes: KlasaMessage, start: number): void;
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

		public delete(name: Inhibitor | string): boolean;
		public run(msg: KlasaMessage, cmd: Command, selective: boolean): void;
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
		public delete(name: Language | string): boolean;
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

		public delete(name: Monitor | string): boolean;
		public run(msg: KlasaMessage): void;
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

		public delete(name: Provider | string): boolean;
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
		provider?: { engine: string };
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
		preserveConfigs?: boolean;
		quotedStringSupport?: boolean;
		readyMessage?: string | Function;
		ownerID?: string;
		regexPrefix?: RegExp;
	};

	export type ExecOptions = {
		cwd?: string;
		env?: StringMappedType<string>;
		encoding?: string;
		shell?: string;
		timeout?: number;
		maxBuffer?: number;
		killSignal?: string | number;
		uid?: number;
		gid?: number;
	};

	export type GatewayOptions = {
		provider?: Provider;
		cache?: Provider;
		nice?: boolean;
	};

	export type ConfigurationUpdateResult = {
		value: any;
		path: SchemaPiece;
	};

	export type ConfigurationParseOptions = {
		path: string;
		route: string[];
	};

	export type ConfigurationParseResult = {
		parsed: any;
		parsedID: string | number | object;
		settings: Configuration;
		array: null;
		entryID: string;
	} & ConfigurationParseOptions;

	export type ConfigurationParseResultArray = {
		parsed: any;
		parsedID: string | number | object;
		settings: Configuration;
		array: any[];
		entryID: string;
	} & ConfigurationParseOptions;

	export type ConfigurationUpdateManyList = {
		errors: Error[];
		promises: Array<Promise<any>>;
		keys: string[];
		values: any[];
	};

	export type ConfigurationUpdateManyUpdated = {
		keys: string[];
		values: any[];
	};

	export type ConfigurationUpdateManyResult = {
		updated: ConfigurationUpdateManyUpdated;
		errors: Error[];
	};

	export type ConfigUpdateEntryMany = {
		type: 'MANY';
		keys: string[];
		values: any[];
	};

	export type GatewayGuildResolvable = KlasaGuild
		| ExtendedTextChannel
		| ExtendedVoiceChannel
		| KlasaMessage
		| Role
		| Snowflake;

	export type ConfigurationPathOptions = {
		avoidUnconfigurable?: boolean;
		piece?: boolean;
	};

	export type ConfigurationPathResult = {
		path: SchemaPiece;
		route: string[];
	};

	export type SchemaPieceJSON = {
		type: string;
		array: boolean;
		default: any;
		min?: number;
		max?: number;
		sql: [string, string];
		configurable: boolean;
	};

	export type SettingsOptions = {
		provider?: string;
		nice?: boolean;
	};

	export type KlasaConsoleConfig = {
		stdout?: NodeJS.WritableStream;
		stderr?: NodeJS.WritableStream;
		useColor?: boolean;
		colors?: Colors;
		timestamps?: boolean | string;
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
		configurable?: boolean;
	};

	export type ModifyOptions = {
		default?: any;
		min?: number;
		max?: number;
		configurable?: boolean;
	};

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
		style: string | string[];
		background: string | number | string[];
		text: string | number | string[]
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

	export type TextColorTypes = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'gray' | 'grey' | 'lightgray' | 'lightgrey' | 'lightred' | 'lightgreen' | 'lightyellow' | 'lightblue' | 'lightmagenta' | 'lightcyan' | 'white' | number[] | string[];

	export type BackgroundColorTypes = 'black' | 'red' | 'green' | 'blue' | 'magenta' | 'cyan' | 'gray' | 'grey' | 'lightgray' | 'lightgrey' | 'lightred' | 'lightgreen' | 'lightyellow' | 'lightblue' | 'lightmagenta' | 'lightcyan' | 'white' | number[] | string[];

	export type StyleTypes = 'normal' | 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden' | 'strikethrough';

	type StringMappedType<T> = { [key: string]: T };

	export type GuildSettings = StringMappedType<any>;
	export type SchemaObject = StringMappedType<SchemaPiece>;
	export type SchemaDefaults = StringMappedType<any>;

	// Extended classes
	export type ExtendedUser = {
		send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	} & KlasaUser;

	export type ExtendedTextChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		guild: KlasaGuild;
		send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	} & DiscordTextChannel;

	export type ExtendedVoiceChannel = {
		guild: KlasaGuild;
	} & DiscordVoiceChannel;

	export type ExtendedDMChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	} & DiscordDMChannel;

	export type ExtendedGroupDMChannel = {
		attachable: boolean;
		embedable: boolean;
		postable: boolean;
		send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	} & DiscordGroupDMChannel;

}
