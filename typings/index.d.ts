declare module 'klasa' {

	import { ExecOptions } from 'child_process';

	import {
		BufferResolvable,
		CategoryChannel as DiscordCategoryChannel,
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
		EmojiResolvable,
		GroupDMChannel as DiscordGroupDMChannel,
		Guild as DiscordGuild,
		GuildChannel as DiscordGuildChannel,
		GuildMember,
		Message as DiscordMessage,
		MessageAttachment,
		MessageCollector,
		MessageEmbed,
		MessageOptions,
		MessageReaction,
		Permissions,
		PermissionResolvable,
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
		public readonly invite: string;
		public readonly owner: KlasaUser | null;
		public options: KlasaClientOptions & ClientOptions;
		public userBaseDirectory: string;
		public console: KlasaConsole;
		public arguments: ArgumentStore;
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
		public gateways: GatewayDriver;
		public configs: Configuration | null;
		public application: ClientApplication;
		public schedule: Schedule;
		public ready: boolean;

		public validatePermissionLevels(): PermissionLevels;
		public registerStore<K, V extends Piece>(store: Store<K, V>): KlasaClient;
		public unregisterStore<K, V extends Piece>(store: Store<K, V>): KlasaClient;

		public login(token: string): Promise<string>;
		private _ready(): Promise<void>;

		public sweepMessages(lifetime?: number, commandLifeTime?: number): number;
		public static types: SchemaTypes;
		public static defaultGuildSchema: Schema;
		public static defaultUserSchema: Schema;
		public static defaultClientSchema: Schema;
		public static defaultPermissionLevels: PermissionLevels;
		public static plugin: Symbol;
		public static use(mod: { plugin: Symbol, [x: string]: any }): KlasaClient;

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
		public on(event: 'commandError', listener: (message: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
		public on(event: 'commandInhibited', listener: (message: KlasaMessage, command: Command, response: string | Error) => void): this;
		public on(event: 'commandRun', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public on(event: 'commandSuccess', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public on(event: 'commandUnknown', listener: (message: KlasaMessage, command: string) => void): this;

		public on(event: 'monitorError', listener: (message: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
		public on(event: 'finalizerError', listener: (message: KlasaMessage, response: KlasaMessage, runTime: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
		public on(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;

		// SettingGateway Events
		public on(event: 'configCreateEntry', listener: (entry: Configuration) => void): this;
		public on(event: 'configDeleteEntry', listener: (entry: Configuration) => void): this;
		public on(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path: string[]) => void): this;

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
		public once(event: 'commandError', listener: (message: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
		public once(event: 'commandInhibited', listener: (message: KlasaMessage, command: Command, response: string | Error) => void): this;
		public once(event: 'commandRun', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public once(event: 'commandSuccess', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
		public once(event: 'commandUnknown', listener: (message: KlasaMessage, command: string) => void): this;

		public once(event: 'monitorError', listener: (message: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
		public once(event: 'finalizerError', listener: (message: KlasaMessage, response: KlasaMessage, runTime: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
		public once(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;

		// SettingGateway Events
		public once(event: 'configCreateEntry', listener: (entry: Configuration) => void): this;
		public once(event: 'configDeleteEntry', listener: (entry: Configuration) => void): this;
		public once(event: 'configUpdateEntry', listener: (oldEntry: Configuration, newEntry: Configuration, path?: string) => void): this;

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
		public readonly language: Language;
	}

	export class KlasaMessage extends DiscordMessage {
		public readonly guild: KlasaGuild;
		public guildConfigs: Configuration;
		public language: Language;
		public command: Command | null;
		public prefix: RegExp | null;
		public prefixLength: number | null;
		private prompter: CommandPrompt | null;
		private _responses: KlasaMessage[];

		public readonly responses: KlasaMessage[];
		public readonly args: string[];
		public readonly params: any[];
		public readonly flags: ObjectLiteral<string>;
		public readonly reprompted: boolean;
		public readonly reactable: boolean;
		public prompt(text: string, time?: number): Promise<KlasaMessage>;
		public usableCommands(): Promise<Collection<string, Command>>;
		public hasAtLeastPermissionLevel(min: number): Promise<boolean>;

		public sendLocale(key: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendLocale(key: string, localeArgs?: Array<any>, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(language: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;

		private _patch(data: any): void;
		private _registerCommand(commandInfo: { command: Command, prefix: RegExp, prefixLength: number }): void;
		private static combineContentOptions(content?: StringResolvable, options?: MessageOptions): MessageOptions;
	}

	export class KlasaUser extends DiscordUser {
		public configs: Configuration;
		public send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public send(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendLocale(key: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendLocale(key: string, localeArgs?: Array<any>, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
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
		public sendLocale(key: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendLocale(key: string, localeArgs?: Array<any>, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendEmbed(embed: MessageEmbed, options?: MessageOptions): Promise<KlasaMessage>;
		public sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(content?: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendMessage(options: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

	export class KlasaGuildChannel extends DiscordGuildChannel {
		public readonly guild: KlasaGuild;
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
		public sendLocale(key: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendLocale(key: string, localeArgs?: Array<any>, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
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
		public sendLocale(key: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		public sendLocale(key: string, localeArgs?: Array<any>, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
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

	export class Resolver {
		public constructor(client: KlasaClient);
		public readonly client: KlasaClient;

		public boolean(input: boolean | string): Promise<boolean>;
		public channel(input: Channel | Snowflake): Promise<Channel>;
		public float(input: string | number): Promise<number>;
		public guild(input: KlasaGuild | Snowflake): Promise<KlasaGuild>;
		public integer(input: string | number): Promise<number>;
		public member(input: KlasaUser | GuildMember | Snowflake, guild: KlasaGuild): Promise<GuildMember>;
		public message(input: KlasaMessage | Snowflake, channel: Channel): Promise<KlasaMessage>;
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

		public add(level: number, check: (client: KlasaClient, message: KlasaMessage) => boolean, options?: PermissionLevelOptions): this;
		public debug(): string;
		public isValid(): boolean;
		public remove(level: number): this;
		public set(level: number, obj: PermissionLevelOptions | symbol): this;

		public run(message: KlasaMessage, min: number): PermissionLevelsData;
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
		public get(id: string): ScheduledTask | void;
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
		public recurring: Cron | null;
		public time: Date;
		public id: string;
		public data: any;

		private running: boolean;

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
		public readonly synchronizing: boolean;
		private _existsInDB: boolean;

		public get<T = any>(path: string | string[]): T;
		public clone(): Configuration;
		public sync(): Promise<this>;
		public destroy(): Promise<this>;

		public reset(key?: string | string[], options?: ConfigurationResetOptions): Promise<ConfigurationUpdateResult>;
		public reset(key?: string | string[], guild?: KlasaGuild, options?: ConfigurationResetOptions): Promise<ConfigurationUpdateResult>;
		public update(key: ObjectLiteral, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: ObjectLiteral, guild?: GuildResolvable, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: string, value: any, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: string, value: any, guild?: GuildResolvable, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: string[], value: any[], options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public update(key: string[], value: any[], guild?: GuildResolvable, options?: ConfigurationUpdateOptions): Promise<ConfigurationUpdateResult>;
		public list(message: KlasaMessage, path: SchemaFolder | string): string;
		public resolveString(message: KlasaMessage, path: SchemaPiece | string): string;

		private _save(data: ConfigurationUpdateResult): Promise<void>;
		private _setValueByPath(piece: SchemaPiece, parsedID: any): { updated: boolean, old: any };
		private _patch(data: ObjectLiteral, instance?: object, schema?: SchemaFolder): void;

		public toJSON<T extends ObjectLiteral>(): T;
		public toString(): string;
	}

	export class Gateway extends GatewayStorage {
		public constructor(store: GatewayDriver, type: string, schema: Schema, options: GatewayOptions);
		public store: GatewayDriver;
		public readonly cache: Collection<string, Configuration>;
		public readonly syncQueue: Collection<string, Promise<Configuration>>;

		public get(input: string | number, create?: boolean): Configuration;
		public sync(input: string): Promise<Configuration>;
		public sync(input?: string[]): Promise<Gateway>;
		public getPath(key?: string, options?: GatewayGetPathOptions): GatewayGetPathResult | null;
		public toJSON(): GatewayJSON;
		public toString(): string;

		private _resolveGuild(guild: GuildResolvable): KlasaGuild;
	}

	export class QueryBuilder {
		public constructor(datatypes: ObjectLiteral<QueryBuilderDatatype>, options?: QueryBuilderOptions);
		public get(type: string): QueryBuilderDatatype | null;
		public parse(schemaPiece: SchemaPiece): string;
		public parseValue(value: any, schemaPiece: SchemaPiece, datatype?: QueryBuilderDatatype): string;
		private arrayResolver: (values: Array<any>, piece: SchemaPiece, resolver: Function) => string;
		private formatDatatype: (name: string, datatype: string, def?: string) => string;
		private readonly _datatypes: ObjectLiteral<QueryBuilderDatatype>;
	}

	export class GatewayDriver {
		private constructor(client: KlasaClient);
		public readonly client: KlasaClient;
		public keys: Set<string>;
		public ready: boolean;
		public guilds: Gateway;
		public users: Gateway;
		public clientStorage: Gateway;
		private _queue: Array<(() => Gateway)>;

		public [Symbol.iterator](): Iterator<[string, Gateway]>;
		public register(name: string, options?: GatewayDriverRegisterOptions): this;
		public init(): Promise<void>;
		public sync(input?: string[]): Promise<Array<Gateway>>;

		public toJSON(): GatewayDriverJSON;
		public toString(): string;
	}

	export abstract class GatewayStorage {
		public constructor(client: KlasaClient, type: string, schema: Schema, provider?: string);
		public readonly client: KlasaClient;
		public readonly defaults: any;
		public readonly provider: Provider | null;
		public readonly providerName: string;
		public readonly type: string;
		public ready: boolean;
		public schema: SchemaFolder | null;

		public init(): Promise<void>;
	}

	abstract class SchemaBase extends Map<string, SchemaPiece | SchemaFolder> {
		public readonly configurableKeys: Array<string>;
		public readonly defaults: ObjectLiteral;
		public readonly paths: Map<string, SchemaPiece | SchemaFolder>;
		public add(key: string, callback: (folder: SchemaFolder) => any): this;
		public add(key: string, options: SchemaPieceOptions, callback: (folder: SchemaFolder) => any): this;
		public add(key: string, options?: SchemaPieceOptions): this;
		public add(key: string, type?: string, options?: SchemaPieceOptions): this;
		public remove(key: string): this;
		public get<T = SchemaPiece | SchemaFolder>(key: string | Array<string>): T;
		public toJSON(): ObjectLiteral;

		private debug(): Array<string>;
	}

	export class Schema extends SchemaBase {
		public readonly path: string;
	}

	export class SchemaFolder extends SchemaBase {
		public constructor(parent: Schema | SchemaFolder, key: string, type: 'Folder', options: SchemaFolderOptions);
		public readonly parent: Schema | SchemaFolder;
		public readonly key: string;
		public readonly type: 'Folder';
		public readonly path: string;
		public readonly defaultOptions: SchemaFolderOptions;
	}

	export class SchemaPiece {
		public constructor(parent: Schema | SchemaFolder, key: string, type: string, options: SchemaPieceOptions);
		public readonly parent: Schema | SchemaFolder;
		public readonly key: string;
		public readonly type: string;
		public readonly path: string;
		public array: boolean;
		public default: any;
		public min: number | null;
		public max: number | null;
		public configurable: boolean;
		public toJSON(): SchemaPieceOptions;

		private isValid(): boolean;
		private _generateDefault(): [] | false | null;
		// any is supplied since the following methods do type checks
		private _schemaCheckType(type: any): void;
		private _schemaCheckArray(array: any): void;
		private _schemaCheckDefault(options: any): void;
		private _schemaCheckLimits(min: any, max: any): void;
		private _schemaCheckConfigurable(configurable: any): void;
	}

	export class SchemaTypes extends Map<string, SchemaType> {
		public add(name: string, type: SchemaType): this;
	}

	export class SchemaType {
		public constructor(types: SchemaTypes);
		public readonly types: SchemaTypes;
		public readonly client: KlasaClient;
		public resolve(data: any): Promise<any>;
		public static minOrMax(client: KlasaClient, value: number, guild: KlasaGuild | null, options: SchemaPiece, suffix: string): boolean;
		public static regex: {
			userOrMember: RegExp;
			channel: RegExp;
			emoji: RegExp;
			role: RegExp;
			snowflake: RegExp;
		};
	}

//#endregion Settings

//#region Pieces

	export abstract class Piece {
		public constructor(client: KlasaClient, store: Store<string, Piece, typeof Piece>, file: string[], directory: string, options?: PieceOptions);
		public readonly client: KlasaClient;
		public readonly type: string;
		public readonly path: string;
		public file: string[];
		public name: string;
		public enabled: boolean;
		public store: Store<string, this>;
		public directory: string;

		public reload(): Promise<this>;
		public unload(): void;
		public enable(): this;
		public disable(): this;
		public init(): Promise<any>;
		public toJSON(): PieceJSON;
		public toString(): string;
	}

	export abstract class Argument extends Piece {
		public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string, options?: ArgumentOptions);
		public aliases: string[];
		public static regex: {
			userOrMember: RegExp;
			channel: RegExp;
			emoji: RegExp;
			role: RegExp;
			snowflake: RegExp;
		};

		public abstract run(arg: string, possible: Possible, message: KlasaMessage): any;
		public toJSON(): PieceArgumentJSON;
		private static minOrMax(client: KlasaClient, value: number, min: number, max: number, possible: Possible, message: KlasaMessage, suffix: string): boolean;
	}

	export abstract class Command extends Piece {
		public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string, options?: CommandOptions);
		public readonly category: string;
		public readonly subCategory: string;
		public readonly usageDelim: string;
		public readonly usageString: string;
		public aliases: string[];
		public requiredPermissions: Permissions;
		public bucket: number;
		public cooldown: number;
		public deletable: boolean;
		public description: string | ((language: Language) => string);
		public extendedHelp: string | ((language: Language) => string);
		public fullCategory: string[];
		public guarded: boolean;
		public nsfw: boolean;
		public permissionLevel: number;
		public promptLimit: number;
		public promptTime: number;
		public quotedStringSupport: boolean;
		public requiredConfigs: string[];
		public runIn: string[];
		public subcommands: boolean;
		public usage: CommandUsage;
		private cooldowns: Map<Snowflake, number>;

		public createCustomResolver(type: string, resolver: ArgResolverCustomMethod): this;
		public customizeResponse(name: string, response: string | ((message: KlasaMessage, possible: Possible) => string)): this;
		public definePrompt(usageString: string, usageDelim?: string): Usage;
		public run(message: KlasaMessage, params: any[]): Promise<KlasaMessage | KlasaMessage[] | null>;
		public toJSON(): PieceCommandJSON;
	}

	export abstract class Event extends Piece {
		public constructor(client: KlasaClient, store: EventStore, file: string, directory: string, options?: EventOptions);
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
		public constructor(client: KlasaClient, store: ExtendableStore, file: string, directory: string, options?: ExtendableOptions);
		public readonly static: boolean;
		public appliesTo: string[];
		public target: boolean;

		public extend: any;
		public static extend(...params: any[]): any;
		public toJSON(): PieceExtendableJSON;
	}

	export abstract class Finalizer extends Piece {
		public constructor(client: KlasaClient, store: FinalizerStore, file: string, directory: string, options?: FinalizerOptions);
		public abstract run(message: KlasaMessage, response: KlasaMessage | KlasaMessage[] | null, runTime: Stopwatch): void;
		public toJSON(): PieceFinalizerJSON;
	}

	export abstract class Inhibitor extends Piece {
		public constructor(client: KlasaClient, store: InhibitorStore, file: string, directory: string, options?: InhibitorOptions);
		public spamProtection: boolean;

		public abstract run(message: KlasaMessage, command: Command): Promise<void | string>;
		public toJSON(): PieceInhibitorJSON;
	}

	export abstract class Language extends Piece {
		public constructor(client: KlasaClient, store: LanguageStore, file: string, directory: string, options?: LanguageOptions);
		public language: ObjectLiteral<string | string[] | ((...args: any[]) => string | string[])>;

		public get<T = string>(term: string, ...args: any[]): T;
		public toJSON(): PieceLanguageJSON;
	}

	export abstract class Monitor extends Piece {
		public constructor(client: KlasaClient, store: MonitorStore, file: string, directory: string, options?: MonitorOptions);
		public ignoreBots: boolean;
		public ignoreEdits: boolean;
		public ignoreOthers: boolean;
		public ignoreSelf: boolean;
		public ignoreWebhooks: boolean;
		public ignoreBlacklistedUsers: boolean;
		public ignroeBlacklistedGuilds: boolean;

		public abstract run(message: KlasaMessage): void;
		public shouldRun(message: KlasaMessage): boolean;
		public toJSON(): PieceMonitorJSON;
	}

	export abstract class Provider extends Piece {
		public constructor(client: KlasaClient, store: ProviderStore, file: string, directory: string, options?: ProviderOptions);
		public abstract create<T = any>(table: string, entry: string, data: any): Promise<T>;
		public abstract createTable<T = any>(table: string, rows?: any[]): Promise<T>;
		public abstract delete<T = any>(table: string, entry: string): Promise<T>;
		public abstract deleteTable<T = any>(table: string): Promise<T>;
		public abstract get<T extends ObjectLiteral>(table: string, entry: string): Promise<T>;
		public abstract getAll<T extends ObjectLiteral>(table: string): Promise<T[]>;
		public abstract has(table: string, entry: string): Promise<boolean>;
		public abstract hasTable(table: string): Promise<boolean>;
		public abstract replace<T = any>(table: string, entry: string, data: ConfigurationUpdateResultEntry[] | [string, any][] | ObjectLiteral): Promise<T>;
		public abstract update<T = any>(table: string, entry: string, data: ConfigurationUpdateResultEntry[] | [string, any][] | ObjectLiteral): Promise<T>;
		// The following is not required by SettingGateway but might be available in some providers
		public getKeys(table: string): Promise<string[]>;
		protected parseUpdateInput<T = ObjectLiteral>(updated: T | ConfigurationUpdateResult): T;

		public shutdown(): Promise<void>;
		public toJSON(): PieceProviderJSON;
	}

	export abstract class SQLProvider extends Provider {
		public abstract qb: QueryBuilder;
		public abstract addColumn<T = any>(table: string, columns: SchemaFolder | SchemaPiece): Promise<T>;
		public abstract removeColumn<T = any>(table: string, columns: string | string[]): Promise<T>;
		public abstract updateColumn<T = any>(table: string, piece: SchemaPiece): Promise<T>;
		public abstract getColumns(table: string): Promise<Array<string>>;
		protected parseUpdateInput<T = [string, any]>(updated?: ConfigurationUpdateResultEntry[] | [string, any][] | ObjectLiteral, resolve?: boolean): T;
		protected parseEntry<T = ObjectLiteral>(gateway: string | Gateway, entry: ObjectLiteral): T;
		protected parseValue<T = any>(value: any, schemaPiece: SchemaPiece): T;
		private _parseGatewayInput(updated: ConfigurationUpdateResultEntry[], keys: string[], values: string[], resolve?: boolean): void;
	}

	export abstract class Task extends Piece {
		public constructor(client: KlasaClient, store: TaskStore, file: string, directory: string, options?: TaskOptions);
		public abstract run(data: any): Promise<void>;
		public toJSON(): PieceTaskJSON;
	}

//#endregion Pieces

//#region Stores

	export abstract class Store<K, V extends Piece, VConstructor = Constructable<V>> extends Collection<K, V> {
		public constructor(client: KlasaClient, name: string, holds: V);
		public readonly client: KlasaClient;
		public readonly holds: VConstructor;
		public readonly name: string;
		public readonly userDirectory: string;
		private readonly coreDirectories: Set<string>;

		protected registerCoreDirectory(directory: string): this;
		public delete(name: K | V): boolean;
		public get(key: K): V;
		public get<T extends V>(key: K): T;
		public init(): Promise<any[]>;
		public load(directory: string, file: string[]): V;
		public loadAll(): Promise<number>;
		public resolve(name: V | string): V;
		public set<T extends V>(key: K, value: T): this;
		public set(piece: V): V;
		public toString(): string;

		private static walk<K, V extends Piece, T extends Store<K, V>>(store: T, coreDirectory?: string): Promise<Array<Piece>>;
	}

	export class ArgumentStore extends Store<string, Argument, typeof Argument> {
		public aliases: string[];
	}

	export class CommandStore extends Store<string, Command, typeof Command> {
		public aliases: Collection<string, Command>;
	}

	export class EventStore extends Store<string, Event, typeof Event> {
		private _onceEvents: Set<string>;
	}

	export class ExtendableStore extends Store<string, Extendable, typeof Extendable> { }

	export class FinalizerStore extends Store<string, Finalizer, typeof Finalizer> {
		public run(message: KlasaMessage, response: KlasaMessage, runTime: Stopwatch): Promise<void>;
	}

	export class InhibitorStore extends Store<string, Inhibitor, typeof Inhibitor> {
		public run(message: KlasaMessage, command: Command, selective: boolean): Promise<void>;
	}

	export class LanguageStore extends Store<string, Language, typeof Language> {
		public readonly default: Language;
	}

	export class MonitorStore extends Store<string, Monitor, typeof Monitor> {
		public run(message: KlasaMessage): Promise<void>;
		private _run(message: KlasaMessage, monitor: Monitor);
	}

	export class ProviderStore extends Store<string, Provider, typeof Provider> {
		public readonly default: Provider;
	}

	export class TaskStore extends Store<string, Task, typeof Task> { }

//#endregion Stores

//#region Usage

	export class CommandPrompt extends TextPrompt {
		public constructor(message: KlasaMessage, usage: CommandUsage, options: TextPromptOptions);
		private typing: boolean;

		public run<T = any[]>(): Promise<T>;
		private static generateNewDelim(delim: string): RegExp;
		private static delims: Map<string, RegExp>;
	}

	export class CommandUsage extends Usage {
		public constructor(client: KlasaClient, command: Command);
		public names: string[];
		public commands: string;
		public nearlyFullUsage: string;

		public createPrompt(message: KlasaMessage, options?: TextPromptOptions): CommandPrompt;
		public fullUsage(message: KlasaMessage): string;
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
		public response: string | ((message: KlasaMessage) => string);

		private register(name: string, response: ArgResolverCustomMethod): boolean;
		private static pattern: RegExp;
		private static parseMembers(members: string, count: number): Possible[];
		private static parseTrueMembers(members: string): string[];
	}

	export class TextPrompt {
		public constructor(message: KlasaMessage, usage: Usage, options: TextPromptOptions);
		public readonly client: KlasaClient;
		public message: KlasaMessage;
		public usage: Usage | CommandUsage;
		public reprompted: boolean;
		public flags: ObjectLiteral<string>;
		public args: string[];
		public params: any[];
		public time: number;
		public limit: number;
		public quotedStringSupport: boolean;
		public responses: Collection<string, KlasaMessage>;
		private _repeat: boolean;
		private _required: number;
		private _prompted: number;
		private _currentUsage: Tag;

		public run<T = any[]>(prompt: string): Promise<T>;
		private reprompt(prompt: string): Promise<any[]>;
		private repeatingPrompt(): Promise<any[]>;
		private validateArgs(): Promise<any[]>;
		private multiPossibles(index: number): Promise<any[]>;
		private pushParam(param: any): any[];
		private handleError(err: string): Promise<any[]>;
		private finalize(): any[];
		private _setup(original: string): void;

		private static getFlags(content: string, delim: string): { content: string; flags: ObjectLiteral<string> };
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
		public customResolvers: ObjectLiteral<ArgResolverCustomMethod>;

		public createCustomResolver(type: string, resolver: ArgResolverCustomMethod): this;
		public customizeResponse(name: string, response: ((message: KlasaMessage) => string)): this;
		public createPrompt(message: KlasaMessage, options?: TextPromptOptions): TextPrompt;
		public toJSON(): Tag[];
		public toString(): string;

		private static parseUsage(usageString: string): Tag[];
		private static tagOpen(usage: ObjectLiteral, char: string): void;
		private static tagClose(usage: ObjectLiteral, char: string): void;
		private static tagSpace(usage: ObjectLiteral, char: string): void;
	}

//#endregion Usage

//#region Util

	export class Colors {
		public constructor(options?: ColorsFormatOptions);
		public opening: string;
		public closing: string;

		public format(input: string): string;
		public static useColors: boolean | null;
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

	export const constants: Constants;

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

	export class KlasaConsole {
		private constructor(client: KlasaClient, options: KlasaConsoleConfig);
		public readonly client: KlasaClient;
		public readonly stdout: NodeJS.WritableStream;
		public readonly stderr: NodeJS.WritableStream;
		public template: Timestamp | null;
		public colors: KlasaConsoleColorStyles;
		public utc: boolean;

		private readonly timestamp: string;

		private write(data: any[], type?: string): void;

		public log(...data: any[]): void;
		public warn(...data: any[]): void;
		public error(...data: any[]): void;
		public debug(...data: any[]): void;
		public verbose(...data: any[]): void;
		public wtf(...data: any[]): void;

		private static _flatten(data: any): string;
	}

	export class ReactionHandler extends ReactionCollector {
		public constructor(message: KlasaMessage, filter: Function, options: ReactionHandlerOptions, display: RichDisplay | RichMenu, emojis: EmojiResolvable[]);
		public display: RichDisplay | RichMenu;
		public methodMap: Map<string, EmojiResolvable>;
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

		private _queueEmojiReactions(emojis: EmojiResolvable[]): Promise<null>;
	}

	export class RichDisplay {
		public constructor(embed?: MessageEmbed);
		public embedTemplate: MessageEmbed;
		public pages: MessageEmbed[];
		public infoPage: MessageEmbed | null;
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
		public run(message: KlasaMessage, options?: RichDisplayRunOptions): Promise<ReactionHandler>;

		protected _determineEmojis(emojis: EmojiResolvable[], stop: boolean, jump: boolean, firstLast: boolean): EmojiResolvable[];
		private _footer(): void;
		private _handlePageGeneration(cb: Function | MessageEmbed): MessageEmbed;
	}

	export class RichMenu extends RichDisplay {
		public constructor(embed?: MessageEmbed);
		public emojis: RichMenuEmojisObject;
		public paginated: boolean;
		public options: MenuOption[];

		public addOption(name: string, body: string, inline?: boolean): RichMenu;
		public run(message: KlasaMessage, options?: RichMenuRunOptions): Promise<ReactionHandler>;

		protected _determineEmojis(emojis: EmojiResolvable[], stop: boolean): EmojiResolvable[];
		private _paginate(): void;
	}

	export class Stopwatch {
		public constructor(digits?: number);
		public digits: number;
		private _start: number;
		private _end: number | null;

		public readonly duration: number;
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
		public displayUTC(time?: Date | number | string): string;
		public edit(pattern: string): this;

		public static utc(time?: Date | number | string): Date;
		public static displayArbitrary(pattern: string, time?: Date | number | string): string;

		private static A(time: Date): string;
		private static a(time: Date): string;
		private static d(time: Date): string;
		private static D(time: Date): string;
		private static dd(time: Date): string;
		private static DD(time: Date): string;
		private static ddd(time: Date): string;
		private static DDD(time: Date): string;
		private static dddd(time: Date): string;
		private static DDDD(time: Date): string;
		private static h(time: Date): string;
		private static H(time: Date): string;
		private static hh(time: Date): string;
		private static HH(time: Date): string;
		private static m(time: Date): string;
		private static M(time: Date): string;
		private static mm(time: Date): string;
		private static MM(time: Date): string;
		private static MMM(time: Date): string;
		private static MMMM(time: Date): string;
		private static Q(time: Date): string;
		private static S(time: Date): string;
		private static s(time: Date): string;
		private static ss(time: Date): string;
		private static SS(time: Date): string;
		private static SSS(time: Date): string;
		private static x(time: Date): string;
		private static X(time: Date): string;
		private static Y(time: Date): string;
		private static YY(time: Date): string;
		private static YYY(time: Date): string;
		private static YYYY(time: Date): string;
		private static Z(time: Date): string;
		private static ZZ(time: Date): string;

		private static _resolveDate(time: Date | number | string): Date;
		private static _display(template: string, time: Date | number | string): string;
		private static _patch(pattern: string): TimestampObject[];
	}

	export class Type {
		public constructor(value: any, parent?: Type);

		public value: any;
		public is: string;

		private parent: Type | null;
		private childKeys: Map<string, Type>;
		private childValues: Map<string, Type>;

		private readonly childTypes: string;

		public toString(): string;

		private addValue(value: any): void;
		private addEntry(entry: [string, any]): void;
		private parents(): Iterator<Type>;
		private check(): void;
		private isCircular(): boolean;

		public static resolve(value: any): string;

		private static list(values: Map<string, Type>): string;
	}

	class Util {
		public static arrayFromObject<T = any>(obj: ObjectLiteral<T>, prefix?: string): Array<T>;
		public static arraysStrictEquals(arr1: any[], arr2: any[]): boolean;
		public static chunk<T>(entries: T[], chunkSize: number): Array<T[]>;
		public static clean(text: string): string;
		public static codeBlock(lang: string, expression: string | number | Stringifible): string;
		public static deepClone<T = any>(source: T): T;
		public static exec(exec: string, options?: ExecOptions): Promise<{ stdout: string, stderr: string }>;
		public static getIdentifier(value: PrimitiveType | { id?: PrimitiveType, name?: PrimitiveType }): PrimitiveType | null;
		public static getTypeName(input: any): string;
		public static isClass(input: any): input is Constructable<any>;
		public static isFunction(input: any): input is Function;
		public static isNumber(input: any): input is number;
		public static isObject(input: any): boolean;
		public static isPrimitive(input: any): input is string | number | boolean;
		public static isThenable(input: any): boolean;
		public static makeObject<T = ObjectLiteral, S = ObjectLiteral>(path: string, value: any, obj?: ObjectLiteral): T & S;
		public static mergeDefault<T = ObjectLiteral, S = ObjectLiteral>(objDefaults: T, objSource: S): T & S;
		public static mergeObjects<T = ObjectLiteral, S = ObjectLiteral>(objTarget: T, objSource: S): T & S;
		public static objectToTuples(obj: ObjectLiteral, entries?: { keys: string[], values: any[] }): [string[], any[]];
		public static regExpEsc(str: string): string;
		public static sleep<T = any>(delay: number, args?: T): Promise<T>;
		public static toTitleCase(str: string): string;
		public static tryParse<T = ObjectLiteral>(value: string): T | string;
		private static initClean(client: KlasaClient): void;

		public static titleCaseVariants: TitleCaseVariants;
		public static PRIMITIVE_TYPES: string[];
	}

	export { Util as util };

//#endregion Util

//#endregion Classes

//#region Typedefs

	export type KlasaClientOptions = {
		commandEditing?: boolean;
		commandLogging?: boolean;
		commandMessageLifetime?: number;
		console?: KlasaConsoleConfig;
		consoleEvents?: KlasaConsoleEvents;
		customPromptDefaults?: KlasaCustomPromptDefaults;
		disabledCorePieces?: string[];
		gateways?: KlasaGatewaysOptions;
		language?: string;
		ownerID?: string;
		permissionLevels?: PermissionLevels;
		pieceDefaults?: KlasaPieceDefaults;
		prefix?: string | string[];
		preserveConfigs?: boolean;
		prefixCaseInsensitive?: boolean;
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
		limit?: number;
		time?: number;
		quotedStringSupport?: boolean;
	};

	export type KlasaPieceDefaults = {
		arguments?: ArgumentOptions;
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
	} & ObjectLiteral;

	export type KlasaGatewaysOptions = {
		clientStorage?: GatewayDriverRegisterOptions;
		guilds?: GatewayDriverRegisterOptions;
		users?: GatewayDriverRegisterOptions;
	} & ObjectLiteral;

	// Parsers
	type ArgResolverCustomMethod = (arg: string, possible: Possible, message: KlasaMessage, params: string[]) => any;

	type Constants = {
		DEFAULTS: {
			CLIENT: KlasaClientOptions,
			CONSOLE: KlasaConsoleConfig,
			DATATYPES: ObjectLiteral<QueryBuilderDatatype>
		};
		TIME: {
			SECOND: number;
			MINUTE: number;
			HOUR: number;
			DAY: number;
			DAYS: string[];
			MONTHS: string[];
			TIMESTAMP: {
				TOKENS: {
					Y: number;
					Q: number;
					M: number;
					D: number;
					d: number;
					X: number;
					x: number;
					H: number;
					h: number;
					a: number;
					A: number;
					m: number;
					s: number;
					S: number;
					Z: number;
				};
			};
			CRON: {
				partRegex: RegExp;
				allowedNum: number[][];
				predefined: {
					'@annually': string;
					'@yearly': string;
					'@monthly': string;
					'@weekly': string;
					'@daily': string;
					'@hourly': string;
				};
				tokens: {
					jan: number;
					feb: number;
					mar: number;
					apr: number;
					may: number;
					jun: number;
					jul: number;
					aug: number;
					sep: number;
					oct: number;
					nov: number;
					dec: number;
					sun: number;
					mon: number;
					tue: number;
					wed: number;
					thu: number;
					fri: number;
					sat: number;
				};
				tokensRegex: RegExp;
			}
		};
	};

	// Permissions
	export type PermissionLevel = {
		break: boolean;
		check: (client: KlasaClient, message: KlasaMessage) => Promise<boolean> | boolean;
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
		data: ObjectLiteral;
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
		provider: string;
	};

	export type GatewayJSON = {
		options: GatewayOptions;
		schema: SchemaFolderAddOptions;
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

	export type QueryBuilderDatatype = {
		array?: (datatype: string) => string;
		resolver?: <T = any>(input: any, schemaPiece: SchemaPiece) => T;
		type: string | ((piece: SchemaPiece) => string);
	} | string;

	export type QueryBuilderOptions = {
		arrayResolver?: (values: Array<any>, piece: SchemaPiece, resolver: Function) => string;
		formatDatatype?: (name: string, datatype: string, def?: string) => string;
	} & ObjectLiteral<string | ((piece: SchemaPiece) => string) | QueryBuilderDatatype>;

	export type GuildResolvable = KlasaGuild
		| KlasaMessage
		| KlasaGuildChannel
		| Snowflake;

	export type ConfigurationResetOptions = {
		avoidUnconfigurable?: boolean;
		force?: boolean;
	};

	export type ConfigurationUpdateOptions = {
		action?: 'add' | 'remove' | 'auto';
		arrayPosition?: number;
		avoidUnconfigurable?: boolean;
		force?: boolean;
	};

	export type ConfigurationUpdateResult = {
		errors: Error[];
		updated: ConfigurationUpdateResultEntry[];
	};

	export type ConfigurationUpdateResultEntry = {
		data: [string, any];
		piece: SchemaPiece;
	};

	export type GatewayDriverRegisterOptions = {
		provider?: string;
		schema?: Schema;
		syncArg?: string[] | string | true;
	};

	export type SchemaFolderAddOptions = SchemaFolderOptions | SchemaPieceOptions;

	export type SchemaPieceOptions = {
		type: string;
		array?: boolean;
		configurable?: boolean;
		default?: any;
		max?: number | null;
		min?: number | null;
	};

	export type SchemaFolderOptions = {
		type?: 'Folder';
	} & ObjectLiteral<SchemaPieceOptions>;

	export type GatewayDriverJSON = {
		clientStorage: GatewayJSON;
		guilds: GatewayJSON;
		users: GatewayJSON;
		keys: string[];
		ready: boolean;
	} & ObjectLiteral<GatewayJSON>;

	// Structures
	export type PieceOptions = {
		enabled?: boolean
		name?: string,
	};

	export type ArgumentOptions = {
		aliases?: string[];
	} & PieceOptions;

	export type CommandOptions = {
		aliases?: string[];
		autoAliases?: boolean;
		requiredPermissions?: PermissionResolvable;
		bucket?: number;
		cooldown?: number;
		deletable?: boolean;
		description?: string | string[] | ((language: Language) => string | string[]);
		extendedHelp?: string | string[] | ((language: Language) => string | string[]);
		guarded?: boolean;
		nsfw?: boolean;
		permissionLevel?: number;
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
		ignoreBlacklistedUsers?: boolean;
		ignroeBlacklistedGuilds?: boolean;
	} & PieceOptions;

	export type EventOptions = {
		emitter?: NodeJS.EventEmitter;
		event?: string;
		once?: boolean;
	} & PieceOptions;

	export type ProviderOptions = PieceOptions;
	export type FinalizerOptions = PieceOptions;
	export type LanguageOptions = PieceOptions;
	export type TaskOptions = PieceOptions;

	export type PieceJSON = {
		directory: string;
		path: string;
		enabled: boolean;
		file: string[];
		name: string;
		type: string;
	};

	export type PieceArgumentJSON = {
		aliases: string[];
	} & PieceJSON;

	export type PieceCommandJSON = {
		aliases: string[];
		requiredPermissions: string[];
		bucket: number;
		category: string;
		cooldown: number;
		deletable: boolean;
		description: string | ((language: Language) => string);
		extendedHelp: string | ((language: Language) => string);
		fullCategory: string[];
		guarded: boolean;
		nsfw: boolean;
		permissionLevel: number;
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
		target: 'discord.js' | 'klasa';
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
		ignoreBlacklistedUsers: boolean;
		ignroeBlacklistedGuilds: boolean;
	} & PieceJSON;

	export type PieceEventJSON = {
		emitter: string;
		event: string;
		once: boolean;
	} & PieceJSON;

	export type PieceProviderJSON = PieceJSON;
	export type PieceFinalizerJSON = PieceJSON;
	export type PieceLanguageJSON = PieceJSON;
	export type PieceTaskJSON = PieceJSON;

	// Usage
	export type TextPromptOptions = {
		limit?: number;
		time?: number;
		quotedStringSupport?: boolean;
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
		background?: string | number | string[];
		style?: string | string[];
		text?: string | number | string[]
	};

	export type ColorsFormatType = string | number | [string, string, string] | [number, number, number];

	type ColorsFormatData = {
		opening: string[];
		closing: string[];
	};

	export type KlasaConsoleConfig = {
		utc?: boolean;
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
		content: string | null;
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

	export type RichDisplayEmojisObject = {
		first: EmojiResolvable;
		back: EmojiResolvable;
		forward: EmojiResolvable;
		last: EmojiResolvable;
		jump: EmojiResolvable;
		info: EmojiResolvable;
		stop: EmojiResolvable;
	} & ObjectLiteral<EmojiResolvable>;

	export type RichMenuEmojisObject = {
		zero: EmojiResolvable;
		one: EmojiResolvable;
		two: EmojiResolvable;
		three: EmojiResolvable;
		four: EmojiResolvable;
		five: EmojiResolvable;
		six: EmojiResolvable;
		seven: EmojiResolvable;
		eight: EmojiResolvable;
		nine: EmojiResolvable;
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

	interface Stringifible {
		toString(): string;
	}

	interface ObjectLiteral<T = any> {
		[k: string]: T;
	}

	type Constructable<T> = new (...args: any[]) => T;

	export type PrimitiveType = string | number | boolean;

	export type TitleCaseVariants = {
		textchannel: 'TextChannel';
		voicechannel: 'VoiceChannel';
		categorychannel: 'CategoryChannel';
		guildmember: 'GuildMember';
	} & ObjectLiteral<string>;

//#endregion

}
