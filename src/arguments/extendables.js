import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...extendable'] });
	}

	get base() {
		return this.store.get('extendable');
	}

};
