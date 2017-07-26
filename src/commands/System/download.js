const { Command } = require('klasa');
const snek = require('snekfetch');
const fs = require('fs-nextra');
const { dirname, resolve } = require('path');
const vm = require('vm');

const piecesURL = 'https://raw.githubusercontent.com/dirigeants/komada-pieces/master/';
const types = ['commands', 'monitors', 'inhibitors', 'providers', 'finalizers', 'extendables'];

const mod = { exports: {} };

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enable: false,
			permLevel: 10,
			description: 'Downloads a piece, either from a link or our Pieces Repository, and installs it.',
			usage: '<commands|monitors|inhibitors|providers|finalizers|extendables|url:url> [location:str] [folder:str]',
			usageDelim: ' '
		});
	}

	async run(msg, [link, piece, folder = 'Downloaded']) {
		const proposedURL = types.includes(link) ? `${piecesURL}${link}/${piece}.js` : link;
		if (link === 'commands' && !/\w+\/\w+/.test(piece)) {
			return msg.sendMessage(`${msg.author} | You provided an invalid or no subfolder for a command. Please provide a valid folder name from the Pieces Repo. Example: Misc/test`);
		}

		const text = await this.requestAndCheck(proposedURL).catch(err => { throw `${msg.author} | ${err}`; });
		return this.process(msg, text, link, folder);
	}

	async requestAndCheck(newURL) {
		const { text } = await snek.get(newURL)
			.catch((error) => {
				if (error.message === 'Unexpected token <') {
					throw `An error has occured: **${error.message}** | This typically happens when you try to download a file from a link that isn't raw github information. Try a raw link instead!`;
				}
				if (error.message === 'Not Found') throw `An error has occured: **${error.message}** | This typically happens when you try to download a piece that doesn't exist. Try verifying it exists.`;
				throw `An error has occured: **${error}** | We're not sure what happened here... Report this to our Developers to get it checked out!`;
			});
		return text;
	}

	async process(msg, text, link, folder) {
		try {
			vm.runInNewContext(text, { module: mod, exports: mod.exports, require }, { timeout: 500 });
		} catch (err) {
			return this.client.emit('log', err, 'error');
		}

		const { name } = mod.exports;
		const description = mod.exports.description || 'No description provided.';
		const type = mod.exports.type || link;
		const modules = mod.exports.requiredModules || 'No required modules.. Yay!';

		try {
			this.runChecks(type, name);
			if (mod.exports.selfbot && this.client.user.bot) throw `I am not a selfbot, so I cannot download nor use ${name}.`;
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

		await msg.sendMessage([
			`Are you sure you want to load the following ${type.slice(0, -1)} into your bot?`,
			`This will also install all required modules. This prompt will abort after 20 seconds.${code.join('\n')}`
		]);
		const collector = msg.channel.createMessageCollector(mes => mes.author === msg.author, { time: 20000 });

		collector.on('collect', (mes) => {
			if (mes.content.toLowerCase() === 'no') collector.stop('aborted');
			if (mes.content.toLowerCase() === 'yes') collector.stop('success');
		});

		collector.on('end', async (collected, reason) => {
			if (reason === 'aborted') return msg.sendMessage(`📵 Load aborted, ${type.slice(0, -1)} not installed.`);
			else if (reason === 'time') return msg.sendMessage(`⏲ Load aborted, ${type.slice(0, -1)} not installed. You ran out of time.`);
			await msg.sendMessage(`📥 \`Loading ${type.slice(0, -1)}\``).catch(err => this.client.emit('log', err, 'error'));
			if (Array.isArray(modules) && modules.length > 0) {
				await this.client.funcs.installNPM(modules.join(' '))
					.catch((err) => {
						this.client.emit('error', err);
						process.exit();
					});
			}
			return this.load(msg, type, text, name, mod.exports.category || this.client.funcs.toTitleCase(folder));
		});

		return true;
	}

	runChecks(client, type, name) {
		if (!name) throw 'I have stopped the load of this piece because it does not have a name value, and I cannot determine the file name without it. Please ask the Developer of this piece to add it.';
		if (!type) throw 'I have stopped the load of this piece because it does not have a type value, and I cannot determine the type without it. Please ask the Developer of the piece to add it.';
		if (!types.includes(type)) throw "I have stopped the loading of this piece because its type value doesn't match those we accept. Please ask the Developer of the piece to fix it.";
		if (client[type].has(name)) throw `That ${type.slice(0, -1)} already exists in your bot. Aborting the load.`;
	}

	async load(msg, type, text, name, category) {
		const dir = this.client[type].userDir;
		const file = type === 'commands' ? [...category, name] : name;
		const fullPath = type === 'commands' ? resolve(dir, ...file) : resolve(dir, file);
		await msg.sendMessage(`📥 \`Loading ${type.slice(0, -1)} into ${fullPath}.js...\``);
		await fs.ensureDir(dirname(fullPath)).catch(err => this.client.emit('log', err, 'error'));
		await fs.writeFile(`${fullPath}.js`, text);
		return this.client[type].load(dir, file)
			.then(piece => msg.sendMessage(`📥 Successfully loaded ${piece.type}: ${piece.name}`))
			.catch(response => {
				msg.sendMessage(`📵 Command load failed ${name}\n\`\`\`${response}\`\`\``);
				return fs.unlink(`${fullPath}.js`);
			});
	}

};
