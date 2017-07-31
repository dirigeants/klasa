const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Reboots the bot.'
		});
	}

	async run(msg) {
		await msg.sendMessage(msg.language.get('COMMAND_REBOOT')).catch(err => this.client.emit('error', err));
		process.exit();
	}

};
