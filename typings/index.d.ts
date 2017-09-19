declare module 'klasa' {

    import {
        Client,
        ClientOptions,
        Collection,
        Snowflake,
        MessageEmbed,
        MessageCollector,
        WebhookClient,
        User,
        Message,
        GuildMember,
        Guild,
        Role,
        Channel,
        TextChannel,
        VoiceChannel
    } from 'discord.js';

    class KlasaClient extends Client {
        constructor(options?: KlasaClientConfig);
        config: KlasaClientConfig;
        coreBaseDir: string;
        clientBaseDir: string;
        console: Console;
        argResolver: ArgResolver;
        commands: CommandStore;
        inhibitors: InhibitorStore;
        finalizers: FinalizerStore;
        monitors: MonitorStore;
        languages: LanguageStore;
        providers: ProviderStore;
        events: EventStore;
        extendables: ExtendableStore;
        pieceStores: Collection<any, any>;
        commandMessages: Collection<Snowflake, Message>;
        permissionLevels: PermissionLevels;
        commandMessageLifetime: number;
        commandMessageSweep: number;
        ready: false;
        methods: {
            Collection: typeof Collection;
            Embed: typeof MessageEmbed;
            MessageCollector: typeof MessageCollector;
            Webhook: typeof WebhookClient;
            CommandMessage: typeof CommandMessage;
            util: object;
        };
        settings: object;
        application: object;

        static readonly invite: string;
        static readonly owner: User;
        public validatePermissionLevels(): PermissionLevels;
        public registerStore(store: Store): KlasaClient;
        public unregisterStore(store: Store): KlasaClient;

        public registerPiece(pieceName: string, store: Store): KlasaClient;
        public unregisterPiece(pieceName: string): KlasaClient;

        public login(token: string): Promise<string>;
        private _ready(): void;

        public sweepCommandMessages(lifetime: number): number;
        public defaultPermissionLevels: PermissionLevels;
    }

    class Resolver {
        public constructor(client: KlasaClient);
        public client: KlasaClient;

        public msg(message: Message|Snowflake, channel: Channel): Promise<Message>;
        public user(user: User|GuildMember|Message|Snowflake): Promise<User>;
        public member(member: User|GuildMember|Snowflake, guild: Guild): Promise<GuildMember>;
        public channel(channel: Channel|Snowflake): Promise<Channel>;
        public guild(guild: Guild|Snowflake): Promise<Guild>;
        public role(role: Role|Snowflake, guild: Guild): Promise<Role>;
        public boolean(bool: boolean|string): Promise<boolean>;
        public string(string: string): Promise<String>;
        public integer(integer: string|number): Promise<number>;
        public float(number: string|number): Promise<number>;
        public url(hyperlink: string): Promise<number>;

        static readonly regex: {
            userOrMember: RegExp,
            channel: RegExp,
            role: RegExp,
            snowflake: RegExp,
        }
    }

    class ArgResolver extends Resolver {
        public piece(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Piece>;
        public store(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Store>;

        public cmd(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Command>;
        public command(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Command>;
        public event(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Event>;
        public extendable(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Extendable>;
        public finalizer(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Finalizer>;
        public inhibitor(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Inhibitor>;
        public monitor(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Monitor>;
        public language(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Language>;
        public provider(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Provider>;

        public msg(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Message>;
        public message(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Message>;
        public user(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<User>;
        public mention(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<User>;
        public member(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<GuildMember>;
        public channel(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Channel>;
        public guild(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Guild>;
        public role(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<Role>;
        public literal(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;
        public bool(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<boolean>;
        public boolean(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<boolean>;
        public str(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;
        public string(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;
        public int(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<number>;
        public integer(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<number>;
        public num(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<number>;
        public number(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<number>;
        public float(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<number>;
        public reg(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;
        public regex(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;
        public regexp(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;
        public url(arg: string, currentUsage: Object, possible: number, repeat: boolean, msg: Message): Promise<string>;

        static minOrMax(value: number, min: number, max: number, currentUsage: Object, possible: number, repeat: boolean, msg: Message, suffix: string): boolean;
    }

    class SettingResolver extends Resolver {
        public user(data: any, guild: Guild, name: string): Promise<User>;
        public channel(data: any, guild: Guild, name: string): Promise<Channel>;
        public textchannel(data: any, guild: Guild, name: string): Promise<TextChannel>;
        public voicechannel(data: any, guild: Guild, name: string): Promise<VoiceChannel>;
        public guild(data: any, guild: Guild, name: string): Promise<Guild>;
        public role(data: any, guild: Guild, name: string): Promise<Role>;
        public boolean(data: any, guild: Guild, name: string): Promise<boolean>;
        public string(data: any, guild: Guild, name: string, minMax: { min: number, max: number }): Promise<string>;
        public integer(data: any, guild: Guild, name: string, minMax: { min: number, max: number }): Promise<number>;
        public float(data: any, guild: Guild, name: string, minMax: { min: number, max: number }): Promise<number>;
        public url(data: any, guild: Guild, name: string): Promise<string>;
        public command(data: any, guild: Guild, name: string): Promise<Command>;
        public language(data: any, guild: Guild, name: string): Promise<Language>;

        static maxOrMin(guild: Guild, value: number, min: number, max: number, name: string, suffix: string): boolean;
    }

    class PermissionLevels extends Collection<number, PermissionLevel> {
        public constructor(levels: number);
        public requiredLevels: number;

        public addLevel(level: number, brk: boolean, check: Function);
        public set(level: number, obj: PermissionLevel): this;
        public isValid(): boolean;
        public debug(): string;

        public run(msg: Message, min: number): permissionLevelResponse;
    }

    class CommandStore extends Collection<string, Command> {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public aliases: Collection<string, Command>;
        public coreDir: string;
        public userDir: string;
        public holds: Command;
        public name: 'commands';

        public readonly help: Object[];
        public get(name: string): Command;
        public has(name: string): boolean;
        public set(command: Command): Command;
        public delete(name: Command|string): boolean;
        public clear(): void;

        public load(dir: string, file: string[]): Command;
        public loadAll(): Promise<number[]>;

        public init(): any;
        public resolve(): any;

        static walk(store: CommandStore, dir: string, subs: string[]): Promise<void>;
    }

    class Piece {
        public reload(): Promise<Piece>;
        public unload(): void;
        public enable(): Piece;
        public disable(): Piece;

        static applyToClass(structure: Object, skips: string[]): void;
    }

    abstract class Command {
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

        public abstract run(msg: CommandMessage, params: any[]): Promise<Message>;
        public abstract init(): any;

        public abstract reload(): any;
        public abstract unload(): any;
        public abstract enable(): any;
        public abstract disable(): any;
    }

    abstract class Event {
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

        public abstract reload(): any;
        public abstract unload(): any;
        public abstract enable(): any;
        public abstract disable(): any;
    }

    abstract class Extendable {
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
        private init(): any;

        public enable(): Piece;
        public disable(): Piece;
        public abstract reload(): any;
        public abstract unload(): any;
    }

    class Store {
        init(): Promise<any[]>;
        load(dir: string, file: string): Piece;
        loadAll(): Promise<number>;
        resolve(name: Piece|string): Piece;

        static applyToClass(structure: Object, skips: string[]): void;
    }

    type KlasaClientConfig = {
        prefix: string;
        permissionLevels: PermissionLevels;
        clientBaseDir: string;
        commandMessageLifetime: number;
        commandMessageSweep: number;
        provider: object;
        console: KlasaConsoleConfig;
        consoleEvents: KlasaConsoleEvents;
        ignoreBots: boolean;
        ignoreSelf: boolean;
        prefixMention: RegExp;
        cmdPrompt: boolean;
        cmdEditing: boolean;
        cmdLogging: boolean;
        typing: boolean;
        quotedStringSupport: boolean;
        readyMessage: string|Function;
        string: string;
    } & ClientOptions;

    type KlasaConsoleConfig = {
        stdout: NodeJS.WritableStream;
        stderr: NodeJS.WritableStream;
        useColor: boolean;
        colors: Colors;
        timestamps: boolean|string;
    };

    type KlasaConsoleEvents = {
        log: boolean;
        warn: boolean;
        error: boolean;
        debug: boolean;
        verbose: boolean;
        wtf: boolean;
    };

    type PermissionLevel = {
        break: boolean;
        check: Function;
    }

    type permissionLevelResponse = {
        broke: boolean;
        permission: boolean;
    }

    type CommandOptions = {
        enabled: boolean;
        name: string;
        aliases: string[];
        runIn: string[];
        botPerms: string[];
        requiredSettings: string[];
        cooldown: number;
        permLevel: number;
        description: string;
        usage: string;
        usageDelim: string;
        extendedHelp: string;
        quotedStringSupport: boolean;
    }

    type EventOptions = {
        enabled: boolean;
        name: string;
    }

    type ExtendableOptions = {
        enabled: boolean;
        name: string;
        klasa: boolean;
    }
}
