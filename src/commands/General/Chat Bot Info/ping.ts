import { Command } from 'klasa';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
		const msg = await message.sendLocale('COMMAND_PING');
		return message.sendLocale('COMMAND_PINGPONG', [(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp), Math.round(this.client.ws.ping)]);
	}

}
