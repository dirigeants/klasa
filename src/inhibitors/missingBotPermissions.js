const { Inhibitor } = require('../lib/index');
const { Permissions } = require('discord.js');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'missingBotPermissions', {});
		this.impliedPermissions = new Permissions([
			'READ_MESSAGES',
			'SEND_MESSAGES',
			'SEND_TTS_MESSAGES',
			'EMBED_LINKS',
			'ATTACH_FILES',
			'READ_MESSAGE_HISTORY',
			'MENTION_EVERYONE',
			'EXTERNAL_EMOJIS',
			'ADD_REACTIONS'
		]);
	}

	async run(msg, user, cmd) {
		const missing = msg.channel.type === 'text' ? msg.channel.permissionsFor(this.client.user).missing(cmd.conf.botPerms) : this.impliedPermissions.missing(cmd.conf.botPerms);
		if (missing.length > 0) throw `Insufficient permissions, missing: **${Inhibitor.toTitleCase(missing.join(', ').split('_').join(' '))}**`;
		return;
	}

};
