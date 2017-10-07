const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		const { broke, permission } = await this.client.permissionLevels.run(msg, cmd.permLevel);
		if (permission) return;
		throw broke ? msg.fetchLanguageCode('INHIBITOR_PERMISSIONS') : true;
	}

};
