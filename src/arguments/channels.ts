import { MultiArgument } from 'klasa';

export default class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...channel'] });
	}

	get base() {
		return this.store.get('channel');
	}

}
