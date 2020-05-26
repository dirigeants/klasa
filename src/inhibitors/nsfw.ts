import { Inhibitor, Command, KlasaMessage } from 'klasa';
import { ChannelType } from '@klasa/dapi-types';

export default class extends Inhibitor {

	public run(message: KlasaMessage, command: Command): void {
		if (command.nsfw && message.channel.type !== ChannelType.DM && !message.channel.nsfw) throw message.language.get('INHIBITOR_NSFW');
	}

}
