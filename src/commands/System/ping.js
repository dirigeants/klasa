const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'ping', { description: 'Ping/Pong command. I wonder what this does? /sarcasm' });
	}

	async run(msg) {
		const message = await msg.sendMessage('Ping?');
		return msg.sendMessage(`Pong! (Roundtrip took: ${message.createdTimestamp - msg.createdTimestamp}ms. Heartbeat: ${Math.round(this.client.ping)}ms.)`);
	}

};
