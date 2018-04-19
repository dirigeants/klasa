const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const task = this.client.tasks.get(arg);
		if (task) return task;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'task');
	}

};
