import { Inhibitor } from 'klasa';

export class extends Inhibitor {

	run(message, command) {
		if (!command.runIn.length) throw message.language.get('INHIBITOR_RUNIN_NONE', command.name);
		if (!command.runIn.includes(message.channel.type)) throw message.language.get('INHIBITOR_RUNIN', command.runIn.join(', '));
	}

};
