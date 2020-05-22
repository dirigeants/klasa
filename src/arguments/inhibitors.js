import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...inhibitor'] });
	}

	get base() {
		return this.store.get('inhibitor');
	}

};
