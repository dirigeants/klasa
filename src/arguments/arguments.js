import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...argument'] });
	}

	get base() {
		return this.store.get('argument');
	}

};
