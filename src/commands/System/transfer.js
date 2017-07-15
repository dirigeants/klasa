const fs = require('fs-nextra');
const { resolve } = require('path');

exports.run = async (client, msg, [type, name]) => {
	const coreDir = client.coreBaseDir;
	const clientDir = client.clientBaseDir;
	const reload = {
		command: client.funcs.reloadCommand,
		function: client.funcs.reloadFunction,
		inhibitor: client.funcs.reloadInhibitor,
		finalizer: client.funcs.reloadFinalizer,
		event: client.funcs.reloadEvent,
		monitor: client.funcs.reloadMessageMonitor
	};
	if (type === 'command') name = `System/${name}`;
	const fileLocation = resolve(coreDir, `${type}s`, `${name}.js`);
	await fs.access(fileLocation).catch(() => { throw '❌ That file has been transfered already or never existed.'; });
	return fs.copy(fileLocation, resolve(clientDir, `${type}s`, `${name}.js`))
		.then(() => {
			reload[type].call(client.funcs, `${name}`).catch((response) => { throw `❌ ${response}`; });
			return msg.sendMessage(`✅ Successfully Transferred ${type}: ${name}`);
		})
		.catch((err) => {
			client.emit('error', err.stack);
			return msg.sendMessage(`Transfer of ${type}: ${name} to Client has failed. Please check your Console.`);
		});
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
	name: 'transfer',
	description: 'Transfers a core piece to its respective folder',
	usage: '<command|function|inhibitor|event|monitor|finalizer> <name:str>',
	usageDelim: ' '
};
