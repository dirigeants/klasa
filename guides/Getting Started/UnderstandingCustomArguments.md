One of the best features from Klasa's (and Komada's) usage is that you can extend its functionality by adding new types. To achieve this, we will use our {@link Extendable}s. We will create an empty extendable, called `emoji.js`, and aim it to Klasa:

> **Note**: The following argument type type is already included in klasa, and is just an explanation of how it works.

```javascript
const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['ArgResolver'], klasa: true });
	}

	extend() {
		// `this` refers to the parent class, and not this one. You cannot use super
	}

};
```

> **Note**: that the class we want to extend to add new types to usage is **{@link ArgResolver}**, which belongs to `klasa`, so we put only `'ArgResolver'` to the classes we want to extend, and select `klasa: true` in the {@link ExtendableOptions}.

Each method in {@link ArgResolver} takes 3 parameters:

| Name             | Type                 | Description                            |
| ---------------- | -------------------- | -------------------------------------- |
| **arg**          | string               | The parameter given to parse           |
| **possible**     | {@link Possible}     | The Possible instance that is running  |
| **msg**          | {@link KlasaMessage} | The message that triggered the command |

```javascript
const { Extendable } = require('klasa');
const REGEX_EMOJI = /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/;

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['ArgResolver'], klasa: true });
	}

	async extend(arg, possible, msg) {
		const results = REGEX_EMOJI.exec(arg);
		const emoji = results ? this.client.emojis.get(results[1]) : null;
		if (emoji) return emoji;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
```

> **Note**: All methods from ArgResolver must return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

How does the new extendable or custom argument work?

1. Let's consider arg is `<:klasa:354702113147846666>`. The result of `exec`uting `REGEX_EMOJI` on that string gives an array-like object: `['<:klasa:354702113147846666>', '354702113147846666', index: 0, input: '<:klasa:354702113147846666>']`.
1. There are cases the argument does not match, in that case, `results` would be `null`. So we verify its existence and get the first grouping match: `(\d{17,19})`, which gets the **id** of the emoji, and as we see in the result, it is in the second index: `'354702113147846666'`, and we get the emoji with said id.
1. If `results` was null, `emoji` would be `null` too due to the ternary condition, but there is also the possibility of emoji being undefined: when the client does not have the Emoji instance cached or is in a guild the bot is not in. The case is, **if the emoji is valid and found, we should return it**.
1. If the emoji was valid and found, we do not run the two next steps, 4 and 5. The fourth line of code inside `extend` handles optional arguments: if it's optional and it's not a repeating tag, it should not throw, but return null.
1. Finally, the argument was required and/or looping/repeating, so we should throw an error. That error must be a string and you can use i18n to have localized errors.

And now, you can use this type in a command! For example, the following:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Get the name of an emoji.',
			usage: '<emoji:emoji>'
		});
	}

	run(msg, [emoji]) {
		return msg.sendMessage(`The name of the emoji ${emoji} is: ${emoji.name}`);
	}

};
```
