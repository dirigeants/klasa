Hurray! We made an entire role command that does exactly what we wanted it to do. Did you notice, the role command was also logging in your console whenever it ran. This is happening because of the `commandLogging.js` Finalizer that Klasa adds for us.

## What Is A Finalizer?

A `Finalizer` is going to run after a **successful** command. If there was some error like a missing argument that is mandatory or something went wrong in the code, these finalizers will not run. You can have as many finalizers as you wish and they will all run after the command is done.

For the purposes of this guide, let's try and create a finalizer that will delete all command trigger messages. Once the command is ran the trigger message is not needed anymore. So let's go ahead and get rid of it.

```shell
+role add @role @member
```

## Creating Our First Finalizer

Remember when we made our `role` command, we made it inside the `commands` folder. This time we will make the file called `deleteCommandTrigger.js` in our `finalizers` folder.

> Note: If you have installed the VSCode Klasa Plugin, you can use it to easily create a new finalizer for you.

<!-- Insert Image Here -->

Once the file is created, go ahead and paste in this following base snippet of what a finalizer should look like.

```js
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    constructor(...args) {
        super(...args, {
            name: 'myFinalizerName',
            enabled: true
        });
    }

    run(message, command, response, runTime) {
        // This is where you place the code you want to run for your finalizer
    }

    async init() {
        /*
        * You can optionally define this method which will be run when the bot starts
        * (after login, so discord data is available via this.client)
        */
    }

};
```

Right now, we don't need to worry about the `init` function as it won't be used here. We will see how it can be used once we get to the tasks section of this guide.

```js
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    constructor(...args) {
        super(...args, {
            name: 'myFinalizerName',
            enabled: true
        });
    }

    run(message, command, response, runTime) {
        // This is where you place the code you want to run for your finalizer
    }

};
```

## Understanding Finalizer Options

The `name` and `enabled` options for finalizers work the exact same way as how they work in commands. The name of the finalizer will default to the file name if we don't provide a `name` option. The enabled will default to true, if it is not provided.

Since we want this finalizer enabled, we can remove that line so it stays `true`. Also, we have a nice unique name for our finalizer file already `deleteCommandTrigger` which will assign the name automatically. So let's also remove the `name` option as well.

```js
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    constructor(...args) {
        super(...args, {
        });
    }

    run(message, command, response, runTime) {
        // This is where you place the code you want to run for your finalizer
    }

};
```

Notice how our constructor does not have any options left to customize it from the default values. In this case, we can actually remove the entire constructor as well to make our code much cleaner.

```js
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    run(message, command, response, runTime) {
        // This is where you place the code you want to run for your finalizer
    }

};
```

Boom! We now have a nice clean base for the finalizer.

## Understanding The Finalizer Run Parameters

Every finalizer has 4 arguments passed to it.

- message: The message object that triggered the command.
- command: The command that was triggered.
- response: The value that you `return`ed in your command.
- runTime: The time it took to run this command.

## Adding The Functionality

```ts
run(message, command, response, runTime) {
	// If the command was used in DM cancel this finalizer since we can't delete users messages in a DM.
	// OR If the message is not deletable by the bot or it has already been deleted cancel out
	if (!message.guild || message.deleted || !message.deletable) return null

	// Delete the original command trigger message
	return message.delete()
}
```

Now that we have added all the functionality in this finalizer, we can see that we did not use the `command`, `response`, or `runTime` parameters. So we can remove them and be left with our first complete finalizer.

```js
const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

    run(message) {
        // If the command was used in DM cancel this finalizer since we can't delete users messages in a DM.
        // OR If the message is not deletable by the bot or it has already been deleted cancel out
        if (!message.guild || message.deleted || !message.deletable) return null;

        // Delete the original command trigger message
        return message.delete();
    }

};
```

Go ahead and reload the finalizers by running the following command in a discord channel.

```shell
+reload finalizers
```

Now that your new finalizer has been added, trying running the role command.

```shell
+role @role @member
```

Did you see how the command trigger was deleted? Cool right!

## Possible Improvements

Right now, every command trigger will always be deleted. It would be really nice if we could give each guild the option to choose which commands should have their trigger message deleted.

In order to achieve this we have to learn about how `Settings` work in Klasa. Let's dive into that next. {@tutorial CreatingOurFirstGuildSetting}
