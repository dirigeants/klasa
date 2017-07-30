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
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};

```

## Configuration
- **enabled**: Represents if the inhibitor should be enabled or disabled, it must be
a boolean. Set to false to completely disable this inhibitor, it cannot be forcefully enabled.
- **spamProtection**: Represents if the inhibitor is meant to prevent bot/command spam. Setting
spamProtection to true will prevent the inhibitor to run while doing tasks such as generating help.


## Further Reading:
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}