const { Permissions } = require('discord.js');
const Piece = require('./base/Piece');
const Usage = require('../usage/Usage');
const CommandUsage = require('../usage/CommandUsage');

/**
 * Base class for all Klasa Commands. See {@tutorial CreatingCommands} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingCommands
 * @extends Piece
 */
class Command extends Piece {

	/**
	 * @typedef {PieceOptions} CommandOptions
	 * @property {string[]} [aliases=[]] Any command aliases
	 * @property {boolean} [autoAliases=true] If automatic aliases should be added (adds aliases of name and aliases without dashes)
	 * @property {external:PermissionResolvable} [botPerms=0] The required Discord permissions for the bot to use this command
	 * @property {number} [bucket=1] The number of times this command can be run before ratelimited by the cooldown
	 * @property {number} [cooldown=0] The amount of time before the user can run the command again in seconds
	 * @property {boolean} [deletable=false] If the responses should be deleted if the triggering message is deleted
	 * @property {(string|Function)} [description=''] The help description for the command
	 * @property {(string|Function)} [extendedHelp=msg.language.get('COMMAND_HELP_NO_EXTENDED')] Extended help strings
	 * @property {boolean} [guarded=false] If the command can be disabled on a guild level (does not effect global disable)
	 * @property {boolean} [nsfw=false] If the command should only run in nsfw channels
	 * @property {number} [permLevel=0] The required permission level to use the command
	 * @property {number} [promptLimit=0] The number or attempts allowed for re-prompting an argument
	 * @property {number} [promptTime=30000] The time allowed for re-prompting of this command
	 * @property {boolean} [quotedStringSupport=false] Whether args for this command should not deliminated inside quotes
	 * @property {string[]} [requiredConfigs=[]] The required guild configs to use this command
	 * @property {string[]} [runIn=['text','dm','group']] What channel types the command should run in
	 * @property {boolean} [subcommands=false] Whether to enable sub commands or not
	 * @property {string} [usage=''] The usage string for the command
	 * @property {?string} [usageDelim=undefined] The string to delimit the command input for usage
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {CommandStore} store The Command store
	 * @param {Array} file The path from the pieces folder to the command file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {CommandOptions} [options={}] Optional Command settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		this.name = this.name.toLowerCase();

		/**
		 * The aliases for this command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.aliases = options.aliases;
		if (options.autoAliases) {
			if (this.name.includes('-')) this.aliases.push(this.name.replace(/-/g, ''));
			for (const alias of this.aliases) if (alias.includes('-')) this.aliases.push(alias.replace(/-/g, ''));
		}

		/**
		 * The required bot permissions to run this command
		 * @since 0.0.1
		 * @type {external:Permissions}
		 */
		this.botPerms = new Permissions(options.botPerms).freeze();

		/**
		 * The number of times this command can be run before ratelimited by the cooldown
		 * @since 0.5.0
		 * @type {number}
		 */
		this.bucket = options.bucket;

		/**
		 * The cooldown in seconds this command has
		 * @since 0.0.1
		 * @type {number}
		 */
		this.cooldown = options.cooldown;

		/**
		 * Whether this command should have it's responses deleted if the triggering message is deleted
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.deletable = options.deletable;

		/**
		 * The description of the command
		 * @since 0.0.1
		 * @type {(string|Function)}
		 * @param {KlasaMessage} msg The message used to trigger this command
		 * @returns {string}
		 */
		this.description = options.description;

		/**
		 * The extended help for the command
		 * @since 0.0.1
		 * @type {(string|Function)}
		 * @param {KlasaMessage} msg The message used to trigger this command
		 * @returns {string}
		 */
		this.extendedHelp = options.extendedHelp || (msg => msg.language.get('COMMAND_HELP_NO_EXTENDED'));

		/**
		 * The full category for the command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.fullCategory = file.slice(0, -1);

		/**
		 * Whether this command should not be able to be disabled in a guild or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.guarded = options.guarded;

		/**
		 * Whether this command should only run in NSFW channels or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.nsfw = options.nsfw;

		/**
		 * The required permLevel to run this command
		 * @since 0.0.1
		 * @type {number}
		 */
		this.permLevel = options.permLevel;

		/**
		 * The number or attempts allowed for re-prompting an argument
		 * @since 0.5.0
		 * @type {number}
		 */
		this.promptLimit = options.promptLimit;

		/**
		 * The time allowed for re-prompting of this command
		 * @since 0.5.0
		 * @type {number}
		 */
		this.promptTime = options.promptTime;

		/**
		 * Whether to use quoted string support for this command or not
		 * @since 0.2.1
		 * @type {boolean}
		 */
		this.quotedStringSupport = options.quotedStringSupport;

		/**
		 * The required per guild configs to run this command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.requiredConfigs = options.requiredConfigs;


		/**
		 * What channels the command should run in
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.runIn = options.runIn;

		/**
		 * Whether to enable sub commands or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.subcommands = options.subcommands;

		/**
		 * The parsed usage for the command
		 * @since 0.0.1
		 * @type {CommandUsage}
		 */
		this.usage = new CommandUsage(client, options.usage, options.usageDelim, this);

		/**
		 * Any active cooldowns for the command
		 * @since 0.0.1
		 * @type {Map<string, number>}
		 * @private
		 */
		this.cooldowns = new Map();
	}

	/**
	 * The main category for the command
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get category() {
		return this.fullCategory[0] || 'General';
	}

	/**
	 * The sub category for the command
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get subCategory() {
		return this.fullCategory[1] || 'General';
	}

	/**
	 * The usage deliminator for the command input
	 * @since 0.0.1
	 * @type {?string}
	 * @readonly
	 */
	get usageDelim() {
		return this.usage.usageDelim;
	}

	/**
	 * The usage string for the command
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get usageString() {
		return this.usage.usageString;
	}

	/**
	 * Creates a Usage to run custom prompts off of
	 * @param {string} usageString The string designating all parameters expected
	 * @param {string} usageDelim The string to delimit the input
	 * @returns {Usage}
	 */
	definePrompt(usageString, usageDelim) {
		return new Usage(this.client, usageString, usageDelim);
	}

	/**
	 * Registers a one-off custom resolver. See tutorial {@link CommandsCustomResolvers}
	 * @since 0.5.0
	 * @param {string} type The type of the usage argument
	 * @param {Function} resolver The one-off custom resolver
	 * @returns {this}
	 * @chainable
	 */
	createCustomResolver(type, resolver) {
		this.usage.createCustomResolver(type, resolver);
		return this;
	}

	/**
	 * Customizes the response of an argument if it fails resolution. See tutorial {@link CommandsCustomResponses}
	 * @since 0.5.0
	 * @param {string} name The name of the usage argument
	 * @param {(string|Function)} response The custom response or i18n function
	 * @returns {this}
	 * @chainable
	 * @example
	 * // Changing the message for a parameter called 'targetUser'
	 * this.customizeResponse('targetUser', 'You did not give me a user...');
	 *
	 * // Or also using functions to have multilingual support:
	 * this.customizeResponse('targetUser', (msg) =>
	 *     msg.language.get('COMMAND_REQUIRED_USER_FRIENDLY'));
	 */
	customizeResponse(name, response) {
		this.usage.customizeResponse(name, response);
		return this;
	}

	/**
	 * The run method to be overwritten in actual commands
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The command message mapped on top of the message used to trigger this command
	 * @param {any[]} params The fully resolved parameters based on your usage / usageDelim
	 * @returns {KlasaMessage|KlasaMessage[]} You should return the response message whenever possible
	 * @abstract
	 */
	async run(msg) {
		// Defined in extension Classes
		return msg;
	}

	/**
	 * Defines the JSON.stringify behavior of this command.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			aliases: this.aliases.slice(0),
			botPerms: this.botPerms.toArray(false),
			bucket: this.bucket,
			category: this.category,
			cooldown: this.cooldown,
			deletable: this.deletable,
			description: typeof this.description === 'function' ? this.description({ language: this.client.languages.default }) : this.description,
			extendedHelp: typeof this.extendedHelp === 'function' ? this.extendedHelp({ language: this.client.languages.default }) : this.extendedHelp,
			fullCategory: this.fullCategory,
			guarded: this.guarded,
			nsfw: this.nsfw,
			permLevel: this.permLevel,
			promptLimit: this.promptLimit,
			promptTime: this.promptTime,
			quotedStringSupport: this.quotedStringSupport,
			requiredConfigs: this.requiredConfigs.slice(0),
			runIn: this.runIn.slice(0),
			subCategory: this.subCategory,
			subcommands: this.subcommands,
			usage: {
				usageString: this.usage.usageString,
				usageDelim: this.usage.usageDelim,
				nearlyFullUsage: this.usage.nearlyFullUsage
			},
			usageDelim: this.usageDelim,
			usageString: this.usageString
		};
	}

}

module.exports = Command;
