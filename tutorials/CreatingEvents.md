# Creating Event Handlers

Events are placed in `./events/` and their filename must be `eventName.js`. If a conflicting event is present in both the core and your client, *both* are loaded and will run when that event is triggered.

Their structure is the following:

```javascript
const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'yourEventName');
	}

	run(...params) {
		// This is where you place the code you want to run for your command
	}

	init() {
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
```

Where `...params` are arguments you would *normally* get from those events. For example, while the `ready` event would only have none, the `guildMemberAdd` event would be `member`.
