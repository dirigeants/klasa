TextPrompt allows you to create a prompt that users of your bot will need to respond to by providing some form of text input.

An extremely simple working example can achieved by this code:

```javascript
const { TextPrompt, Usage, Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Test RichDisplay' });
	}

	async run(message) {
		// Initialize A usage that you want the response to fulfill
		const usage = new Usage(this.client, `<skillz4killz|momushanji>`, '');
		// Initiliaze the prompt with the necessary paramaters
        const confirmationPrompt = new TextPrompt(message, usage, { limit: 1, time: 6000, quotedStringSupport: false });
        // Ask the user to respond
        const [response] = await yesOrNoPrompt.run('Who is your favorite?');
        // Check to confirm if user provided a response
        if (!response) return null;
        // Do something with response
        return msg.reply(`You selected ${response}`);
	}

};
```

## Breaking It Down

First we create a new {@link Usage} instance, in which ever format you would like. Usage takes three parameters.

1. client: The Klasa Client itself, most likely to be `this.client` assuming the Usage is initialized in a Piece.
2. usageString: The usageString similar to any command `usage` property you will create. For more info: {@link UnderstandUsageStrings]
3. usageDelim: The usageDelim string similar to any command `usageDelim` property.

```javascript
    const usage = new Usage(this.client, `<skillz4killz|momushanji>`, '');
```
> Here we passed in our client, a string *requiring* a response from the user either of `skillz4killz` or `momushanji`, and a empty string for the delim since we did not want multiple arguments. If for example, you wanted a usage like `'<add|remove> <user:user>'` then a usageDelim should be passed in as `' ''`.

Next we will initialize the TextPrompt using the Usage that we just created above. To do this, we need to once again pass in three arguments.

1. message: The user that responds to the message will be the author of the {@link KlasaMessage} provided.
2. usage: {@link Usage} that we created above is passed in as the second argument.
3. options: The third argument must be an object containing options for the prompt. Our limit is set to 1 if we only want to allow a maximum of 1 re-prompts in case user responds with an invalid response. We set the time to listen for a response be a maximum of 1 minute.`quotedStringSupport` was set to false since we didn't need to support spaces in our strings in this case.

```javascript
    const confirmationPrompt = new TextPrompt(message, usage, { limit: 1, time: 60000, quotedStringSupport: false });
```

> It is highly recommended to include a short time interval especially for bigger bots as the more listeners you have open by various users, it may affect your bot's performance a lot.

Now that we have our {@link TextPrompt} initialized, we can go ahead and run the prompt. We pass in a string asking the user a question to respond to. In this case, we are asking the user `Who is your favorite?`. Since running a {@link TextPrompt} returns a Promise of an Array, we destructure that array using [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```javascript
    const [response] = await yesOrNoPrompt.run('Yes or No?');
});
```
> Note that you can also pass in a [`MessageEmbed`](https://discord.js.org/#/docs/main/master/class/MessageEmbed) instead of a string.

Finally, if the user provided no response we simply error out. However, if they provided a response to the prompt that was valid according to the {@link Usage} then we do something with that usage.

```javascript
    if (!response) return null;

    return msg.reply(`You selected ${response}`);

```
