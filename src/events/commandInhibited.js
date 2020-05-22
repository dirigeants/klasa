import { Event } from 'klasa';

export class extends Event {

	run(message, command, response) {
		if (response && response.length) message.sendMessage(response);
	}

};
