import { Event } from '@klasa/core';
import { codeblock } from 'discord-md-tags';
import type { Argument, KlasaMessage } from 'klasa';

export default class extends Event {

	public run(message: KlasaMessage, argument: Argument, _params: readonly unknown[], error: Error): void {
		this.client.emit('wtf', `[ARGUMENT] ${argument.path}\n${error.stack || error}`);
		message.send(mb => mb.setContent(codeblock('JSON') `${error.message}`)).catch(err => this.client.emit('wtf', err));
	}

}
