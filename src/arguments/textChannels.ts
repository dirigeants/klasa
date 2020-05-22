import { MultiArgument } from 'klasa';

export default class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...textChannel'] });
	}

	get base() {
		return this.store.get('textChannel');
	}

}
