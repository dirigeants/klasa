import { Inhibitor } from 'klasa';

export default class extends Inhibitor {

	run(message, command) {
		return command.hidden && message.command !== command && !this.client.owners.has(message.author);
	}

}
