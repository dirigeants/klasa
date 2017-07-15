const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'permissions', {});
	}

	async run(msg, cmd) {
		const min = typeof cmd === 'number' ? cmd : cmd.conf.permLevel;
		const mps = [];
		for (let i = min; i < 11; i++) {
			mps.push(this.client.permStructure[i].check(this.client, msg));
			if (this.client.permStructure[i].break) break;
		}
		return Promise.race(mps).catch(() => { throw 'You do not have permission to use this command.'; });
	}

};
