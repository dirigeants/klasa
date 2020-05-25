import { MultiArgument, ArgumentStore, Argument } from 'klasa';

export default class CoreMultiArgument extends MultiArgument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['...dmChannel'] });
	}

	public get base(): Argument {
		return this.store.get('dmChannel') as Argument;
	}

}
