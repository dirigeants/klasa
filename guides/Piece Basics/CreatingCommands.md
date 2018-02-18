New commands are created in the `./commands/` folder, where subfolders are the categories offered in the help command. For instance adding `./commands/Misc/test.js` will create a command named `test` in the `Misc` category. Subcategories can also be created by adding a second folder level.

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'yourCommandName',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 0,
			bucket: 1,
			aliases: [],
			permLevel: 0,
			botPerms: [],
			requiredConfigs: [],
			description: '',
			quotedStringSupport: false,
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		});
	}

	async run(msg, [...params]) {
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

## Configuration

| Name                    | Default                          | Type    | Description                                                                 |
| ----------------------- | -------------------------------- | ------- | --------------------------------------------------------------------------- |
| **name**                | `theFileName`                    | string  | The name of the command                                                     |
| **enabled**             | `true`                           | boolean | Whether the command is enabled or not                                       |
| **runIn**               | `['text', 'dm', 'group']`        | Array   | What channel types the command should run in                                |
| **cooldown**            | `0`                              | number  | The amount of time before the user can run the command again in seconds     |
| **bucket**              | `1`                              | number  | The amount of successful command runs required before applying ratelimits   |
| **aliases**             | `[]`                             | Array   | Any command aliases                                                         |
| **permLevel**           | `0`                              | number  | The required permission level to use the command                            |
| **botPerms**            | `[]`                             | Array   | The required Discord permissions for the bot to use this command            |
| **requiredConfigs**     | `[]`                             | Array   | The required guild configs to use this command                              |
| **description**         | `''`                             | string  | The help description for the command                                        |
| **usage**               | `''`                             | string  | The usage string for the command - See {@tutorial UnderstandingUsageStrings}|
| **usageDelim**          | `''`                             | string  | The string to deliminate the command input for usage                        |
| **quotedStringSupport** | `false`                          | boolean | Whether args for this command should not deliminated inside quotes          |
| **extendedHelp**        | `'No extended help available.'`  | string  | Extended help strings                                                       |

> All commands are required to return an [Object Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) you can do that by adding the `async` keyword to the function, there's no need to change anything else.

> All {@link CommandOptions command options} are optional, the code above shows all default values. You can delete any line with an optional value that matches the default value.

>`[...params]` represents a variable number of arguments give when the command is run. The name of the arguments in the array (and their count) is determined by the `usage` property and its given arguments.

## Further Reading:

- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}
