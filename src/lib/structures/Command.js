const Piece = require('./interfaces/Piece');
const ParsedUsage = require('../usage/ParsedUsage');

/**
 * Base class for all Klasa Commands. See {@tutorial CreatingCommands} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingCommands
 * @implements {Piece}
 */
class Command {

	/**
	 * @typedef {Object} CommandOptions
	 * @memberof Command
	 * @property {string} [name=theFileName] The name of the command
	 * @property {boolean} [enabled=true] Whether the command is enabled or not
	 * @property {string[]} [runIn=['text','dm','group']] What channel types the command should run in
	 * @property {number} [cooldown=0] The amount of time before the user can run the command again in seconds
	 * @property {boolean} [nsfw=false] If the command should only run in nsfw channels
	 * @property {boolean} [guarded=false] If the command can be disabled on a guild level (does not effect global disable)
	 * @property {string[]} [aliases=[]] Any comand aliases
	 * @property {boolean} [autoAliases=true] If automatic aliases should be added (adds aliases of name and aliases without dashes)
	 * @property {number} [permLevel=0] The required permission level to use the command
	 * @property {string[]} [botPerms=[]] The required Discord permissions for the bot to use this command
	 * @property {string[]} [requiredConfigs=[]] The required guild configs to use this command
	 * @property {(string|Function)} [description=''] The help description for the command
	 * @property {string} [usage=''] The usage string for the command
	 * @property {?string} [usageDelim=undefined] The string to deliminate the command input for usage
	 * @property {boolean} [quotedStringSupport=this.client.config.quotedStringSupport] Wheter args for this command should not deliminated inside quotes
	 * @property {(string|Function)} [extendedHelp=msg.language.get('COMMAND_HELP_NO_EXTENDED')] Extended help strings
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user command pieces folder
	 * @param {Array} file The path from the pieces folder to the command file
	 * @param {CommandOptions} [options = {}] Optional Command settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = 'command';

		/**
		 * If the command is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * What channels the command should run in
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.runIn = options.runIn || ['text', 'dm', 'group'];

		/**
		 * The cooldown in seconds this command has
		 * @since 0.0.1
		 * @type {number}
		 */
		this.cooldown = options.cooldown || 0;

		/**
		 * Whether this command should only run in NSFW channels or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.nsfw = Boolean(options.nsfw);

		/**
		 * Whether this command shound not be able to be disabled in a guild or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.guarded = Boolean(options.guarded);

		/**
		 * Whether this command should have it's responses deleted if the triggering message is deleted
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.deletable = Boolean(options.deletable);

		/**
		 * The name of the command
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file[file.length - 1].slice(0, -3);

		/**
		 * The aliases for this command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.aliases = options.aliases || [];
		if ('autoAliases' in options ? options.autoAliases : true) {
			if (this.name.includes('-')) this.aliases.push(this.name.replace(/-/g, ''));
			for (const alias of this.aliases) if (alias.includes('-')) this.aliases.push(alias.replace(/-/g, ''));
		}

		/**
		 * The required permLevel to run this command
		 * @since 0.0.1
		 * @type {number}
		 */
		this.permLevel = options.permLevel || 0;

		/**
		 * The required bot permissions to run this command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.botPerms = options.botPerms || [];

		/**
		 * The required per guild configs to run this command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.requiredConfigs = options.requiredConfigs || [];

		/**
		 * The description of the command
		 * @since 0.0.1
		 * @type {(string|Function)}
		 * @param {KlasaMessage} msg The message used to trigger this command
		 * @returns {string}
		 */
		this.description = options.description || '';

		/**
		 * The extended help for the command
		 * @since 0.0.1
		 * @type {(string|Function)}
		 * @param {KlasaMessage} msg The message used to trigger this command
		 * @returns {string}
		 */
		this.extendedHelp = options.extendedHelp || (msg => msg.language.get('COMMAND_HELP_NO_EXTENDED'));

		/**
		 * The usage string for the command
		 * @since 0.0.1
		 * @type {string}
		 */
		this.usageString = options.usage || '';

		/**
		 * The usage deliminator for the command input
		 * @since 0.0.1
		 * @type {?string}
		 */
		this.usageDelim = options.usageDelim;

		/**
		 * Whether to use quoted string support for this command or not
		 * @since 0.2.1
		 * @type {boolean}
		 */
		this.quotedStringSupport = 'quotedStringSupport' in options ? options.quotedStringSupport : this.client.config.quotedStringSupport;

		/**
		 * The full category for the command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.fullCategory = file.slice(0, -1);

		/**
		 * The main category for the command
		 * @since 0.0.1
		 * @type {string}
		 */
		this.category = this.fullCategory[0] || 'General';

		/**
		 * The sub category for the command
		 * @since 0.0.1
		 * @type {string}
		 */
		this.subCategory = this.fullCategory[1] || 'General';

		/**
		 * The parsed usage for the command
		 * @since 0.0.1
		 * @type {ParsedUsage}
		 */
		this.usage = new ParsedUsage(client, this);

		/**
		 * Any active cooldowns for the command
		 * @since 0.0.1
		 * @type {Map}
		 * @private
		 */
		this.cooldowns = new Map();

		/**
		 * The file location where this command is stored
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.file = file;

		/**
		 * The directory to where this command piece is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.dir = dir;
	}

	/**
	 * The run method to be overwritten in actual commands
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The command message mapped on top of the message used to trigger this command
	 * @param {any[]} params The fully resolved parameters based on your usage / usageDelim
	 * @abstract
	 * @returns {Promise<KlasaMessage|KlasaMessage[]>} You should return the response message whenever possible
	 */
	async run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual commands
	 * @since 0.0.1
	 * @abstract
	 * @returns {Promise<*>}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Command);

module.exports = Command;
