import { MultiArgument } from 'klasa';

export class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...piece'] });
	}

	get base() {
		return this.store.get('piece');
	}

};
