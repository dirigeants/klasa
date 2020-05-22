import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...command'] });
	}

	get base() {
		return this.store.get('command');
	}

};
