import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...user'] });
	}

	get base() {
		return this.store.get('user');
	}

};
