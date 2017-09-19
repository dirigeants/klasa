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
	 * @property {Array<string>} [runIn=['text','dm','group']] What channel types the command should run in
	 * @property {number} [cooldown=0] The amount of time before the user can run the command again in seconds
	 * @property {Array<string>} [aliases=[]] Any comand aliases
	 * @property {number} [permLevel=0] The required permission level to use the command
	 * @property {Array<string>} [botPerms=[]] The required Discord permissions for the bot to use this command
	 * @property {Array<string>} [requiredSettings=[]] The required guild settings to use this command
	 * @property {string} [description=''] The help description for the command
	 * @property {string} [usage=''] The usage string for the command
	 * @property {?string} [usageDelim=undefined] The string to deliminate the command input for usage
	 * @property {boolean} [quotedStringSupport=this.client.config.quotedStringSupport] Wheter args for this command should not deliminated inside quotes
	 * @property {string} [extendedHelp='No extended help available.'] Extended help strings
	 */

	/**
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user command pieces folder
	 * @param {Array} file The path from the pieces folder to the command file
	 * @param {CommandOptions} [options = {}] Optional Command settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'command';

		/**
		 * If the command is enabled or not
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * What channels the command should run in
		 * @type {Array<string>}
		 */
		this.runIn = options.runIn || ['text', 'dm', 'group'];

		/**
		 * The cooldown in seconds this command has
		 * @type {number}
		 */
		this.cooldown = options.cooldown || 0;

		/**
		 * The aliases for this command
		 * @type {Array<string>}
		 */
		this.aliases = options.aliases || [];

		/**
		 * The required permLevel to run this command
		 * @type {number}
		 */
		this.permLevel = options.permLevel || 0;

		/**
		 * The required bot permissions to run this command
		 * @type {Array<string>}
		 */
		this.botPerms = options.botPerms || [];

		/**
		 * The required guild settings to run this command
		 * @type {Array<string>}
		 */
		this.requiredSettings = options.requiredSettings || [];

		/**
		 * The name of the command
		 * @type {string}
		 */
		this.name = options.name || file[file.length - 1].slice(0, -3);

		/**
		 * The description of the command
		 * @type {string}
		 */
		this.description = options.description || '';

		/**
		 * The extended help for the command
		 * @type {string}
		 */
		this.extendedHelp = options.extendedHelp || 'No extended help available.';

		/**
		 * The usage string for the command
		 * @type {string}
		 */
		this.usageString = options.usage || '';

		/**
		 * The usage deliminator for the command input
		 * @type {?string}
		 */
		this.usageDelim = options.usageDelim || undefined;

		/**
		 * Whether to use quoted string support for this command or not
		 * @type {boolean}
		 */
		this.quotedStringSupport = 'quotedStringSupport' in options ? options.quotedStringSupport : this.client.config.quotedStringSupport;

		/**
		 * The full category for the command
		 * @type {Array<string>}
		 */
		this.fullCategory = file.slice(0, -1);

		/**
		 * The main category for the command
		 * @type {string}
		 */
		this.category = this.fullCategory[0] || 'General';

		/**
		 * The sub category for the command
		 * @type {string}
		 */
		this.subCategory = this.fullCategory[1] || 'General';

		/**
		 * The parsed usage for the command
		 * @type {ParsedUsage}
		 */
		this.usage = new ParsedUsage(client, this);

		/**
		 * Any active cooldowns for the command
		 * @type {Map}
		 * @private
		 */
		this.cooldowns = new Map();

		/**
		 * The file location where this command is stored
		 * @type {Array<string>}
		 */
		this.file = file;

		/**
		 * The directory to where this command piece is stored
		 * @type {string}
		 */
		this.dir = dir;
	}

	/**
	 * The run method to be overwritten in actual commands
	 * @param {CommandMessage} msg The command message mapped on top of the message used to trigger this command
	 * @param {Array<any>} params The fully resolved parameters based on your usage / usageDelim
	 * @abstract
	 * @returns {external:Message} You should return the response message whenever possible
	 */
	async run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual commands
	 * @abstract
	 * @returns {void}
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
