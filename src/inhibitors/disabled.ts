import { Inhibitor, KlasaMessage, Command } from 'klasa';

export default class extends Inhibitor {

	public run(message: KlasaMessage, command: Command): void {
		if (!command.enabled) throw message.language.get('INHIBITOR_DISABLED_GLOBAL');
		if ((message.guildSettings.get('disabledCommands') as string[]).includes(command.name)) throw message.language.get('INHIBITOR_DISABLED_GUILD');
	}

}
