{@link RichMenu} allows you to create a list of options organized in a paginated embed that users of your bot will be able to browse through reaction-based navigation.

A really simple example of a working {@link RichMenu} can be coded as follows:

```javascript
const { Command, RichMenu } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Test RichDisplay' });
	}

	async run(msg) {
		const menu = await new RichMenu()
			.addOption('First Option', 'This is an example.')
			.addOption('Another Option', 'This is another option.');

		const collector = await menu.run(await msg.send('Loading...'));

		const choice = await collector.selection;
		if (choice === null) {
			return collector.message.delete();
		}

		return collector.message.edit(new this.client.methods.Embed()
			.setTitle(menu.options[choice].name)
		);
	}

};
```

A more complete example could be done by listing all the commands and their descriptions, like this:

```javascript
const menu = new RichMenu(new this.client.methods.Embed()
	.setColor(0x673AB7)
	.setAuthor(this.client.user.username, this.client.user.avatarURL())
	.setTitle('Command List:')
	.setDescription('Use the arrow reactions to scroll between pages.\nUse number reactions to select an option.')
);

for (const command of this.client.commands.values()) {
	menu.addOption(command.name, command.description);
}

const collector = await menu.run(await msg.send('Loading commands...'));

const choice = await collector.selection;
if (choice === null) {
	return collector.message.delete();
}

const command = this.client.commands.get(menu.options[choice].name);

return collector.message.edit(new this.client.methods.Embed()
	.setDescription(`The chosen command is \`${command.name}\`.`)
);
```

> The code is contained in the block of the aforementioned command, inside the `async run(msg)` method but the menu or its options can easily be initialized within the constructor method or the {@link Command.init} method of the command.

## Code Analysis

We begin by creating a new {@link RichMenu} instance. We define a new [`MessageEmbed`](https://discord.js.org/#/docs/main/master/class/MessageEmbed) instance in it, which will be used as a template applied to each page of the menu.

```javascript
const menu = new RichMenu(new this.client.methods.Embed()
	/* ... */
);
```

Unlike {@tutorial RichDisplay} we won't be able to access the template or to define custom pages, we will instead be able to call {@link RichMenu.addOption} to define the options that will be shown in our menu.

Each option takes a title and a description that will be provided through the usage of this method:

```javascript
for (const command of /* ... */) {
	menu.addOption(command.name, command.description);
}
```

After listing all the options we can call {@link RichMenu.run} on our menu to render it.
We will store the resulting {@link ReactionHandler} to later access the selected option.

```javascript
const collector = await menu.run(await msg.send('Loading Commands...'));
```

We will also need to [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) for the user to select an option before continuing:

```javascript
const choice = await collector.selection;
```

After obtaining the index of the selected option we can access the option's name and description through our menu:

```javascript
const command = /* ... */(menu.options[choice].name);
```

In the example we use it to retrieve a {@link Command} piece from the {@link KlasaClient}.

```javascript
const command = this.client.commands.get(menu.options[choice].name);

return collector.message.edit(new this.client.methods.Embed()
	.setDescription(`The chosen command is \`${command.name}\`.`)
);
```

As you can see we can access the message instance in which our {@link RichMenu} is rendered. In the example we use it to edit the embed and replace the menu with the selected option's command name.

## Personalization

### Info Page

You can also set a page dedicated to showing information about your menu and its content through {@link RichDisplay.setInfoPage}.
This will allow you to access and edit a clone of your template if you defined one in the constructor of your {@link RichMenu}.

The page will be accessible to the user through its own "i" reaction.

### Custom Behavior Handling

To handle whether or not a user should trigger an action when interacting with the reactions applied to the embed you can provide a `filter` function, which will be called every time a user reacts with the embed.

A simple example for this would be a filter that only allows the user who executes the command to interact with it:

```javascript
menu.run(await msg.send('Loading commands...'), { filter: (reaction, user) => user === msg.author });
```
