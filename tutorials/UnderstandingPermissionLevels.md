Permission Levels are what defines who has permission to use what command. They cascade up to a permission level break, so guild owners can do everything the lower levels can do, and so on.

For instace the conf command requires level 6 to run, by default this is how it works:

- level 6 requires 'MANAGE_GUILD' Permission: true/false
- level 7 is the guild Owner: true/false
- level 8 is not defined, and always returns false
- level 9 is the bot owner, and has break so we will stop checking higher rules: true/false

If any check from 6-9 returns true, the user will be able to run that command. Also, if no break is encountered, the command will silently fail, instead of telling the user "they don't have permission to use x command"...

## Creating Completely Custom PermissionLevels

Each level consists of a number (the level), a boolean (whether the level is a break or not), and a function (the check function that returns true or false). {@link PermissionLevels.addLevel}

Example:

```javascript
const { Client, PermissionLevels } = require('klasa');
const config = require('./config.json');

config.permissionLevels = new PermissionLevels()
//Optionally you can pass a number to set a custom number of permission levels. It is not advised however, as internal commands expect 10 to be the highest permission level. Modifying away from 10 without further modification of all core commands, could put your server at risk of malicious users using the core eval command.
	.addLevel(0, false, () => true)
	// everyone can use these commands
	.addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
	// Members of guilds must have 'MANAGE_GUILD' permission
	.addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	// The member using this command must be the guild owner
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	// Allows the Bot Owner to use any lower commands, and causes any command with a permission level 9 or lower to return an error if no check passes.
	.addLevel(10, false, (client, msg) => msg.author === client.owner);
	// Allows the bot owner to use Bot Owner only commands, which silently fail for other users.

new Client(config).login(config.token);
```

## Customizing the default PermissionLevels

Another way you can customize permission levels is simply modifying the defaultPermissionLevels:

Example:

```javascript
const { Client } = require('klasa');
const config = require('./config.json');

Client.defaultPermissionLevels
    .addLevel(3, false, ...)
	// let some group of people who solved some easteregg clues use a special command/some custom non-admin role
    .addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('ADMINISTRATOR'))
	// Make the requirements to use the conf command stricter than just who can add the bot to the guild
    .addLevel(8, false, (client, msg) => client.config.botSupportTeam.includes(msg.author.id));
	// add a role above guild owners that let your support team help setup/troubleshoot on other guilds.

new Client(config).login(config.token);
```

## What's different from Komada?

Permission levels are fairly close to the same as Komada Permission levels, with a few exceptions.

### The default permission level structure is different: {@link KlasaClient.defaultPermissionLevels}

| Level | Break | Description                                           |
| ----- | ----- | ----------------------------------------------------- |
| 0     | false | Everyone can use these commands                       |
| 6     | false | Members of guilds must have 'MANAGE_GUILD' permission |
| 7     | false | Guild Owner                                           |
| 9     | true  | Bot Owner                                             |
| 10    | false | Bot Owner (silent)                                    |

>This gives the bot creator a more blank slate to work with when first creating a bot. (Not all bots are mod bots, so mod/admin roles were largly unneed. Also there is infinitly more that you would want to put between 0 and administrative users, than between Guild Owner and Bot Owner). This helps keep bot creators from having to completely "remake the wheel" of permissions in almost all cases, without preventing that if wanted. (This fixes most cases of those who perpetually had to transfer/modify core commands to match their custom permissionLevels.)

### Since inhibitors are async in Klasa, check functions may be async

So you can have:

```javascript
    .addLevel(3, false, async(client, msg) => {
		const value = await someAsyncFunction();
		return value === someOtherValue;
	});
```

### Levels may be Overwritten/You can have any number of levels

Currently in Komada, if you try to overwrite a level, it will throw an error. And PermissionLevels must be from 0-10 on komada. *(This may change in the future)*
