> This feature is implemented in Klasa **0.5.0**, check the PR that implemented it [here](https://github.com/dirigeants/klasa/pull/162).

## Custom Responses

This is one of the most requested features for Klasa: the ability to translate and/or customize the error messages when a parameter is missing. This is now achievable thanks to {@link Command.customizeResponse}, which takes the name of the key of the possible (remember the {@tutorial CommandsArguments} tutorial) and either a `string` or a `function` that takes one parameter: `message` being a `KlasaMessage` instance, that you can use to get the Language instance from (check {@link KlasaMessage.language}).

## Configuring/Creating a custom response

They require an argument name from the `usageString`, as you have seen in {@tutorial CommandsArguments}, the `name` is what identifies a Tag/argument, to do so, you put that name, and Klasa will modify the Tag so when it's value is not providen or is incorrect, use your custom message. Let's say we have an Overwatch command and you want Klasa to reply with a *nicer* response, for example, when you have the [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) type with `/(\w{3,12})#(\d{4,5})/i` and you want to notify the user that they did not write the name correctly, then you may want to customize the message that the framework sends so they can understand what's going wrong better. Consider the following command example:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Check your Overwatch stats.',
			usage: '<battletag:reg/(\\w{3,12})#(\\d{4,5})/i>'
		});
	}

	async run(message, [battletag]) {}

};
```

And you want it to send 'You must insert a valid battletag with the format username#0000' when the user doesn't input a string matching the RegExp, then you may use the method {@link Command.customizeResponse} inside the commands' constructor:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Check your Overwatch stats.',
			usage: '<battletag:reg/(\\w{3,12})#(\\d{4,5})/i>'
		});

		this.customizeResponse('battletag',
			'You must insert a valid battletag with the format username#0000');
	}

	async run(message, [battletag]) {}

};
```

And when you miss that argument or you input something that doesn't match the RegExp pattern (triggering the required arguments' error message), it'll send the string you used instead of `'battletag is a required parameter.'`.

For multilanguage purposes, you can also pass a function with the parameters message ({@link KlasaMessage}) and possible ({@link Possible}), and if you have a `COMMAND_INVALID_BATTLETAG` key in your language files, you can do:

```javascript
this.customizeResponse('battletag', message =>
	message.language.get('COMMAND_INVALID_BATTLETAG'));
```

In a side note, `Command#customizeResponse` returns the command instance, meaning that you can chain it, for example:

```javascript
this.customizeResponse('arg1', 'Response for argument 1')
	.customizeResponse('arg2', 'Response for argument 2')
	.customizeResponse('arg3', 'Response for argument 3')
	.customizeResponse('arg4', 'Response for argument 4');
```

> **Note**: If an argument already has a custom response, you cannot re-set it.

## FAQ

- How can I customize the response for a type with unions? Like `<add|set|delete|list>`? You can use one of the possible names, for example, `'set'`.
- What happens if I have two arguments with the same name? Klasa will assign the custom response to the first argument that matches. A second call with that method with the same name would set it for the second.

## Further Reading:

- {@tutorial CommandsArguments}
- {@tutorial CommandsSubcommands}
- {@tutorial CommandsCustomResolvers}
