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
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
```

## Configuration
- **enabled**: `default: theFileName` `type: string` Represents if the inhibitor should be enabled or disabled, it must be
a boolean. Set to false to completely disable this inhibitor, it cannot be forcefully enabled.
- **runIn**: `default: ['text', 'dm', 'group']` `type: array` The channels types this command is allowed to run in.
- **cooldown**: `default: 0` `type: number` The time in seconds before a user can use this command again. (Does not apply to bot owners)
- **aliases**: `default: []` `type: array` Other names this command will respond to.
- **permLevel**: `default: 0` `type: number` The permission level required to run this command. From 0 as everyone, to 10 as bot owner only with default permlevels.
- **botPerms**: `default: []` `type: array` The permissions needed to run the command, based on Permissions in discord.js.
- **requiredSettings**: `default: []` `type: array` Any required guild settings, that must be set before you can use this command.
- **description**: `default: ''` `type: string` The command description.
- **quotedStringSupport**: `default: this.client.config.quotedStringSupport` `type: boolean` Whether args for this command should not be deliminated inside quotes. Default is undefined or false. Change to true to use it.
- **usage**: `default: ''` `type: string` The expected arguments for this command. See {@tutorial UnderstandingUsageStrings} for information on how to use this.
- **usageDelim**: `default: null` `type: string` The deliminator for how the usage will be deliminated. Popular ones are `' '` (a space), and `', '` (a comma space).
- **extendedHelp**: `default: 'No extended help available.'` `type: string` A more in depth help string if you would like to define it.

| Name | Default | Type | Description |
| --- | --- | --- | --- |
| **name** | theFileName | string | The name of the command |
| **enabled** | true | boolean | Whether the command is enabled or not |
| **runIn** | ['text', 'dm', 'group'] | Array | What channel types the command should run in |
| **cooldown** | 0 | number | The amount of time before the user can run the command again in seconds |
| **aliases** | [] | Array | Any comand aliases |
| **permLevel** | 0 | number | The required permission level to use the command |
| **botPerms** | [] | Array | The required Discord permissions for the bot to use this command |
| **requiredSettings** | [] | Array | The required guild settings to use this command |
| **description** | '' | string | The help description for the command |
| **usage** | '' | string | The usage string for the command |
| **usageDelim** | '' | string | The string to deliminate the command input for usage |
| **quotedStringSupport** | KlasaClientConfig | boolean | Wheter args for this command should not deliminated inside quotes |
| **extendedHelp** | 'No extended help available.' | string | Extended help strings |


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
