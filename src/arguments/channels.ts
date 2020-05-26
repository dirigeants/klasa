import { Argument, MultiArgument, ArgumentStore } from 'klasa';

export default class CoreMultiArgument extends MultiArgument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['...channel'] });
	}

	public get base(): Argument {
		return this.store.get('channel') as Argument;
	}

}
