import { Inhibitor, Command } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Inhibitor {
    run(message: Message, command: Command): Promise<void>;
}
