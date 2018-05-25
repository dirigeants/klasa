Events are placed in `./events/`. If a conflicting event is present in both the core and your client, *only your client version* is loaded and will run when that event is triggered.

Their structure is the following:

```javascript
const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'yourEventName',
			enabled: true,
			event: 'theEventToListenTo',
			emitter: client,
			once: false
		});
	}

	run(...params) {
		// This is where you place the code you want to run for your event
	}

	async init() {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 */
	}

};
```

Where `...params` are arguments you would *normally* get from those events. For example, while the `ready` event would only have none, the `guildMemberAdd` event would be `member`.

## Configuration

| Name        | Default       | Type         | Description                         |
| ----------- | ------------- | ------------ | ----------------------------------- |
| **name**    | `theFileName` | string       | The name of the event               |
| **enabled** | `true`        | boolean      | Whether the event is enabled or not |
| **event**   | `theFileName` | string       | The event to listen to              |
| **emitter** | `this.client` | EventEmitter | The emitter the event belongs to    |
| **once**    | `false`       | boolean      | If the event should only run once   |

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}
