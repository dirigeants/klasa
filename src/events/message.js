const { Event, util: { regExpEsc } } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
		this.prefixes = new Map();
		this.prefixMention = null;
		this.mentionOnly = null;
		this.prefixFlags = this.client.options.prefixCaseInsensitive ? 'i' : '';
	}

	run(message) {
		if (!this.client.ready) return;

		if (this.client.user !== message.author &&
			!message.author.bot &&
			!message.webhookID &&
			message.channel.postable) {
			const { prefix, prefixLength } = this.parsePrefix(message);
			if (prefix) message._registerPrefix(prefix, prefixLength);
		}

		this.client.monitors.run(message);
	}

	parsePrefix(message) {
		const result = this.customPrefix(message) || this.mentionPrefix(message) || this.naturalPrefix(message) || this.prefixLess(message);
		return result ? {
			prefix: result.regex,
			prefixLength: result.length
		} : {};
	}

	customPrefix({ content, guildSettings: { prefix } }) {
		if (!prefix) return null;
		for (const prf of Array.isArray(prefix) ? prefix : [prefix]) {
			const testingPrefix = this.prefixes.get(prf) || this.generateNewPrefix(prf);
			if (testingPrefix.regex.test(content)) return testingPrefix;
		}
		return null;
	}

	mentionPrefix({ content }) {
		const prefixMention = this.prefixMention.exec(content);
		return prefixMention ? { length: prefixMention[0].length, regex: this.prefixMention } : null;
	}

	naturalPrefix({ content, guildSettings: { disableNaturalPrefix } }) {
		if (disableNaturalPrefix || !this.client.options.regexPrefix) return null;
		const results = this.client.options.regexPrefix.exec(content);
		return results ? { length: results[0].length, regex: this.client.options.regexPrefix } : null;
	}

	prefixLess({ channel: { type } }) {
		return this.client.options.noPrefixDM && type === 'dm' ? { length: 0, regex: null } : null;
	}

	generateNewPrefix(prefix) {
		const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`, this.prefixFlags) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject;
	}

	init() {
		this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
		this.mentionOnly = new RegExp(`^<@!?${this.client.user.id}>$`);
	}

};
