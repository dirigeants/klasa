const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, msg, custom) {
		try {
			const resolved = await custom(arg, possible, msg, msg.params);
			return resolved;
		} catch (err) {
			if (err) throw err;
			throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_CUSTOM', possible.name, possible.type);
		}
	}

};
