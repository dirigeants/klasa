import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...emoji'] });
	}

	get base() {
		return this.store.get('emoji');
	}

};
