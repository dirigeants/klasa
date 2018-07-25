const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: (message) => message.language.get('COMMAND_REBOOT_DESCRIPTION')
		});
	}

	async run(message) {
		await message.sendLocale('COMMAND_REBOOT').catch(err => this.client.emit('error', err));
		process.exit();
	}

};
