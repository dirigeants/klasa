const longTypes = { command: 'commands', inhibitor: 'inhibitors', monitor: 'monitors', finalizer: 'finalizers' };

exports.run = async (client, msg, [type, name]) => {
	const toDisable = client[longTypes[type]].get(name);
	if (!toDisable) return msg.sendCode('diff', `- I cannot find the ${type}: ${name}`);
	toDisable.conf.enabled = false;
	return msg.sendCode('diff', `+ Successfully disabled ${type}: ${name}`);
};

exports.conf = {
	enabled: true,
	runIn: ['text', 'dm', 'group'],
	aliases: [],
	permLevel: 10,
	botPerms: [],
	requiredFuncs: [],
	requiredSettings: []
};

exports.help = {
	name: 'disable',
	description: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
	usage: '<command|inhibitor|monitor|finalizer> <name:str>',
	usageDelim: ' '
};
