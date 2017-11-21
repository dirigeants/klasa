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
			ignoreOthers: true
		});
	}

	run(msg) {
		// This is where you place the code you want to run for your monitor
	}

	async init() {
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
```

## Configuration
- **name**: `default: ` `type: string` The name of the monitor
- **enabled**: `default: true` `type: boolean` Represents if the inhibitor should be enabled or disabled, it must be a boolean. Set to false to completely disable this monitor.
- **ignoreBots**: `default: true` `type: boolean` Set this to true if you want the monitor to ignore bots.
- **ignoreSelf**: `default: true` `type: boolean` Set this to true if you want the monitor to ignore the client user (the bot account, yourself if it's a selfbot).
- **ignoreOthers**: `default: true` `type: boolean` Whether the monitor ignores others or not

>As with all other pieces, you can omit any optional Configuration that match the default values.


## Further Reading:
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingProviders}