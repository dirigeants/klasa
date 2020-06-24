import { Inhibitor, Command } from 'klasa';
import { Permissions, PermissionsFlags, Message, isGuildTextBasedChannel } from '@klasa/core';
import { toTitleCase } from '@klasa/utils';

export default class extends Inhibitor {

	private readonly impliedPermissions = new Permissions(515136).freeze();
	// VIEW_CHANNEL, SEND_MESSAGES, SEND_TTS_MESSAGES, EMBED_LINKS, ATTACH_FILES,
	// READ_MESSAGE_HISTORY, MENTION_EVERYONE, USE_EXTERNAL_EMOJIS, ADD_REACTIONS

	private readonly friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
		Reflect.set(obj, key, toTitleCase(key.split('_').join(' ')));
		return obj;
	}, {}) as Record<PermissionsFlags, string>;

	public run(message: Message, command: Command): void {
		const missing: PermissionsFlags[] = isGuildTextBasedChannel(message.channel) ?
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			(message.guild!.me!.permissionsIn(message.channel).missing(command.requiredPermissions) ?? []) as PermissionsFlags[] :
			this.impliedPermissions.missing(command.requiredPermissions) as PermissionsFlags[];

		if (missing.length) throw message.language.get('INHIBITOR_MISSING_BOT_PERMS', missing.map(key => this.friendlyPerms[key]).join(', '));
	}

}
