import type { Cache } from '@klasa/cache';
import type { Application, User, MessageBuilder, SplitOptions, MessageOptions } from '@klasa/core';
import type { ArgumentStore } from '../structures/ArgumentStore';
import type { Command } from '../structures/Command';
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
import type {
	CommandHandlingOptions,
	ConsoleEvents,
	PieceDefaults,
	ProviderClientOptions,
	ScheduleOptions,
	SettingsOptions
} from '../Client';

declare module '@klasa/core/dist/src/lib/client/Client' {

	export interface Client {
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

	export interface ClientOptions {
		commands: CommandHandlingOptions;
		console: ConsoleOptions;
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

	export interface ClientPieceOptions {
		defaults: PieceDefaults;
	}

}

declare module '@klasa/core/dist/src/lib/caching/structures/guilds/Guild' {

	export interface Guild {
		settings: Settings;
		language: Language | null;
	}

}

declare module '@klasa/core/dist/src/lib/caching/structures/User' {

	export interface User {
		settings: Settings;
	}

}

declare module '@klasa/core/dist/src/lib/caching/structures/Message' {

	export interface Message {
		command: Command | null;
		commandText: string | null;
		prefix: RegExp | null;
		prefixLength: number | null;
		language: Language;
		guildSettings: Settings;
		readonly responses: Message[];
		readonly args: (string | undefined | null)[];
		readonly params: unknown[];
		readonly flagArgs: Record < string, string >;
		readonly reprompted: boolean;
		usableCommands(): Promise < Cache < string, Command >>;
		hasAtLeastPermissionLevel(min: number): Promise<boolean>;
		send(data: MessageOptions, options?: SplitOptions): Promise<Message[]>;
		send(data: (message: MessageBuilder) => MessageBuilder | Promise <MessageBuilder>, options?: SplitOptions): Promise<Message[]>;
		sendLocale(key: string, options?: SplitOptions): Promise<Message[]>;
		sendLocale(key: string, localeArgs?: unknown[], options?: SplitOptions): Promise<Message[]>;
	}

}
