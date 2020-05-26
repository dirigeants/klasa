import { Inhibitor, KlasaMessage, Command } from 'klasa';

export default class extends Inhibitor {

	public async run(message: KlasaMessage, command: Command): Promise<void> {
		const { broke, permission } = await this.client.permissionLevels.run(message, command.permissionLevel);
		if (!permission) throw broke ? message.language.get('INHIBITOR_PERMISSIONS') : true;
	}

}
