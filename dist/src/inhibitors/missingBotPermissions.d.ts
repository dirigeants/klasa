import { Inhibitor, Command } from 'klasa';
import { Message } from '@klasa/core';
export default class extends Inhibitor {
    private readonly impliedPermissions;
    private readonly friendlyPerms;
    run(message: Message, command: Command): void;
}
