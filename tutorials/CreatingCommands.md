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
            aliases: [],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: '',
            quotedStringSupport: this.client.config.quotedStringSupport,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
		});
	}

	async run(msg, [...params]) {
		// This is where you place the code you want to run for your command
	}

	async init() {
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
```

## Configuration
- **enabled**: Represents if the inhibitor should be enabled or disabled, it must be
a boolean. Set to false to completely disable this inhibitor, it cannot be forcefully enabled.
- **runIn**: The channels types this command is allowed to run in.
- **cooldown**: The time in seconds before a user can use this command again. (Does not apply to bot owners)
- **aliases**: Other names this command will respond to.
- **permLevel**: The permission level required to run this command. From 0 as everyone, to 10 as bot owner only with default permlevels.
- **botPerms**: The permissions needed to run the command, based on Permissions in discord.js.
- **requiredSettings**: Any required guild settings, that must be set before you can use this command.
- **description**: The command description.
- **quotedStringSupport**: Whether args for this command should not be deliminated inside quotes. Default is undefined or false. Change to true to use it.
- **usage**: The expected arguments for this command. See {@tutorial UnderstandingUsageStrings} for information on how to use this.
- **usageDelim**: The deliminator for how the usage will be deliminated. Popular ones are `' '` (a space), and `', '` (a comma space).
- **extendedHelp**: A more in depth help string if you would like to define it.

> All commands are required to return an [Object Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) you can do that by adding the `async` keyword to the function, there's no need to change anything else.

> All [command options]{@link CommandOptions} are optional, the code above shows all default values. You can delete any line with an optional value that matches the default value.

>`[...params]` represents a variable number of arguments give when the command is run. The name of the arguments in the array (and their count) is determined by the `usage` property and its given arguments.


## Further Reading:
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
