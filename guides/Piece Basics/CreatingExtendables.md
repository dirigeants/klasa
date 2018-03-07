Extendables are functions that extend current Discord.js classes by adding methods or properties.

Extendables have the following syntax:

<!-- eslint-disable no-dupe-class-members, no-inline-comments -->

```javascript
const { Extendable } = require('klasa');

class MyExtendable extends Extendable {

	constructor(...args) {
		super(...args, {
			appliesTo: [],
			name: 'nameOfExtendable',
			enabled: true,
			klasa: false
		});
	}

	// Getters

	get extend() {
		// Make a getter
	}

	// Setters

	set extend(value) {
		// Make a setter
	}

	// Methods

	extend() {
		// Make a method
	}

	// Static Methods

	static extend() {
		// Make a static method
	}

}

// Static Properties

MyExtendable.extend = 'wew'; // Make a static property

module.exports = MyExtendable;
```

<!-- eslint-enable no-dupe-class-members, no-inline-comments -->

## Understanding extendable settings

```javascript
const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, {
			appliesTo: [],
			name: 'nameOfExtendable',
			enabled: true,
			klasa: false
		});
	}

};
```

| Name          | Default       | Type          | Description                                            |
| ------------- | ------------- | ------------- | ------------------------------------------------------ |
| **name**      | `theFileName` | string        | The name of the method/property                        |
| **enabled**   | `true`        | boolean       | If the extendable is enabled or not                    |
| **klasa**     | `false`       | boolean       | If the extendable is for Klasa instead of Discord.js   |
| **appliesTo** | `[]`          | Array<string> | An array of affected classes from Discord.js or Klasa. |

> You can find all extendable classes for [Discord.js](https://github.com/discordjs/discord.js/blob/master/src/index.js) and [Klasa](https://github.com/dirigeants/klasa/blob/master/src/index.js) in those respective links.

## Understanding extend

The extend method can only be a setter, getter, method, or static methods/properties. You cannot define multiple in one file as the above example may imply.

## Examples

Imagine we want to extend the [Message](https://discord.js.org/#/docs/main/master/class/Message) class
so it has a method called `prompt` so you can do `Message#prompt("Are you sure you want to continue?")`
everywhere in your code, resolving if the user confirms the prompt, or rejecting otherwise. Then, your
extendable is likely to be like the following:

> You can extend the Message object with this because you're likely to lock the prompt for a user in a channel,
and Message has both properties of `author` and `channel`.

```js
const { Extendable } = require('klasa');
const prompt = require('../../prompt');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['Message'], name: 'prompt' });
	}

	extend() {
		return prompt();
	}

};
```

Where `prompt()` is your prompt function.

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}
