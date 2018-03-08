While {@tutorial RichDisplay} allows you to create fully configurable paginated embeds, {@link RichMenu} allows you to define menus using a similar interface.

Unlike {@tutorial RichDisplay}, {@link RichMenu} manages a page's content and layout automatically and instead of calling {@link RichDisplay.addPage} that allows to customize the template (if provided), the user is presented with the {@link RichMenu.addOption} method, which only requires a `name` and a `body` and handles the organization of the options automatically.

Like {@tutorial RichDisplay} there is the option to define a template [`MessageEmbed`](https://discord.js.org/#/docs/main/master/class/MessageEmbed) in its constructor, but it will be applied automatically to each page of the menu.

An example of how {@link RichMenu} could be used is in a `help`-like command, this is a simple demo of how it would work:

```javascript
module.exports = class extends Command {

	constructor(...args) {
		super(...args);
		this.menu = new RichMenu(new this.client.methods.Embed()
			.setColor(0x673AB7)
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setTitle('Advanced Commands Help:')
			.setDescription('Use the arrow reactions to scroll between pages.\nUse number reactions to select an option.')
		);
	}

	async run(msg) {
		const collector = await this.menu.run(await msg.send('Loading commands...'));

		const choice = await collector.selection;
		if (choice === null) {
			return collector.message.delete();
		}

		const command = this.client.commands.get(this.menu.options[choice].name);
		const info = new this.client.methods.Embed()
			.setTitle(`Command \`${msg.guild.configs.prefix}${command.name}\``)
			.setDescription(typeof command.description === 'function' ? command.description(msg) : command.description)
			.addField('Usage:', command.usageString);

		if (command.extendedHelp && command.extendedHelp !== '') {
			const extendHelp = typeof command.extendedHelp === 'function' ? command.extendedHelp(msg) : command.extendedHelp;
			info.addField('Help:', extendHelp);
		}

		return msg.sendEmbed(info);
	}

	init() {
		for (const command of this.client.commands.values()) {
			this.menu.addOption(command.name, command.description);
		}
	}

};
```

> The code is designed to be placed in a command, inside the `async run(msg)` method but the menu or its options can easily be initialized within the constructor method or the {@link Command.init} method of the command.

## Code Analysis

The creation of the {@link RichMenu} is the same as the one displayed in {@tutorial RichDisplay}, like most of the code and personalization options. Please refer to the {@tutorial RichDisplay} tutorial.

We begin by adding the options, which will be listed in the same order we defined.

```javascript
for (const command of this.client.commands.values()) {
	menu.addOption(command.name, command.description);
}
```

After listing all the options we can call {@link RichMenu.run} on our menu to render it.
We will store the resulting {@link ReactionHandler} to later access the selected option.

```javascript
module.exports = class extends Command {

	async run(msg) {
		// ...
		const collector = await menu.run(await msg.send('Loading Commands...'));
		// ...
	}

};
```

We will also need to [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) for the user to select an option before continuing:

```javascript
module.exports = class extends Command {

	async run(msg) {
		// ...
		const choice = await collector.selection;
		// ...
	}

};
```

After obtaining the index of the selected option we can access the option's name through our menu:

```javascript
const command = this.client.commands.get(menu.options[choice].name);
```

Finally, we show the user the selected command by editing the original [`MessageEmbed`](https://discord.js.org/#/docs/main/master/class/MessageEmbed):

```javascript
const info = new this.client.methods.Embed()
	.setTitle(`Command \`${msg.guild.configs.prefix}${command.name}\``)
	.setDescription(typeof command.description === 'function' ? command.description(msg) : command.description)
	.addField('Usage:', command.usageString);

collector.message.edit(info);
```

## Personalization

Personalization is the same offered by {@tutorial RichDisplay}. You can define an Info Page through {@link RichDisplay.setInfoPage} and you can define custom behavior handling by defining a function in the `filter` argument of {@link RichMenuRunOptions}
