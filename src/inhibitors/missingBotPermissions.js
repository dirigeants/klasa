const { Inhibitor, util } = require('klasa');
const { Permissions } = require('discord.js');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args);
		this.impliedPermissions = new Permissions([
			'VIEW_CHANNEL',
			'SEND_MESSAGES',
			'SEND_TTS_MESSAGES',
			'EMBED_LINKS',
			'ATTACH_FILES',
			'READ_MESSAGE_HISTORY',
			'MENTION_EVERYONE',
			'USE_EXTERNAL_EMOJIS',
			'ADD_REACTIONS'
		]);
		this.friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
			obj[key] = util.toTitleCase(key.split('_').join(' '));
			return obj;
		}, {});
	}

	async run(msg, cmd) {
		const missing = msg.channel.type === 'text' ? msg.channel.permissionsFor(this.client.user).missing(cmd.botPerms) : this.impliedPermissions.missing(cmd.botPerms);
		if (missing.length) throw msg.language.get('INHIBITOR_MISSING_BOT_PERMS', missing.map(key => this.friendlyPerms[key]).join(', '));
		return;
	}

};
