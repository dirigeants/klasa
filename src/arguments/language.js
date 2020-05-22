import { Argument } from 'klasa';

export class extends Argument {

	run(arg, possible, message) {
		const language = this.client.languages.get(arg);
		if (language) return language;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'language');
	}

};
