const zws = String.fromCharCode(8203);
let sensitivePattern;

class Util {

	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static codeBlock(lang, expression) {
		return `\`\`\`${lang}\n${expression || '\u200b'}\`\`\``;
	}

	static clean(text) {
		if (typeof text === 'string') return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
		return text;
	}

	static initClean(client) {
		const patterns = [];
		if (client.token) patterns.push(client.token);
		if (client.user.email) patterns.push(client.user.email);
		if (client.password) patterns.push(client.password);
		sensitivePattern = new RegExp(patterns.join('|'), 'gi');
	}

	static toTitleCase(str) {
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

	static newError(error, code) {
		if (error.status) {
			this.statusCode = error.response.res.statusCode;
			this.statusMessage = error.response.res.statusMessage;
			this.code = error.response.body.code;
			this.message = error.response.body.message;
			return this;
		}
		this.code = code || null;
		this.message = error;
		this.stack = error.stack || null;
		return this;
	}

	static regExpEsc(str) {
		return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

}

module.exports = Util;
