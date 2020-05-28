import type { Cache } from '@klasa/cache';
import type { Application, User, MessageBuilder, SplitOptions, MessageOptions, PieceOptions, AliasPieceOptions } from '@klasa/core';
import type { ArgumentStore } from '../structures/ArgumentStore';
import type { Command, CommandOptions } from '../structures/Command';
import type { CommandStore } from '../structures/CommandStore';
import type { ExtendableStore } from '../structures/ExtendableStore';
import type { FinalizerStore } from '../structures/FinalizerStore';
import type { GatewayDriver } from '../settings/gateway/GatewayDriver';
import type { InhibitorStore } from '../structures/InhibitorStore';
import type { Language } from '../structures/Language';
import type { LanguageStore } from '../structures/LanguageStore';
import type { MonitorStore } from '../structures/MonitorStore';
import type { PermissionLevels } from '../permissions/PermissionLevels';
import type { ProviderStore } from '../structures/ProviderStore';
import type { Schedule } from '../schedule/Schedule';
import type { SerializerStore } from '../structures/SerializerStore';
import type { Settings } from '../settings/Settings';
import type { TaskStore } from '../structures/TaskStore';
import type { KlasaConsole, ConsoleOptions } from '@klasa/console';
import type { CommandHandlingOptions, ConsoleEvents, ProviderClientOptions, ScheduleOptions, SettingsOptions } from '../Client';
import type { ExtendableOptions } from '../structures/Extendable';
import type { InhibitorOptions } from '../structures/Inhibitor';
import type { MonitorOptions } from '../structures/Monitor';
import { CommandPrompt } from '../usage/CommandPrompt';
declare module '@klasa/core/dist/src/lib/client/Client' {
    interface Client {
        console: KlasaConsole;
        arguments: ArgumentStore;
        commands: CommandStore;
        inhibitors: InhibitorStore;
        finalizers: FinalizerStore;
        monitors: MonitorStore;
        languages: LanguageStore;
        providers: ProviderStore;
        extendables: ExtendableStore;
        tasks: TaskStore;
        serializers: SerializerStore;
        permissionLevels: PermissionLevels;
        gateways: GatewayDriver;
        schedule: Schedule;
        ready: boolean;
        mentionPrefix: RegExp | null;
        settings: Settings | null;
        application: Application | null;
        readonly invite: string;
        readonly owners: Set<User>;
        fetchApplication(): Promise<Application>;
    }
    interface ClientOptions {
        commands: CommandHandlingOptions;
        console: Partial<ConsoleOptions>;
        consoleEvents: ConsoleEvents;
        language: string;
        owners: string[];
        permissionLevels: (permissionLevels: PermissionLevels) => PermissionLevels;
        production: boolean;
        readyMessage: string | ((client: Client) => string);
        providers: ProviderClientOptions;
        settings: SettingsOptions;
        schedule: ScheduleOptions;
    }
    interface PieceDefaults {
        commands: CommandOptions;
        extendables?: Partial<ExtendableOptions>;
        finalizers?: Partial<PieceOptions>;
        inhibitors?: Partial<InhibitorOptions>;
        languages?: Partial<PieceOptions>;
        monitors?: Partial<MonitorOptions>;
        providers?: Partial<PieceOptions>;
        arguments?: Partial<AliasPieceOptions>;
        serializers: Partial<AliasPieceOptions>;
        tasks: Partial<PieceOptions>;
    }
}
declare module '@klasa/core/dist/src/lib/caching/structures/guilds/Guild' {
    interface Guild {
        settings: Settings;
        language: Language;
    }
}
declare module '@klasa/core/dist/src/lib/caching/structures/User' {
    interface User {
        settings: Settings;
    }
}
declare module '@klasa/core/dist/src/lib/caching/structures/Message' {
    interface Message {
        command: Command | null;
        commandText: string | null;
        prefix: RegExp | null;
        prefixLength: number | null;
        prompter: CommandPrompt | null;
        language: Language;
        guildSettings: Settings;
        readonly responses: Message[];
        readonly args: (string | undefined | null)[];
        readonly params: unknown[];
        readonly flagArgs: Record<string, string>;
        readonly reprompted: boolean;
        usableCommands(): Promise<Cache<string, Command>>;
        hasAtLeastPermissionLevel(min: number): Promise<boolean>;
        send(data: MessageOptions, options?: SplitOptions): Promise<Message[]>;
        send(data: (message: MessageBuilder) => MessageBuilder | Promise<MessageBuilder>, options?: SplitOptions): Promise<Message[]>;
        sendLocale(key: string, options?: SplitOptions): Promise<Message[]>;
        sendLocale(key: string, localeArgs?: unknown[], options?: SplitOptions): Promise<Message[]>;
    }
}
