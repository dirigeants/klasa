import { MultiArgument } from 'klasa';

export default class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...member'] });
	}

	get base() {
		return this.store.get('member');
	}

}
