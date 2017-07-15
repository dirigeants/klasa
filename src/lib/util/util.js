module.exports = class Util {

	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static codeBlock(lang, expression) {
		return `\`\`\`${lang}\n${expression || '\u200b'}\`\`\``;
	}

	static clean(text) {
		if (typeof text === 'string') return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
		return text;
	}

	static toTitleCase(str) {
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

};
