Amazing! You just got through the most complex part of Klasa. We will slowly go more in depth with how Settings work in Klasa throughout this guide, but for now let's finish our finalizer.

## Getting A Value From Settings

Klasa will automatically help make all Guild Settings available to us in every guild object. To get a value form the settings, we simply use the `settings.get(keyName)` method.

```js
const commandNames = message.guild.settings.get('commandTriggersToDelete')
```

## Finishing Touches To Finalizer

Now we just have to add a bit of functionality to our finalizer. First, we get the values from the guild settings for all the command names that the guild admins want to have deleted. Then we check if the command used was one of those commands and remove it.

```js
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    run(message) {
      // If the command was used in DM cancel this finalizer since we can't delete users messages in a DM.
			// OR If the message is not deletable by the bot or it has already been deleted cancel out
			if (!message.guild || message.deleted || !message.deletable) return null

			// Get the command names that guild admins asked to have deleted on their server
			const commandNames = message.guild.settings.get('commandTriggersToDelete')
			// If the command used was not set by guild admins, cancel out
			if (!commandNames.includes(message.command.name)) return null

			// Delete the original command trigger message
			return message.delete()
    }

};
```

Now you can reload the command and test it out. Set some commands to be deleted with the `conf` command and see how the finalizer works.

Nice work! You now have a fully built finalizer that will delete command triggers and you have built custom settings for each guild.

Now, we will create our first `monitor` that will help us learn more ways to use settings and also how monitors work. {@tutorial CreatingFirstMonitor}
