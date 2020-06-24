import { Inhibitor, Command } from 'klasa';
import { Permissions, PermissionsFlags, Message, isGuildTextBasedChannel } from '@klasa/core';
import { toTitleCase } from '@klasa/utils';

export default class extends Inhibitor {

	private readonly impliedPermissions = new Permissions(515136).freeze();
	// VIEW_CHANNEL, SEND_MESSAGES, SEND_TTS_MESSAGES, EMBED_LINKS, ATTACH_FILES,
	// READ_MESSAGE_HISTORY, MENTION_EVERYONE, USE_EXTERNAL_EMOJIS, ADD_REACTIONS

	// These are permissions that can be set in a channel permission overwrite but is meaningless in the context
	// So we add the ones we had back after calculating the permissions in the channel (after overwrites)
	private readonly guildScopePermissions = new Permissions(1275592878).freeze();
	// KICK_MEMBERS, BAN_MEMBERS, ADMINISTRATOR, MANAGE_GUILD, VIEW_AUDIT_LOG,
	// VIEW_GUILD_INSIGHTS, CHANGE_NICKNAME, MANAGE_NICKNAMES, MANAGE_EMOJIS

	private readonly friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
		Reflect.set(obj, key, toTitleCase(key.split('_').join(' ')));
		return obj;
	}, {}) as Record<PermissionsFlags, string>;

	public run(message: Message, command: Command): void {
		let missing: PermissionsFlags[];
		if (isGuildTextBasedChannel(message.channel)) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const guildPerms = message.guild!.me!.permissions!.mask(this.guildScopePermissions);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			missing = (message.guild!.me!.permissionsIn(message.channel).add(guildPerms).missing(command.requiredPermissions) ?? []) as PermissionsFlags[];
		} else {
			missing = this.impliedPermissions.missing(command.requiredPermissions) as PermissionsFlags[];
		}

		if (missing.length) throw message.language.get('INHIBITOR_MISSING_BOT_PERMS', missing.map(key => this.friendlyPerms[key]).join(', '));
	}

}
