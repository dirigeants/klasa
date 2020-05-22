import { Inhibitor } from 'klasa';

export class extends Inhibitor {

	run(message, command) {
		return command.hidden && message.command !== command && !this.client.owners.has(message.author);
	}

};
