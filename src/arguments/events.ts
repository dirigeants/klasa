import { MultiArgument } from 'klasa';

export default class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...event'] });
	}

	get base() {
		return this.store.get('event');
	}

}
