const TextPrompter = require('./TextPrompter');

/**
 * A class to handle argument collection and parameter resolution
 */
class CommandPrompt extends TextPrompter {

	constructor(msg, usage, options) {
		super(msg, usage, options);

		this.typing = this.client.options.typing;

		this._setup(this.message.content.slice(this.message.prefixLength).trim().split(' ').slice(1).join(' ').trim());
	}

	async run() {
		return this.validateArgs();
	}

}

module.exports = CommandPrompt;
