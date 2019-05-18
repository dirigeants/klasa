Permission Levels are what defines who has permission to use what command. They cascade up to a permission level break, so guild owners can do everything the lower levels can do, and so on.

For instance the conf command requires level 6 to run, by default this is how it works:

- level 6 requires 'MANAGE_GUILD' Permission: true/false
- level 7 is the Guild Owner: true/false
- level 8 is not defined, and always returns false
- level 9 is the Bot Owner, and has break so we will stop checking higher rules: true/false

If any check from 6-9 returns true, the user will be able to run that command. Also, if no break is encountered, the command will silently fail, instead of telling the user "they don't have permission to use x command"...

## Understanding "Breaking Levels"

Pretend for a moment, that permission levels work like this:

<!-- eslint-disable no-fallthrough -->

```javascript
function permissionLevel(message) {
	switch (level) {
		case 0:
			return true;
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			if (message.guild && message.member.permissions.has('MANAGE_GUILD')) return true;
		case 7:
			if (message.guild && message.member === message.guild.owner) return true;
		case 8:
		case 9:
			if (message.client.owners.has(author)) return true;
			break;
		case 10:
			if (message.client.owners.has(author)) return true;
			return false;
	}
	throw 'You don\'t have permission';
}
```

<!-- eslint-enable no-fallthrough -->

Completely ignoring that your check function can be async and returning false is how you progress to the next check if applicable, it works like that. It checks levels starting with the __minimum level__ acceptable for any action. (Usually a {@link Command#permissionLevel}) And it continues checking higher levels until it __returns true__ or hits a break. And if there is no break when levels run out, it's silent.

This does mean that you can design permission levels where guild owners, and even you the client/bot owner can't access. Say you have a breaking permission level 3 that checks if `message.author.settings.xp >= 1000`. When a command with a permissionLevel of 3 is called, if you don't have that much xp, it will return you don't have permission to use that command even though you may satisfy higher levels. It breaks at that level, and won't check anything higher.

## Creating Completely Custom PermissionLevels

Each level consists of a number (the level), a function (the check function that returns true or false), and an options object with break (if the level is breaking) and fetch (if the level should autofetch member when appropriate). Check: {@link PermissionLevels#add}

Example:

```javascript
const { Client, PermissionLevels } = require('klasa');
const config = require('./config.json');

config.permissionLevels = new PermissionLevels()
	/*
	 * Optionally you can pass a number to set a custom number of permission levels.
	 * It is not advised however, as internal commands expect 10 to be the highest permission level.
	 * Modifying away from 10 without further modification of all core commands,
	 * could put your server at risk of malicious users using the core eval command.
	 */
	// everyone can use these commands
	.add(0, () => true)
	// Members of guilds must have 'MANAGE_GUILD' permission
	.add(6, ({ guild, member }) => guild && member.permissions.has('MANAGE_GUILD'), { fetch: true })
	// The member using this command must be the guild owner
	.add(7, ({ guild, member }) => guild && member === guild.owner, { fetch: true })
	/*
	 * Allows the Bot Owner to use any lower commands
	 * and causes any command with a permission level 9 or lower to return an error if no check passes.
	 */
	.add(9, ({ author, client }) => client.owners.has(author), { break: true })
	// Allows the bot owner to use Bot Owner only commands, which silently fail for other users.
	.add(10, ({ author, client }) => client.owners.has(author));

new Client(config).login(config.token);
```

## Customizing the default PermissionLevels

Another way you can customize permission levels is simply modifying the defaultPermissionLevels:

Example:

```javascript
const { Client } = require('klasa');
const config = require('./config.json');

Client.defaultPermissionLevels
	// let some group of people who solved some easteregg clues use a special command/some custom non-admin role
	.add(3, ({ guild, author }) => guild && guild.settings.solvers.includes(author.id))
	// Make the requirements to use the conf command stricter than just who can add the bot to the guild
	.add(6, ({ guild, member }) => guild && member.permissions.has('ADMINISTRATOR'), { fetch: true })
	// add a role above guild owners that let your support team help setup/troubleshoot on other guilds.
	.add(8, ({ client, author }) => client.settings.botSupportTeam.includes(author.id));

new Client(config).login(config.token);
```

## What's different from Komada?

Permission levels are fairly close to Komada's Permission levels, with a few exceptions.

### The default permission level structure is different: {@link KlasaClient.defaultPermissionLevels}

| Level | Break | Fetch | Description                                           |
| ----- | ----- | ----- | ----------------------------------------------------- |
| 0     | false | false | Everyone can use these commands                       |
| 6     | false | true  | Members of guilds must have 'MANAGE_GUILD' permission |
| 7     | false | true  | Guild Owner                                           |
| 9     | true  | false | Bot Owner                                             |
| 10    | false | false | Bot Owner (silent)                                    |

>This gives the bot creator a cleaner slate to work with when first creating a bot. (Not all bots are mod bots, so mod/admin roles were largely unneeded. Also there is infinitely more that you would want to put between 0 and administrative users, than between Guild Owner and Bot Owner). This helps keep bot creators from having to completely "remake the wheel" of permissions in almost all cases, without preventing that if wanted. (This fixes most cases of those who perpetually had to transfer/modify core commands to match their custom permissionLevels.)

### Since inhibitors are async in Klasa, check functions may be async

So you can have:

```javascript
Client.defaultPermissionLevels
	.add(3, async (message) => {
		const value = await someAsyncFunction();
		return value === someOtherValue;
	});
```
