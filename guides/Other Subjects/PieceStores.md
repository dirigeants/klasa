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

Now that probably doesn't give you much idea on what that means or why it is useful. But take the following idea: You are making a starboard for your bot, and you need raw events for messageReactionAdd. A switch case for rawEvents would do the trick, but it would be a lot of hassle if you wanted to add *more* raw events. So lets make a piece store for rawEvents, which will make loading, reloading and creating them much easier.

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

See? That's not that different from a simple store. Although be sure to take a look at all of the core stores. Sometimes, like in the case of Providers, we want to run a shutdown method before we delete the collection entry. In that case we also want to overwrite the clear method, and loop over the collection doing this.delete() so that all entries are shutdown properly.

```javascript
const { Piece } = require('klasa');

class RawEvent extends Piece {

	run() {
		// Defined in extension Classes
	}

}

module.exports = RawEvent;
```

There aren't a lot of options here, so you won't need the constructor most of the times anyways.

```javascript
const RawEvent = require('../RawEvent');

module.exports = class extends RawEvent {

	async run(data) {
		// Overwrite this in your file
	}

};
```

This is great and all, but we need to register the store:

```javascript
const { Client } = require('klasa');
const RawEventStore = require('./RawEventStore');

class MyClient extends Client {

	constructor(...args) {
		super(...args);

		// Make a new RawEventStore and attach it to client
		this.rawEvents = new RawEventStore();

		// Register the RawEventStore to be loaded, init, and available
		// to be used as an arg to be looked up in commands
		this.registerStore(this.rawEvents);
		// Note: You will likely want to make a custom Argument for this new piece type
	}

}

new MyClient({ pieceDefaults: { rawEvents: { enabled: true } } }).login('token-goes-here');
```

Now, to make our raw event store actually work, we're going to add this code in `events/raw.js` to run on every raw event received

```javascript
const { Event } = require('klasa');

module.exports = class extends Event {

	async run(packet) {
		const rawEvent = this.client.rawEvents.get(packet.t);
		if (rawEvent && rawEvent.enabled) {
			rawEvent.run(packet.d);
		}
	}

};
```

Now, for an example event, we'll have MESSAGE_REACTION_ADD, which will go in `rawEvents/MESSAGE_REACTION_ADD.js` and will run on all added reactions

```javascript
const RawEvent = require('../RawEvent');

module.exports = class extends RawEvent {

	async run(data) {
		// Data is whatever Discord sent.
		// If you don't know what the data object can have, you should log it.
		console.log(data);
	}

};
```
