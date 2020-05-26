import { Command, CommandStore, KlasaMessage } from 'klasa';
import { User, Message, Guild } from '@klasa/core';
export default class extends Command {
    private terms;
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage, usersAndGuilds: [User | Guild | string]): Promise<Message[]>;
}
