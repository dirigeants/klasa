import { MultiArgument } from 'klasa';

export default class CoreArgument extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...extendable'] });
	}

	get base() {
		return this.store.get('extendable');
	}

}
