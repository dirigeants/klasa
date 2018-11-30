Monitors are special in that they will always run on any message. This is particularly
useful when you need to do checking on the message, such as checking if a message
contains a vulgar word (profanity filter). They are almost completely identical to
inhibitors, the only difference between one is ran on the message, and the other
is ran on the command. Monitors are loaded as core first, and if your code contains
a monitor of the same name it overrides the core monitor.

Their structure is identical to inhibitors, being the only difference is that you
don't pass a command parameter to them.

```javascript
const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			name: 'yourMonitorName',
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreOthers: true,
			ignoreWebhooks: true,
			ignoreEdits: true,
			ignoreBlacklistedUsers: true,
			ignoreBlacklistedGuilds: true
		});
	}

	run(message) {
		// This is where you place the code you want to run for your monitor
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

{@typedef MonitorOptions}

>As with all other pieces, you can omit any optional option that match the default values.

## Examples

You can take a look at the [included core Monitors](https://github.com/dirigeants/klasa/tree/{@branch}/src/monitors), or see some [prebuilt Monitors on klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/monitors).

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
