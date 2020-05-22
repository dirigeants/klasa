import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...dmChannel'] });
	}

	get base() {
		return this.store.get('dmChannel');
	}

};
