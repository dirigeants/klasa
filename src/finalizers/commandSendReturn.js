const { Finalizer } = require('klasa');

module.exports = class SendCmdReturn extends Finalizer {

	run(msg, mes) {
		if (
			(typeof mes === 'string') ||
			(Array.isArray(mes) && mes.every(SendCmdReturn.isString))
		) msg.sendMessage(mes);
	}

	static isString(value) { return typeof value === 'string'; }

};
