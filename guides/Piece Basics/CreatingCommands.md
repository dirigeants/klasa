New commands are created in the `./commands/` folder, where subfolders are the categories offered in the help command. For instance adding `./commands/Misc/test.js` will create a command named `test` in the `Misc` category. Subcategories can also be created by adding a second folder level.

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'yourCommandName',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 0,
			deletable: false,
			bucket: 1,
			aliases: [],
			guarded: false,
			nsfw: false,
			permissionLevel: 0,
			requiredPermissions: [],
			requiredSettings: [],
			subcommands: false,
			description: '',
			quotedStringSupport: false,
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		});
	}

	async run(message, [...params]) {
		// This is where you place the code you want to run for your command
	}

	async init() {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 */
	}

};
```

## Options

{@typedef CommandOptions}

> All commands are required to return an [Object Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) you can do that by adding the `async` keyword to the function, there's no need to change anything else.

> All {@link CommandOptions command options} are optional, the code above shows all default values. You can delete any line with an optional value that matches the default value.

>`[...params]` represents a variable number of arguments give when the command is run. The name of the arguments in the array (and their count) is determined by the `usage` property and its given arguments.

## Examples

You can take a look at the [included core Commands](https://github.com/dirigeants/klasa/tree/{@branch}/src/commands), or see some [prebuilt Commands on klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/commands).

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
