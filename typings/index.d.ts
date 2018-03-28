declare module 'klasa' {

	import {
		BufferResolvable,
		Channel,
		Client,
		ClientApplication,
		ClientOptions,
		ClientUser,
		ClientUserGuildSettings,
		ClientUserSettings,
		Collection,
		DMChannel as DiscordDMChannel,
		Emoji,
		GroupDMChannel as DiscordGroupDMChannel,
		Guild as DiscordGuild,
		GuildMember,
		Message as DiscordMessage,
		MessageAttachment,
		MessageCollector,
		MessageEmbed,
		MessageOptions,
		MessageReaction,
		ReactionCollector,
		Role,
		Snowflake,
		StringResolvable,
		User as DiscordUser,
		UserResolvable,
		TextChannel as DiscordTextChannel,
		VoiceChannel as DiscordVoiceChannel,
		CategoryChannel as DiscordCategoryChannel,
		WebhookClient
	} from 'discord.js';

	export const version: string;

//#region Classes

	export class KlasaClient extends Client {
		public constructor(options?: KlasaClientOptions & ClientOptions);
		public options: KlasaClientOptions & ClientOptions;
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
		public tasks: TaskStore;
		public events: EventStore;
		public extendables: ExtendableStore;
		public pieceStores: Collection<string, any>;
		public permissionLevels: PermissionLevels;
		public sharded: boolean;
		public methods: {
			Collection: typeof Collection;
			Embed: typeof MessageEmbed;
			KlasaMessage: typeof KlasaMessage;
			MessageCollector: typeof MessageCollector;
			Webhook: typeof WebhookClient;
			util: typeof Util;
		};
		public gateways: GatewayDriver;
		public configs?: Configuration;
		public application: ClientApplication;
		public schedule: Schedule;
		public ready: boolean;

		public readonly invite: string;
		public readonly owner?: KlasaUser;
		public validatePermissionLevels(): PermissionLevels;
		public registerStore<K, V>(store: Store<K, V>): KlasaClient;
		public unregisterStore<K, V>(store: Store<K, V>): KlasaClient;

		public registerPiece<K, V>(pieceName: string, store: Store<K, V>): KlasaClient;
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
		public on(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public on(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void): this;
		public on(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public on(event: 'disconnect', listener: (event: any) => void): this;
		public on(event: 'emojiCreate | emojiDelete', listener: (emoji: Emoji) => void): this;
		public on(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
		public on(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
		public on(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: KlasaGuild) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public on(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
		public on(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
		public on(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
		public on(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public on(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public on(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: KlasaUser) => void): this;
		public on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: KlasaUser, newUser: KlasaUser) => void): this;

		// Klasa Command Events
		public on(event: 'commandError', listener: (msg: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
		public on(event: 'commandInhibited', listener: (msg: KlasaMessage, command: Command, response: string | Error) => void): this;
		public on(event: 'commandRun', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public on(event: 'commandSuccess', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public on(event: 'commandUnknown', listener: (msg: KlasaMessage, command: string) => void): this;

		public on(event: 'monitorError', listener: (msg: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
		public on(event: 'finalizerError', listener: (msg: KlasaMessage, mes: KlasaMessage, timer: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
		public on(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;

		// SettingGateway Events
		public on(event: 'configCreateEntry', listener: (entry: Configuration) => void): this;
		public on(event: 'configDeleteEntry', listener: (entry: Configuration) => void): this;
		public on(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path: string[]) => void): this;

		// Schema Events
		public on(event: 'schemaKeyAdd', listener: (key: SchemaFolder | SchemaPiece) => void): this;
		public on(event: 'schemaKeyRemove', listener: (key: SchemaFolder | SchemaPiece) => void): this;
		public on(event: 'schemaKeyUpdate', listener: (key: SchemaPiece) => void): this;

		// Klasa Console Custom Events
		public on(event: 'log', listener: (data: any) => void): this;
		public on(event: 'verbose', listener: (data: any) => void): this;
		public on(event: 'wtf', listener: (failure: Error) => void): this;

		// Klasa Piece Events
		public on(event: 'pieceDisabled', listener: (piece: Piece) => void): this;
		public on(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
		public on(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
		public on(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
		public on(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;

		// Discord.js events
		public once(event: string, listener: Function): this;
		public once(event: 'channelCreate' | 'channelDelete', listener: (channel: Channel) => void): this;
		public once(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public once(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public once(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public once(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public once(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void): this;
		public once(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public once(event: 'disconnect', listener: (event: any) => void): this;
		public once(event: 'emojiCreate | emojiDelete', listener: (emoji: Emoji) => void): this;
		public once(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
		public once(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
		public once(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: KlasaGuild) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public once(event: 'guildMemberUpdate' | 'presenceUpdate' | 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
		public once(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
		public once(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
		public once(event: 'ready' | 'reconnecting' | 'resume', listener: () => void): this;
		public once(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public once(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: KlasaUser) => void): this;
		public once(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: KlasaUser, newUser: KlasaUser) => void): this;

		// Klasa Command Events
		public once(event: 'commandError', listener: (msg: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
		public once(event: 'commandInhibited', listener: (msg: KlasaMessage, command: Command, response: string | Error) => void): this;
		public once(event: 'commandRun', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public once(event: 'commandSuccess', listener: (msg: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public once(event: 'commandUnknown', listener: (msg: KlasaMessage, command: string) => void): this;

		public once(event: 'monitorError', listener: (msg: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
		public once(event: 'finalizerError', listener: (msg: KlasaMessage, mes: KlasaMessage, timer: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
		public once(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;

		// SettingGateway Events
		public once(event: 'configCreateEntry', listener: (entry: Configuration) => void): this;
		public once(event: 'configDeleteEntry', listener: (entry: Configuration) => void): this;
		public once(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path?: string) => void): this;

		// Schema Events
		public once(event: 'schemaKeyAdd', listener: (key: SchemaFolder | SchemaPiece) => void): this;
		public once(event: 'schemaKeyRemove', listener: (key: SchemaFolder | SchemaPiece) => void): this;
		public once(event: 'schemaKeyUpdate', listener: (key: SchemaPiece) => void): this;

		// Klasa Console Custom Events
		public once(event: 'log', listener: (data: any) => void): this;
		public once(event: 'verbose', listener: (data: any) => void): this;
		public once(event: 'wtf', listener: (failure: Error) => void): this;

		// Klasa Piece Events
		public once(event: 'pieceDisabled', listener: (piece: Piece) => void): this;
		public once(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
		public once(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
		public once(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
		public once(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;
	}

	export { KlasaClient as Client };

//#region Extensions

	export class KlasaGuild extends DiscordGuild {
		public configs: Configuration;
		public readonly language?: Language;
	}

	export class KlasaMessage extends DiscordMessage {
		public readonly guild: KlasaGuild;
		public guildConfigs: Configuration;
		public language: Language;
		public command?: Command;
		public prefix?: RegExp;
		public prefixLength?: number;
		private prompter?: CommandPrompt;
		private _responses: Snowflake[];

		public readonly responses: KlasaMessage[];
		public readonly args: string[];
		public readonly params: any[];
		public readonly flags: object;
		public readonly reprompted: boolean;
		public readonly reactable: boolean;
		public prompt(text: string, time?: number): Promise<KlasaMessage>;
		public usableCommands(): Promise<Collection<string, Command>>;
		public hasAtLeastPermissionLevel(min: number): Promise<boolean>;

		public sendMessage(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;

		private _patch(data: any): void;
		private _registerCommand(commandInfo: { command: Command, prefix: RegExp, prefixLength: number }): void;
		private static combineContentOptions(content?: StringResolvable, options?: MessageOptions): MessageOptions;
	}

	export class KlasaUser extends DiscordUser {
		public configs: Configuration;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		public sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

	export class KlasaTextChannel extends DiscordTextChannel {
		public readonly attachable: boolean;
		public readonly embedable: boolean;
		public readonly postable: boolean;
		public readonly guild: KlasaGuild;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		public sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

	export class KlasaVoiceChannel extends DiscordVoiceChannel {
		public readonly guild: KlasaGuild;
	}

	export class KlasaCategoryChannel extends DiscordCategoryChannel {
		public readonly guild: KlasaGuild;
	}

	export class KlasaDMChannel extends DiscordDMChannel {
		public readonly attachable: boolean;
		public readonly embedable: boolean;
		public readonly postable: boolean;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		public sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

	export class KlasaGroupDMChannel extends DiscordGroupDMChannel {
		public readonly attachable: boolean;
		public readonly embedable: boolean;
		public readonly postable: boolean;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		public sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

//#endregion Extensions

//#region Parsers

	export class ArgResolver extends Resolver {

		public custom(arg: string, possible: Possible, msg: KlasaMessage, custom: ArgResolverCustomMethod): Promise<any>;
		public piece(arg: string, possible: Possible, msg: KlasaMessage): Promise<Piece>;
		public store<K, V>(arg: string, possible: Possible, msg: KlasaMessage): Promise<Store<K, V>>;

		public cmd(arg: string, possible: Possible, msg: KlasaMessage): Promise<Command>;
		public command(arg: string, possible: Possible, msg: KlasaMessage): Promise<Command>;
		public event(arg: string, possible: Possible, msg: KlasaMessage): Promise<Event>;
		public extendable(arg: string, possible: Possible, msg: KlasaMessage): Promise<Extendable>;
		public finalizer(arg: string, possible: Possible, msg: KlasaMessage): Promise<Finalizer>;
		public inhibitor(arg: string, possible: Possible, msg: KlasaMessage): Promise<Inhibitor>;
		public language(arg: string, possible: Possible, msg: KlasaMessage): Promise<Language>;
		public monitor(arg: string, possible: Possible, msg: KlasaMessage): Promise<Monitor>;
		public provider(arg: string, possible: Possible, msg: KlasaMessage): Promise<Provider>;
		public task(arg: string, possible: Possible, msg: KlasaMessage): Promise<Task>;

		public message(arg: string, possible: Possible, msg: KlasaMessage): Promise<KlasaMessage>;
		public msg(arg: string, possible: Possible, msg: KlasaMessage): Promise<KlasaMessage>;
		public mention(arg: string, possible: Possible, msg: KlasaMessage): Promise<KlasaUser>;
		public user(arg: string, possible: Possible, msg: KlasaMessage): Promise<KlasaUser>;
		public member(arg: string, possible: Possible, msg: KlasaMessage): Promise<GuildMember>;
		public channel(arg: string, possible: Possible, msg: KlasaMessage): Promise<Channel>;
		public emoji(arg: string, possible: Possible, msg: KlasaMessage): Promise<Emoji>;
		public guild(arg: string, possible: Possible, msg: KlasaMessage): Promise<KlasaGuild>;
		public role(arg: string, possible: Possible, msg: KlasaMessage): Promise<Role>;
		public literal(arg: string, possible: Possible, msg: KlasaMessage): Promise<string>;
		public boolean(arg: string, possible: Possible, msg: KlasaMessage): Promise<boolean>;
		public bool(arg: string, possible: Possible, msg: KlasaMessage): Promise<boolean>;
		public string(arg: string, possible: Possible, msg: KlasaMessage): Promise<string>;
		public str(arg: string, possible: Possible, msg: KlasaMessage): Promise<string>;
		public integer(arg: string, possible: Possible, msg: KlasaMessage): Promise<number>;
		public int(arg: string, possible: Possible, msg: KlasaMessage): Promise<number>;
		public num(arg: string, possible: Possible, msg: KlasaMessage): Promise<number>;
		public number(arg: string, possible: Possible, msg: KlasaMessage): Promise<number>;
		public float(arg: string, possible: Possible, msg: KlasaMessage): Promise<number>;
		public reg(arg: string, possible: Possible, msg: KlasaMessage): Promise<RegExpExecArray>;
		public regex(arg: string, possible: Possible, msg: KlasaMessage): Promise<RegExpExecArray>;
		public regexp(arg: string, possible: Possible, msg: KlasaMessage): Promise<RegExpExecArray>;
		public url(arg: string, possible: Possible, msg: KlasaMessage): Promise<string>;
		public date(arg: string, possible: Possible, msg: KlasaMessage): Promise<Date>;
		public duration(arg: string, possible: Possible, msg: KlasaMessage): Promise<Date>;
		public time(arg: string, possible: Possible, msg: KlasaMessage): Promise<Date>;

		// Overloads for TS retrocompatibility
		public message(input: string | KlasaMessage, channel: Channel): Promise<KlasaMessage>;
		public msg(input: string | KlasaMessage, channel: Channel): Promise<KlasaMessage>;
		public mention(input: KlasaUser | GuildMember | KlasaMessage | Snowflake): Promise<KlasaUser>;
		public user(input: KlasaUser | GuildMember | KlasaMessage | Snowflake): Promise<KlasaUser>;
		public member(input: KlasaUser | GuildMember | Snowflake, guild: KlasaGuild): Promise<GuildMember>;
		public channel(input: Channel | Snowflake): Promise<Channel>;
		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public role(input: Role | Snowflake, guild: KlasaGuild): Promise<Role>;
		public boolean(input: boolean | string): Promise<boolean>;
		public bool(input: boolean | string): Promise<boolean>;
		public string(input: string): Promise<string>;
		public str(input: string): Promise<string>;
		public integer(input: string | number): Promise<number>;
		public int(input: string | number): Promise<number>;
		public num(input: string | number): Promise<number>;
		public number(input: string | number): Promise<number>;
		public float(input: string | number): Promise<number>;
		public url(input: string): Promise<string>;

		private static minOrMax(client: KlasaClient, value: number, min: number, max: number, possible: Possible, msg: KlasaMessage, suffix: string): boolean;
	}

	export class Resolver {
		public constructor(client: KlasaClient);
		public readonly client: KlasaClient;

		public boolean(input: boolean | string): Promise<boolean>;
		public channel(input: Channel | Snowflake): Promise<Channel>;
		public float(input: string | number): Promise<number>;
		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public integer(input: string | number): Promise<number>;
		public member(input: KlasaUser | GuildMember | Snowflake, guild: KlasaGuild): Promise<GuildMember>;
		public msg(input: KlasaMessage | Snowflake, channel: Channel): Promise<KlasaMessage>;
		public role(input: Role | Snowflake, guild: KlasaGuild): Promise<Role>;
		public string(input: string): Promise<string>;
		public url(input: string): Promise<string>;
		public user(input: KlasaUser | GuildMember | KlasaMessage | Snowflake): Promise<KlasaUser>;

		public static readonly regex: {
			userOrMember: RegExp,
			channel: RegExp,
			role: RegExp,
			snowflake: RegExp
		};
	}

	export class SettingResolver extends Resolver {
		public any(data: any): Promise<any>;
		public boolean(data: any, guild: KlasaGuild, name: string): Promise<boolean>;
		public boolean(input: boolean | string): Promise<boolean>;
		public channel(data: any, guild: KlasaGuild, name: string): Promise<Channel>;
		public channel(input: Channel | Snowflake): Promise<Channel>;
		public command(data: any, guild: KlasaGuild, name: string): Promise<Command>;
		public float(data: any, guild: KlasaGuild, name: string, minMax: { min: number, max: number }): Promise<number>;
		public float(input: string | number): Promise<number>;
		public guild(data: any, guild: KlasaGuild, name: string): Promise<KlasaGuild>;
		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public integer(data: any, guild: KlasaGuild, name: string, minMax: { min: number, max: number }): Promise<number>;
		public integer(input: string | number): Promise<number>;
		public language(data: any, guild: KlasaGuild, name: string): Promise<Language>;
		public role(data: any, guild: KlasaGuild, name: string): Promise<Role>;
		public role(input: Role | Snowflake, guild: KlasaGuild): Promise<Role>;
		public string(data: any, guild: KlasaGuild, name: string, minMax: { min: number, max: number }): Promise<string>;
		public string(input: string): Promise<string>;
		public textchannel(data: any, guild: KlasaGuild, name: string): Promise<KlasaTextChannel>;
		public url(data: any, guild: KlasaGuild, name: string): Promise<string>;
		public url(input: string): Promise<string>;
		public user(data: any, guild: KlasaGuild, name: string): Promise<KlasaUser>;
		public user(input: KlasaUser | GuildMember | KlasaMessage | Snowflake): Promise<KlasaUser>;
		public voicechannel(data: any, guild: KlasaGuild, name: string): Promise<KlasaVoiceChannel>;
		public categorychannel(data: any, guild: KlasaGuild, name: string): Promise<KlasaCategoryChannel>;

		public static maxOrMin(guild: KlasaGuild, value: number, min: number, max: number, name: string, suffix: string): boolean;
	}

//#endregion Parsers

//#region Permissions

	export class PermissionLevels extends Collection<number, PermissionLevel> {
		public constructor(levels?: number);

		public add(level: number, check: (client: KlasaClient, msg: KlasaMessage) => boolean, options?: PermissionLevelOptions): this;
		public debug(): string;
		public isValid(): boolean;
		public remove(level: number): this;
		public set(level: number, obj: PermissionLevelOptions | symbol): this;

		public run(msg: KlasaMessage, min: number): PermissionLevelsData;
	}

//#endregion Permissions

//#region Schedule

	export class Schedule {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public tasks: ScheduledTask[];
		public timeInterval: number;
		private _interval: NodeJS.Timer;

		private readonly _tasks: ScheduledTaskOptions[];
		public init(): Promise<void>;
		public execute(): Promise<void>;
		public next(): ScheduledTask;
		public create(taskName: string, time: Date | number | string, options: ScheduledTaskOptions): Promise<ScheduledTask>;
		public delete(id: string): Promise<this>;
		public clear(): Promise<void>;

		private _add(taskName: string, time: Date | number | string, options: ScheduledTaskOptions): ScheduledTask;
		private _insert(task: ScheduledTask): ScheduledTask;
		private _clearInterval(): void;
		private _checkInterval(): void;

		public [Symbol.iterator](): Iterator<ScheduledTask>;
	}

	export class ScheduledTask {
		public constructor(client: KlasaClient, taskName: string, time: Date | number | string, options?: ScheduledTaskOptions);
		public readonly client: KlasaClient;
		public readonly store: Schedule;
		public taskName: string;
		public recurring?: Cron;
		public time?: Date;
		public id: string;
		public data: any;

		public readonly task?: Task;
		public run(): Promise<this>;
		public update(options?: ScheduledTaskUpdateOptions): Promise<this>;
		public delete(): Promise<Schedule>;
		public toJSON(): ScheduledTaskJSON;

		private static _resolveTime(time: Date | number | Cron | string): [Date, Cron];
		private static _generateID(client: KlasaClient, time: Date | number): string;
		private static _validate(st: ScheduledTask): void;
	}

//#endregion Schedule

//#region Settings

	export class Configuration {
		public constructor(manager: Gateway, data: any);
		public readonly client: KlasaClient;
		public readonly gateway: Gateway;
		public readonly id: string;
		private _existsInDB: boolean;
		private _syncStatus?: Promise<object>;

		public get(key: string): any;
		public get<T>(key: string): T;
		public clone(): Configuration;
		public sync(): Promise<this>;
		public destroy(): Promise<this>;

		public reset(key?: string | string[], avoidUnconfigurable?: boolean): Promise<ConfigurationUpdateResult>;
		public reset(key?: string | string[], guild?: KlasaGuild, avoidUnconfigurable?: boolean): Promise<ConfigurationUpdateResult>;
		public update(key: object, guild?: GatewayGuildResolvable): Promise<ConfigurationUpdateResult>;
		public update(key: string, value: any, guild?: GatewayGuildResolvable, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: string[], value: any[], guild?: GatewayGuildResolvable, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public list(msg: KlasaMessage, path: SchemaFolder | string): string;
		public resolveString(msg: KlasaMessage, path: SchemaPiece | string): string;

		private _get(route: string | string[], piece?: boolean): object;
		private _get<T>(route: string | string[], piece?: boolean): T;
		private _save(data: ConfigurationUpdateResult): Promise<void>;
		private _updateMany(object: any, guild?: GatewayGuildResolvable): Promise<ConfigurationUpdateResult>;
		private _parseSingle(key: string, value: any, guild: KlasaGuild | null, options: ConfigurationUpdateOptions, list: ConfigurationUpdateResult): Promise<void>;
		private _parseUpdateMany(cache: any, object: any, schema: SchemaFolder, guild: KlasaGuild, list: ConfigurationUpdateResult): void;
		private _setValueByPath(piece: SchemaPiece, parsedID: any): { updated: boolean, old: any };
		private _patch(data: any): void;

		public toJSON(): object;
		public toString(): string;

		private static _merge(data: any, folder: SchemaFolder | SchemaPiece): any;
		private static _clone(data: any, schema: SchemaFolder): any;
		private static _patch(inst: any, data: any, schema: SchemaFolder): void;
	}

	export class Gateway extends GatewayStorage {
		private constructor(store: GatewayDriver, type: string, schema: object, options: GatewayOptions);
		public store: GatewayDriver;
		public options: GatewayOptions;
		public defaultSchema: object;
		public readonly resolver: SettingResolver;
		public readonly cache: Collection<string, Configuration>;

		public getEntry(input: string, create?: boolean): object | Configuration;
		public createEntry(input: string): Promise<Configuration>;
		public insertEntry(id: string, data?: object): Configuration;
		public deleteEntry(input: string): Promise<boolean>;
		public sync(input?: object | string, download?: boolean): Promise<any>;
		public getPath(key?: string, options?: GatewayGetPathOptions): GatewayGetPathResult | null;

		private init(download?: boolean): Promise<void>;
		private _ready(): Promise<Array<Collection<string, Configuration>>>;
		private _resolveGuild(guild: GatewayGuildResolvable): KlasaGuild;
		private _shardSync(path: string[], data: any, action: 'add' | 'delete' | 'update', force: boolean): Promise<void>;

		public toJSON(): GatewayJSON;
		public toString(): string;
	}

	export class GatewayDriver {
		private constructor(client: KlasaClient);
		public readonly client: KlasaClient;
		public resolver: SettingResolver;
		public types: Set<string>;
		public keys: Set<string>;
		public ready: boolean;
		private _queue: Map<string, (() => Gateway)>;

		public readonly guildsSchema: {
			prefix: SchemaPieceJSON,
			language: SchemaPieceJSON,
			disableNaturalPrefix: SchemaPieceJSON,
			disabledCommands: SchemaPieceJSON
		};

		public readonly clientStorageSchema: {
			userBlacklist: SchemaPieceJSON,
			guildBlacklist: SchemaPieceJSON,
			schedules: SchemaPieceJSON
		};

		public guilds: Gateway;
		public users: Gateway;
		public clientStorage: Gateway;

		public register(name: string, schema?: object, options?: GatewayDriverAddOptions): this;
		private _register(name: string, schema?: object, options?: GatewayDriverAddOptions): Gateway;
		private _ready(): Promise<Array<Array<Collection<string, Configuration>>>>;
		private _checkProvider(engine: string): string;

		public toJSON(): GatewayDriverJSON;
		public toString(): string;
	}

	export abstract class GatewayStorage {
		public constructor(client: KlasaClient, type: string, provider?: string);
		public readonly client: KlasaClient;
		public readonly type: string;
		public readonly providerName: string;
		public readonly baseDir: string;
		public readonly filePath: string;
		public readonly sql: boolean;
		public schema?: SchemaFolder;
		public ready: boolean;

		public readonly sqlSchema: string[][];
		public readonly provider?: Provider;
		public readonly defaults: any;

		private initTable(): Promise<void>;
		private initSchema(): Promise<SchemaFolder>;
		private parseEntry(entry: any): any;

		private static _parseSQLValue(value: any, schemaPiece: SchemaPiece): any;
	}

	export abstract class Schema {
		public constructor(client: KlasaClient, gateway: Gateway, object: any, parent: SchemaFolder, key: string);
		public readonly client: KlasaClient;
		public readonly gateway: Gateway;
		public readonly parent?: SchemaFolder;
		public readonly path: string;
		public readonly key: string;
		private readonly _inited: true;
	}

	export class SchemaFolder extends Schema {
		private constructor(client: KlasaClient, gateway: Gateway, object: any, parent: SchemaFolder, key: string);
		public readonly type: 'Folder';
		public defaults: object;
		public keyArray: string[];

		public readonly configurableKeys: string[];

		public add(key: string, options: SchemaFolderAddOptions | { [k: string]: SchemaFolderAddOptions }, force?: boolean): Promise<SchemaFolder>;
		public has(key: string): boolean;
		public remove(key: string, force?: boolean): Promise<SchemaFolder>;
		public force(action: 'add' | 'delete', key: string, piece: SchemaFolder | SchemaPiece): Promise<any>;
		public getDefaults(data?: object): object;
		public getSQL(array?: string[]): string[];

		private _add(key: string, options: SchemaFolderAddOptions, type: typeof Schema | typeof SchemaFolder): void;
		private _remove(key: string): void;
		private _shardSyncSchema(piece: SchemaFolder | SchemaPiece, action: 'add' | 'delete' | 'update', force: boolean): Promise<void>;
		private _init(options: object): true;

		public entries(recursive?: boolean): Iterator<[string, SchemaFolder | SchemaPiece]>;
		public values(recursive?: boolean): Iterator<SchemaFolder | SchemaPiece>;
		public keys(recursive?: boolean): Iterator<string>;
		public [Symbol.iterator](): Iterator<[string, SchemaFolder | SchemaPiece]>;

		public toJSON(): any;
		public toString(): string;
	}

	export class SchemaPiece extends Schema {
		private constructor(client: KlasaClient, gateway: Gateway, options: SchemaFolderAddOptions, parent: SchemaFolder, key: string);
		public type: string;
		public array: boolean;
		public default: any;
		public min?: number;
		public max?: number;
		public sql: [string, string];
		public configurable: boolean;
		public validator?: (resolved: any, guild?: KlasaGuild) => void;

		public setValidator(fn: Function): this;
		public parse(value: any, guild: KlasaGuild): Promise<any>;
		public modify(options: SchemaPieceEditOptions): Promise<this>;

		private _generateDefault(): Array<any> | false | null;
		private _schemaCheckType(type: string): void;
		private _schemaCheckArray(array: boolean): void;
		private _schemaCheckDefault(options: SchemaFolderAddOptions): void;
		private _schemaCheckLimits(min: number, max: number): void;
		private _schemaCheckConfigurable(configurable: boolean): void;
		private _generateSQLDatatype(sql?: string): string;
		private _init(options: SchemaFolderAddOptions): true;

		public toJSON(): SchemaPieceJSON;
		public toString(): string;

		private static _parseSQLValue(value: any): string;
	}

//#endregion Settings

//#region Pieces

	export class Piece {
		public constructor(client: KlasaClient, store: Store<string, Piece>, type: string, file: string | string[], core: boolean, options?: PieceOptions);
		public readonly client: KlasaClient;
		public readonly core: boolean;
		public readonly type: string;
		public file: string | string[];
		public name: string;
		public enabled: boolean;
		public store: Store<string, this>;

		public reload(): Promise<Piece>;
		public unload(): void;
		public enable(): Piece;
		public disable(): Piece;
		public init(): Promise<any>;

		public toJSON(): PieceJSON;
		public toString(): string;
	}

	export abstract class Command extends Piece {
		public constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean, options?: CommandOptions);
		public readonly category: string;
		public readonly subCategory: string;
		public readonly usageDelim: string;
		public readonly usageString: string;
		public aliases: string[];
		public botPerms: string[];
		public bucket: number;
		public cooldown: number;
		public deletable: boolean;
		public description: string | ((msg: KlasaMessage) => string);
		public extendedHelp: string | ((msg: KlasaMessage) => string);
		public fullCategory: string[];
		public guarded: boolean;
		public nsfw: boolean;
		public permLevel: number;
		public promptLimit: number;
		public promptTime: number;
		public quotedStringSupport: boolean;
		public requiredConfigs: string[];
		public runIn: string[];
		public subcommands: boolean;
		public usage: CommandUsage;
		private cooldowns: Map<Snowflake, number>;

		public definePrompt(usageString: string, usageDelim: string): Usage;
		public createCustomResolver(type: string, resolver: ArgResolverCustomMethod): this;
		public customizeResponse(name: string, response: string | ((msg: KlasaMessage, possible: Possible) => string)): this;

		public run(msg: KlasaMessage, params: any[]): Promise<KlasaMessage | KlasaMessage[]>;
		public toJSON(): PieceCommandJSON;
	}

	export abstract class Event extends Piece {
		public constructor(client: KlasaClient, store: EventStore, file: string, core: boolean, options?: EventOptions);
		public emitter: NodeJS.EventEmitter;
		public event: string;
		public once: boolean;
		private _listener: Function;

		public abstract run(...params: any[]): void;
		public toJSON(): PieceEventJSON;

		private _run(param: any): void;
		private _runOnce(...args: any[]): Promise<void>;
		private _listen(): void;
		private _unlisten(): void;
	}

	export abstract class Extendable extends Piece {
		public constructor(client: KlasaClient, store: ExtendableStore, file: string, core: boolean, options?: ExtendableOptions);
		public readonly static: boolean;
		public appliesTo: string[];
		public target: boolean;

		public extend(...params: any[]): any;
		public static extend(...params: any[]): any;
		public toJSON(): PieceExtendableJSON;
	}

	export abstract class Finalizer extends Piece {
		public abstract run(msg: KlasaMessage, mes: KlasaMessage, start: Stopwatch): void;
		public toJSON(): PieceFinalizerJSON;
	}

	export abstract class Inhibitor extends Piece {
		public constructor(client: KlasaClient, store: InhibitorStore, file: string, core: boolean, options?: InhibitorOptions);
		public spamProtection: boolean;

		public abstract run(msg: KlasaMessage, cmd: Command): Promise<void | string>;
		public toJSON(): PieceInhibitorJSON;
	}

	export abstract class Language extends Piece {
		public language: { [key: string]: any };

		public get(term: string, ...args: any[]): any;
		public toJSON(): PieceLanguageJSON;
	}

	export abstract class Monitor extends Piece {
		public constructor(client: KlasaClient, store: MonitorStore, file: string, core: boolean, options?: MonitorOptions);

		public ignoreBots: boolean;
		public ignoreEdits: boolean;
		public ignoreOthers: boolean;
		public ignoreSelf: boolean;
		public ignoreWebhooks: boolean;
		public abstract run(msg: KlasaMessage): void;
		public shouldRun(msg: KlasaMessage, edit?: boolean): boolean;
		public toJSON(): PieceMonitorJSON;
	}

	export abstract class Provider extends Piece {
		public constructor(client: KlasaClient, store: ProviderStore, file: string, core: boolean, options?: ProviderOptions);

		public cache: boolean;
		public sql: boolean;

		public abstract hasTable(table: string): Promise<boolean>;
		public abstract createTable(table: string): Promise<any>;
		public abstract deleteTable(table: string): Promise<any>;
		public abstract getAll<T>(table: string): Promise<T[]>;
		public abstract getKeys(table: string): Promise<string[]>;
		public abstract get<T>(table: string, entry: string): Promise<T>;
		public abstract has(table: string, entry: string): Promise<boolean>;
		public abstract updateValue(table: string, path: string, newValue: any): Promise<any>;
		public abstract removeValue(table: string, path: string): Promise<any>;
		public abstract create(table: string, entry: string, data: any): Promise<any>;
		public abstract update(table: string, entry: string, data: any): Promise<any>;
		public abstract replace(table: string, entry: string, data: any): Promise<any>;
		public abstract delete(table: string, entry: string): Promise<any>;

		public shutdown(): Promise<void>;
		public toJSON(): PieceProviderJSON;
	}

	export abstract class Task extends Piece {
		public abstract run(data: any): Promise<void>;
		public toJSON(): PieceTaskJSON;
	}

//#endregion Pieces

//#region Stores

	export class Store<K, V> extends Collection<K, V> {
		public constructor(client: KlasaClient, name: string, holds: V);

		public readonly client: KlasaClient;
		public readonly name: string;
		public readonly holds: V;
		public readonly coreDir: string;
		public readonly userDir: string;

		public init(): Promise<any[]>;
		public load(file: string | string[], core?: boolean): Piece;
		public loadAll(): Promise<number>;
		public resolve(name: Piece | string): Piece;
		public toString(): string;
	}

	export class CommandStore extends Store<string, Command> {
		public constructor(client: KlasaClient);
		public aliases: Collection<string, Command>;

		public get(name: string): Command;
		public has(name: string): boolean;
		public set(key: string, value: Command): this;
		public set(command: Command): Command;
		public delete(name: Command | string): boolean;
		public clear(): void;
	}

	export class EventStore extends Store<string, Event> {
		public constructor(client: KlasaClient);
		private _onceEvents: Set<string>;

		public clear(): void;
		public delete(name: Event | string): boolean;
		public set(key: string, value: Event): this;
		public set(event: Event): Event;
	}

	export class ExtendableStore extends Store<string, Extendable> {
		public constructor(client: KlasaClient);

		public delete(name: Extendable | string): boolean;
		public clear(): void;
		public set(key: string, value: Extendable): this;
		public set(extendable: Extendable): Extendable;
	}

	export class FinalizerStore extends Store<string, Finalizer> {
		public constructor(client: KlasaClient);

		public run(msg: KlasaMessage, mes: KlasaMessage, start: number): Promise<void>;
	}

	export class InhibitorStore extends Store<string, Inhibitor> {
		public constructor(client: KlasaClient);

		public run(msg: KlasaMessage, cmd: Command, selective: boolean): Promise<void>;
	}

	export class LanguageStore extends Store<string, Language> {
		public constructor(client: KlasaClient);

		public readonly default: Language;
	}

	export class MonitorStore extends Store<string, Monitor> {
		public constructor(client: KlasaClient);

		public run(msg: KlasaMessage, edit?: boolean): Promise<void>;

		private _run(msg: KlasaMessage, monitor: Monitor);
	}

	export class ProviderStore extends Store<string, Provider> {
		public constructor(client: KlasaClient);

		public readonly default?: Provider;
		public clear(): void;
		public delete(name: Provider | string): boolean;
	}

	export class TaskStore extends Store<string, Task> {
		public constructor(client: KlasaClient);
	}

//#endregion Stores

//#region Usage

	export class CommandPrompt extends TextPrompt {
		public constructor(msg: KlasaMessage, usage: CommandUsage, options: TextPromptOptions);
		private typing: boolean;

		public run(): Promise<any[]>;
		private static generateNewDelim(delim: string): RegExp;
		private static delims: Map<string, RegExp>;
	}

	export class CommandUsage extends Usage {
		public constructor(client: KlasaClient, command: Command);
		public names: string[];
		public commands: string;
		public nearlyFullUsage: string;

		public createPrompt(msg: KlasaMessage, options?: TextPromptOptions): CommandPrompt;
		public fullUsage(msg: KlasaMessage): string;
		public toString(): string;
	}

	export class Possible {
		public constructor([match, name, type, min, max, regex, flags]: [string, string, string, string, string, string, string]);
		public name: string;
		public type: string;
		public min: number;
		public max: number;
		public regex: RegExp;

		private static resolveLimit(limit: string, type: string, limitType: string): number;
	}

	export class Tag {
		public constructor(members: string, count: number, required: number);
		public required: number;
		public possibles: Possible[];
		public response: string | ((msg: KlasaMessage) => string);

		private register(name: string, response: ArgResolverCustomMethod): boolean;
		private static pattern: RegExp;
		private static parseMembers(members: string, count: number): Possible[];
		private static parseTrueMembers(members: string): string[];
	}

	export class TextPrompt {
		public constructor(msg: KlasaMessage, usage: Usage, options: TextPromptOptions);
		public readonly client: KlasaClient;
		public message: KlasaMessage;
		public usage: Usage | CommandUsage;
		public reprompted: boolean;
		public flags: object;
		public args: string[];
		public params: any[];
		public promptTime: number;
		public promptLimit: number;
		public quotedStringSupport: boolean;
		private _repeat: boolean;
		private _required: number;
		private _prompted: number;
		private _currentUsage: Tag;

		public run(prompt: string): Promise<any[]>;
		private reprompt(prompt: string): Promise<any[]>;
		private repeatingPrompt(): Promise<any[]>;
		private validateArgs(): Promise<any[]>;
		private multiPossibles(index: number): Promise<any[]>;
		private pushParam(param: any): any[];
		private handleError(err: string): Promise<any[]>;
		private finalize(): any[];
		private _setup(original: string): void;

		private static getFlags(content: string, delim: string): { content: string; flags: object };
		private static getArgs(content: string, delim: string): string[];
		private static getQuotedStringArgs(content: string, delim: string): string[];

		public static readonly flagRegex: RegExp;
	}

	export class Usage {
		public constructor(client: KlasaClient, usageString: string, usageDelim: string);
		public readonly client: KlasaClient;
		public deliminatedUsage: string;
		public usageString: string;
		public usageDelim: string;
		public parsedUsage: Tag[];
		public customResolvers: { [K: string]: ArgResolverCustomMethod };

		public createCustomResolver(type: string, resolver: ArgResolverCustomMethod): this;
		public customizeResponse(name: string, response: ((msg: KlasaMessage) => string)): this;
		public createPrompt(msg: KlasaMessage, options?: TextPromptOptions): TextPrompt;
		public toJSON(): Tag[];
		public toString(): string;

		private static parseUsage(usageString: string): Tag[];
		private static tagOpen(usage: object, char: string): void;
		private static tagClose(usage: object, char: string): void;
		private static tagSpace(usage: object, char: string): void;
	}

//#endregion Usage

//#region Util

	export class Colors {
		public constructor(options?: ColorsFormatOptions);
		public opening: string;
		public closing: string;

		public format(input: string, type?: ColorsFormatOptions): string;
		public static useColors?: boolean;
		public static CLOSE: ColorsClose;
		public static STYLES: ColorsStyles;
		public static TEXTS: ColorsTexts;
		public static BACKGROUNDS: ColorsBackgrounds;
		public static hexToRGB(hex: string): number[];
		public static hueToRGB(p: number, q: number, t: number): number;
		public static hslToRGB([h, s, l]: [number | string, number | string, number | string]): number[];
		public static formatArray([pos1, pos2, pos3]: [number | string, number | string, number | string]): string;

		private static style(styles: string | string[], data?: ColorsFormatData): ColorsFormatData;
		private static background(style: ColorsFormatType, data?: ColorsFormatData): ColorsFormatData;
		private static text(style: ColorsFormatType, data?: ColorsFormatData): ColorsFormatData;

	}

	export type constants = {
		DEFAULTS: {
			CLIENT: KlasaConstantsClient,
			CONSOLE: KlasaConsoleConfig
		};
		CRON: {
			allowedNum: number[][];
			partRegex: RegExp;
			day: number;
			predefined: {
				'@yearly': '0 0 0 1 1 *',
				'@monthly': '0 0 0 1 * *',
				'@weekly': '0 0 0 * * 0',
				'@daily': '0 0 0 * * *',
				'@hourly': '0 0 * * * *'
			};
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
			};
			tokensRegex: RegExp;
		};
	};

	export class Cron {
		public constructor(cron: string);
		public next(zDay?: Date, origin?: boolean): Date;

		private static _normalize(cron: string): string;
		private static _parseString(cron: string): number[][];
		private static _parsePart(cronPart: string, id: number): number[];
		private static _range(min: number, max: number, step: number): number[];
	}

	export class Duration {
		public constructor(pattern: string);
		public offset: number;
		public readonly fromNow: Date;

		public dateFrom(date: Date): Date;

		public static toNow(earlier: Date | number | string, showIn?: boolean): string;

		private static regex: RegExp;
		private static nanosecond: number;
		private static ns: number;
		private static microsecond: number;
		private static μs: number;
		private static millisecond: number;
		private static ms: number;
		private static second: number;
		private static sec: number;
		private static s: number;
		private static minute: number;
		private static min: number;
		private static m: number;
		private static hour: number;
		private static hr: number;
		private static h: number;
		private static day: number;
		private static d: number;
		private static month: number;
		private static b: number;
		private static year: number;
		private static yr: number;
		private static y: number;

		private static _parse(pattern: string): number;
	}

	export class KlasaConsole implements Console {
		private constructor(client: KlasaClient, options: KlasaConsoleConfig);
		public readonly client: KlasaClient;
		public readonly stdout: NodeJS.WritableStream;
		public readonly stderr: NodeJS.WritableStream;
		public template?: Timestamp;
		public colors: object;
		public utc: boolean;

		private readonly timestamp: string;

		private write(data: any[], type?: string): void;

		public log(...data: any[]): void;
		public warn(...data: any[]): void;
		public error(...data: any[]): void;
		public debug(...data: any[]): void;
		public verbose(...data: any[]): void;
		public wtf(...data: any[]): void;

		// Console methods
		// tslint:disable-next-line
		public Console: NodeJS.ConsoleConstructor;
		public assert(test?: boolean, message?: string, ...optionalParameters: any[]): void;
		public clear(): void;
		public count(countTitle?: string): void;
		public dir(value?: any, ...optionalParameters: any[]): void;
		public dirxml(value?: any): void;
		public exception(message?: string, ...optionalParameters: any[]): void;
		public group(groupTitle?: string, ...optionalParameters: any[]): void;
		public groupCollapsed(groupTitle?: string, ...optionalParameters: any[]): void;
		public groupEnd(): void;
		public info(message?: string, ...optionalParameters: any[]): void;
		public msIsIndependentlyComposed(element: any): boolean;
		public profile(reportName?: string): void;
		public profileEnd(): void;
		public select(element: any): void;
		public table(...data: any[]): void;
		public time(timerName?: string): void;
		public timeEnd(timerName?: string): void;
		public trace(message?: string, ...optionalParameters: any[]): void;
		// End of Console methods

		private static _flatten(data: any): string;
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
		public footerPrefix: string;
		public footerSuffix: string;
		public readonly template: MessageEmbed;

		public setEmojis(emojis: RichDisplayEmojisObject): this;
		public setFooterPrefix(prefix: string): this;
		public setFooterSuffix(suffix: string): this;
		public useCustomFooters(): this;
		public addPage(embed: Function | MessageEmbed): this;
		public setInfoPage(embed: MessageEmbed): RichDisplay;
		public run(msg: KlasaMessage, options?: RichDisplayRunOptions): Promise<ReactionHandler>;

		protected _determineEmojis(emojis: emoji[], stop: boolean, jump: boolean, firstLast: boolean): emoji[];
		private _footer(): void;
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

	export class Stopwatch {
		public constructor(digits?: number);
		public digits: number;
		private _start: number;
		private _end?: number;

		public readonly duration: number;
		public readonly friendlyDuration: string;
		public readonly running: boolean;
		public restart(): this;
		public reset(): this;
		public start(): this;
		public stop(): this;
		public toString(): string;
	}

	export class Timestamp {
		public constructor(pattern: string);
		public pattern: string;
		private _template: TimestampObject[];

		public display(time?: Date | number | string): string;
		public edit(pattern: string): this;

		public static displayArbitrary(pattern: string, time?: Date | number | string): string;

		private static _display(template: string, time: Date | number | string): string;
		private static _parse(type: string, time: Date): string;
		private static _patch(pattern: string): TimestampObject[];
	}

	export class Type {
		public constructor(value: any, parent: ?type);

		public value: any;
		public is: string;

		private parent: ?Type;
		private childKeys: Map;
		private childValues: Map;

		private readonly childTypes: string;

		public toString(): string;

		private addValue(value: any): void;
		private addEntry(entry: [string, any]): void;
		private parents(): Iterator<Type>;
		private check(): void;
		private isCircular(): boolean;

		public static resolve(value: any): string;

		private static list(values: Map): string;
	}

	class Util {
		public static applyToClass(base: object, structure: object, skips?: string[]): void;
		public static clean(text: string): string;
		public static codeBlock(lang: string, expression: string): string;
		public static deepClone(source: any): any;
		public static exec(exec: string, options?: ExecOptions): Promise<{ stdout: string, stderr: string }>;
		public static getIdentifier(value: PrimitiveType | { id?: PrimitiveType, name?: PrimitiveType }): PrimitiveType | null;
		public static getTypeName(input: any): string;
		public static isClass(input: Function): boolean;
		public static isFunction(input: Function): boolean;
		public static isNumber(input: number): boolean;
		public static isObject(input: object): boolean;
		public static isThenable(input: Promise<any>): boolean;
		public static makeObject(path: string, value: any): object;
		public static arraysEqual(arr1: any[], arr2: any[], clone?: boolean): boolean;
		public static mergeDefault(def: object, given?: object): object;
		public static mergeObjects(objTarget: object, objSource: object): object;
		public static regExpEsc(str: string): string;
		public static sleep(delay: number, args?: any): Promise<any>;
		public static sleep<T>(delay: number, args?: T): Promise<T>;
		public static toTitleCase(str: string): string;
		public static tryParse(value: string): object;
		private static initClean(client: KlasaClient): void;

		public static titleCaseVariants: TitleCaseVariants;
	}

	export { Util as util };

//#endregion Util

//#endregion Classes

//#region Typedefs

	export type KlasaClientOptions = {
		clientBaseDir?: string;
		cmdEditing?: boolean;
		cmdLogging?: boolean;
		commandMessageLifetime?: number;
		console?: KlasaConsoleConfig;
		consoleEvents?: KlasaConsoleEvents;
		customPromptDefaults?: KlasaCustomPromptDefaults;
		gateways?: KlasaGatewaysOptions;
		language?: string;
		ownerID?: string;
		permissionLevels?: PermissionLevels;
		pieceDefaults?: KlasaPieceDefaults;
		prefix?: string;
		preserveConfigs?: boolean;
		providers?: KlasaProvidersOptions;
		readyMessage?: (client: KlasaClient) => string;
		regexPrefix?: RegExp;
		schedule?: KlasaClientOptionsSchedule;
		typing?: boolean;
	} & ClientOptions;

	export type KlasaClientOptionsSchedule = {
		interval?: number;
	};

	export type KlasaCustomPromptDefaults = {
		promptLimit?: number;
		promptTime?: number;
		quotedStringSupport?: number;
	};

	export type KlasaPieceDefaults = {
		commands?: CommandOptions;
		events?: EventOptions;
		extendables?: ExtendableOptions;
		finalizers?: FinalizerOptions;
		inhibitors?: InhibitorOptions;
		languages?: LanguageOptions;
		monitors?: MonitorOptions;
		providers?: ProviderOptions;
	};

	export type KlasaProvidersOptions = {
		default?: string;
	} & object;

	export type KlasaGatewaysOptions = {
		clientStorage?: GatewayDriverAddOptions;
		guilds?: GatewayDriverAddOptions;
		users?: GatewayDriverAddOptions;
	} & object;

	export type ExecOptions = {
		cwd?: string;
		encoding?: string;
		env?: StringMappedType<string>;
		gid?: number;
		killSignal?: string | number;
		maxBuffer?: number;
		shell?: string;
		timeout?: number;
		uid?: number;
	};

	// Parsers
	type ArgResolverCustomMethod = (arg: string, possible: Possible, msg: KlasaMessage, params: string[]) => Promise<any>;

	// Permissions
	export type PermissionLevel = {
		break: boolean;
		check: (client: KlasaClient, msg: KlasaMessage) => boolean;
		fetch: boolean;
	};

	export type PermissionLevelOptions = {
		break?: boolean;
		fetch?: boolean;
	};

	export type PermissionLevelsData = {
		broke: boolean;
		permission: boolean;
	};

	// Schedule
	export type ScheduledTaskOptions = {
		catchUp?: boolean;
		data?: any;
		id?: string;
	};

	export type ScheduledTaskJSON = {
		catchUp: boolean;
		data?: any;
		id: string;
		taskName: string;
		time: number;
	};

	export type ScheduledTaskUpdateOptions = {
		catchUp?: boolean;
		data?: any;
		repeat?: string;
		time?: Date;
	};

	// Settings
	export type GatewayOptions = {
		nice?: boolean;
		provider: Provider;
	};

	export type GatewayJSON = {
		options: GatewayOptions;
		schema: SchemaFolderJSON;
		type: string;
	};

	export type GatewayGetPathOptions = {
		avoidUnconfigurable?: boolean;
		errors?: boolean;
		piece?: boolean;
	};

	export type GatewayGetPathResult = {
		piece: SchemaPiece;
		route: string[];
	};

	export type GuildResolvable = KlasaGuild
		| KlasaMessage
		| KlasaTextChannel
		| KlasaVoiceChannel
		| KlasaCategoryChannel
		| GuildMember
		| Role;

	export type ConfigurationUpdateOptions = {
		action?: 'add' | 'remove' | 'auto';
		arrayPosition?: number;
		avoidUnconfigurable?: boolean;
	};

	export type ConfigurationUpdateResult = {
		errors: Error[];
		updated: ConfigurationUpdateResultEntry[];
	};

	export type ConfigurationUpdateResultEntry = {
		data: [string, any];
		piece: SchemaPiece;
	};

	export type GatewayGuildResolvable = KlasaGuild
		| KlasaMessage
		| KlasaTextChannel
		| KlasaVoiceChannel
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

	export type GatewayDriverAddOptions = {
		nice?: boolean;
		provider?: string;
	};

	export type SchemaFolderAddOptions = {
		array?: boolean;
		configurable?: boolean;
		default?: any;
		max?: number;
		min?: number;
		sql?: string;
		type: string;
	};

	export type SchemaPieceEditOptions = {
		configurable?: boolean;
		default?: any;
		max?: number;
		min?: number;
		sql?: string;
	};

	export type SchemaPieceJSON = {
		array: boolean;
		configurable: boolean;
		default: any;
		max?: number;
		min?: number;
		sql: string;
		type: string;
	};

	export type SchemaFolderJSON = {
		type: 'Folder';
		[k: string]: SchemaPieceJSON | SchemaFolderJSON | string;
	};

	export type GatewayDriverJSON = {
		clientStorage: GatewayJSON;
		guilds: GatewayJSON;
		users: GatewayJSON;
		keys: string[];
		ready: boolean;
		types: string[];
		[k: string]: GatewayJSON | any;
	};

	// Structures
	export type PieceOptions = {
		enabled?: boolean
		name?: string,
	};

	export type CommandOptions = {
		aliases?: string[];
		autoAliases?: boolean;
		botPerms?: string[];
		bucket?: number;
		cooldown?: number;
		deletable?: boolean;
		description?: string | ((msg: KlasaMessage) => string);
		extendedHelp?: string | ((msg: KlasaMessage) => string);
		guarded?: boolean;
		nsfw?: boolean;
		permLevel?: number;
		promptLimit?: number;
		promptTime?: number;
		quotedStringSupport?: boolean;
		requiredConfigs?: string[];
		runIn?: Array<'text' | 'dm' | 'group'>;
		subcommands?: boolean;
		usage?: string;
		usageDelim?: string;
	} & PieceOptions;

	export type ExtendableOptions = {
		appliesTo: string[];
		klasa?: boolean;
	} & PieceOptions;

	export type InhibitorOptions = {
		spamProtection?: boolean;
	} & PieceOptions;

	export type MonitorOptions = {
		ignoreBots?: boolean;
		ignoreEdits?: boolean;
		ignoreOthers?: boolean;
		ignoreSelf?: boolean;
		ignoreWebhooks?: boolean;
	} & PieceOptions;

	export type ProviderOptions = {
		cache?: boolean;
		sql?: boolean;
	} & PieceOptions;

	export type EventOptions = {
		emitter?: NodeJS.EventEmitter;
		event?: string;
		once?: boolean;
	} & PieceOptions;

	export type FinalizerOptions = PieceOptions;
	export type LanguageOptions = PieceOptions;
	export type TaskOptions = PieceOptions;

	export type PieceJSON = {
		dir: string;
		enabled: boolean;
		file: string[];
		name: string;
		type: string;
	};

	export type PieceCommandJSON = {
		aliases: string[];
		botPerms: string[];
		bucket: number;
		category: string;
		cooldown: number;
		deletable: boolean;
		description: string | ((msg: KlasaMessage) => string);
		extendedHelp: string | ((msg: KlasaMessage) => string);
		fullCategory: string[];
		guarded: boolean;
		nsfw: boolean;
		permLevel: number;
		promptLimit: number;
		promptTime: number;
		quotedStringSupport: boolean;
		requiredConfigs: string[];
		runIn: Array<'text' | 'dm' | 'group'>;
		subCategory: string;
		subcommands: boolean;
		usage: {
			usageString: string;
			usageDelim: string;
			nearlyFullUsage: string;
		};
		usageDelim: string;
		usageString: string;
	} & PieceJSON;

	export type PieceExtendableJSON = {
		appliesTo: string[];
		target: string;
	} & PieceJSON;

	export type PieceInhibitorJSON = {
		spamProtection: boolean;
	} & PieceJSON;

	export type PieceMonitorJSON = {
		ignoreBots: boolean;
		ignoreEdits: boolean;
		ignoreOthers: boolean;
		ignoreSelf: boolean;
		ignoreWebhooks: boolean;
	} & PieceJSON;

	export type PieceProviderJSON = {
		cache: boolean;
		sql: boolean;
	} & PieceJSON;

	export type PieceEventJSON = {
		emitter: string;
		event: string;
		once: boolean;
	} & PieceJSON;

	export type PieceFinalizerJSON = PieceJSON;
	export type PieceLanguageJSON = PieceJSON;
	export type PieceTaskJSON = PieceJSON;

	// Usage
	export type TextPromptOptions = {
		promptLimit?: number;
		promptTime?: number;
		quotedStringSupport?: number;
	};

	// Util
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
		background: string | number | string[];
		style: string | string[];
		text: string | number | string[]
	};

	export type ColorsFormatType = string | number | [string, string, string] | [number, number, number];

	type ColorsFormatData = {
		opening: string[];
		closing: string[];
	};

	export type KlasaConsoleConfig = {
		types?: {
			debug?: string;
			error?: string;
			log?: string;
			verbose?: string;
			warn?: string;
			wtf?: string;
		};
		colors?: KlasaConsoleColorStyles;
		stderr?: NodeJS.WritableStream;
		stdout?: NodeJS.WritableStream;
		timestamps?: boolean | string;
		useColor?: boolean;
	};

	export type KlasaConsoleEvents = {
		debug?: boolean;
		error?: boolean;
		log?: boolean;
		verbose?: boolean;
		warn?: boolean;
		wtf?: boolean;
	};

	export type KlasaConsoleColorStyles = {
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
		background?: KlasaConsoleColorTypes;
		style?: KlasaConsoleStyleTypes;
		text?: KlasaConsoleColorTypes;
	};

	export type KlasaConsoleTimeObject = {
		background?: KlasaConsoleColorTypes;
		style?: KlasaConsoleStyleTypes;
		text?: KlasaConsoleColorTypes;
	};

	export type KlasaConsoleColorTypes = 'black'
		| 'blue'
		| 'cyan'
		| 'gray'
		| 'green'
		| 'grey'
		| 'lightblue'
		| 'lightcyan'
		| 'lightgray'
		| 'lightgreen'
		| 'lightgrey'
		| 'lightmagenta'
		| 'lightred'
		| 'lightyellow'
		| 'magenta'
		| 'red'
		| 'white'
		| number[]
		| string[];

	export type KlasaConsoleStyleTypes = 'normal'
		| 'bold'
		| 'dim'
		| 'italic'
		| 'underline'
		| 'inverse'
		| 'hidden'
		| 'strikethrough';

	export type KlasaConstantsClient = {
		clientBaseDir: string;
		schedule: { interval: 60000 };
		cmdEditing: false;
		cmdLogging: false;
		cmdPrompt: false;
		commandMessageLifetime: 1800;
		console: {};
		consoleEvents: {
			debug: false;
			error: true;
			log: true;
			verbose: false;
			warn: true;
			wtf: true;
		};
		ignoreBots: true;
		ignoreSelf: true;
		language: 'en-US';
		pieceDefaults: {
			commands: CommandOptions,
			events: EventOptions,
			extendables: ExtendableOptions,
			finalizers: FinalizerOptions,
			inhibitors: InhibitorOptions,
			languages: LanguageOptions,
			monitors: MonitorOptions,
			providers: ProviderOptions
		};
		preserveConfigs: true;
		promptTime: 30000;
		provider: {};
		readyMessage: (client: KlasaClient) => string;
		typing: false;
		customPromptDefaults: {
			promptTime: 30000,
			promptLimit: number,
			quotedStringSupport: false
		};
	};

	export type ReactionHandlerOptions = {
		filter?: Function;
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
		prompt?: string;
		startPage?: number;
		stop?: boolean;
		time?: number;
	};

	export type TimestampObject = {
		content?: string;
		type: string;
	};

	export type RichDisplayRunOptions = {
		filter?: ((reaction: MessageReaction, user: KlasaUser) => boolean);
		firstLast?: boolean;
		jump?: boolean;
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
		prompt?: string;
		startPage?: number;
		stop?: boolean;
		time?: number;
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

	export type MenuOption = {
		name: string;
		body: string;
		inline?: boolean;
	};

	export type RichMenuRunOptions = {
		filter?: Function;
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
		prompt?: string;
		startPage?: number;
		stop?: boolean;
		time?: number;
	};

	type StringMappedType<T> = { [key: string]: T };

	export type GuildSettings = StringMappedType<any>;
	export type SchemaObject = StringMappedType<SchemaPiece>;
	export type SchemaDefaults = StringMappedType<any>;

	// TypeScript lacks of Proxy
	export type Proxy<T> = {
		get(): T;
		set(value: T): void;
	};

	export type PrimitiveType = string | number | boolean;

	export type TitleCaseVariants = {
		textchannel: 'TextChannel';
		voicechannel: 'VoiceChannel';
		categorychannel: 'CategoryChannel';
		guildmember: 'GuildMember';
		[key: string]: string;
	};

//#endregion

}
