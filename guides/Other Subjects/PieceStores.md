Probably one of the most advanced and powerful tools in klasa is making your own stores and pieces, to do the things you want.

The most basic store:

```javascript
const { Store } = require('klasa');
const Something = require('./Something');

class SomethingStore extends Store {

	constructor(client) {
		super(client, 'somethings', Something);
	}

}

module.exports = SomethingStore;
```

The most basic Piece:

```javascript
const { Piece } = require('klasa');

class Something extends Piece {

	run() {
		// Defined in extension Classes
	}

}

module.exports = Something;
```

Now that probably doesn't give you much idea on what that means or why. But take the following idea: You are making a starboard for your bot, and you need raw events for messageReactionAdd. A switch case for rawEvents would do the trick, but it would be a lot of hassle if you wanted to add *more* raw events. So lets make a piece store for rawEvents, which will make loading, reloading and creating them much easier.
```javascript
const { Store } = require('klasa');
const RawEvent = require('./RawEvent');

class RawEventStore extends Store {

	constructor(client) {
		super(client, 'rawEvents', RawEvent);
	}

}

module.exports = RawEventStore;
```

Tbh, not that different than a simple store. Although be sure to take a look at all of the core stores. Sometimes, like in the case of Providers, we want to run a shutdown method before we delete the collection entry. In that case we also want to overwrite the clear method, and loop over the collection doing this.delete() so that all entries are shutdown properly.

```javascript
const { Piece } = require('klasa');

class RawEvent extends Piece {

	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

        // not a lot of options, but im keeping it simple for the sake of the guide
		this.enabled = options.enabled || true;
	}

}

module.exports = RawEvent;
```

Not a lot of options here, so most times you won't be needing your constructor anyway.

```javascript
const RawEvent = require('../RawEvent');

module.exports = class extends RawEvent {

	async run(data) {

	}
};
```

This is great and all, but we need to register these pieces/store:

```javascript
const { Client } = require('klasa');
const RawEventStore = require('./RawEventStore');

class MyBot extends Client {

	constructor(...args) {
		super(...args);

		// Make a new RawEventStore and attach it to client
		this.rawEvents = new RawEventStore();

		// Register the RawEventStore to be loaded, init, and available
		// to be used as an arg to be looked up in commands
		this.registerStore(this.rawEvents);
	}

}

new MyBot().login('token-goes-here');
```

Now to actually make our raw events work! This code goes in events/raw.

```javascript
const { Event } = require('klasa');
const { Constants: { Events } } = require('discord.js');

module.exports = class extends Event {

	async run(data) {
		const event = Events[data.t];
		if (this.client.rawEvents.has(event)) {
			const rawEvent = this.client.rawEvents.get(event);
			if (rawEvent.enabled) rawEvent.run(data.d);
		}
	}


};
```

Now an example raw event, we'll have messageReactionAdd, which will go in rawEvents/messageReactionAdd

```javascript
const RawEvent = require('../RawEvent');

module.exports = class extends RawEvent {

	async run({ channel_id, message_id, user_id }) {
		console.log(channel_id, message_id, user_id);
	}
};
```
