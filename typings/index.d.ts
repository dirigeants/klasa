declare module 'klasa' {

	import { ExecOptions } from 'child_process';

	import {
		BufferResolvable,
		CategoryChannel,
		Channel,
		Client,
		ClientApplication,
		ClientOptions,
		ClientUser,
		Collection,
		DMChannel,
		Emoji,
		EmojiResolvable,
		GroupDMChannel,
		Guild,
		GuildChannel,
		GuildEmoji,
		GuildMember,
		Message,
		MessageAttachment,
		MessageCollector,
		MessageEmbed,
		MessageOptions,
		MessageReaction,
		PermissionResolvable,
		Permissions,
		Presence,
		RateLimitData,
		ReactionCollector,
		Role,
		Snowflake,
		Speaking,
		StringResolvable,
		TextChannel,
		User,
		UserResolvable,
		VoiceChannel,
		VoiceState,
		WebhookClient
	} from 'discord.js';

	export const version: string;

//#region Classes

	export class KlasaClient extends Client {
		public constructor(options?: KlasaClientOptions);
		public login(token?: string): Promise<string>;
		private validatePermissionLevels(): PermissionLevels;
		private _ready(): Promise<void>;
		public sweepMessages(lifetime?: number, commandLifeTime?: number): number;
		public static basePermissions: Permissions;
		public static defaultGuildSchema: Schema;
		public static defaultUserSchema: Schema;
		public static defaultClientSchema: Schema;
		public static defaultPermissionLevels: PermissionLevels;
		public static plugin: symbol;
		public static use(mod: any): typeof KlasaClient;
	}

	export { KlasaClient as Client };

//#region Extensions

	export class KlasaGuild extends Guild {
		public settings: Settings;
		public readonly language: Language;
	}

	export class KlasaMessage extends Message {
		private levelID: Snowflake | null;
		private prompter: CommandPrompt | null;
		private _responses: KlasaMessage[];
		private _patch(data: any): void;
		private _registerCommand(commandInfo: { command: Command, prefix: RegExp, prefixLength: number }): this;
	}

	export class KlasaUser extends User {}

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
		public textchannel(data: any, guild: KlasaGuild, name: string): Promise<TextChannel>;
		public url(data: any, guild: KlasaGuild, name: string): Promise<string>;
		public url(input: string): Promise<string>;
		public user(data: any, guild: KlasaGuild, name: string): Promise<KlasaUser>;
		public user(input: KlasaUser | GuildMember | KlasaMessage | Snowflake): Promise<KlasaUser>;
		public voicechannel(data: any, guild: KlasaGuild, name: string): Promise<VoiceChannel>;
		public categorychannel(data: any, guild: KlasaGuild, name: string): Promise<VoiceChannel>;

		public static maxOrMin(guild: KlasaGuild, value: number, min: number, max: number, name: string, suffix: string): boolean;
	}

//#endregion Parsers

//#region Permissions

	export class PermissionLevels extends Collection<number, PermissionLevel> {
		public constructor(levels?: number);

		public add(level: number, check: (message: KlasaMessage) => boolean, options?: PermissionLevelOptions): this;
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
		public create(taskName: string, time: Date | number | string, options?: ScheduledTaskOptions): Promise<ScheduledTask>;
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

	export class SettingsFolder extends Map<string, SettingsFolder | PrimitiveType | object | Array<PrimitiveType | object>> {
		public constructor(schema: SchemaFolder);
		public readonly schema: SchemaFolder;
		public readonly base: Settings | null;
		public readonly gateway: Gateway;
		public reset(path: string, options?: SettingsFolderResetOptions): Promise<SettingsFolderUpdateResult>;
		public reset(paths: Iterable<string>, options?: SettingsFolderResetOptions): Promise<SettingsFolderUpdateResult>;
		public reset(object: Record<string, any>, options?: SettingsFolderResetOptions): Promise<SettingsFolderUpdateResult>;
		public update(key: string, value: any, options?: SettingsFolderUpdateOptions): Promise<SettingsFolderUpdateResult>;
		public update(entries: Iterable<[string, any]>, options?: SettingsFolderUpdateOptions): Promise<SettingsFolderUpdateResult>;
		public update(object: Record<string, any>, options?: SettingsFolderUpdateOptions): Promise<SettingsFolderUpdateResult>;
		public display(message: KlasaMessage, path?: string | Schema | SchemaFolder | SchemaEntry): string;
		public pluck<T extends string>(...paths: T[]): Partial<Record<T, any>>;
		public resolve<T extends string>(...paths: T[]): Partial<Record<T, any>>;
		public toJSON(): any;
		public toString(): string;
		private relative(pathOrPiece: string | Schema | SchemaEntry): string;
		private _save(results: Array<SettingsFolderUpdateResultEntry>): Promise<void>;
		private _parse(entry: SchemaEntry, previous: any, next: any, options: SettingsFolderUpdateOptions): Promise<any>;
		private _patch(data: Record<string, any>): void;
	}

	export class Settings extends SettingsFolder {
		public constructor(manager: Gateway, target: any, id: string);
		public readonly id: string;
		public readonly gateway: Gateway;
		public readonly target: any;
		public readonly synchronizing: boolean;
		private existenceStatus: boolean | null;
		public clone(): Settings;
		public sync(force?: boolean): Promise<this>;
		public destroy(): Promise<this>;
		private init(folder: SettingsFolder, schema: SchemaFolder): void;
	}

	export class GatewayDriver extends Collection<string, Gateway> {
		public constructor(client: KlasaClient);
		public readonly client: KlasaClient;
		public ready: boolean;

		public register(gateway: GatewayStorage): this;
		public init(): Promise<void>;
		public sync(input?: string[] | string): Promise<Array<Gateway>>;

		public toJSON(): GatewayDriverJSON;
		public toString(): string;
	}

	export class Gateway extends GatewayStorage {
		protected syncQueue: WeakMap<Settings, Promise<Settings>>;
		protected cache: Collection<string, Record<string, any> & { settings: Settings }>;
		public acquire(target: any, id?: string | number): Settings;
		public create(target: any, id?: string | number): Settings;
		public get(id: string | number): Settings | null;
		public sync(input: string): Promise<Settings>;
		public sync(input?: string[]): Promise<this>;
		public sync(input?: string | string[]): Promise<Settings | this>;
	}

	export class QueryBuilder extends Map<string, Required<QueryBuilderDatatype>> {
		public constructor(options?: QueryBuilderEntryOptions);
		private array: QueryBuilderArray;
		private arraySerializer: QueryBuilderArraySerializer;
		private formatDatatype: QueryBuilderFormatDatatype;
		private serializer: QueryBuilderSerializer;
		public add(name: string, data: QueryBuilderDatatype | string): this;
		public generateDatatype(schemaEntry: SchemaEntry): string;
		public serialize(value: any, schemaEntry: SchemaEntry, datatype?: Required<QueryBuilderDatatype>): string;
		public debug(): string;
	}

	export class GatewayStorage {
		public constructor(client: KlasaClient, name: string, options?: GatewayOptions);
		public readonly client: KlasaClient;
		public readonly provider: Provider | null;
		public readonly name: string;
		public readonly schema: SchemaFolder;
		private readonly _provider: string;
		public ready: boolean;
		public sync(): Promise<this>;
		public init(): Promise<void>;
		public toJSON(): GatewayJSON;
		public toString(): string;
	}

	export class Schema extends Map<string, SchemaEntry | SchemaFolder> {
		public constructor(path?: string);
		public readonly configurableValues: Array<SchemaEntry>;
		public readonly configurableKeys: Array<string>;
		public readonly defaults: SettingsFolder;
		public readonly path: string;
		public readonly paths: Map<string, SchemaEntry | SchemaFolder>;
		public readonly type: 'Folder';
		public add(key: string, type: string, options?: SchemaEntryOptions): this;
		public add(key: string, callback: (folder: SchemaFolder) => any): this;
		public get<T = Schema | SchemaEntry | SchemaFolder>(key: string | Array<string>): T;
		public resolve(settings: Settings, language: Language, guild: KlasaGuild): Promise<Record<string, any>>;
		public toJSON(): ObjectLiteral;
	}

	export class SchemaFolder extends Schema {
		public constructor(parent: Schema | SchemaFolder, key: string);
		public readonly key: string;
		public readonly parent: Schema | SchemaFolder;
	}

	export class SchemaEntry {
		public constructor(parent: Schema | SchemaFolder, key: string, type: string, options: SchemaEntryOptions);
		public readonly client: KlasaClient | null;
		public readonly parent: Schema | SchemaFolder;
		public readonly key: string;
		public readonly serializer: Serializer;
		public readonly type: string;
		public readonly path: string;
		public array: boolean;
		public configurable: boolean;
		public default: any;
		public min: number | null;
		public max: number | null;
		public filter: ((client: KlasaClient, value: any, entry: SchemaEntry, language: Language) => boolean) | null;
		public shouldResolve: boolean;
		public parse<T>(value: any, guild?: KlasaGuild): T;
		public edit(options?: SchemaEntryEditOptions): this;
		public resolve(settings: Settings, language: Language, guild: KlasaGuild): Promise<any>;
		public toJSON(): SchemaEntryOptions;

		private isValid(): boolean;
		private _generateDefault(): Array<any> | false | null;
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

	export abstract class AliasPiece extends Piece {
		public constructor(client: KlasaClient, store: Store<string, Piece, typeof Piece>, file: string[], directory: string, options?: AliasPieceOptions);
		public aliases: Array<string>;
		public toJSON(): AliasPieceJSON;
	}

	export abstract class Argument extends AliasPiece {
		public constructor(client: KlasaClient, store: ArgumentStore, file: string[], directory: string, options?: ArgumentOptions);
		public aliases: string[];
		public abstract run(arg: string, possible: Possible, message: KlasaMessage): any;
		public static regex: MentionRegex;
		private static minOrMax(client: KlasaClient, value: number, min: number, max: number, possible: Possible, message: KlasaMessage, suffix: string): boolean;
	}

	export abstract class Command extends AliasPiece {
		public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string, options?: CommandOptions);
		public readonly bucket: number;
		public readonly category: string;
		public readonly cooldown: number;
		public readonly subCategory: string;
		public readonly usageDelim: string;
		public readonly usageString: string;
		public aliases: string[];
		public requiredPermissions: Permissions;
		public cooldownLevel: 'author' | 'channel' | 'guild';
		public deletable: boolean;
		public description: string | ((language: Language) => string);
		public extendedHelp: string | ((language: Language) => string);
		public fullCategory: string[];
		public guarded: boolean;
		public hidden: boolean;
		public nsfw: boolean;
		public permissionLevel: number;
		public promptLimit: number;
		public promptTime: number;
		public quotedStringSupport: boolean;
		public requiredSettings: string[];
		public runIn: string[];
		public subcommands: boolean;
		public usage: CommandUsage;
		private cooldowns: RateLimitManager;

		public createCustomResolver(type: string, resolver: ArgResolverCustomMethod): this;
		public customizeResponse(name: string, response: string | ((message: KlasaMessage, possible: Possible) => string)): this;
		public definePrompt(usageString: string, usageDelim?: string): Usage;
		public run(message: KlasaMessage, params: any[]): Promise<KlasaMessage | KlasaMessage[] | null>;
		public toJSON(): PieceCommandJSON;
	}

	export abstract class Event extends Piece {
		public constructor(client: KlasaClient, store: EventStore, file: string[], directory: string, options?: EventOptions);
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
		public constructor(client: KlasaClient, store: ExtendableStore, file: string[], directory: string, options?: ExtendableOptions);
		public readonly appliesTo: Array<Constructor<any>>;
		private staticPropertyDescriptors: PropertyDescriptorMap;
		private instancePropertyDescriptors: PropertyDescriptorMap;
		private originals: Map<Constructor<any>, OriginalPropertyDescriptors>;
		public toJSON(): PieceExtendableJSON;
	}

	export abstract class Finalizer extends Piece {
		public constructor(client: KlasaClient, store: FinalizerStore, file: string[], directory: string, options?: FinalizerOptions);
		public abstract run(message: KlasaMessage, command: Command, response: KlasaMessage | KlasaMessage[] | null, runTime: Stopwatch): void;
		public toJSON(): PieceFinalizerJSON;
		protected _run(message: KlasaMessage, command: Command, response: KlasaMessage | KlasaMessage[] | null, runTime: Stopwatch): Promise<void>;
	}

	export abstract class Inhibitor extends Piece {
		public constructor(client: KlasaClient, store: InhibitorStore, file: string[], directory: string, options?: InhibitorOptions);
		public spamProtection: boolean;
		public abstract run(message: KlasaMessage, command: Command): void | boolean | string | Promise<void | boolean | string>;
		public toJSON(): PieceInhibitorJSON;
		protected _run(message: KlasaMessage, command: Command): Promise<boolean | string>;
	}

	export abstract class Language extends Piece {
		public constructor(client: KlasaClient, store: LanguageStore, file: string[], directory: string, options?: LanguageOptions);
		public language: ObjectLiteral<string | string[] | ((...args: any[]) => string | string[])>;

		public get<T = string>(term: string, ...args: any[]): T;
		public toJSON(): PieceLanguageJSON;
	}

	export abstract class Monitor extends Piece {
		public constructor(client: KlasaClient, store: MonitorStore, file: string[], directory: string, options?: MonitorOptions);
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
		protected _run(message: KlasaMessage): Promise<void>;
	}

	export abstract class MultiArgument extends Argument {
		public abstract readonly base: Argument;
		public run<T = any>(argument: string, possible: Possible, message: KlasaMessage): Promise<Array<T>>;
	}

	export abstract class Provider extends Piece {
		public constructor(client: KlasaClient, store: ProviderStore, file: string[], directory: string, options?: ProviderOptions);
		public abstract create(table: string, entry: string, data: any): Promise<any>;
		public abstract createTable(table: string, rows?: any[]): Promise<any>;
		public abstract delete(table: string, entry: string): Promise<any>;
		public abstract deleteTable(table: string): Promise<any>;
		public abstract get<T extends ObjectLiteral>(table: string, entry: string): Promise<T>;
		public abstract getAll<T extends ObjectLiteral>(table: string): Promise<T[]>;
		public abstract has(table: string, entry: string): Promise<boolean>;
		public abstract hasTable(table: string): Promise<boolean>;
		public abstract update(table: string, entry: string, data: SettingsFolderUpdateResult[] | [string, any][] | ObjectLiteral): Promise<any>;
		public abstract replace(table: string, entry: string, data: SettingsFolderUpdateResult[] | [string, any][] | ObjectLiteral): Promise<any>;
		// The following is not required by SettingGateway but might be available in some providers
		public getKeys(table: string): Promise<string[]>;
		protected parseUpdateInput<T = ObjectLiteral>(updated: T | Array<SettingsFolderUpdateResultEntry>): T;

		public shutdown(): Promise<void>;
		public toJSON(): PieceProviderJSON;
	}

	export abstract class SQLProvider extends Provider {
		public abstract qb: QueryBuilder;
		public abstract addColumn<T = any>(table: string, columns: SchemaFolder | SchemaEntry): Promise<T>;
		public abstract removeColumn<T = any>(table: string, columns: string | string[]): Promise<T>;
		public abstract updateColumn<T = any>(table: string, entry: SchemaEntry): Promise<T>;
		public abstract getColumns(table: string): Promise<Array<string>>;
		protected parseUpdateInput<T = [string, any]>(updated?: SettingsFolderUpdateResultEntry[] | [string, any][] | ObjectLiteral, resolve?: boolean): T;
		protected parseEntry<T = ObjectLiteral>(gateway: string | Gateway, entry: ObjectLiteral): T;
		protected parseValue<T = any>(value: any, schemaEntry: SchemaEntry): T;
		protected validateQueryBuilder(): void;
		private _parseGatewayInput(updated: SettingsFolderUpdateResultEntry[], keys: string[], values: string[], resolve?: boolean): void;
	}

	export abstract class Task extends Piece {
		public constructor(client: KlasaClient, store: TaskStore, file: string[], directory: string, options?: TaskOptions);
		public abstract run(data: any): Promise<void>;
		public toJSON(): PieceTaskJSON;
	}

	export abstract class Serializer extends AliasPiece {
		public constructor(client: KlasaClient, store: SerializerStore, file: string[], directory: string, options?: SerializerOptions);
		public serialize(data: any): PrimitiveType;
		public stringify(data: any): string;
		public toJSON(): PieceSerializerJSON;
		public abstract deserialize(data: any, entry: SchemaEntry, language: Language, guild?: KlasaGuild): Promise<any>;
		public static regex: MentionRegex;
	}

//#endregion Pieces

//#region Stores

	export abstract class Store<K, V extends Piece, VConstructor = Constructor<V>> extends Collection<K, V> {
		public constructor(client: KlasaClient, name: string, holds: VConstructor);
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

	export abstract class AliasStore<K, V extends Piece, VConstructor = Constructor<V>> extends Store<K, V, VConstructor> {
		public aliases: Collection<K, V>;
	}

	export class ArgumentStore extends AliasStore<string, Argument, typeof Argument> { }

	export class CommandStore extends AliasStore<string, Command, typeof Command> { }

	export class EventStore extends Store<string, Event, typeof Event> {
		private _onceEvents: Set<string>;
	}

	export class ExtendableStore extends Store<string, Extendable, typeof Extendable> { }

	export class FinalizerStore extends Store<string, Finalizer, typeof Finalizer> {
		public run(message: KlasaMessage, command: Command, response: KlasaMessage, runTime: Stopwatch): Promise<void>;
	}

	export class InhibitorStore extends Store<string, Inhibitor, typeof Inhibitor> {
		public run(message: KlasaMessage, command: Command, selective?: boolean): Promise<void>;
	}

	export class LanguageStore extends Store<string, Language, typeof Language> {
		public readonly default: Language;
	}

	export class MonitorStore extends Store<string, Monitor, typeof Monitor> {
		public run(message: KlasaMessage): Promise<void>;
	}

	export class ProviderStore extends Store<string, Provider, typeof Provider> {
		public readonly default: Provider;
	}

	export class TaskStore extends Store<string, Task, typeof Task> { }

	export class SerializerStore extends AliasStore<string, Serializer, typeof Serializer> { }

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
		private static commas: RegExp;
		private static aan: RegExp;

		private static _parse(pattern: string): number;
	}

	export class KlasaConsole {
		private constructor(options?: ConsoleOptions);
		public readonly stdout: NodeJS.WritableStream;
		public readonly stderr: NodeJS.WritableStream;
		public template: Timestamp | null;
		public colors: ConsoleColorStyles;
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

	export class RateLimit {
		public constructor(bucket: number, cooldown: number);
		public readonly expired: boolean;
		public readonly limited: boolean;
		public readonly remainingTime: number;
		public bucket: number;
		public cooldown: number;
		private remaining: number;
		private time: number;
		public drip(): this;
		public reset(): this;
		public resetRemaining(): this;
		public resetTime(): this;
	}

	export class RateLimitManager<K = Snowflake> extends Collection<K, RateLimit> {
		public constructor(bucket: number, cooldown: number);
		public bucket: number;
		public cooldown: number;
		private _bucket: number;
		private _cooldown: number;
		private sweepInterval: NodeJS.Timer | null;
		public acquire(id: K): RateLimit;
		public create(id: K): RateLimit;
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

		public static A(time: Date): string;
		public static a(time: Date): string;
		public static d(time: Date): string;
		public static D(time: Date): string;
		public static dd(time: Date): string;
		public static DD(time: Date): string;
		public static ddd(time: Date): string;
		public static DDD(time: Date): string;
		public static dddd(time: Date): string;
		public static DDDD(time: Date): string;
		public static h(time: Date): string;
		public static H(time: Date): string;
		public static hh(time: Date): string;
		public static HH(time: Date): string;
		public static m(time: Date): string;
		public static M(time: Date): string;
		public static mm(time: Date): string;
		public static MM(time: Date): string;
		public static MMM(time: Date): string;
		public static MMMM(time: Date): string;
		public static Q(time: Date): string;
		public static S(time: Date): string;
		public static s(time: Date): string;
		public static ss(time: Date): string;
		public static SS(time: Date): string;
		public static SSS(time: Date): string;
		public static x(time: Date): string;
		public static X(time: Date): string;
		public static Y(time: Date): string;
		public static YY(time: Date): string;
		public static YYY(time: Date): string;
		public static YYYY(time: Date): string;
		public static Z(time: Date): string;
		public static ZZ(time: Date): string;

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
		public static codeBlock(lang: string, expression: StringResolvable): string;
		public static deepClone<T = any>(source: T): T;
		public static exec(exec: string, options?: ExecOptions): Promise<{ stdout: string, stderr: string }>;
		public static getTypeName(input: any): string;
		public static isClass(input: any): input is Constructor<any>;
		public static isFunction(input: any): input is Function;
		public static isNumber(input: any): input is number;
		public static isObject(input: any): boolean;
		public static isPrimitive(input: any): input is string | number | boolean;
		public static isThenable(input: any): boolean;
		public static makeObject<T = ObjectLiteral, S = ObjectLiteral>(path: string, value: any, obj?: ObjectLiteral): T & S;
		public static mergeDefault<T = ObjectLiteral, S = ObjectLiteral>(objDefaults: T, objSource: S): T & S;
		public static mergeObjects<T = ObjectLiteral, S = ObjectLiteral>(objTarget: T, objSource: S): T & S;
		public static objectToTuples(obj: ObjectLiteral): Array<[string, any]>;
		public static regExpEsc(str: string): string;
		public static sleep<T = any>(delay: number, args?: T): Promise<T>;
		public static toTitleCase(str: string): string;
		public static tryParse<T = ObjectLiteral>(value: string): T | string;
		public static resolveGuild(client: KlasaClient, guild: GuildResolvable): KlasaGuild;
		private static initClean(client: KlasaClient): void;

		public static titleCaseVariants: TitleCaseVariants;
		public static PRIMITIVE_TYPES: string[];
	}

	export { Util as util };

//#endregion Util

//#endregion Classes

//#region Augmentations

	module 'discord.js' {

		export interface Client {
			constructor: typeof KlasaClient;
			readonly invite: string;
			readonly owner: User | null;
			options: Required<KlasaClientOptions>;
			userBaseDirectory: string;
			console: KlasaConsole;
			arguments: ArgumentStore;
			commands: CommandStore;
			inhibitors: InhibitorStore;
			finalizers: FinalizerStore;
			monitors: MonitorStore;
			languages: LanguageStore;
			providers: ProviderStore;
			tasks: TaskStore;
			serializers: SerializerStore;
			events: EventStore;
			extendables: ExtendableStore;
			pieceStores: Collection<string, any>;
			permissionLevels: PermissionLevels;
			gateways: GatewayDriver;
			settings: Settings | null;
			application: ClientApplication;
			schedule: Schedule;
			ready: boolean;
			registerStore<K, V extends Piece, VConstructor = Constructor<V>>(store: Store<K, V, VConstructor>): KlasaClient;
			unregisterStore<K, V extends Piece, VConstructor = Constructor<V>>(store: Store<K, V, VConstructor>): KlasaClient;
			sweepMessages(lifetime?: number, commandLifeTime?: number): number;
			on(event: string | symbol, listener: Function): this;
			on(event: 'channelCreate', listener: (channel: Channel) => void): this;
			on(event: 'channelDelete', listener: (channel: Channel) => void): this;
			on(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
			on(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
			on(event: 'debug', listener: (info: string) => void): this;
			on(event: 'warn', listener: (info: string) => void): this;
			on(event: 'disconnect', listener: (event: any) => void): this;
			on(event: 'emojiCreate', listener: (emoji: GuildEmoji) => void): this;
			on(event: 'emojiDelete', listener: (emoji: GuildEmoji) => void): this;
			on(event: 'emojiUpdate', listener: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void): this;
			on(event: 'error', listener: (error: Error) => void): this;
			on(event: 'guildBanAdd', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
			on(event: 'guildBanRemove', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
			on(event: 'guildCreate', listener: (guild: KlasaGuild) => void): this;
			on(event: 'guildDelete', listener: (guild: KlasaGuild) => void): this;
			on(event: 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
			on(event: 'guildMemberAdd', listener: (member: GuildMember) => void): this;
			on(event: 'guildMemberAvailable', listener: (member: GuildMember) => void): this;
			on(event: 'guildMemberRemove', listener: (member: GuildMember) => void): this;
			on(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, GuildMember>, guild: KlasaGuild) => void): this;
			on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: Readonly<Speaking>) => void): this;
			on(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
			on(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
			on(event: 'guildIntegrationsUpdate', listener: (guild: KlasaGuild) => void): this;
			on(event: 'message', listener: (message: KlasaMessage) => void): this;
			on(event: 'messageDelete', listener: (message: KlasaMessage) => void): this;
			on(event: 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
			on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
			on(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
			on(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
			on(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
			on(event: 'presenceUpdate', listener: (oldPresence: Presence | undefined, newPresence: Presence) => void): this;
			on(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
			on(event: 'ready', listener: () => void): this;
			on(event: 'reconnecting', listener: () => void): this;
			on(event: 'resumed', listener: (replayed: number) => void): this;
			on(event: 'roleCreate', listener: (role: Role) => void): this;
			on(event: 'roleDelete', listener: (role: Role) => void): this;
			on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
			on(event: 'typingStart', listener: (channel: Channel, user: KlasaUser) => void): this;
			on(event: 'typingStop', listener: (channel: Channel, user: KlasaUser) => void): this;
			on(event: 'userUpdate', listener: (oldUser: KlasaUser, newUser: KlasaUser) => void): this;
			on(event: 'voiceStateUpdate', listener: (oldState: VoiceState, newState: VoiceState) => void): this;
			on(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
			on(event: 'commandError', listener: (message: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
			on(event: 'commandInhibited', listener: (message: KlasaMessage, command: Command, response: string | Error) => void): this;
			on(event: 'commandRun', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
			on(event: 'commandSuccess', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
			on(event: 'commandUnknown', listener: (message: KlasaMessage, command: string, prefix: RegExp, prefixLength: number) => void): this;
			on(event: 'monitorError', listener: (message: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
			on(event: 'finalizerError', listener: (message: KlasaMessage, response: KlasaMessage, runTime: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
			on(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;
			on(event: 'settingsSync', listener: (entry: Settings) => void): this;
			on(event: 'settingsCreate', listener: (entry: Settings) => void): this;
			on(event: 'settingsDelete', listener: (entry: Settings) => void): this;
			on(event: 'settingsUpdate', listener: (entry: Settings, changes: SettingsFolderUpdateResultEntry[]) => void): this;
			on(event: 'log', listener: (data: any) => void): this;
			on(event: 'verbose', listener: (data: any) => void): this;
			on(event: 'wtf', listener: (failure: Error) => void): this;
			on(event: 'pieceDisabled', listener: (piece: Piece) => void): this;
			on(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
			on(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
			on(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
			on(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;
			once(event: string | symbol, listener: Function): this;
			once(event: 'channelCreate', listener: (channel: Channel) => void): this;
			once(event: 'channelDelete', listener: (channel: Channel) => void): this;
			once(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
			once(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
			once(event: 'debug', listener: (info: string) => void): this;
			once(event: 'warn', listener: (info: string) => void): this;
			once(event: 'disconnect', listener: (event: any) => void): this;
			once(event: 'emojiCreate', listener: (emoji: GuildEmoji) => void): this;
			once(event: 'emojiDelete', listener: (emoji: GuildEmoji) => void): this;
			once(event: 'emojiUpdate', listener: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void): this;
			once(event: 'error', listener: (error: Error) => void): this;
			once(event: 'guildBanAdd', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
			once(event: 'guildBanRemove', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
			once(event: 'guildCreate', listener: (guild: KlasaGuild) => void): this;
			once(event: 'guildDelete', listener: (guild: KlasaGuild) => void): this;
			once(event: 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
			once(event: 'guildMemberAdd', listener: (member: GuildMember) => void): this;
			once(event: 'guildMemberAvailable', listener: (member: GuildMember) => void): this;
			once(event: 'guildMemberRemove', listener: (member: GuildMember) => void): this;
			once(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, GuildMember>, guild: KlasaGuild) => void): this;
			once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: Readonly<Speaking>) => void): this;
			once(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
			once(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
			once(event: 'guildIntegrationsUpdate', listener: (guild: KlasaGuild) => void): this;
			once(event: 'message', listener: (message: KlasaMessage) => void): this;
			once(event: 'messageDelete', listener: (message: KlasaMessage) => void): this;
			once(event: 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
			once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
			once(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
			once(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
			once(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
			once(event: 'presenceUpdate', listener: (oldPresence: Presence | undefined, newPresence: Presence) => void): this;
			once(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
			once(event: 'ready', listener: () => void): this;
			once(event: 'reconnecting', listener: () => void): this;
			once(event: 'resumed', listener: (replayed: number) => void): this;
			once(event: 'roleCreate', listener: (role: Role) => void): this;
			once(event: 'roleDelete', listener: (role: Role) => void): this;
			once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
			once(event: 'typingStart', listener: (channel: Channel, user: KlasaUser) => void): this;
			once(event: 'typingStop', listener: (channel: Channel, user: KlasaUser) => void): this;
			once(event: 'userUpdate', listener: (oldUser: KlasaUser, newUser: KlasaUser) => void): this;
			once(event: 'voiceStateUpdate', listener: (oldState: VoiceState, newState: VoiceState) => void): this;
			once(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
			once(event: 'commandError', listener: (message: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
			once(event: 'commandInhibited', listener: (message: KlasaMessage, command: Command, response: string | Error) => void): this;
			once(event: 'commandRun', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
			once(event: 'commandSuccess', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
			once(event: 'commandUnknown', listener: (message: KlasaMessage, command: string, prefix: RegExp, prefixLength: number) => void): this;
			once(event: 'monitorError', listener: (message: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
			once(event: 'finalizerError', listener: (message: KlasaMessage, response: KlasaMessage, runTime: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
			once(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;
			once(event: 'settingsSync', listener: (entry: Settings) => void): this;
			once(event: 'settingsCreate', listener: (entry: Settings) => void): this;
			once(event: 'settingsDelete', listener: (entry: Settings) => void): this;
			once(event: 'settingsUpdate', listener: (entry: Settings, changes: SettingsFolderUpdateResultEntry[]) => void): this;
			once(event: 'log', listener: (data: any) => void): this;
			once(event: 'verbose', listener: (data: any) => void): this;
			once(event: 'wtf', listener: (failure: Error) => void): this;
			once(event: 'pieceDisabled', listener: (piece: Piece) => void): this;
			once(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
			once(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
			once(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
			once(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;
			off(event: string | symbol, listener: Function): this;
			off(event: 'channelCreate', listener: (channel: Channel) => void): this;
			off(event: 'channelDelete', listener: (channel: Channel) => void): this;
			off(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
			off(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
			off(event: 'debug', listener: (info: string) => void): this;
			off(event: 'warn', listener: (info: string) => void): this;
			off(event: 'disconnect', listener: (event: any) => void): this;
			off(event: 'emojiCreate', listener: (emoji: GuildEmoji) => void): this;
			off(event: 'emojiDelete', listener: (emoji: GuildEmoji) => void): this;
			off(event: 'emojiUpdate', listener: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void): this;
			off(event: 'error', listener: (error: Error) => void): this;
			off(event: 'guildBanAdd', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
			off(event: 'guildBanRemove', listener: (guild: KlasaGuild, user: KlasaUser) => void): this;
			off(event: 'guildCreate', listener: (guild: KlasaGuild) => void): this;
			off(event: 'guildDelete', listener: (guild: KlasaGuild) => void): this;
			off(event: 'guildUnavailable', listener: (guild: KlasaGuild) => void): this;
			off(event: 'guildMemberAdd', listener: (member: GuildMember) => void): this;
			off(event: 'guildMemberAvailable', listener: (member: GuildMember) => void): this;
			off(event: 'guildMemberRemove', listener: (member: GuildMember) => void): this;
			off(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, GuildMember>, guild: KlasaGuild) => void): this;
			off(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: Readonly<Speaking>) => void): this;
			off(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
			off(event: 'guildUpdate', listener: (oldGuild: KlasaGuild, newGuild: KlasaGuild) => void): this;
			off(event: 'guildIntegrationsUpdate', listener: (guild: KlasaGuild) => void): this;
			off(event: 'message', listener: (message: KlasaMessage) => void): this;
			off(event: 'messageDelete', listener: (message: KlasaMessage) => void): this;
			off(event: 'messageReactionRemoveAll', listener: (message: KlasaMessage) => void): this;
			off(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, KlasaMessage>) => void): this;
			off(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
			off(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: KlasaUser) => void): this;
			off(event: 'messageUpdate', listener: (oldMessage: KlasaMessage, newMessage: KlasaMessage) => void): this;
			off(event: 'presenceUpdate', listener: (oldPresence: Presence | undefined, newPresence: Presence) => void): this;
			off(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
			off(event: 'ready', listener: () => void): this;
			off(event: 'reconnecting', listener: () => void): this;
			off(event: 'resumed', listener: (replayed: number) => void): this;
			off(event: 'roleCreate', listener: (role: Role) => void): this;
			off(event: 'roleDelete', listener: (role: Role) => void): this;
			off(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
			off(event: 'typingStart', listener: (channel: Channel, user: KlasaUser) => void): this;
			off(event: 'typingStop', listener: (channel: Channel, user: KlasaUser) => void): this;
			off(event: 'userUpdate', listener: (oldUser: KlasaUser, newUser: KlasaUser) => void): this;
			off(event: 'voiceStateUpdate', listener: (oldState: VoiceState, newState: VoiceState) => void): this;
			off(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
			off(event: 'commandError', listener: (message: KlasaMessage, command: Command, params: any[], error: Error) => void): this;
			off(event: 'commandInhibited', listener: (message: KlasaMessage, command: Command, response: string | Error) => void): this;
			off(event: 'commandRun', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
			off(event: 'commandSuccess', listener: (message: KlasaMessage, command: Command, params: any[], response: any) => void): this;
			off(event: 'commandUnknown', listener: (message: KlasaMessage, command: string, prefix: RegExp, prefixLength: number) => void): this;
			off(event: 'monitorError', listener: (message: KlasaMessage, monitor: Monitor, error: Error | string) => void): this;
			off(event: 'finalizerError', listener: (message: KlasaMessage, response: KlasaMessage, runTime: Timestamp, finalizer: Finalizer, error: Error | string) => void): this;
			off(event: 'taskError', listener: (scheduledTask: ScheduledTask, task: Task, error: Error) => void): this;
			off(event: 'settingsSync', listener: (entry: Settings) => void): this;
			off(event: 'settingsCreate', listener: (entry: Settings) => void): this;
			off(event: 'settingsDelete', listener: (entry: Settings) => void): this;
			off(event: 'settingsUpdate', listener: (entry: Settings, changes: SettingsFolderUpdateResultEntry[]) => void): this;
			off(event: 'log', listener: (data: any) => void): this;
			off(event: 'verbose', listener: (data: any) => void): this;
			off(event: 'wtf', listener: (failure: Error) => void): this;
			off(event: 'pieceDisabled', listener: (piece: Piece) => void): this;
			off(event: 'pieceEnabled', listener: (piece: Piece) => void): this;
			off(event: 'pieceLoaded', listener: (piece: Piece) => void): this;
			off(event: 'pieceReloaded', listener: (piece: Piece) => void): this;
			off(event: 'pieceUnloaded', listener: (piece: Piece) => void): this;
		}

		export interface Guild {
			settings: Settings;
			readonly language: Language;
		}

		export interface Message extends PartialSendAliases {
			guildSettings: Settings;
			language: Language;
			command: Command | null;
			prefix: RegExp | null;
			prefixLength: number | null;
			readonly responses: KlasaMessage[];
			readonly args: string[];
			readonly params: any[];
			readonly flags: ObjectLiteral<string>;
			readonly reprompted: boolean;
			readonly reactable: boolean;
			send(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
			prompt(text: string, time?: number): Promise<KlasaMessage>;
			usableCommands(): Promise<Collection<string, Command>>;
			hasAtLeastPermissionLevel(min: number): Promise<boolean>;
		}

		export interface User extends SendAliases {
			settings: Settings;
		}

		export interface TextChannel extends SendAliases, ChannelExtendables { }

		export interface DMChannel extends SendAliases, ChannelExtendables { }

		export interface GroupDMChannel extends SendAliases, ChannelExtendables { }

	}

//#endregion Augmentations

//#region Typedefs

	export type KlasaClientOptions = {
		commandEditing?: boolean;
		commandLogging?: boolean;
		commandMessageLifetime?: number;
		console?: ConsoleOptions;
		consoleEvents?: KlasaConsoleEvents;
		createPiecesFolders?: boolean;
		customPromptDefaults?: CustomPromptDefaults;
		disabledCorePieces?: string[];
		gateways?: GatewayOptions;
		language?: string;
		noPrefixDM?: boolean;
		ownerID?: string;
		permissionLevels?: PermissionLevels;
		pieceDefaults?: PieceDefaults;
		prefix?: string | string[];
		prefixCaseInsensitive?: boolean;
		preserveSettings?: boolean;
		production?: boolean;
		providers?: ProvidersOptions;
		readyMessage?: (client: KlasaClient) => string;
		regexPrefix?: RegExp;
		schedule?: ScheduleOptions;
		slowmode?: number;
		slowmodeAggressive?: boolean;
		typing?: boolean;
	} & ClientOptions;

	export type ScheduleOptions = {
		interval?: number;
	};

	export type CustomPromptDefaults = {
		limit?: number;
		time?: number;
		quotedStringSupport?: boolean;
	};

	export type PieceDefaults = {
		arguments?: ArgumentOptions;
		commands?: CommandOptions;
		events?: EventOptions;
		extendables?: ExtendableOptions;
		finalizers?: FinalizerOptions;
		inhibitors?: InhibitorOptions;
		languages?: LanguageOptions;
		monitors?: MonitorOptions;
		providers?: ProviderOptions;
		serializers?: SerializerOptions;
	};

	export type ProvidersOptions = {
		default?: string;
	} & ObjectLiteral;

	// Parsers
	export type ArgResolverCustomMethod = (arg: string, possible: Possible, message: KlasaMessage, params: string[]) => any;

	export type Constants = {
		DEFAULTS: {
			CLIENT: Required<KlasaClientOptions>;
			CONSOLE: Required<ConsoleOptions>,
			QUERYBUILDER: {
				datatypes: [string, QueryBuilderDatatype][];
				queryBuilderOptions: Required<QueryBuilderEntryOptions>;
			};
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
		MENTION_REGEX: MentionRegex;
	};

	// Permissions
	export type PermissionLevel = {
		break: boolean;
		check: (message: KlasaMessage) => Promise<boolean> | boolean;
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
	export interface ScheduledTaskOptions {
		catchUp?: boolean;
		data?: any;
		id?: string;
	}

	export interface ScheduledTaskJSON {
		catchUp: boolean;
		data: ObjectLiteral;
		id: string;
		taskName: string;
		time: number;
	}

	export interface ScheduledTaskUpdateOptions {
		catchUp?: boolean;
		data?: any;
		repeat?: string;
		time?: Date;
	}

	// Settings

	export interface SettingsFolderResetOptions {
		throwOnError?: boolean;
		onlyConfigurable?: boolean;
	}

	export interface SettingsFolderUpdateOptions extends SettingsFolderResetOptions {
		guild?: GuildResolvable;
		arrayAction?: 'add' | 'remove' | 'auto' | 'overwrite';
		arrayIndex?: number;
	}

	export interface SettingsFolderUpdateResult {
		errors: Array<Error>;
		updated: Array<SettingsFolderUpdateResultEntry>;
	}

	export interface SettingsFolderUpdateResultEntry {
		key: string;
		value: PrimitiveType;
		entry: SchemaEntry;
	}

	export interface GatewayOptions {
		schema?: Schema;
		provider?: string;
	}

	export interface GatewayJSON {
		name: string;
		provider: string;
		schema: SchemaFolderOptions | SchemaEntryOptions;
	}

	export interface QueryBuilderArray {
		(entry: SchemaEntry): string;
	}

	export interface QueryBuilderArraySerializer {
		(values: Array<any>, resolver: QueryBuilderSerializer): string;
	}

	export interface QueryBuilderSerializer {
		(value: any, entry: SchemaEntry): string;
	}

	export interface QueryBuilderFormatDatatype {
		(name: string, datatype: string, def?: string): string;
	}

	export interface QueryBuilderType {
		(entry: SchemaEntry): string;
	}

	export interface QueryBuilderEntryOptions {
		array?: QueryBuilderArray;
		arraySerializer?: QueryBuilderArraySerializer;
		formatDatatype?: QueryBuilderFormatDatatype;
		serializer?: QueryBuilderSerializer;
	}

	export interface QueryBuilderDatatype extends QueryBuilderEntryOptions {
		type?: QueryBuilderType | string;
		extends?: string;
	}

	export interface SchemaEntryOptions {
		array?: boolean;
		configurable?: boolean;
		default?: any;
		min?: number;
		max?: number;
		filter?: ((client: KlasaClient, value: any, entry: SchemaEntry, language: Language) => boolean) | null;
		resolve?: boolean;
	}

	export interface SchemaEntryEditOptions extends SchemaEntryOptions {
		type?: string;
	}

	export interface SchemaFolderOptions extends Record<string, string | SchemaEntryOptions> {
		type?: 'Folder';
	}

	export interface GatewayDriverJSON extends Record<string, GatewayJSON> {
		clientStorage: GatewayJSON;
		guilds: GatewayJSON;
		users: GatewayJSON;
	}

	// Structures
	export type PieceOptions = {
		enabled?: boolean
		name?: string,
	};

	export type ArgumentOptions = {
		aliases?: string[];
	} & PieceOptions;

	export type CommandOptions = {
		autoAliases?: boolean;
		requiredPermissions?: PermissionResolvable;
		bucket?: number;
		cooldown?: number;
		cooldownLevel?: 'author' | 'channel' | 'guild';
		deletable?: boolean;
		description?: string | string[] | ((language: Language) => string | string[]);
		extendedHelp?: string | string[] | ((language: Language) => string | string[]);
		guarded?: boolean;
		hidden?: boolean;
		nsfw?: boolean;
		permissionLevel?: number;
		promptLimit?: number;
		promptTime?: number;
		quotedStringSupport?: boolean;
		requiredSettings?: string[];
		runIn?: Array<'text' | 'dm' | 'group'>;
		subcommands?: boolean;
		usage?: string;
		usageDelim?: string;
	} & AliasPieceOptions;

	export type ExtendableOptions = {
		appliesTo: Array<Constructor<any>>;
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

	export type SerializerOptions = AliasPieceOptions;
	export type ProviderOptions = PieceOptions;
	export type FinalizerOptions = PieceOptions;
	export type LanguageOptions = PieceOptions;
	export type TaskOptions = PieceOptions;

	export type AliasPieceOptions = {
		aliases?: Array<string>;
	} & PieceOptions;

	export type AliasPieceJSON = {
		aliases: Array<string>;
	} & PieceJSON;

	export type OriginalPropertyDescriptors = {
		staticPropertyDescriptors: PropertyDescriptorMap;
		instancePropertyDescriptors: PropertyDescriptorMap;
	};

	export type PieceJSON = {
		directory: string;
		path: string;
		enabled: boolean;
		file: string[];
		name: string;
		type: string;
	};


	export type PieceCommandJSON = {
		requiredPermissions: string[];
		bucket: number;
		category: string;
		cooldown: number;
		deletable: boolean;
		description: string | ((language: Language) => string);
		extendedHelp: string | ((language: Language) => string);
		fullCategory: string[];
		guarded: boolean;
		hidden: boolean;
		nsfw: boolean;
		permissionLevel: number;
		promptLimit: number;
		promptTime: number;
		quotedStringSupport: boolean;
		requiredSettings: string[];
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
	} & AliasPieceJSON;

	export type PieceExtendableJSON = {
		appliesTo: string[];
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

	export type PieceArgumentJSON = AliasPieceJSON;
	export type PieceSerializerJSON = AliasPieceJSON;
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
		background?: string;
		style?: string | string[];
		text?: string;
	};

	export type ColorsFormatType = string | number | [string, string, string] | [number, number, number];

	export type ColorsFormatData = {
		opening: string[];
		closing: string[];
	};

	export type ConsoleOptions = {
		utc?: boolean;
		colors?: ConsoleColorStyles;
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

	export type ConsoleColorStyles = {
		debug?: ConsoleColorObjects;
		error?: ConsoleColorObjects;
		info?: ConsoleColorObjects;
		log?: ConsoleColorObjects;
		verbose?: ConsoleColorObjects;
		warn?: ConsoleColorObjects;
		wtf?: ConsoleColorObjects;
	};

	export type ConsoleColorObjects = {
		message?: ConsoleMessageObject;
		time?: ConsoleTimeObject;
	};

	export type ConsoleMessageObject = {
		background?: ConsoleColorTypes;
		style?: ConsoleStyleTypes;
		text?: ConsoleColorTypes;
	};

	export type ConsoleTimeObject = {
		background?: ConsoleColorTypes;
		style?: ConsoleStyleTypes;
		text?: ConsoleColorTypes;
	};

	export type ConsoleColorTypes = 'black'
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
		| null;

	export type ConsoleStyleTypes = 'normal'
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

	export type MentionRegex = {
		userOrMember: RegExp;
		channel: RegExp;
		emoji: RegExp;
		role: RegExp;
		snowflake: RegExp;
	};

	export type GuildResolvable = KlasaGuild
		| KlasaMessage
		| GuildChannel
		| Snowflake;

	interface ObjectLiteral<T = any> {
		[k: string]: T;
	}

	interface Constructor<C> {
		new(...args: any[]): C;
	}

	type PrimitiveType = string | number | boolean;

	export interface TitleCaseVariants {
		textchannel: 'TextChannel';
		voicechannel: 'VoiceChannel';
		categorychannel: 'CategoryChannel';
		guildmember: 'GuildMember';
	}

	export interface PartialSendAliases {
		sendLocale(key: string, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendLocale(key: string, localeArgs?: Array<any>, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendMessage(content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendEmbed(embed: MessageEmbed, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendCode(language: string, content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

	export interface SendAliases extends PartialSendAliases {
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
		sendFiles(attachments: MessageAttachment[], content: StringResolvable, options?: MessageOptions): Promise<KlasaMessage | KlasaMessage[]>;
	}

	export interface ChannelExtendables {
		readonly attachable: boolean;
		readonly embedable: boolean;
		readonly postable: boolean;
		readonly readable: boolean;
	}

//#endregion

}
