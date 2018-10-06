Arguments are the resolvers used to convert strings padded by users, into fully resolved parameters that are passed into the command. New arguments are created in the `./arguments/` folder.

```javascript
const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		// This is where you want to validate arg and return a resolved param or throw an error
	}

};
```

The run method in {@link Argument} takes 3 parameters:

| Name             | Type                 | Description                            |
| ---------------- | -------------------- | -------------------------------------- |
| **arg**          | string               | The parameter given to parse           |
| **possible**     | {@link Possible}     | The Possible instance that is running  |
| **message**      | {@link KlasaMessage} | The message that triggered the command |

```javascript
const { Argument } = require('klasa');
const REGEX_EMOJI = /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/;

module.exports = class extends Argument {

	run(arg, possible, message) {
		const results = REGEX_EMOJI.exec(arg);
		const emoji = results ? this.client.emojis.get(results[1]) : null;
		if (emoji) return emoji;
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
```

How does the new argument work?

1. Let's consider arg is `<:klasa:354702113147846666>`. The result of `exec`uting `REGEX_EMOJI` on that string gives an array-like object: `['<:klasa:354702113147846666>', '354702113147846666', index: 0, input: '<:klasa:354702113147846666>']`.
1. There are cases the argument does not match, in that case, `results` would be `null`. So we verify its existence and get the first grouping match: `(\d{17,19})`, which gets the **id** of the emoji, and as we see in the result, it is in the second index: `'354702113147846666'`, and we get the emoji with said id.
1. If `results` was null, `emoji` would be `null` too due to the ternary condition, but there is also the possibility of emoji being undefined: when the client does not have the Emoji instance cached or is in a guild the bot is not in. The case is, **if the emoji is valid and found, we should return it**.
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
		return msg.send(`The name of the emoji ${emoji} is: ${emoji.name}`);
	}

};
```

>**note:** An Emoji argument already comes included with Klasa.

# Further reading

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
