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
			enabled: true
		});
	}

	// Getters

	get myProperty() {
		// Make a getter
	}

	// Setters

	set myProperty(value) {
		// Make a setter
	}

	// Methods

	myMethod() {
		// Make a method
	}

	// Static Methods

	static myMethod() {
		// Make a static method
	}

}

// Static Properties

MyExtendable.myStaticProperty = 'wew'; // Make a static property

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
			enabled: true
		});
	}

};
```

| Name          | Default       | Type    | Description                          |
| ------------- | ------------- | ------- | ------------------------------------ |
| **name**      | `theFileName` | string  | The name of the method/property.     |
| **enabled**   | `true`        | boolean | If the extendable is enabled or not. |
| **appliesTo** | `[]`          | class[] | An array of classes to extend.       |

## Understanding extendables

Understanding classes like a blueprint, and all its members (instance and static setters, getters, properties, and methods) as pieces of it, an Extendable would copy all the pieces into all the targetted structures with their respective names. You can define multiple members with different names inside the extended class.

## Examples

Imagine we want to extend the [Message](https://discord.js.org/#/docs/main/master/class/Message) class
so it has a method called `prompt` so you can do `Message#prompt("Are you sure you want to continue?")`
everywhere in your code, resolving if the user confirms the prompt, or rejecting otherwise. Then, your
extendable is likely to be like the following:

> You can extend the Message object with this because you're likely to lock the prompt for a user in a channel,
and Message has both properties of `author` and `channel`.

```js
const { Extendable } = require('klasa');
const { Message } = require('discord.js');
const makePrompt = require('../lib/util/Prompt');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [Message] });
	}

	prompt() {
		// `this` is an instance of Message
		return makePrompt(this);
	}

};
```

After loading this extendable, `Message.prototype.prompt` will be available as a method that calls and returns `makePrompt`.

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
