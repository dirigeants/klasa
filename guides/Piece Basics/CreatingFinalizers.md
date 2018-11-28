Finalizers are functions run after successful commands, and this is the reason of why all commands **must** return an
[Object Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Finalizers have the following syntax:

```javascript
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'myFinalizerName',
			enabled: true
		});
	}

	run(message, command, response, runTime) {
		// This is where you place the code you want to run for your finalizer
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

{@typedef PieceOptions}

## Arguments:

- **message**: The message object.
- **command**: The command used (may not be the same as message.command).
- **response**: The value the command returns.
- **runTime**: The time it took to run the command.

## Examples

You can take a look at the [included core Finalizers](https://github.com/dirigeants/klasa/tree/{@branch}/src/finalizers), or see some [prebuilt Finalizers on klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/finalizers).

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
