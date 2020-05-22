import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...provider'] });
	}

	get base() {
		return this.store.get('provider');
	}

};
