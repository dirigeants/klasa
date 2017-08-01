const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		const min = typeof cmd === 'number' ? cmd : cmd.permLevel;
		const mps = [];
		let broke = false;
		for (let i = min; i < 11; i++) {
			mps.push(this.client.permStructure[i].check(this.client, msg));
			if (this.client.permStructure[i].break) {
				broke = true;
				break;
			}
		}
		const responses = await Promise.all(mps);
		if (responses.includes(true)) return;
		throw broke ? msg.language.get('INHIBITOR_PERMISSIONS') : true;
	}

};
