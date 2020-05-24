import { MultiArgument } from 'klasa';

export default class CoreMultiArgument extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...voiceChannel'] });
	}

	get base() {
		return this.store.get('voiceChannel');
	}

}
