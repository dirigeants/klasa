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

	run(msg, mes, start) {
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

## Configuration

| Name        | Default       | Type    | Description                             |
| ----------- | ------------- | ------- | --------------------------------------- |
| **name**    | `theFileName` | string  | The name of the finalizer               |
| **enabled** | `true`        | boolean | Whether the finalizer is enabled or not |

## Arguments:

- **msg**: The message object.
- **mes**: The value the command returns.
- **start**: The time in which the command has been run, by `performance.now()`, ideal for benchmarking.

## Existing finalizers

Klasa has two preinstalled finalizers: `commandCooldown` and `commandlogging`.

### commandCooldown

This finalizer applies the cooldown from the commands' `Command.cooldown` (if exists and its value is above `0`).

### commandlogging

This finalizer, unlike commandCooldown, it's only run if the property `cmdLogging` of
your Klasa's client configs is set to `true`. It prints in the cmd prompt the command run, where,
the user who ran it, and the time it took to process the command.

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}
