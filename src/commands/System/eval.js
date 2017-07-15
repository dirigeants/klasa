const { inspect } = require('util');

/* eslint-disable no-eval */
exports.run = async (client, msg, [code]) => {
	try {
		let evaled = eval(code);
		if (evaled instanceof Promise) evaled = await evaled;
		if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: 0 });
		msg.sendCode('js', client.funcs.clean(client, evaled));
	} catch (err) {
		msg.sendMessage(`\`ERROR\` \`\`\`js\n${client.funcs.clean(client, err)}\n\`\`\``);
		if (err.stack) client.emit('error', err.stack);
	}
};

exports.conf = {
	enabled: true,
	runIn: ['text', 'dm', 'group'],
	aliases: ['ev'],
	permLevel: 10,
	botPerms: [],
	requiredFuncs: [],
	requiredSettings: []
};

exports.help = {
	name: 'eval',
	description: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
	usage: '<expression:str>',
	usageDelim: ''
};
