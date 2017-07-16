const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'help', {
			aliases: ['commands'],
			description: 'Display help for a command.',
			usage: '[Command:cmd]'
		});
	}

	async run(msg, [cmd]) {
		const method = this.client.user.bot ? 'author' : 'channel';
		if (cmd) {
			const info = [
				`= ${cmd.help.name} = `,
				cmd.help.description,
				`usage :: ${cmd.usage.fullUsage(msg)}`,
				'Extended Help ::',
				cmd.help.extendedHelp || 'No extended help available.'
			].join('\n');
			return msg.sendMessage(info, { code: 'asciidoc' });
		}
		const help = await this.buildHelp(msg);
		const categories = Object.keys(help);
		const helpMessage = [];
		for (let cat = 0; cat < categories.length; cat++) {
			helpMessage.push(`**${categories[cat]} Commands**: \`\`\`asciidoc`);
			const subCategories = Object.keys(help[categories[cat]]);
			for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join('\n')}\n`);
			helpMessage.push('```\n\u200b');
		}

		return msg[method].send(helpMessage, { split: { char: '\u200b' } })
			.then(() => { if (msg.channel.type !== 'dm' && this.client.user.bot) msg.sendMessage('📥 | Commands have been sent to your DMs.'); })
			.catch(() => { if (msg.channel.type !== 'dm' && this.client.user.bot) msg.sendMessage("❌ | You have DMs disabled, I couldn't send you the commands in DMs."); });
	}

	async buildHelp(msg) {
		const help = {};

		const commandNames = Array.from(this.client.commands.keys());
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(this.msg, command, true)
				.then(() => {
					if (!help.hasOwnProperty(command.help.category)) help[command.help.category] = {};
					if (!help[command.help.category].hasOwnProperty(command.help.subCategory)) help[command.help.category][command.help.subCategory] = [];
					help[command.help.category][command.help.subCategory].push(`${msg.guildSettings.prefix}${command.help.name.padEnd(longest)} :: ${command.help.description}`);
					return;
				})
				.catch(() => {
					// noop
				})
		));

		return help;
	}

};
