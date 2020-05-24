import type { Cache } from '@klasa/cache';
import type { Application, User } from '@klasa/core';
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
import type { Settings } from '../settings/settings/Settings';
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
		readonly owners: Set<User>;
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
		language: Language | null;
		guildSettings: Settings;
		responses: Message[];
		readonly args: (string | null)[];
		readonly params: unknown[];
		readonly flagArgs: Record<string, string>;
		readonly reprompted: boolean;
		usableCommands(): Promise<Cache<string, Command>>;
		hasAtLeastPermissionLevel(minimum: number): Promise<boolean>;
	}

}
