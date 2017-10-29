const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['commands'],
			description: 'Display help for a command.',
			usage: '[Command:string]'
		});
	}

	async run(msg, [cmd]) {
		const method = this.client.user.bot ? 'author' : 'channel';
		if (cmd) {
			cmd = this.client.commands.get(cmd);
			if (!cmd) return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_HELP_COMMAND_NOT_FOUND'));
			await this.client.inhibitors.run(msg, cmd, true);
			const settings = await msg.fetchGuildSettings();
			const info = [
				`= ${cmd.name} = `,
				cmd.description,
				`usage :: ${cmd.usage.fullUsage(settings.prefix || this.client.config.prefix)}`,
				'Extended Help ::',
				cmd.extendedHelp
			].join('\n');
			return msg.sendMessage(info, { code: 'asciidoc' });
		}
		const help = await this.buildHelp(msg);
		const categories = Object.keys(help);
		const helpMessage = [];
		for (let cat = 0; cat < categories.length; cat++) {
			helpMessage.push(`**${categories[cat]} Commands**: \`\`\`asciidoc`, '');
			const subCategories = Object.keys(help[categories[cat]]);
			for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join('\n')}\n`);
			helpMessage.push('```\n\u200b');
		}

		return msg[method].send(helpMessage, { split: { char: '\u200b' } })
			.then(async () => { if (msg.channel.type !== 'dm' && this.client.user.bot) msg.sendMessage(await msg.fetchLanguageCode('COMMAND_HELP_DM')); })
			.catch(async () => { if (msg.channel.type !== 'dm' && this.client.user.bot) msg.sendMessage(await msg.fetchLanguageCode('COMMAND_HELP_NODM')); });
	}

	async buildHelp(msg) {
		const help = {};

		const commandNames = Array.from(this.client.commands.keys());
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		const { prefix } = await msg.fetchGuildSettings();

		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(msg, command, true)
				.then(() => {
					if (!help.hasOwnProperty(command.category)) help[command.category] = {};
					if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];
					help[command.category][command.subCategory].push(`${prefix}${command.name.padEnd(longest)} :: ${command.description}`);
					return;
				})
				.catch(() => {
					// noop
				})
		));

		return help;
	}

};
