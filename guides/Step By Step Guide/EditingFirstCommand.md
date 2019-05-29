Wow! You even got your client customized with some really cool Klasa options! Really great job. Now, lets dive into trying to understand what some of the Klasa commands and terminology are.

## Understanding Pieces And Stores

In order to understand how Pieces and Stores work, you would first need to understand Javascript `Classes` and extending classes.

> Note: This guide is meant for beginners so we won't really worry about the details. If you wish to learn the details about the Pieces and Stores, please read them at XXXX

Let's just try and remember a few details.

- `Pieces` enable a bunch of cool features that make it easier to code.
- Klasa will help make most of the stuff we need `Pieces` for us :tada:
- A `Store` in its most basic sense, a group of `Pieces`.

Up till this point, we have ignored all the folders that Klasa made for us.

<!-- Insert Image Here -->

Every one of these folders is a `Store` and every file we will create inside them is going to be a `Piece`.

## Command Store

The first store we should learn is the `CommandStore`. We have already used this store and we didn't have much need to understand it. Every single command we used so far is a part of this `CommandStore`.

The commands like `reboot`, `invite`, `help`, `ping`, `stats` are all **Command Pieces** in the `CommandStore`.

But what happens if we wanted to modify one of these commands? For example, what if we wanted to make it so that `+inv` does the same thing as `+invite`. Let's try and see if we can customize the `invite` command together to give it an alias of `inv`. Each command has an option called `aliases`. This allows users to run that command with different names. For example, we want our users to be able to easily and quickly get the invite link.

## Customizing The Invite Command

If you open up the `Commands` folder that Klasa created, you will notice that it is actually empty. All the commands we have used up till now are actually in the core of Klasa. To modify these commands, we will use the `+transfer` command to transfer the command from Klasa to our `Commands` folder.

Go ahead and type in a discord channel.

```shell
+transfer invite
```

Now, if you go check the `Commands` folder, you will see you have access to Invite command inside a folder called `Chat Bot Info`. Klasa organizes it's commands into Categories and the Invite command is in a Category called `Chat Bot Info`.

> Note: You can change the name of this folder if you wish to change the category name. For the purpose of this guide, we will leave it as is.

> Note: The core Klasa `invite` command was not actually deleted. It is simply overwritten by your copy of the invite command. In the future, if you ever wish to undo everything, you can delete your invite file and Klasa will use the core invite command again. Any piece you transfer, will always overwrite the core pieces.

```js
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_INVITE_DESCRIPTION')
		});
	}

	async run(message) {
		return message.sendLocale('COMMAND_INVITE');
	}

	async init() {
		if (this.client.application && !this.client.application.botPublic) this.permissionLevel = 10;
	}

};
```

> Note: For Typescript users, you will need to modify this file as Klasa is built with Javascript. Once you have converted the file into Typescript you can follow along with the rest of this guide.

Don't worry too much about all the lines and options just yet. We will cover them later when we create our own command. For now we just want to focus on this part:

```ts
guarded: true,
description: language => language.get('COMMAND_INVITE_DESCRIPTION')
```

This is the part that holds the options for each of the commands.

- `guarded`: The guarded option tells Klasa that this command is not allowed to be disabled by servers. Since we want anyone to be able to invite our bot we can keep the `guarded` option as true.

- `description`: The description option tells Klasa what to show the user when they type `+help`. In that help message, each command has a small description next to it. This is where it comes from. For now don't worry too much about the whole `Language` part. We will cover that when we create our own language in this guide.

> Note: Klasa has built in multi-lingual support. You can support as many languages as you wish. We will learn more about languages when we create our own language but for now we just want to see how to customize the command.

Now, we want to add the `aliases` option to it:

```ts
	aliases: [`inv`, `i`],
	description: language => language.get(`COMMAND_INVITE_DESCRIPTION`)
	guarded: true,
```

Notice, I added 2 aliases here. You can add as many aliases as you like. If you see a lot of users typing it wrong by accident you can add those typos as aliases as well.

## The Power Of Pieces: Reloading

Now it is time to see why `Pieces` are so amazing. Remember, in the last section we had to reboot the bot every time we made a single change? We don't need to do that for `Pieces`. Klasa gives us a `+reload` command that can update the `Piece` or `Store` without needed to reboot.

Let's go ahead and see this in action. Type the following command in a discord channel.

```shell
+reload invite
```

> Note: You can also do `+reload commands` to reload all commands at once if you edited multiple commands.

<!-- Insert Image Here -->

Once the reload is done, we can try using `+inv` or `+i`.

<!-- Insert Image Here -->

Nice! You can now customize any of the commands from Klasa as you wish. But for the purposes of this guide we will continue to making our very own command so we can learn about all the options that Klasa gives us when it comes to making commands.
