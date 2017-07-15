const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'reboot', {
			permLevel: 10,
			description: 'Reboots the bot.'
		});
	}

	async run(msg) {
		await msg.sendMessage('Rebooting...').catch(err => this.client.emit('error', err));
		process.exit();
	}

};
