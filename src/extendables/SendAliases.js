const { Extendable } = require('klasa');
const { TextChannel, DMChannel, GroupDMChannel, User } = require('discord.js');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [TextChannel, DMChannel, GroupDMChannel, User] });
	}

	sendCode(lang, content, options = {}) {
		return this.send({ ...options, content, code: lang });
	}

	sendEmbed(embed, content, options = {}) {
		if (typeof content === 'object') {
			options = content;
			content = '';
		}
		return this.send({ content, ...options, embed });
	}

	sendFile(attachment, name, content, options = {}) {
		return this.send({ ...options, files: [{ attachment, name }], content });
	}

	sendFiles(files, content, options = {}) {
		return this.send(content, { ...options, files });
	}

	sendLocale(key, args = [], options = {}) {
		if (!Array.isArray(args)) {
			options = args;
			args = [];
		}
		const language = this.guild ? this.guild.language : this.client.languages.default;
		return this.send({ content: language.get(key, ...args), ...options });
	}

	sendMessage(content, options) {
		return this.send(content, options);
	}

};
