import { AliasPiece, AliasPieceOptions, Permissions, PermissionsResolvable, Message } from '@klasa/core';
import { isFunction } from '@klasa/utils';
import { RateLimitManager } from '@klasa/ratelimits';
import { Usage } from '../usage/Usage';
import { CommandUsage } from '../usage/CommandUsage';

import type { CommandStore } from './CommandStore';
import type { Language, LanguageValue } from './Language';
import type { Possible } from '../usage/Possible';
import type { ChannelType } from '@klasa/dapi-types';

export type CooldownLevel = 'author' | 'channel' | 'guild';

/**
 * Base class for all Klasa Commands. See {@tutorial CreatingCommands} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingCommands
 */
export abstract class Command extends AliasPiece {

	/**
	 * The required bot permissions to run this command
	 * @since 0.0.1
	 */
	public requiredPermissions: Permissions;

	/**
	 * Whether this command should have it's responses deleted if the triggering message is deleted
	 * @since 0.5.0
	 */
	public deletable: boolean;

	/**
	 * The description of the command
	 * @since 0.0.1
	 */
	public description: string | ((language: Language) => string)

	/**
	 * The extended help for the command
	 * @since 0.0.1
	 */
	public extendedHelp: string | ((language: Language) => string)

	/**
	 * The full category for the command
	 * @since 0.0.1
	 * @type {string[]}
	 */
	public fullCategory: string[];

	/**
	 * Whether this command should not be able to be disabled in a guild or not
	 * @since 0.5.0
	 */
	public guarded: boolean;

	/**
	 * Whether this command is hidden or not
	 * @since 0.5.0
	 */
	public hidden: boolean;

	/**
	 * Whether this command should only run in NSFW channels or not
	 * @since 0.5.0
	 */
	public nsfw: boolean;

	/**
	 * The required permissionLevel to run this command
	 * @since 0.0.1
	 */
	public permissionLevel: number;

	/**
	 * The number or attempts allowed for re-prompting an argument
	 * @since 0.5.0
	 */
	public promptLimit: number;

	/**
	 * The time allowed for re-prompting of this command
	 * @since 0.5.0
	 */
	public promptTime: number;

	/**
	 * Whether to use flag support for this command or not
	 * @since 0.2.1
	 */
	public flagSupport: boolean;

	/**
	 * Whether to use quoted string support for this command or not
	 * @since 0.2.1
	 */
	public quotedStringSupport: boolean;

	/**
	 * The required per guild settings to run this command
	 * @since 0.0.1
	 */
	public requiredSettings: string[];

	/**
	 * What channels the command should run in
	 * @since 0.0.1
	 */
	public runIn: ChannelType[];

	/**
	 * Whether to enable subcommands or not
	 * @since 0.5.0
	 */
	public subcommands: boolean;

	/**
	 * The parsed usage for the command
	 * @since 0.0.1
	 */
	public usage: CommandUsage;

	/**
	 * The level at which cooldowns should apply
	 * @since 0.5.0
	 */
	public cooldownLevel: CooldownLevel;

	/**
	 * The cooldowns for this command
	 * @since 0.6.0
	 */
	public cooldowns: RateLimitManager;

	/**
	 * @since 0.0.1
	 * @param store The Command store
	 * @param directory The base directory to the pieces folder
	 * @param file The path from the pieces folder to the command file
	 * @param options Optional Command settings
	 */
	public constructor(store: CommandStore, directory: string, files: readonly string[], options: CommandOptions = {}) {
		super(store, directory, files, options);

		options = options as Required<CommandOptions>;

		this.name = this.name.toLowerCase();

		if (options.autoAliases) {
			if (this.name.includes('-')) this.aliases.push(this.name.replace(/-/g, ''));
			for (const alias of this.aliases) if (alias.includes('-')) this.aliases.push(alias.replace(/-/g, ''));
		}

		this.requiredPermissions = new Permissions(options.requiredPermissions).freeze();
		this.deletable = options.deletable as boolean;

		this.description = (isFunction(options.description) ?
			(language = this.client.languages.default): string => (options.description as (language: Language) => string)(language) :
			options.description) as string | ((language: Language) => string);

		this.extendedHelp = (isFunction(options.extendedHelp) ?
			(language = this.client.languages.default): string => (options.extendedHelp as (language: Language) => string)(language) :
			options.extendedHelp) as string | ((language: Language) => string);

		this.fullCategory = files.slice(0, -1);
		this.guarded = options.guarded as boolean;
		this.hidden = options.hidden as boolean;
		this.nsfw = options.nsfw as boolean;
		this.permissionLevel = options.permissionLevel as number;
		this.promptLimit = options.promptLimit as number;
		this.promptTime = options.promptTime as number;
		this.flagSupport = options.flagSupport as boolean;
		this.quotedStringSupport = options.quotedStringSupport as boolean;
		this.requiredSettings = options.requiredSettings as string[];
		this.runIn = options.runIn as ChannelType[];
		this.subcommands = options.subcommands as boolean;
		this.usage = new CommandUsage(this.client, options.usage as string, options.usageDelim as string, this);
		this.cooldownLevel = options.cooldownLevel as CooldownLevel;
		if (!['author', 'channel', 'guild'].includes(this.cooldownLevel)) throw new Error('Invalid cooldownLevel');
		this.cooldowns = new RateLimitManager(options.cooldown as number, options.bucket as number);
	}

	/**
	 * The main category for the command
	 * @since 0.0.1
	 * @readonly
	 */
	get category(): string {
		return this.fullCategory[0] || 'General';
	}

	/**
	 * The sub category for the command
	 * @since 0.0.1
	 * @readonly
	 */
	get subCategory(): string {
		return this.fullCategory[1] || 'General';
	}

	/**
	 * Creates a Usage to run custom prompts off of
	 * @param {string} usageString The string designating all parameters expected
	 * @param {string} usageDelim The string to delimit the input
	 * @returns {Usage}
	 */
	public definePrompt(usageString: string, usageDelim: string): Usage {
		return new Usage(this.client, usageString, usageDelim);
	}

	/**
	 * Registers a one-off custom resolver. See tutorial {@link CommandsCustomResolvers}
	 * @since 0.5.0
	 * @param {string} type The type of the usage argument
	 * @param {Function} resolver The one-off custom resolver
	 * @chainable
	 */
	public createCustomResolver(type: string, resolver: ((arg: any, possible: Possible, message: Message, args: any[]) => any)): this {
		this.usage.createCustomResolver(type, resolver);
		return this;
	}

	/**
	 * Customizes the response of an argument if it fails resolution. See tutorial {@link CommandsCustomResponses}
	 * @since 0.5.0
	 * @param {string} name The name of the usage argument
	 * @param {(string|Function)} response The custom response or i18n function
	 * @chainable
	 * @example
	 * // Changing the message for a parameter called 'targetUser'
	 * this.customizeResponse('targetUser', 'You did not give me a user...');
	 *
	 * // Or also using functions to have multilingual support:
	 * this.customizeResponse('targetUser', (message) =>
	 *     message.language.get('COMMAND_REQUIRED_USER_FRIENDLY'));
	 */
	public customizeResponse(name: string, response: string | ((message: Message) => string)): this {
		this.usage.customizeResponse(name, response);
		return this;
	}

	/**
	 * Defines the JSON.stringify behavior of this command.
	 * @returns {Object}
	 */
	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			requiredPermissions: this.requiredPermissions.toArray(),
			category: this.category,
			deletable: this.deletable,
			description: isFunction(this.description) ? this.description(this.client.languages.default) : this.description,
			extendedHelp: isFunction(this.extendedHelp) ? this.extendedHelp(this.client.languages.default) : this.extendedHelp,
			fullCategory: this.fullCategory,
			guarded: this.guarded,
			hidden: this.hidden,
			nsfw: this.nsfw,
			permissionLevel: this.permissionLevel,
			promptLimit: this.promptLimit,
			promptTime: this.promptTime,
			quotedStringSupport: this.quotedStringSupport,
			requiredSettings: this.requiredSettings.slice(0),
			runIn: this.runIn.slice(0),
			subCategory: this.subCategory,
			subcommands: this.subcommands,
			usage: {
				usageString: this.usage.usageString,
				usageDelim: this.usage.usageDelim,
				nearlyFullUsage: this.usage.nearlyFullUsage
			}
		};
	}

}

export interface Command {
	/**
	 * The run method to be overwritten in actual commands
	 * @since 0.0.1
	 * @param message The command message mapped on top of the message used to trigger this command
	 * @param params The fully resolved parameters based on your usage / usageDelim
	 * @returns You should return the response message whenever possible
	 */
	run?(message: Message, params: any[]): Promise<Message[]>;
}

export interface CommandOptions extends AliasPieceOptions {
	autoAliases?: boolean;
	bucket?: number;
	cooldown?: number;
	cooldownLevel?: CooldownLevel;
	deletable?: boolean;
	description?: ((language: Language) => LanguageValue) | string;
	extendedHelp?: ((language: Language) => LanguageValue) | string;
	flagSupport?: boolean;
	guarded?: boolean;
	hidden?: boolean;
	nsfw?: boolean;
	permissionLevel?: number;
	promptLimit?: number;
	promptTime?: number;
	quotedStringSupport?: boolean;
	requiredPermissions?: PermissionsResolvable;
	requiredSettings?: string[];
	runIn?: ChannelType[];
	subcommands?: boolean;
	usage?: string;
	usageDelim?: string | undefined;
}
