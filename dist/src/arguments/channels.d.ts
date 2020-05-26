import { Argument, MultiArgument, ArgumentStore } from 'klasa';
export default class CoreMultiArgument extends MultiArgument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    get base(): Argument;
}
