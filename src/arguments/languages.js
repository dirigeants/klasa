import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...language'] });
	}

	get base() {
		return this.store.get('language');
	}

};
