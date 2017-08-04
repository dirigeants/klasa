const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		const min = typeof cmd === 'number' ? cmd : cmd.permLevel;
		const mps = [];
		let broke = false;
		for (let i = min; i < this.client.permLevels.size; i++) {
			mps.push(this.client.permLevels.get(i).check(this.client, msg));
			if (this.client.permLevels.get(i).break) {
				broke = true;
				break;
			}
		}
		const responses = await Promise.all(mps);
		if (responses.includes(true)) return;
		throw broke ? msg.language.get('INHIBITOR_PERMISSIONS') : true;
	}

};
