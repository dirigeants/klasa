const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Ping/Pong command. I wonder what this does? /sarcasm' });
	}

	async run(msg) {
		const language = msg.fetchLanguage();
		const message = await msg.sendMessage(language.get('COMMAND_PING'));
		return msg.sendMessage(language.get('COMMAND_PINGPONG', message.createdTimestamp - msg.createdTimestamp, Math.round(this.client.ping)));
	}

};
