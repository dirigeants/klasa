Inhibitors are only ran on commands. They are used to check a variety of conditions
before a command is ever ran, such as checking if a user has the right amount of permissions
to use a command. Inhibitors are loaded as core first, and if your code contains a inhibitor
of the same name it overrides the core inhibitor.

Their structure is restricted, meaning to work they must be defined exactly like
the following example. They *must* return an [Object Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).
You can accomplish this by adding the `async` identifier, or returning a new promise.
An inhibitor blocks a command by rejecting the promise, either with a string or `undefined` for silent rejections.

```javascript
const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, {
			name: 'myInhibitorName',
			enabled: true,
			spamProtection: false
		});
	}

	async run(msg, cmd) {
		// This is where you place the code you want to run for your inhibitor
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

| Name               | Default       | Type    | Description                                                                                  |
| ------------------ | ------------- | ------- | -------------------------------------------------------------------------------------------- |
| **name**           | `theFileName` | string  | The name of the inhibitor                                                                    |
| **enabled**        | `true`        | boolean | Whether the inhibitor is enabled or not                                                      |
| **spamProtection** | `false`       | boolean | If this inhibitor is meant for spamProtection (disables the inhibitor while generating help) |

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}
