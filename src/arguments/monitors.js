import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...monitor'] });
	}

	get base() {
		return this.store.get('monitor');
	}

};
