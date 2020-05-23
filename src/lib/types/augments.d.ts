import type { Cache } from '@klasa/cache';
import type { Application } from '@klasa/core';
import type { ArgumentStore } from '../structures/ArgumentStore';
import type { Command } from '../structures/Command';
import type { CommandStore } from '../structures/CommandStore';
import type { ExtendableStore } from '../structures/ExtendableStore';
import type { FinalizerStore } from '../structures/FinalizerStore';
import type { GatewayDriver } from '../settings/GatewayDriver';
import type { InhibitorStore } from '../structures/InhibitorStore';
import type { KlasaConsole, ConsoleOptions } from '../util/KlasaConsole';
import type { KlasaMessage } from '../extensions/KlasaMessage';
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
	ProvidersOptions,
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
	}

	export interface ClientOptions {
		commands?: CommandHandlingOptions;
		console?: ConsoleOptions;
		consoleEvents?: ConsoleEvents;
		language?: string;
		owners?: string[];
		permissionLevels?: PermissionLevels;
		pieceDefaults?: PieceDefaults;
		production?: boolean;
		readyMessage?: string | ((client: Client) => string);
		providers?: ProvidersOptions;
		settings?: SettingsOptions;
		schedule?: ScheduleOptions;
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
		readonly responses: KlasaMessage[];
		readonly args: string[];
		readonly params: unknown[];
		readonly flagArgs: Record<string, string>;
		readonly reprompted: boolean;
		usableCommands(): Promise<Cache<string, Command>>;
		hasAtLeastPermissionLevel(minimum: number): Promise<boolean>;
	}

}
