import { MultiArgument } from 'klasa';

export default class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...task'] });
	}

	get base() {
		return this.store.get('task');
	}

}
