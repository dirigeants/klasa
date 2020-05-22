import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...message'] });
	}

	get base() {
		return this.store.get('message');
	}

};
