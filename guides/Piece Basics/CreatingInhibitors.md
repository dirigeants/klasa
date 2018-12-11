Inhibitors are only ran on commands. They are used to check a variety of conditions before a
command is ever ran, such as checking if a user has the right amount of permissions to use a
command. Core inhibitors are loaded first, and if your code contains an inhibitor of the same name
it overrides the core inhibitor.

An inhibitor blocks a command by returning a truthy value (or a promise that fulfills with a
truthy value): either a string (which is shown to the user) or `true` (for silent rejections). It
doesn't matter whether you return or throw (or resolve or reject a returned promise); the value is
treated the same.

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

	async run(message, command) {
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

## Options

{@typedef InhibitorOptions}

## Examples

You can take a look at the [included core Inhibitors](https://github.com/dirigeants/klasa/tree/{@branch}/src/inhibitors), or see some [prebuilt Inhibitors on klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/inhibitors).

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
