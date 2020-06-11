import { AliasPiece, AliasPieceOptions, Permissions, PermissionsResolvable, Message } from '@klasa/core';
import { Usage } from '../usage/Usage';
import { CommandUsage } from '../usage/CommandUsage';
import type { CommandStore } from './CommandStore';
import type { Language, LanguageValue } from './Language';
import type { Possible } from '../usage/Possible';
import type { ChannelType } from '@klasa/dapi-types';
/**
 * Base class for all Klasa Commands. See {@tutorial CreatingCommands} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingCommands
 */
export declare abstract class Command extends AliasPiece {
    /**
     * The required bot permissions to run this command
     * @since 0.0.1
     */
    requiredPermissions: Permissions;
    /**
     * Whether this command should have it's responses deleted if the triggering message is deleted
     * @since 0.5.0
     */
    deletable: boolean;
    /**
     * The description of the command
     * @since 0.0.1
     */
    description: string | ((language: Language) => string);
    /**
     * The extended help for the command
     * @since 0.0.1
     */
    extendedHelp: string | ((language: Language) => string);
    /**
     * The full category for the command
     * @since 0.0.1
     * @type {string[]}
     */
    fullCategory: string[];
    /**
     * Whether this command should not be able to be disabled in a guild or not
     * @since 0.5.0
     */
    guarded: boolean;
    /**
     * Whether this command is hidden or not
     * @since 0.5.0
     */
    hidden: boolean;
    /**
     * Whether this command should only run in NSFW channels or not
     * @since 0.5.0
     */
    nsfw: boolean;
    /**
     * The required permissionLevel to run this command
     * @since 0.0.1
     */
    permissionLevel: number;
    /**
     * The number or attempts allowed for re-prompting an argument
     * @since 0.5.0
     */
    promptLimit: number;
    /**
     * The time allowed for re-prompting of this command
     * @since 0.5.0
     */
    promptTime: number;
    /**
     * Whether to use flag support for this command or not
     * @since 0.2.1
     */
    flagSupport: boolean;
    /**
     * Whether to use quoted string support for this command or not
     * @since 0.2.1
     */
    quotedStringSupport: boolean;
    /**
     * The required per guild settings to run this command
     * @since 0.0.1
     */
    requiredSettings: string[];
    /**
     * What channels the command should run in
     * @since 0.0.1
     */
    runIn: ChannelType[];
    /**
     * Whether to enable subcommands or not
     * @since 0.5.0
     */
    subcommands: boolean;
    /**
     * The parsed usage for the command
     * @since 0.0.1
     */
    usage: CommandUsage;
    /**
     * The level at which cooldowns should apply
     * @since 0.5.0
     */
    cooldownLevel: string;
    /**
     * The number of times this command can be run before ratelimited by the cooldown
     * @since 0.5.0
     */
    bucket: number;
    /**
     * The amount of time before the users can run the command again in seconds based on cooldownLevel
     * @since 0.5.0
     */
    cooldown: number;
    /**
     * @since 0.0.1
     * @param store The Command store
     * @param directory The base directory to the pieces folder
     * @param file The path from the pieces folder to the command file
     * @param options Optional Command settings
     */
    constructor(store: CommandStore, directory: string, files: readonly string[], options?: CommandOptions);
    /**
     * The main category for the command
     * @since 0.0.1
     * @readonly
     */
    get category(): string;
    /**
     * The sub category for the command
     * @since 0.0.1
     * @readonly
     */
    get subCategory(): string;
    /**
     * The usage deliminator for the command input
     * @since 0.0.1
     * @readonly
     */
    get usageDelim(): string;
    /**
     * The usage string for the command
     * @since 0.0.1
     * @readonly
     */
    get usageString(): string;
    /**
     * Creates a Usage to run custom prompts off of
     * @param {string} usageString The string designating all parameters expected
     * @param {string} usageDelim The string to delimit the input
     * @returns {Usage}
     */
    definePrompt(usageString: string, usageDelim: string): Usage;
    /**
     * Registers a one-off custom resolver. See tutorial {@link CommandsCustomResolvers}
     * @since 0.5.0
     * @param {string} type The type of the usage argument
     * @param {Function} resolver The one-off custom resolver
     * @chainable
     */
    createCustomResolver(type: string, resolver: ((arg: any, possible: Possible, message: Message, args: any[]) => any)): this;
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
    customizeResponse(name: string, response: string | ((message: Message) => string)): this;
    /**
     * Defines the JSON.stringify behavior of this command.
     * @returns {Object}
     */
    toJSON(): Record<string, any>;
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
    cooldownLevel?: string;
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
