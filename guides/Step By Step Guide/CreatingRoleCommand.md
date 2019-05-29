`<add|remove|auto:default>`;
```
Now that we have added the default subcommand in the usage, let's actually create the subcommand as well.

```js
async auto(message, [role, member = message.member]) {
	// If the member is not manageable, send an error message
	if (!member.manageable) return message.send(`I do not have a role high enough to remove roles from ${member.displayName}`)
	// Check if the bot highest role is higher than the role provided so it can assign it
	const botHasHigherRole = message.guild.me.roles.highest.position > role.position
	if (!botHasHigherRole) return message.send(`The role you provided was higher than the bots highest role.`)

	// If the member already has the role then send an error message
	const memberHasRole = member.roles.has(role.id)

	// if the member has the role remove it else add the role to the member
	const roleUpdated = memberHasRole ? await member.roles.remove(role.id).catch(() => null) : await member.roles.add(role.id).catch(() => null)

	// Send a response on whether or not the role was successfully added
	return message.send(roleUpdated ? `I have ${memberHasRole ? `removed` : `added`} the ${role.name} to ${member.displayName}.` : `I was unable to ${memberHasRole ? `remove` : `add`} the ${role.name} to ${member.displayName}`)
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
	})

	this.customizeResponse(`role`, `You did not give me any role to give to the member silly!`)
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
			usageDelim: ` `
		});

		this.customizeResponse(`role`, `You did not give me any role to give to the member silly!`);
	}

	// This is the add subcommand that will only add a role to the member
	async add(message, [role, member = message.member]) {
		// If the user did not meet the requirements cancel out of the command
		if (!await this.checkRequirements(message, role, member)) return null;

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
		if (!await this.checkRequirements(message, role, member)) return null;

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
		if (!await this.checkRequirements(message, role, member)) return null;

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

};
```

Woah! We have a fully built functional command with Klasa! This should show how amazing and flexible Klasa allows you to make commands. Now, you can easily go ahead and make as many commands as you like. Commands are actually the most complex part of Klasa. So, now that you have understood this, the rest is going to be much easier.

Now we can go ahead and create our first `Finalizer`.
