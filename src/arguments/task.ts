import { Argument, Possible, KlasaMessage, Task } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Task {
		const task = this.client.tasks.get(argument);
		if (task) return task;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'task');
	}

}
