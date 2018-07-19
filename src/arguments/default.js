const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		if (arg.toLowerCase() !== possible.name.toLowerCase()) message.args.splice(message.params.length, 0, undefined);
		return possible.name.toLowerCase();
	}

};
