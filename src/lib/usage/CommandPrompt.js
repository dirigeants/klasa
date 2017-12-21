const TextPrompt = require('./TextPrompt');

/**
 * A class to handle argument collection and parameter resolution for commands
 */
class CommandPrompt extends TextPrompt {

	/**
	 * @param {KlasaMessage} msg The message for the command
	 * @param {CommandUsage} usage The usage of the command
	 * @param {Object} options The options for this CommandPrompt
	 */
	constructor(msg, usage, options) {
		super(msg, usage, options);

		/**
		 * The typing state of this CommandPrompt
		 * @type {boolean}
		 * @private
		 */
		this.typing = this.client.options.typing;

		this._setup(this.message.content.slice(this.message.prefixLength).trim().split(' ').slice(1).join(' ').trim());
	}

	/**
	 * Runs the internal validation, and re-prompts according to the settings
	 * @returns {any[]} The parameters resolved
	 */
	async run() {
		return this.validateArgs();
	}

}

module.exports = CommandPrompt;
