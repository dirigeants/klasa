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
        public string(string: string): Promise<string>;
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

    // Usage
    class ParsedUsage {
        public constructor(client: KlasaClient, command: Command);
        public readonly client: KlasaClient;
        public names: string[];
        public commands: string;
        public deliminatedUsage: string;
        public usageString: string;
        public parsedUsage: Tag[];
        public nearlyFullUsage: string;

        public fullUsage(msg: Message): string;
        static parseUsage(usageString: string): Tag[];
        static tagOpen(usage: Object, char: string): Object;
        static tagClose(usage: Object, char: string): Object;
        static tagSpace(usage: Object, char: string): Object;
    }

    class Possible {
        public constructor(regexResults: string[]);
        public name: string;
        public type: string;
        public min: number;
        public max: number;
        public regex: RegExp;

        static resolveLimit(limit: string, type: string): number;
    }

    class Tag {
        public constructor(members: string, count: number, required: boolean);
        public type: string;
        public possibles: Possible[];

        static parseMembers(members: string, count: number): Possible[];
        static parseTrueMembers(members: string): string[];
    }

    // Util
    class Colors {
        public constructor();
        public CLOSE: ColorsClose;
        public STYLES: ColorsStyles;
        public TEXTS: ColorsTexts;
        public BACKGROUNDS: ColorsBackgrounds;

        static hexToRGB(hex: string): number[];
        static hslToRGB(hsl: number[]): number[];
        static hueToRGB(p: number, q: number, t: number): number;
        static formatArray(array: string[]): string|number[];

        public format(string: string, type: { style: string|string[], background: string|number|string[], text: string|number|string[] }): string;
    }

    class KlasaConsole extends Console {
        public constructor(options: KlasaConsoleConfig);
        public readonly stdout: NodeJS.WritableStream;
        public readonly stderr: NodeJS.WritableStream;
        public timestaamps: boolean|string;
        public useColors: boolean;
        public colors: boolean|KlasaConsoleColors;

        public write(data: any, type: string): void;
        public log(...data: any[]): void;
        public warn(...data: any[]): void;
        public error(...data: any[]): void;
        public debug(...data: any[]): void;
        public verbose(...data: any[]): void;
        public wtf(...data: any[]): void;

        public timestamp(timestamp: Date, time: string): string;
        public messages(string: string, message: string): string;

        static flatten(data: any, useColors: boolean): string;
    }

    // Structures
    class CommandMessage {
        public constructor(msg: Message, cmd: Command, prefix: string, prefixLength: number);
        public readonly client: KlasaClient;
        public msg: Message;
        public cmd: Command;
        public prefix: string;
        public prefixLength: number;
        public args: string[];
        public params: any[];
        public reprompted: false;
        private _currentUsage: Object;
        private _repeat: boolean;

        private validateArgs(): Promise<any[]>;
        private multiPossibles(possible: number, validated: boolean): Promise<any[]>;

        static getArgs(cmdMsg: CommandMessage): string[];
        static getQuotedStringArgs(cmdMsg: CommandMessage): string[];
    }

    class Piece {
        public reload(): Promise<Piece>;
        public unload(): void;
        public enable(): Piece;
        public disable(): Piece;

        static applyToClass(structure: Object, skips: string[]): void;
    }

    abstract class Command implements Piece {
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

        public abstract enable(): Piece;
        public abstract disable(): Piece;
        public abstract reload(): Promise<any>;
        public abstract unload(): any;
    }

    abstract class Event implements Piece  {
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

    abstract class Extendable implements Piece {
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

    abstract class Finalizer implements Piece {
        public constructor(client: KlasaClient, dir: string, file: string[], options: FinalizerOptions);
        public client: KlasaClient;
        public type: 'finalizer';

        public enabled: boolean;
        public name: string;
        public dir: string;
        public file: string;

        public abstract run(msg: CommandMessage, mes: Message, start: Now): void;
        public abstract init(): any;

        public abstract enable(): Piece;
        public abstract disable(): Piece;
        public abstract reload(): Promise<any>;
        public abstract unload(): any;
    }

    abstract class Inhibitor implements Piece {
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

    abstract class Language implements Piece {
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

    abstract class Monitor implements Piece {
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

    abstract class Provider implements Piece {
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

    class Store {
        init(): Promise<any[]>;
        load(dir: string, file: string): Piece;
        loadAll(): Promise<number>;
        resolve(name: Piece|string): Piece;

        static applyToClass(structure: Object, skips: string[]): void;
    }

    class CommandStore extends Collection<string, Command> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public aliases: Collection<string, Command>;
        public coreDir: string;
        public userDir: string;
        public holds: Command;
        public name: 'commands';

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

    class EventStore extends Collection<string, Command> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Event;
        public name: 'events';

        public clear(): void;
        public delete(name: Event|string): boolean;
        public set(event: Event): Event;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
    }

    class ExtendableStore extends Collection<string, Extendable> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Extendable;
        public name: 'extendables';

        public delete(name: Extendable|string): boolean;
        public clear(): void;
        public set(extendable: Extendable): Extendable;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
    }

    class FinalizerStore extends Collection<string, Finalizer> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Finalizer;
        public name: 'finalizers';

        public delete(name: Finalizer|string): boolean;
        public run(msg: CommandMessage, mes: Message, start: Now): void;
        public set(finalizer: Finalizer): Finalizer;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
    }

    class InhibitorStore extends Collection<string, Inhibitor> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Inhibitor;
        public name: 'inhibitors';

        public delete(name: Inhibitor|string): boolean;
        public run(msg: Message, cmd: Command, selective: boolean): void;
        public set(inhibitor: Inhibitor): Inhibitor;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
    }

    class LanguageStore extends Collection<string, Language> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Language;
        public name: 'languages';

        public readonly default: Language;
        public delete(name: Language|string): boolean;
        public set(language: Language): Language;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
    }

    class MonitorStore extends Collection<string, Monitor> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Monitor;
        public name: 'monitors';

        public delete(name: Monitor|string): boolean;
        public run(msg: Message): void;
        public set(monitor: Monitor): Monitor;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
    }

    class ProviderStore extends Collection<string, Provider> implements Store {
        public constructor(client: KlasaClient);
        public client: KlasaClient;
        public coreDir: string;
        public userDir: string;
        public holds: Provider;
        public name: 'providers';

        public delete(name: Provider|string): boolean;
        public set(provider: Provider): Provider;

        public init(): any;
        public load(): any;
        public loadAll(): Promise<any>;
        public resolve(): any;
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
    };

    type permissionLevelResponse = {
        broke: boolean;
        permission: boolean;
    };

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
    };

    type EventOptions = {
        enabled: boolean;
        name: string;
    };

    type ExtendableOptions = {
        enabled: boolean;
        name: string;
        klasa: boolean;
    };

    type FinalizerOptions = {
        enabled: boolean;
        name: string;
    };

    type InhibitorOptions = {
        enabled: boolean;
        name: string;
        spamProtection: boolean;
    };

    type LanguageOptions = {
        enabled: boolean;
        name: string;
    };

    type MonitorOptions = {
        enabled: boolean;
        name: string;
        ignoreBots: boolean;
        ignoreSelf: boolean;
    };

    type ProviderOptions = {
        enabled: boolean;
        name: string;
        description: string;
        sql: boolean;
    };

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
    }

    type KlasaConsoleMessageObject = {
        background: BackgroundColorTypes;
        text: TextColorTypes;
        style: StyleTypes;
    }

    type KlasaConsoleTimeObject = {
        background: BackgroundColorTypes;
        text: TextColorTypes;
        style: StyleTypes;
    }

    type TextColorTypes = {
        black: string;
        red: string;
        green: string;
        yellow: string;
        blue: string;
        magenta: string;
        cyan: string;
        gray: string;
        grey: string;
        lightgray: string;
        lightgrey: string;
        lightred: string;
        lightgreen: string;
        lightyellow: string;
        lightblue: string;
        lightmagenta: string;
        lightcyan: string;
        white: string;
    } | number[] | string[];

    type BackgroundColorTypes = {
        black: string;
        red: string;
        green: string;
        blue: string;
        magenta: string;
        cyan: string;
        gray: string;
        grey: string;
        lightgray: string;
        lightgrey: string;
        lightred: string;
        lightgreen: string;
        lightyellow: string;
        lightblue: string;
        lightmagenta: string;
        lightcyan: string;
        white: string;
    } | number[] | string[];

    type StyleTypes = {
        normal: string;
        bold: string;
        dim: string;
        italic: string;
        underline: string;
        inverse: string;
        hidden: string;
        strikethrough: string;
    }

    // Simulates what performance-now's now() does.
    type Now = () => number;
}
