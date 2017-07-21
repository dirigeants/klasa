const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			description: 'Provides some information about this bot.'
		});
	}

	async run(msg) {
		const information = [
			"Klasa is a 'plug-and-play' framework built on top of the Discord.js library.",
			'Most of the code is modularized, which allows developers to edit Komada to suit their needs.',
			'',
			'Some features of Klasa include:',
			'• Fast Loading times with ES7 Support (Async/Await)',
			'• Per-server settings for each guild, that can be extended with your own code',
			'• Customizable Command system with automated usage parsing and easy to use reloading and downloading modules',
			'• "Monitors" which can watch messages and act on them, like a normal message event (Swear Filters, Spam Protection, etc)',
			'• "Inhibitors" which can prevent commands from running based on a set of parameters (Permissions, Blacklists, etc)',
			'• "Providers" which allow you to connect with an outside database of your choosing. Not yet documented.',
			'• "Finalizers" which run on messages after a successful command.',
			'• "Extendables", code that acts passively. They add properties or methods to existing Discord.js classes.',
			'',
			'We hope to be a 100% customizable framework that can cater to all audiences. We do frequent updates and bugfixes when available.',
			"If you're interested in us, check us out at https://klasa.js.org"
		];
		return msg.sendMessage(information);
	}

};
