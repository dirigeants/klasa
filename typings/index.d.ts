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
		TextChannel as DiscordTextChannel,
		User as DiscordUser,
		UserResolvable,
		VoiceChannel as DiscordVoiceChannel,
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
		public readonly owner: KlasaUser;
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
		public on(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path: string | ConfigUpdateEntryMany) => void): this;

		// Schema Events
		public on(event: 'schemaKeyAdd', listener: (key: SchemaFolder | SchemaPiece) => void): this;
		public on(event: 'schemaKeyRemove', listener: (key: SchemaFolder | SchemaPiece) => void): this;
		public on(event: 'schemaKeyUpdate', listener: (key: SchemaPiece) => void): this;

		// Klasa Console Custom Events
		public on(event: 'log', listener: (data: any, type: string) => void): this;
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
		public once(event: 'log', listener: (data: any, type: string) => void): this;
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
		public readonly language: Language;
	}

	export class KlasaMessage extends DiscordMessage {
		public readonly guild: KlasaGuild;
		public guildConfigs: Configuration;
		public language: Language;
		public responses?: KlasaMessage | KlasaMessage[];
		public command?: Command;
		public prefix?: RegExp;
		public prefixLength?: number;
		private prompter?: CommandPrompt;

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
		public store(arg: string, possible: Possible, msg: KlasaMessage): Promise<Store>;

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

		public static maxOrMin(guild: KlasaGuild, value: number, min: number, max: number, name: string, suffix: string): boolean;
	}

//#endregion Parsers

//#region Permissions

	export class PermissionLevels extends Collection<number, PermissionLevel> {
		public constructor(levels?: number);
		public requiredLevels: number;

		public addLevel(level: number, brk: boolean, check: (client: KlasaClient, msg: KlasaMessage) => boolean): this;
		public set(level: number, obj: PermissionLevel): this;
		public isValid(): boolean;
		public debug(): string;

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

		public readonly task: Task;
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
		public readonly type: string;
		public readonly id: string;
		private _existsInDB: boolean;
		private _syncStatus?: Promise<object>;

		public get(key: string): any;
		public clone(): Configuration;
		public resetConfiguration(): Promise<Configuration>;
		public sync(): Promise<this>;
		public destroy(): Promise<this>;

		public reset(key: string, avoidUnconfigurable?: boolean): Promise<ConfigurationUpdateResult>;
		public update(key: object, guild?: GatewayGuildResolvable): Promise<ConfigurationUpdateManyResult>;
		public update(key: string, value?: any, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: string, value?: any, guild?: GatewayGuildResolvable, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;

		private _updateMany(object: any, guild?: GatewayGuildResolvable): Promise<ConfigurationUpdateManyResult>;
		private _reset(key: string, guild: GatewayGuildResolvable, avoidUnconfigurable: boolean): Promise<ConfigurationParseResult>;
		private _parseReset(key: string, guild: KlasaGuild, options: ConfigurationPathResult): Promise<ConfigurationParseResult>;
		private _parseUpdateOne(key: string, value: any, guild: KlasaGuild, options: ConfigurationPathResult): Promise<ConfigurationParseResult>;
		private _parseUpdateArray(action: 'add' | 'remove' | 'auto', key: string, value: any, guild: KlasaGuild, arrayPosition: number, options: ConfigurationPathResult): Promise<ConfigurationParseResult>;
		private _parseUpdateMany(cache: any, object: any, schema: SchemaFolder, guild: KlasaGuild, list: ConfigurationUpdateManyResult, updateObject: object): void;
		private _updateSingle(key: string, value: any, guild: KlasaGuild, options: ConfigurationUpdateOptions): Promise<ConfigurationParseResult>;
		private _setValue(parsedID: string, path: SchemaPiece, route: string[]): Promise<void>;
		private _patch(data: any): void;

		public toJSON(): object;
		public toString(): string;

		private static _merge(data: any, folder: SchemaFolder | SchemaPiece): any;
		private static _clone(data: any, schema: SchemaFolder): any;
		private static _patch(inst: any, data: any, schema: SchemaFolder): void;
		private static getIdentifier(value: any): any;
	}

	export class Gateway extends GatewayStorage {
		private constructor(store: GatewayDriver, type: string, validateFunction: Function, schema: object, options: GatewayDriverAddOptions);
		public store: GatewayDriver;
		public options: GatewayDriverAddOptions;
		public validate: Function;
		public defaultSchema: object;
		public readonly cache: Provider;
		public readonly resolver: SettingResolver;

		public getEntry(input: string, create?: boolean): object | Configuration;
		public createEntry(input: string): Promise<Configuration>;
		public insertEntry(id: string, data?: object): Configuration;
		public deleteEntry(input: string): Promise<boolean>;
		public sync(input?: object | string, download?: boolean): Promise<any>;
		public getPath(key?: string, options?: GatewayGetPathOptions): GatewayGetPathResult;

		private init(download?: boolean): Promise<void>;
		private _ready(): Promise<Array<Collection<string, Configuration>>>;
		private _resolveGuild(guild: GatewayGuildResolvable): KlasaGuild;
		private _shardSync(path: string[], data: any, action: 'add' | 'delete' | 'update', force: boolean): Promise<void>;

		public toString(): string;
	}

	export class GatewayDriver {
		private constructor(client: KlasaClient);
		public readonly client: KlasaClient;
		public resolver: SettingResolver;
		public types: string[];
		public caches: string[];
		public ready: boolean;

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

		public add(name: string, validateFunction: Function, schema?: object, options?: GatewayDriverAddOptions, download?: boolean): Promise<Gateway>;
		private _ready(): Promise<Array<Array<Collection<string, Configuration>>>>;
		private _checkProvider(engine: string): string;
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
		public readonly provider: Provider;
		public readonly defaults: any;

		private initTable(): Promise<void>;
		private initSchema(): Promise<SchemaFolder>;
		private parseEntry(entry: any): any;

		private static throwError(guild: KlasaGuild, code: string | number, error: string | Error): string;
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
		public keys: Set<string>;
		public keyArray: string[];

		public readonly configurableKeys: string[];

		public addFolder(key: string, object?: object, force?: boolean): Promise<SchemaFolder>;
		public removeFolder(key: string, force?: boolean): Promise<SchemaFolder>;
		public hasKey(key: string): boolean;
		public addKey(key: string, options: SchemaFolderAddOptions, force?: boolean): Promise<SchemaFolder>;
		public removeKey(key: string, force?: boolean): Promise<SchemaFolder>;
		public force(action: 'add' | 'edit' | 'delete', key: string, piece: SchemaFolder | SchemaPiece): Promise<any>;
		public getList(msg: KlasaMessage): string;
		public getDefaults(data?: object): object;
		public getSQL(array?: string[]): string[];
		public getKeys(array?: string[]): string[];
		public getValues(array?: SchemaPiece[]): SchemaPiece[];
		public resolveString(): string;

		private _addKey(key: string, options: SchemaFolderAddOptions, type: typeof Schema | typeof SchemaFolder): void;
		private _removeKey(key: string): void;
		private _init(options: object): true;

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
		public resolveString(msg: KlasaMessage): string;
		public modify(options: SchemaPieceModifyOptions): Promise<this>;

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
		public reload(): Promise<Piece>;
		public unload(): void;
		public enable(): Piece;
		public disable(): Piece;
		public toString(): string;

		public static applyToClass(structure: any, skips?: string[]): void;
	}

	export abstract class Command implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: CommandOptions);
		public client: KlasaClient;
		public type: 'command';

		public aliases: string[];
		public botPerms: string[];
		public category: string;
		public cooldown: number;
		public description: string | ((msg: KlasaMessage) => string);
		public enabled: boolean;
		public extendedHelp: string | ((msg: KlasaMessage) => string);
		public name: string;
		public permLevel: number;
		public promptLimit: number;
		public promptTime: number;
		public quotedStringSupport: boolean;
		public subcommands: boolean;
		public requiredConfigs: string[];
		public runIn: string[];
		public bucket: number;
		public subCategory: string;
		public usage: CommandUsage;
		public usageDelim: string;
		public usageString: string;
		private cooldowns: Map<Snowflake, number>;
		private fullCategory: string[];

		public definePrompt(usageString: string, usageDelim: string): Usage;
		public createCustomResolver(type: string, resolver: ArgResolverCustomMethod): this;
		public customizeResponse(name: string, response: string | ((msg: KlasaMessage, possible: Possible) => string)): this;

		public run(msg: KlasaMessage, params: any[]): Promise<KlasaMessage | KlasaMessage[]>;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Event implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: EventOptions);
		public client: KlasaClient;
		public type: 'event';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		private _run(param: any): void;

		public abstract run(...params: any[]): void;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Extendable implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: ExtendableOptions);
		public client: KlasaClient;
		public type: 'extendable';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public appliesTo: string[];
		public target: boolean;

		public abstract extend(...params: any[]): any;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Finalizer implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: FinalizerOptions);
		public client: KlasaClient;
		public type: 'finalizer';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(msg: KlasaMessage, mes: KlasaMessage, start: Stopwatch): void;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Inhibitor implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: InhibitorOptions);
		public client: KlasaClient;
		public type: 'inhibitor';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(msg: KlasaMessage, cmd: Command): Promise<void | string>;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Language implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: LanguageOptions);
		public client: KlasaClient;
		public language: { [key: string]: any };
		public type: 'language';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public get(term: string, ...args: any[]): any;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Monitor implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: MonitorOptions);
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
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Provider implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: ProviderOptions);
		public client: KlasaClient;
		public type: 'monitor';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public description: string;
		public cache: boolean;
		public sql: boolean;

		public init(): Promise<void>;
		public shutdown(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

	export abstract class Task implements Piece {
		public constructor(client: KlasaClient, dir: string, file: string[], options?: TaskOptions);
		public client: KlasaClient;
		public type: 'task';

		public enabled: boolean;
		public name: string;
		public dir: string;
		public file: string;

		public abstract run(data: any): Promise<void>;
		public init(): Promise<void>;

		public enable(): Piece;
		public disable(): Piece;
		public reload(): Promise<any>;
		public unload(): any;
		public toString(): string;
	}

//#endregion Pieces

//#region Stores

	export class Store {
		public init(): Promise<any[]>;
		public load(dir: string, file: string | string[]): Piece;
		public loadAll(): Promise<number>;
		public resolve(name: Piece | string): Piece;
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
		public delete(name: Command | string): boolean;
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
		public delete(name: Event | string): boolean;
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

		public delete(name: Extendable | string): boolean;
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

		public delete(name: Finalizer | string): boolean;
		public run(msg: KlasaMessage, mes: KlasaMessage, start: number): void;
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

		public delete(name: Inhibitor | string): boolean;
		public run(msg: KlasaMessage, cmd: Command, selective: boolean): void;
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
		public delete(name: Language | string): boolean;
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

		public delete(name: Monitor | string): boolean;
		public run(msg: KlasaMessage): void;
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

		public readonly default: Provider;
		public delete(name: Provider | string): boolean;
		public set(key: string, value: Provider): this;
		public set(provider: Provider): Provider;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
	}

	export class TaskStore extends Collection<string, Task> implements Store {
		public constructor(client: KlasaClient);
		public client: KlasaClient;
		public coreDir: string;
		public userDir: string;
		public holds: Provider;
		public name: 'tasks';

		public delete(name: Task | string): boolean;
		public set(key: string, value: Task): this;
		public set(task: Task): Task;

		public init(): any;
		public load(): any;
		public loadAll(): Promise<any>;
		public resolve(): any;
	}

//#endregion Stores

//#region Usage

	export class CommandPrompt extends TextPrompt {
		public constructor(msg: KlasaMessage, usage: CommandUsage, options: TextPromptOptions);
		private typing: boolean;

		public run(): Promise<any[]>;
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

		private static resolveLimit(limit: string, type: string): number;
	}

	export class Tag {
		public constructor(members: string, count: number, required: boolean);
		public required: number;
		public possibles: Possible[];
		public response: string | ((msg: KlasaMessage) => string);

		private register(name: string, response: ArgResolverCustomMethod): boolean;
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
		private static tagOpen(usage: object, char: string): object;
		private static tagClose(usage: object, char: string): object;
		private static tagSpace(usage: object, char: string): object;
	}

//#endregion Usage

//#region Util

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
		private style(style: string | string[], data?: ColorsFormatData): ColorsFormatData;
		private background(style: ColorsFormatType, data?: ColorsFormatData): ColorsFormatData;
		private text(style: ColorsFormatType, data?: ColorsFormatData): ColorsFormatData;
	}

	export type constants = {
		DEFAULTS: {
			CLIENT: KlasaConstantsClient,
			CONSOLE: KlasaConsoleConfig
		};
		GATEWAY_RESOLVERS: {
			GUILDS: (guildResolvable: string | KlasaGuild) => KlasaGuild,
			USERS: (userResolvable: string | KlasaUser) => KlasaUser,
			CLIENT_STORAGE: (clientResolvable: string | KlasaClient) => ClientUser
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
		public useColors: boolean;
		public colors: boolean | KlasaConsoleColorStyles;

		public write(data: any, type?: string): void;
		public log(...data: any[]): void;
		public warn(...data: any[]): void;
		public error(...data: any[]): void;
		public debug(...data: any[]): void;
		public verbose(...data: any[]): void;
		public wtf(...data: any[]): void;

		public timestamp(timestamp: string, time: ColorsFormatOptions): string;
		public shard(input: string, shard: ColorsFormatOptions): string;
		public messages(input: string, message: ColorsFormatOptions): string;

		private static _flatten(data: any, useColors: boolean): string;
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
		public static toNow(earlier: Date | number | string, showIn?: boolean): string;

		private static _display(template: string, time: Date | number | string): string;
		private static _parse(type: string, time: Date): string;
		private static _patch(pattern: string): TimestampObject[];
	}

	class Util {
		public static applyToClass(base: object, structure: object, skips?: string[]): void;
		public static clean(text: string): string;
		public static codeBlock(lang: string, expression: string): string;
		public static deepClone(source: any): any;
		public static exec(exec: string, options?: ExecOptions): Promise<{ stdout: string, stderr: string }>;
		public static getDeepTypeMap(input: Map<any, any> | WeakMap<object, any> | Collection<any, any>, basic?: string): string;
		public static getDeepTypeName(input: any): string;
		public static getDeepTypeProxy(input: Proxy<any>): string;
		public static getDeepTypeSetOrMap(input: Array<any> | Set<any> | WeakSet<any>, basic?: string): string;
		public static getTypeName(input: any): string;
		public static isClass(input: Function): boolean;
		public static isFunction(input: Function): boolean;
		public static isNumber(input: number): boolean;
		public static isObject(input: object): boolean;
		public static isThenable(input: Promise<any>): boolean;
		public static makeObject(path: string, value: any): object;
		public static mergeDefault(def: object, given?: object): object;
		public static mergeObjects(objTarget: object, objSource: object): object;
		public static regExpEsc(str: string): string;
		public static sleep(delay: number, args?: any): Promise<any>;
		public static sleep<T>(delay: number, args?: T): Promise<T>;
		public static toTitleCase(str: string): string;
		public static tryParse(value: string): object;
		private static initClean(client: KlasaClient): void;
	}

	export { Util as util };

//#endregion Util

//#endregion Classes

//#region Typedefs

	export type KlasaClientOptions = {
		clientBaseDir?: string;
		clock?: KlasaClientOptionsClock;
		cmdEditing?: boolean;
		cmdLogging?: boolean;
		cmdPrompt?: boolean;
		commandMessageLifetime?: number;
		console?: KlasaConsoleConfig;
		consoleEvents?: KlasaConsoleEvents;
		customPromptDefaults?: KlasaCustomPromptDefaults;
		gateways?: KlasaGatewaysOptions;
		ignoreBots?: boolean;
		ignoreSelf?: boolean;
		language?: string;
		ownerID?: string;
		permissionLevels?: PermissionLevels;
		pieceDefaults?: KlasaPieceDefaults;
		prefix?: string;
		preserveConfigs?: boolean;
		providers?: KlasaProvidersOptions;
		readyMessage?: (client: KlasaClient) => string;
		regexPrefix?: RegExp;
		typing?: boolean;
	} & ClientOptions;

	export type KlasaClientOptionsClock = {
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
		[key: string]: string | object;
	};

	export type KlasaGatewaysOptions = {
		clientStorage?: GatewayDriverAddOptions;
		guilds?: GatewayDriverAddOptions;
		users?: GatewayDriverAddOptions;
		[key: string]: string | object;
	};

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
	};

	export type PermissionLevelsData = {
		broke: boolean;
		permission: boolean;
	};

	// Schedule
	export type ScheduledTaskOptions = {
		id?: string;
		data?: any;
	};

	export type ScheduledTaskJSON = {
		id: string;
		taskName: string;
		time: number;
		data?: any;
	};

	export type ScheduledTaskUpdateOptions = {
		repeat?: string;
		time?: Date;
		data?: any;
	};

	// Settings
	export type GatewayGetPathOptions = {
		avoidUnconfigurable?: boolean;
		piece?: boolean;
	};

	export type GatewayGetPathResult = {
		path: SchemaPiece;
		route: string[];
	};

	export type GuildResolvable = KlasaGuild
		| KlasaMessage
		| KlasaTextChannel
		| KlasaVoiceChannel
		| GuildMember
		| Role;

	export type ConfigurationUpdateOptions = {
		avoidUnconfigurable?: boolean;
		arrayPosition?: number;
		action?: 'add' | 'remove' | 'auto';
	};

	export type ConfigurationUpdateResult = {
		path: SchemaPiece;
		value: any;
	};

	export type ConfigurationUpdateObjectResult = {
		updated: ConfigurationUpdateObjectList;
		errors: Error[];
	};

	export type ConfigurationUpdateObjectList = {
		keys: string[];
		values: any[];
	};

	type ConfigurationParseResult = {
		array?: any[];
		entryID: string;
		parsed: any;
		parsedID: string | number | object;
		settings: Configuration;
	} & ConfigurationPathResult;

	type ConfigurationUpdateManyList = {
		errors: Error[];
		keys: string[];
		promises: Array<Promise<any>>;
		values: any[];
	};

	export type ConfigurationUpdateManyResult = {
		errors: Error[];
		updated: ConfigurationUpdateObjectList;
	};

	export type ConfigUpdateEntryMany = {
		type: 'MANY';
		keys: string[];
		values: any[];
	};

	export type GatewayGuildResolvable = KlasaGuild
		| KlasaTextChannel
		| KlasaVoiceChannel
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

	export type GatewayDriverAddOptions = {
		provider?: string;
		nice?: boolean;
	};

	export type SchemaFolderAddOptions = {
		type: string;
		default?: any;
		min?: number;
		max?: number;
		array?: boolean;
		sql?: string;
		configurable?: boolean;
	};

	export type SchemaPieceModifyOptions = {
		default?: any;
		min?: number;
		max?: number;
		configurable?: boolean;
		sql?: string;
	};

	export type SchemaPieceJSON = {
		type: string;
		array: boolean;
		default: any;
		min?: number;
		max?: number;
		sql: string;
		configurable: boolean;
	};

	// Structures
	export type CommandOptions = {
		aliases?: string[];
		autoAliases?: boolean;
		botPerms?: string[];
		cooldown?: number;
		deletable?: boolean;
		promptTime?: number;
		promptLimit?: number;
		description?: string | ((msg: KlasaMessage) => string);
		enabled?: boolean;
		extendedHelp?: string | ((msg: KlasaMessage) => string);
		name?: string;
		permLevel?: number;
		quotedStringSupport?: boolean;
		subcommands?: boolean;
		requiredConfigs?: string[];
		runIn?: string[];
		bucket?: number;
		usage?: string;
		usageDelim?: string;
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

	export type TaskOptions = {
		enabled?: boolean;
		name?: string;
	};

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

//#endregion

}
