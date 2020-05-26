import { Inhibitor, KlasaMessage, Command } from 'klasa';

export default class extends Inhibitor {

	public run(message: KlasaMessage, command: Command): boolean {
		return command.hidden && message.command !== command && !this.client.owners.has(message.author);
	}

}
