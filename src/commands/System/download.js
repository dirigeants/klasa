const { Command } = require('klasa');
const snek = require('snekfetch');
const fs = require('fs-nextra');
const { sep, resolve } = require('path');
const vm = require('vm');

const piecesURL = 'https://raw.githubusercontent.com/dirigeants/komada-pieces/master/';
const types = ['commands', 'functions', 'monitors', 'inhibitors', 'providers', 'finalizers', 'extendables'];

const mod = { exports: {} };

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'download', {
			enable: false,
			permLevel: 10,
			description: 'Downloads a piece, either from a link or our Pieces Repository, and installs it.',
			usage: '<commands|functions|monitors|inhibitors|providers|finalizers|extendables|url:url> [location:str] [folder:str]',
			usageDelim: ' '
		});
	}

	async run(msg, [link, piece, folder = 'Downloaded']) {
		const proposedURL = types.includes(link) ? `${piecesURL}${link}/${piece}.js` : link;
		if (link === 'commands' && !/\w+\/\w+/.test(piece)) {
			return msg.sendMessage(`${msg.author} | You provided an invalid or no subfolder for a command. Please provide a valid folder name from the Pieces Repo. Example: Misc/test`);
		}

		return requestAndCheck(proposedURL)
			.then(text => process(this.client, msg, text, link, folder))
			.catch(err => msg.sendMessage(`${msg.author} | ${err}`));
	}

};

// I CBA to sort this out right now

const process = async (client, msg, text, link, folder) => {
	try {
		vm.runInNewContext(text, { module: mod, exports: mod.exports, require }, { timeout: 500 });
	} catch (err) {
		return client.emit('log', err, 'error');
	}

	const name = mod.exports.name;
	const description = mod.exports.description || 'No description provided.';
	const type = mod.exports.type || link;
	const modules = mod.exports.requiredModules || 'No required modules.. Yay!';

	try {
		runChecks(client, type, name);
		if (mod.exports.selfbot && client.user.bot) throw `I am not a selfbot, so I cannot download nor use ${name}.`;
	} catch (err) {
		return msg.sendMessage(`${msg.author} | ${err}`);
	}

	const code = [
		'```asciidoc',
		'=== NAME ===',
		name,
		'\n=== DESCRIPTION ===',
		description,
		'\n=== REQUIRED MODULES ===',
		modules,
		'```'
	];

	await msg.sendMessage(`Are you sure you want to load the following ${type} into your bot? This will also install all required modules. This prompt will abort after 20 seconds.${code.join('\n')}`);
	const collector = msg.channel.createMessageCollector(mes => mes.author === msg.author, { time: 20000 });

	collector.on('collect', (mes) => {
		if (mes.content.toLowerCase() === 'no') collector.stop('aborted');
		if (mes.content.toLowerCase() === 'yes') collector.stop('success');
	});

	collector.on('end', async (collected, reason) => {
		if (reason === 'aborted') return msg.sendMessage(`📵 Load aborted, ${type} not installed.`);
		else if (reason === 'time') return msg.sendMessage(`⏲ Load aborted, ${type} not installed. You ran out of time.`);
		await msg.sendMessage(`📥 \`Loading ${type}\``).catch(err => client.emit('log', err, 'error'));
		if (Array.isArray(modules) && modules.length > 0) {
			await client.funcs.installNPM(modules.join(' '))
				.catch((err) => {
					client.emit('error', err);
					process.exit();
				});
		}
		return load[type](client, msg, type, text, name, mod.exports.category || client.funcs.toTitleCase(folder));
	});

	return true;
};

const requestAndCheck = async newURL => snek.get(newURL)
	.then(data => data.text)
	.catch((error) => {
		if (error.message === 'Unexpected token <') throw `An error has occured: **${error.message}** | This typically happens when you try to download a file from a link that isn't raw github information. Try a raw link instead!`;
		if (error.message === 'Not Found') throw `An error has occured: **${error.message}** | This typically happens when you try to download a piece that doesn't exist. Try verifying it exists.`;
		throw `An error has occured: **${error}** | We're not sure what happened here... Report this to our Developers to get it checked out!`;
	});

const runChecks = (client, type, name) => {
	if (!name) throw 'I have stopped the load of this piece because it does not have a name value, and I cannot determine the file name without it. Please ask the Developer of this piece to add it.';
	if (!type) throw 'I have stopped the load of this piece because it does not have a type value, and I cannot determine the type without it. Please ask the Developer of the piece to add it.';
	if (!types.includes(type)) throw "I have stopped the loading of this piece because its type value doesn't match those we accept. Please ask the Developer of the piece to fix it.";
	switch (type) {
		case 'commands':
			if (client.commands.has(name)) throw 'That command already exists in your bot. Aborting the load.';
			break;
		case 'functions':
			if (client.funcs[name]) throw 'That function already exists in your bot. Aborting the load.';
			break;
		case 'inhibitors':
			if (client.commandInhibitors.has(name)) throw 'That command inhibitor already exists in your bot. Aborting the load.';
			break;
		case 'monitors':
			if (client.messageMonitors.has(name)) throw 'That message monitor already exists in your bot. Aborting the load.';
			break;
		case 'providers':
			if (client.providers.has(name)) throw 'That provider already exists in your bot. Aborting the load.';
			break;
		case 'finalizers':
			if (client.commandFinalizers.has(name)) throw 'That finalizer already exists in your bot. Aborting the load.';
			break;
    // no default
	}
};

const load = {
	commands: async (client, msg, type, text, name, category) => {
		const dir = resolve(`${client.clientBaseDir}/commands/${category}/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text);
		return client.funcs.reloadCommand(`${category}/${name}`)
			.then(message => msg.sendMessage(`📥 ${message}`))
			.catch((response) => {
				msg.sendMessage(`📵 Command load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${dir}${name}.js`);
			});
	},
	functions: async (client, msg, type, text, name) => {
		const dir = resolve(`${client.clientBaseDir}/functions/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text).catch(err => client.emit('log', err, 'error'));
		return client.funcs.reloadFunction(name)
			.then(message => msg.sendMessage(`📥 ${message}`))
			.catch((response) => {
				msg.sendMessage(`📵 Function load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${dir}${name}.js`);
			});
	},
	inhibitors: async (client, msg, type, text, name) => {
		const dir = resolve(`${client.clientBaseDir}/inhibitors/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text).catch(err => client.emit('log', err, 'error'));
		return client.funcs.reloadInhibitor(name)
			.then(message => msg.sendMessage(`📥 ${message}`))
			.catch((response) => {
				msg.sendMessage(`📵 Inhibitor load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${dir}${name}.js`);
			});
	},
	monitors: async (client, msg, type, text, name) => {
		const dir = resolve(`${client.clientBaseDir}/monitors/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text).catch(err => client.emit('log', err, 'error'));
		return client.funcs.reloadMessageMonitor(name)
			.then(message => msg.sendMessage(`📥 ${message}`))
			.catch((response) => {
				msg.sendMessage(`📵 Monitor load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${dir}${name}.js`);
			});
	},
	providers: async (client, msg, type, text, name) => {
		const dir = resolve(`${client.clientBaseDir}/providers/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text).catch(err => client.emit('log', err, 'error'));
		return client.funcs.reloadProvider(name)
			.then(message => msg.sendMessage(`📥 ${message}`))
			.catch((response) => {
				msg.sendMessage(`📵 Provider load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${dir}${name}.js`);
			});
	},
	finalizers: async (client, msg, type, text, name) => {
		const dir = resolve(`${client.clientBaseDir}/finalizers/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text).catch(err => client.emit('log', err, 'error'));
		return client.funcs.reloadFinalizer(name)
			.then(message => msg.sendMessage(`📥 ${message}`))
			.catch((response) => {
				msg.sendMessage(`📵 Finalizer load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${dir}${name}.js`);
			});
	},
	extendables: async (client, msg, type, text, name) => {
		const dir = resolve(`${client.clientBaseDir}/extendables/`) + sep;
		await msg.sendMessage(`📥 \`Loading ${type} into ${dir}${name}.js...\``);
		await fs.ensureDir(dir).catch(err => client.emit('log', err, 'error'));
		await fs.writeFile(`${dir}${name}.js`, text).catch(err => client.emit('log', err, 'error'));
		return msg.sendMessage(`Your extendable ${name} will be loaded after a reboot.`);
	}
};
