Excellent! Now that you have managed to understand how to transfer and edit the existing commands that Klasa made for us, it is time to make our very own command.

Let's make a command that will allow server admins to give or take roles from a member.

> Note: As always, you can copy and paste this final version snippet or you can follow along the guide step by step to see how we make the command.

```js
const { Command } = require(`klasa`);
const { Permissions } = require(`discord.js`);

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: [`r`, `ro`, `rol`],
			bucket: 5,
			cooldown: 60,
			description: `Adds or removes a role from a member.`,
			extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`,
			permissionLevel: 6,
			requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			runIn: ['text'],
			subcommands: true,
			usage: `<add|remove|auto:default> <role:role> [member:member]`,
			usageDelim: ` `,
		});

		this.customizeResponse(`role`, `You did not give me any role to give to the member silly!`);
	}

	// This is the add subcommand that will only add a role to the member
	async add(message, [role, member = message.member]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (memberHasRole) return message.send(`I can't add the ${role.name} role to ${member.displayName} because they already have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.add(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have added the ${role.name} to ${member.displayName}.` : `I was unable to add the ${role.name} to ${member.displayName}`);
	}


	async remove(message, [role, member = message.author]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (!memberHasRole) return message.send(`I can't remove the ${role.name} role to ${member.displayName} because don't have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.remove(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have removed the ${role.name} to ${member.displayName}.` : `I was unable to remove the ${role.name} to ${member.displayName}`);
	}

	async auto(message, [role, member = message.member]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);

		// if the member has the role remove it else add the role to the member
		const roleUpdated = memberHasRole ? await member.roles.remove(role.id).catch(() => null) : await member.roles.add(role.id).catch(() => null);

		// Send a response on whether or not the role was successfully added
		return message.send(roleUpdated ? `I have ${memberHasRole ? `removed` : `added`} the ${role.name} to ${member.displayName}.` : `I was unable to ${memberHasRole ? `remove` : `add`} the ${role.name} to ${member.displayName}`);
	}

	async checkRequirements(message, role, member) {
		// If the member is not manageable, send an error message
		if (!member.manageable) {
			await message.send(`I do not have a role high enough to remove roles from ${member.displayName}`);
			return false;
		}
		// Check if the bot highest role is higher than the role provided so it can assign it
		const botHasHigherRole = message.guild.me.roles.highest.position > role.position
		if (!botHasHigherRole) {
			await message.send(`The role you provided was higher than the bots highest role.`);
			return false;
		}

		// If all requirements are met we want to return true
		return true;
	}

}
```

For Typescript users:
```ts
import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Permissions, Role, GuildMember } from 'discord.js';

export default class extends Command {
	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: [`r`, `ro`, `rol`],
			bucket: 5,
			cooldown: 60,
			description: `Adds or removes a role from a member.`,
			extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`,
			permissionLevel: 6,
			requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			runIn: ['text'],
			subcommands: true,
			usage: `<add|remove|auto:default> <role:role> [member:member]`,
			usageDelim: ` `,
		});

		this.customizeResponse(`role`, `You did not give me any role to give to the member silly!`);
	}

	// This is the add subcommand that will only add a role to the member
	async add(message: KlasaMessage, [role, member = message.member]: [Role, GuildMember]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (memberHasRole) return message.send(`I can't add the ${role.name} role to ${member.displayName} because they already have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.add(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have added the ${role.name} to ${member.displayName}.` : `I was unable to add the ${role.name} to ${member.displayName}`);
	}


	async remove(message: KlasaMessage, [role, member = message.author]: [Role, GuildMember]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (!memberHasRole) return message.send(`I can't remove the ${role.name} role to ${member.displayName} because don't have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.remove(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have removed the ${role.name} to ${member.displayName}.` : `I was unable to remove the ${role.name} to ${member.displayName}`);
	}

	async auto(message: KlasaMessage, [role, member = message.member]: [Role, GuildMember]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);

		// if the member has the role remove it else add the role to the member
		const roleUpdated = memberHasRole ? await member.roles.remove(role.id).catch(() => null) : await member.roles.add(role.id).catch(() => null);

		// Send a response on whether or not the role was successfully added
		return message.send(roleUpdated ? `I have ${memberHasRole ? `removed` : `added`} the ${role.name} to ${member.displayName}.` : `I was unable to ${memberHasRole ? `remove` : `add`} the ${role.name} to ${member.displayName}`);
	}

	async checkRequirements(message: KlasaMessage, role: Role, member: GuildMember) {
		// If the member is not manageable, send an error message
		if (!member.manageable) {
			await message.send(`I do not have a role high enough to remove roles from ${member.displayName}`);
			// Since the user did not meet the requirements we return false
			return false;
		}
		// Check if the bot highest role is higher than the role provided so it can assign it
		const botHasHigherRole = message.guild.me.roles.highest.position > role.position;
		if (!botHasHigherRole) {
			await message.send(`The role you provided was higher than the bots highest role.`);
			// Since the user did not meet the requirements we return false
			return false;
		}

		// If all requirements are met we want to return true
		return true;
	}

}
```
## VSCode Plugin

One of the coolest things about using Visual Studio Code is that it has a really cool Extension that makes coding bots really easy for Klasa. Go to the Extension store and search for `klasa-vscode` by `bdistin` the creator of Klasa. Once you have, installed it you can follow the steps below to create a command file.

<!-- Insert Image Here -->
> Note: There is no plugin support for Typescript at the time of writing this guide.

## Creating Command File

> Note: If you used the VSCode Plugin to create your command file, you can skip this step.

Since, we are creating a Moderation command to give or take roles, let's go ahead and create a `Category` folder called `Moderation` and then create a file called `role.js` or `role.ts` in Typescript.

Once the file is made, you can paste this following base snippet to make our first command.

```js
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			bucket: 1,
			cooldown: 0,
			deletable: false,
			description: '',
			enabled: true,
			extendedHelp: 'No extended help available.',
			guarded: false,
			name: 'yourCommandName',
			nsfw: false,
			permissionLevel: 0,
			quotedStringSupport: false,
			requiredPermissions: [],
			requiredSettings: [],
			runIn: ['text', 'dm'],
			subcommands: false,
			usage: '',
			usageDelim: undefined,
		});
	}

	async run(message, [...params]) {
		// This is where you place the code you want to run for your command
		return message.send(`${this.name} command ran successfully`);
	}

	async init() {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 */
	}

}
```

For Typescript users:
```ts
import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: [],
			bucket: 1,
			cooldown: 0,
			deletable: false,
			description: '',
			enabled: true,
			extendedHelp: 'No extended help available.',
			guarded: false,
			name: 'yourCommandName',
			nsfw: false,
			permissionLevel: 0,
			quotedStringSupport: false,
			requiredPermissions: [],
			requiredSettings: [],
			runIn: ['text', 'dm'],
			subcommands: false,
			usage: '',
			usageDelim: undefined,
		});
	}

	async run(message: KlasaMessage, [...params]) {
		// This is where you place the code you want to run for your command
		return message.send(`${this.name} command ran successfully.`);
	}

	async init() {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 */
	}

}
```

## Understanding Command Options

Woah! We just added a massive file but most of that stuff is new to us. Don't worry, lets break everything down step by step.

> Note: Any options that are not changed from the snippet above can actually be deleted as Klasa will use the default option if you do not provide anything for that option. This can help keep your files cleaner.

Before, we do anything let's see if the command actually runs. Go into the discord channel and type the command below:

```shell
+reload commands
```
Now that we have reloaded the entire commands Store, this new command we made will be enabled for us. Type the command below to see what it will do!

```shell
+role
```

Weird 🤔! Nothing happened? Well, there is actually a very good reason for that. Try and run this command for a second just to test it out.

```shell
+yourCommandName
```

Wow, that worked! Interesting right. Well this is happening because of the `name` property. Let's start diving into each of the options and what they do.

### Command Name

By default, the name of a command is derived from the file name. In this case the default name of this cThe name of the command is provided in the `name` option. The name can also be derived from the file name. For example, since our file was named `role.js` the commands name is automatically `role`.

The name option allows us to override the filename incase we wanted to make a custom file name.

If you wish you can give this a custom name like below or just delete this entire line.

```js
	name: `modrole`,
```

For this guide, we will just be deleting this line going forward to keep our file cleaner.

### Command Enabled
The `enabled` option will be used to tell Klasa whether this command should be enabled or disabled.

In case, you want to disable the command. You can do so
```js
	enabled: false
```
Just to test how this works, let's go ahead and see if we can make this work. Switch it to `false` as shown below:

```js
	aliases: [],
	bucket: 1,
	cooldown: 0,
	deletable: false,
	description: '',
	enabled: false,
	extendedHelp: 'No extended help available.',
	guarded: false,
	nsfw: false,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text', 'dm'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```

Go into a discord channel and type the following command:

```shell
+reload commands
```
Once the reload is done, you can try and use the command.

```shell
+role
```

Once you finish testing, you can go back and delete this option because we want this command to be enabled. By default, commands are always enabled so we don't need this option either.

### Command Run In
The `runIn` option allows you to tell Klasa where this command should be allowed to run. There are currently, two valid values you can give this option.

- `text`: Allow in guilds
- `dm`: Allow in Direct Messages with the bot

These names refer to the channel types that discord allows messages in.

Since, roles only exist in guilds, we can tell klasa that this command should only be allowed to run in guilds
```js
	runIn: [`text`],
```

Let's go ahead and test this so you can see it in action.

```js
	aliases: [],
	bucket: 1,
	cooldown: 0,
	deletable: false,
	description: '',
	extendedHelp: 'No extended help available.',
	guarded: false,
	nsfw: false,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```
Now you can go to a direct message with your bot, and try to use the role command. It will respond saying it can not run outside text channels. The same would be true if we wanted to only allow a command in `dm`.

We can not delete this line because the default value of this option in to enable the command everywhere. We don't want the `role` command to be used in anything outside a guild. So we are going to leave it as follows:

```js
	runIn: [`text`]
```

### Command Cooldown And Bucket

The cooldown and bucket options go hand in hand together.

- `Cooldown` is how long to make the user wait before they can use the command again. By default, there is no wait time.
- `Bucket` is how many times a user is allowed to use a command before they are placed on cooldown.

Let's use our command as an example. We don't want someone to start spamming the role command so we can add a cooldown of 60 seconds. However, this would mean every time you give a role to someone, you would need to wait a whole minute to give a role to someone else. This is where `bucket` shines! Let's set the bucket to `5` so that a user can use this command 5 times in a row before being asked to wait for 60 seconds.

> Note: It is important to understand the way these two interact. The `cooldown` starts as soon as the first of the `bucket` is used. So, if a user uses the role command 5 times in 59 seconds, they only have to wait 1 second to do another 5 times.

Let's test out how this works to get a better understanding.

```js
	aliases: [],
	bucket: 5,
	cooldown: 60,
	deletable: false,
	description: '',
	extendedHelp: 'No extended help available.',
	guarded: false,
	nsfw: false,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```

First, we have to reload this command.
```shell
+reload role
```

Now you can copy and paste this command into a discord channel 6 times in under a minute to see if it puts you in cooldown.

```shell
+role
```

Did you notice that you were not put in cooldown? This is because you are the owner of the bot. Bot owners are not able to be put into cooldown by default. If you have an alternate discord account, you can test it with that or you can have a friend try it out. They will be put in cooldown.

> Advanced: If you really wish to allow bot owners to be put in cooldown, you can transfer the `+transfer cooldown` inhibitor and make the changes there.

If you don't want any cooldown or bucket for this command, you can simply remove these two lines.

### Command Aliases

Aliases as we learned earlier are other names that can be used to trigger the command. Let's set some aliases that users can use to make it easier for them.

```js
	aliases: [`r`, `ro`, `rol`],
	bucket: 5,
	cooldown: 60,
	deletable: false,
	description: '',
	extendedHelp: 'No extended help available.',
	guarded: false,
	nsfw: false,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```

Notice how I put `r`, `ro`, and `rol` as aliases. This is so if by chance the user forgets to type a letter or two, the command will still work for them. You can choose whatever aliases you like.

> Note: We have already covered aliases when we edited the `invite` command, so we don't need to test this again. Feel free to take a minute and reload the command and test the aliases if you like.

If you don't want to add any aliases for the command, you can simply remove this entire line.

### Command Deletable
This option allows you to tell Klasa to delete all the bots responses to a command if the trigger message was deleted. Let's set this to true and see how it works.

```js
	aliases: [`r`, `ro`, `rol`],
	bucket: 5,
	cooldown: 60,
	deletable: true,
	description: '',
	extendedHelp: 'No extended help available.',
	guarded: false,
	nsfw: false,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```
Now go into a discord channel and reload the command. Once, you have reloaded the command you can type the following command:
```js
+role
```

Once the bot response, you can delete your message where you typed `+role` and notice how it will also delete the bot's response as well.

Since, we don't really want to bot deleting this response so we can always tell when the bot gave a role to someone we will remove this option entirely for this guide.

### Command Guarded
The `guarded` option is something we have seen already in this guide. It tells Klasa that this command should not be allowed to be disabled by servers.

> Note: If you customize the settings and override the default `disabledCommands` guild setting, you must also build the filter for this if you want to use this option. We will go over this in the guild settings part of this guide.

Klasa adds some settings per guild by default whenever the bot is added to a guild. One of the settings is called `disabledCommands`. Guild admins can use the Klasa `+conf` command to disable commands on their server. This option tells Klasa to not allow this command to be disabled by the server admins on those servers.

Let's go ahead and test this out quickly.
```js
	aliases: [`r`, `ro`, `rol`],
	bucket: 5,
	cooldown: 60,
	description: '',
	extendedHelp: 'No extended help available.',
	guarded: true,
	nsfw: false,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```

Since this is a guild moderation command, we want to allow servers to be able to choose whether this command should work on their server or not. So we can delete this line from our command.

### Command NSFW
The `nsfw` options tells Klasa that this is a NSFW command and not to allow this command outside a `nsfw` channel.

> Note: If you make a command nsfw it will not work in Direct Messages. NSFW commands in Direct Messages are against the Terms of Service from discord so Klasa does not support this.

Let's set this to true just to test it out for a bit.
```js
	aliases: [`r`, `ro`, `rol`],
	bucket: 5,
	cooldown: 60,
	description: '',
	extendedHelp: 'No extended help available.',
	nsfw: true,
	permissionLevel: 0,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```

Now make sure to reload the command and then use this command in a channel that is **NOT** a NSFW channel.
```shell
+role
```
Then you can try running the command again in a NSFW channel. You will see that now the command will work.

Going forward we don't want the role command to be only in NSFW channels so we can delete this line so it defaults to `false`.

### Command Permission Level
Permission levels are a very complex function in Klasa. It allows you to tell Klasa what level is required for a user to use this function.

> Note: To learn about Permission levels in depth please read this section of the docs. We will also be creating our own custom permission levels later in this guide.

By default Klasa creates some permissions levels for us.

- 0: Everyone is allowed.
- 6: Members must have `MANAGE_GUILD` permission.
- 7: Only Guild Owners
- 9: Bot Owner
- 10: Bot Owner (silent)

Since we don't want to allow any user to use the role command, we can tell Klasa to only allow users with `MANAGE_GUILD` permission to use it. This will most likely be a moderator or admin that has this permission so they should be able to give or take roles.

```js
	aliases: [`r`, `ro`, `rol`],
	bucket: 5,
	cooldown: 60,
	description: '',
	extendedHelp: 'No extended help available.',
	guarded: true,
	permissionLevel: 6,
	quotedStringSupport: false,
	requiredPermissions: [],
	requiredSettings: [],
	runIn: ['text'],
	subcommands: false,
	usage: '',
	usageDelim: undefined,
```

Now you can reload the bot and have an alternate discord account or a friend try using the command to see how this option works.

### Command Required Permissions
The `requiredPermissions` options tells Klasa what permissions are necessary to run a command. For example, in order to add or remove roles from someone, we need the `MANAGE_ROLES` permission on the server.

> Note: For good practice, it is recommended to try and use the Permissions.FLAGS from Discord.js. However, you can also provide it as just `MANAGE_ROLES`.

```js
const { Command } = require(`klasa`);
const { Permissions } = require(`discord.js`);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [`r`, `ro`, `rol`],
			bucket: 5,
			cooldown: 60,
			description: '',
			extendedHelp: 'No extended help available.',
			name: 'yourCommandName',
			permissionLevel: 6,
			quotedStringSupport: false,
			requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			requiredSettings: [],
			runIn: ['text'],
			subcommands: false,
			usage: '',
			usageDelim: undefined,
		});
	}
```

Now that Klasa knows we need Manage Roles, we can reload the command and try using it. Notice how the command does not work?

> Note: By adding a required permission in any command, you also tell Klasa what permissions to ask the user to give when inviting the bot. When a user uses the `+invite` command the bot will automatically generate a invite link that requires all those permissions.

Next you can give the bot the `MANAGE_ROLES` permission and try it again. This time the command will respond properly.

### Command Required Settings
The `requiredSettings` option tells Klasa which guild settings are required to run this command. This option can come in handy when you want to make sure that a guild has set up a setting in advance.

Imagine you wanted to make a log channel where the bot would post a message every time someone used the role command. In order to make sure that the guild had set a `channel` to send the log message to we could use this option.

> Note: We will cover this in depth when we get to the settings part of this guide.

We will add in the log option later in this guide so for now we can just remove this line.

### Description and Extended Help Options
The `description` and `extendedHelp` are meant to be for the help command. The `description` we have already seen in the `+invite` command but the `extendedHelp` is new.

- description: a short description that is displayed when someone types `+help`
- extendedHelp: a longer help message that is displayed when someone types `+help role`

```js
description: `Adds or removes a role from a member.`,
extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`
```

If you remember back in the `+invite` command of this guide we saw how these options can look differently **IF** we want to support other languages.

```js
description: language => language.get(`COMMAND_ROLE_DESCRIPTION`),
extendedHelp: language => language.get(`COMMAND_ROLE_EXTENDED`)
```

> To make this work you will also need to understand how languages work and create these string in a Klasa Language file. Later in the guide we will create a whole language and see how these can be done.

For now we will be using the first method.


### Usage And Usage Delim Options
The `usage` and `usageDelim` are going to tell our bot how to accept arguments for our command.

> Note: The `usage` is also a very complex part of Klasa. There is an entire page dedicated to understanding Usage and all its details.

The first thing we want to do is to tell Klasa, that the user should split his arguments with spaces. For example:
```shell
+role add @role
```
This is where the `usageDelim` comes into play. Let's set our usageDelim to a empty space.
```js
	usageDelim: ` `,
```
Now Klasa will know to separate all the arguments by spaces. But how does Klasa know that we want `add`, `remove` to determine what to make this command do?
```js
	usage: `<add|remove>`,
```
A few important things to remember about the usage.
- It must always be a string.
- <> is a mandatory argument. So if a user doesnt provide it, the command wont run.
- [] is a option argument. If a user doesnt provide it, it will be `undefined`.
- () is for a `semi-optional` argument. It is used with custom resolvers.

The current usage we created above tells Klasa that we want the first argument to be `add` or `remove`.

> Note: The `|` character in the usage is like saying add `OR` remove.

Okay, now we also tell Klasa that we want the user to give a `role`.

```js
usage: `<add|remove> <role:role>
```
The left side of the `:` in `<role:role>` is the name we want to give this parameter. The right side is the type of usage we want the user to provide. Klasa comes built in with a `role` argument type. We will learn about `Arguments` in the future when we create our own arguments in this guide.

For now just remember, that to ask a user for a role you can put `<whateverName:role>` in the usage.

The last thing we want to do on our usage is to tell Klasa that we also need a `member` to make this command work. Afterall, the purpose of this command is to give or remove a role from another member.

```js
usage: `<add|remove> <role:role> [member:member]`
```
Notice, how we made the member here optional. You will see why a little below when we make the commands but for now just remember you can make it `<>` as well. However, for the purpose of this guide we will make it optional with `[]` because we want to allow the user to give themself that role. It also helps give a nice example of an optional argument. 😉

### Quoted String Support And Subcommands Option
The `quotedStringSupport` is used when you have a need to tell Klasa to ignore the `usageDelim` inside `" "`. Remember the `role` argument from Klasa only accepts a valid role `id` or a role mention `@role`. But if we used the `rolename` argument from **Klasa Pieces**, we would be able to have users provide the name of the role as well.

> Note: Klasa Pieces is the official community built repository that has a bunch of `Pieces` that you can copy and add into your bot. We will explore into this Repository a bit later when we dive into `Providers` or part of this guide.

The problem would arise when a role has a space in its name and our usageDelim is also a space. This would break. So we could enable the `quotedStringSupport` option if and when we want to allow parameters that have a space in it. For now, since we don't need this we can skip to the subcommands. Feel free to try and practice this as much as you like.

The `subcommands` option allows us to tell Klasa that we want to have subcommands for this command. For example:

```shell
+role add @role
+role remove @role
```
All of these should work in this file. A user should be able to add a role or remove a role. The options for the subcommands must always be at the start of the usage. Luckily, we have already done this part before:

```js
usage: `<add|remove> <role:role> <member:member>`,
usageDelim: ` `,
```

So, all we need to do is now set the subcommand to true.
```js
	aliases: [`r`, `ro`, `rol`],
	bucket: 5,
	cooldown: 60,
	description: `Adds or removes a role from a member.`,
	extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`,
	name: 'yourCommandName',
	permissionLevel: 6,
	quotedStringSupport: false,
	requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
	runIn: ['text'],
	subcommands: true,
	usage: `<add|remove> <role:role> <member:member>`,
	usageDelim: ` `,
```

Nice. Now don't go testing this just yet because you will start having errors right now since we have not actually made the `add` and `remove` subcommands.

## Making The Subcommands
Alright, now we have every single option on this command set exactly how we want it. Since, we just enabled the `subcommands`, it is time to start making those subcommands. Let's start with the `add` subcommand.

> Note: We won't be adding the functionality just yet so that it easier to understand how to make the subcommands.

**Add Subcommand**
```js
async add(message, [role, member = message.member]) {
	return message.send(`The add subcommand has run for ${this.name} command with Role: ${role.name} and Member: ${member.displayName}.`);
}
```

**Remove Subcommmand**
```js
async remove(message, [role, member = message.member]) {
	return message.send(`The remove subcommand has run for ${this.name} command with Role: ${role.name} and Member: ${member.displayName}.`);
}
```

Now we have both subcommands made. You can actually go ahead and test out both subcommands, the usage and the usageDelim now. But first, don't forget to `+reload role` reload the command.

```shell
+role
+role add
+role add @role
+role add @role @member
+role remove
+role remove @role
+role remove @role @member
```

Notice how you can not get the command to run unless you provide a subcommand and a role. This is because our subcommand and role part of the usage was `mandatory`. The member was actually optional. The interesting thing is we always had a member. This is because in the subcommands we used the message author by doing `member = message.member` if the user did not provide a valid member.

Now let's take a moment to add some functionality into our subcommands.

> Note: Since this is a guide meant for Klasa and not Javascript or Discord.js we are going to leave comments and assume that you can understand what the code is doing.

```js
const { Command } = require('klasa');
const { Permissions } = require('discord.js')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [`r`, `ro`, `rol`],
			bucket: 5,
			cooldown: 60,
			description: `Adds or removes a role from a member.`,
			extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`,
			permissionLevel: 6,
			requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			runIn: ['text'],
			subcommands: true,
			usage: `<add|remove> <role:role> [member:member]`,
			usageDelim: ` `,
		});
	}

	// This is the add subcommand that will only add a role to the member
	async add(message, [role, member = message.member]) {
		// If the member is not manageable, send an error message
		if (!member.manageable) return message.send(`I do not have a role high enough to add roles from ${member.displayName}`);
		// Check if the bot highest role is higher than the role provided so it can assign it
		const botHasHigherRole = message.guild.me.roles.highest.position > role.position;
		if (!botHasHigherRole) return message.send(`The role you provided was higher than the bots highest role.`);

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (memberHasRole) return message.send(`I can't add the ${role.name} role to ${member.displayName} because they already have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.add(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have added the ${role.name} to ${member.displayName}.` : `I was unable to add the ${role.name} to ${member.displayName}`);
	}


	async remove(message, [role, member = message.author]) {
		// If the member is not manageable, send an error message
		if (!member.manageable) return message.send(`I do not have a role high enough to remove roles from ${member.displayName}`);
		// Check if the bot highest role is higher than the role provided so it can assign it
		const botHasHigherRole = message.guild.me.roles.highest.position > role.position;
		if (!botHasHigherRole) return message.send(`The role you provided was higher than the bots highest role.`);

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (!memberHasRole) return message.send(`I can't remove the ${role.name} role to ${member.displayName} because don't have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.remove(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have removed the ${role.name} to ${member.displayName}.` : `I was unable to remove the ${role.name} to ${member.displayName}`);
	}

}
```
> Note: We have deleted the `init` function as we do not require it in this command. We will see the purpose of this function later in the guide once we discuss `Tasks`. The `run` function was also removed because we do not have any use for it. The `run` function is used when you do not have subcommands normally. Although, you can always create a subcommand that is called `run` and use it.

Now reload the command and go try out all the commands you ran before. This time you will notice that the command is actually adding or removing the roles properly.

Everything is working as expected. But, we can use Klasa subcommands to make this even better. The last part of subcommands to understand is what is referred to as the `default` subcommand.

**Default Subcommand**

The default subcommand is ran when a user does **NOT** provide any of the possible subcommands. For example, if the user typed the command below it would throw an error.
```shell
+role @role @user
```
In order to avoid this error, we can create a default subcommand that can be run when a user does not type `add` or `remove`. We will make this the `auto` command that automatically adds or removes a role from the user based on whether or not that user already has the role. The `default` subcommand is always added at the end of the subcommand portion of the usage with the suffix `:default` after it.

```js
	usage: `<add|remove|auto:default>`
```
Now that we have added the default subcommand in the usage, let's actually create the subcommand as well.

```js
async auto(message, [role, member = message.member]) {
	// If the member is not manageable, send an error message
	if (!member.manageable) return message.send(`I do not have a role high enough to remove roles from ${member.displayName}`);
	// Check if the bot highest role is higher than the role provided so it can assign it
	const botHasHigherRole = message.guild.me.roles.highest.position > role.position;
	if (!botHasHigherRole) return message.send(`The role you provided was higher than the bots highest role.`);

	// If the member already has the role then send an error message
	const memberHasRole = member.roles.has(role.id);

	// if the member has the role remove it else add the role to the member
	const roleUpdated = memberHasRole ? await member.roles.remove(role.id).catch(() => null) : await member.roles.add(role.id).catch(() => null);

	// Send a response on whether or not the role was successfully added
	return message.send(roleUpdated ? `I have ${memberHasRole ? `removed` : `added`} the ${role.name} to ${member.displayName}.` : `I was unable to ${memberHasRole ? `remove` : `add`} the ${role.name} to ${member.displayName}`);
}
```

Nice! We even built a default subcommand. Let's give it a try. `+reload role` and then try to use the `auto` default subcommand this time by not providing add or remove. The bot should be smart enough to now handle the role addition or removal automatically.

```shell
+role @role @member
```

## Making A Custom Error Response
One of the best things about Klasa is that it is extremely flexible and customizable. However, there was one part of the command so far, that we were unable to customize. When you don't provide a `role` the response was always the same and we never coded that part. Klasa automatically handles it when a required argument in our usage was not provided by the user. Fear not, Klasa is so amazing that we can even customize this response.

Right under the `super` but inside the `constructor` we can create as many `customizeResponses` as we wish.

Let's go ahead and make a silly error response.

```js
const { Command } = require('klasa');
const { Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [`r`, `ro`, `rol`],
			bucket: 5,
			cooldown: 60,
			description: `Adds or removes a role from a member.`,
			extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`,
			permissionLevel: 6,
			requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			runIn: ['text'],
			subcommands: true,
			usage: `<add|remove|auto:default> <role:role> [member:member]`,
			usageDelim: ` `,
		});

		this.customizeResponse(`role`, `You did not give me any role to give to the member silly!`);
	}
}
```

The first argument should always be the left side of the usage. In this case `<role:role>` we used `role`. But if your usage was written like `<targetrole:role>`, we would have used `targetrole`. The second argument can accept a string to return or a function that can be used when you want the response to support other languages.

```js
this.customizeResponse(`role`, message => message.language.get(`COMMAND_ROLE_NO_ROLE_PROVIDED`));
```
> Note: We will cover languages in depth later in this guide. For now, we will stick with the first example.

Once again, make sure to `+reload role` and then try out what happens when you try the command without a role.

```shell
+role @member
+role add @member
+role remove @member
```

Klasa at it's core is always about being as customizable and flexible as possible.

## The Power Of Classes
There is another really cool benefit of Klasa that we haven't taken advantage of just yet. Since Klasa is centered around `Classes`, we can leverage this to make our code a lot cleaner.

Right now, we have a lot of repetitive code in every single function. So let's go ahead and clean that up. We can make a new function called `checkRequirements` that we can reuse in all the other subcommands we made.

```js
const { Command } = require('klasa');
const { Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [`r`, `ro`, `rol`],
			bucket: 5,
			cooldown: 60,
			description: `Adds or removes a role from a member.`,
			extendedHelp: `This command can add or remove a role from a member but it will require the user to have **MANAGE_GUILD** permissions to use. The command can be used in the following ways: **+role add @role**, **+role remove @role**, or **+role @role** if you want the bot to automatically add or remove based on if the member has the role already.`,
			permissionLevel: 6,
			requiredPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			runIn: ['text'],
			subcommands: true,
			usage: `<add|remove|auto:default> <role:role> [member:member]`,
			usageDelim: ` `,
		});

		this.customizeResponse(`role`, `You did not give me any role to give to the member silly!`);
	}

	// This is the add subcommand that will only add a role to the member
	async add(message, [role, member = message.member]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (memberHasRole) return message.send(`I can't add the ${role.name} role to ${member.displayName} because they already have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.add(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have added the ${role.name} to ${member.displayName}.` : `I was unable to add the ${role.name} to ${member.displayName}`);
	}


	async remove(message, [role, member = message.author]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);
		if (!memberHasRole) return message.send(`I can't remove the ${role.name} role to ${member.displayName} because don't have that role.`);
		// Add the role to the user
		const roleAdded = await member.roles.remove(role.id).catch(() => null);
		// Send a response on whether or not the role was successfully added
		return message.send(roleAdded ? `I have removed the ${role.name} to ${member.displayName}.` : `I was unable to remove the ${role.name} to ${member.displayName}`);
	}

	async auto(message, [role, member = message.member]) {
		// If the user did not meet the requirements cancel out of the command
		if (!(await this.checkRequirements(message, role, member))) return null;

		// If the member already has the role then send an error message
		const memberHasRole = member.roles.has(role.id);

		// if the member has the role remove it else add the role to the member
		const roleUpdated = memberHasRole ? await member.roles.remove(role.id).catch(() => null) : await member.roles.add(role.id).catch(() => null);

		// Send a response on whether or not the role was successfully added
		return message.send(roleUpdated ? `I have ${memberHasRole ? `removed` : `added`} the ${role.name} to ${member.displayName}.` : `I was unable to ${memberHasRole ? `remove` : `add`} the ${role.name} to ${member.displayName}`);
	}

	async checkRequirements(message, role, member) {
		// If the member is not manageable, send an error message
		if (!member.manageable) {
			await message.send(`I do not have a role high enough to remove roles from ${member.displayName}`);
			return false;
		}
		// Check if the bot highest role is higher than the role provided so it can assign it
		const botHasHigherRole = message.guild.me.roles.highest.position > role.position;
		if (!botHasHigherRole) {
			await message.send(`The role you provided was higher than the bots highest role.`);
			return false;
		}

		// If all requirements are met we want to return true
		return true;
	}

}
```

Woah! We have a fully built functional command with Klasa! This should show how amazing and flexible Klasa allows you to make commands. Now, you can easily go ahead and make as many commands as you like. Commands are actually the most complex part of Klasa. So, now that you have understood this, the rest is going to be much easier.

Now we can go ahead and create our first `Finalizer`.
