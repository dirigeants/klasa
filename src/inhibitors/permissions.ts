import { Inhibitor, Command } from 'klasa';

import type { Message } from '@klasa/core';

export default class extends Inhibitor {

	public async run(message: Message, command: Command): Promise<void> {
		const { broke, permission } = await this.client.permissionLevels.run(message, command.permissionLevel);
		if (!permission) throw broke ? message.language.get('INHIBITOR_PERMISSIONS') : true;
	}

}
