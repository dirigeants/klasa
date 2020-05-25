import { Inhibitor, KlasaMessage, Command } from 'klasa';

export default class extends Inhibitor {

	public run(message: KlasaMessage, command: Command): void {
		if (!command.runIn.length) throw message.language.get('INHIBITOR_RUNIN_NONE', command.name);
		if (!command.runIn.includes(message.channel.type)) throw message.language.get('INHIBITOR_RUNIN', command.runIn.join(', '));
	}

}
