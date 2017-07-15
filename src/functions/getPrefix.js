module.exports = async (client, msg) => {
	if (client.config.prefixMention.test(msg.content)) return client.config.prefixMention;
	const { prefix } = msg.guildSettings;
	const { regExpEsc } = client.funcs;
	if (prefix instanceof Array) {
		for (let i = prefix.length - 1; i >= 0; i--) {
			if (msg.content.startsWith(prefix[i])) return new RegExp(`^${regExpEsc(prefix[i])}`);
		}
	} else if (prefix && msg.content.startsWith(prefix)) { return new RegExp(`^${regExpEsc(prefix)}`); }
	return false;
};
