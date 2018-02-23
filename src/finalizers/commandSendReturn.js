const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(msg, mes) {
		if (typeof mes === 'string') msg.sendMessage(mes);
	}

};
