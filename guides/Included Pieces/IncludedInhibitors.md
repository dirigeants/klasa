## cooldown

Checks if a user is on cooldown for the command run.

**Source:**

[inhibitors/cooldown.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/cooldown.js)

## disable

Checks if the command is globally or locally disabled.

**Source:**

[inhibitors/disable.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/disable.js)

## missingBotPermissions

Checks to make sure the bot has all permissions needed (based on {@link Command#requiredPermissions}) in the channel to run the command.

**Source:**

[inhibitors/missingBotPermissions.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/missingBotPermissions.js)

## nsfw

Checks if the command and the channel are both NSFW. Check {@link Command#nsfw} and {@link external:TextChannel#nsfw}

**Source:**

[inhibitors/nsfw.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/nsfw.js)

## permissions

Checks if the author/member has permission to use the command. (based on {@link Command#permissionLevel})

**Source:**

[inhibitors/permissions.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/permissions.js)

## requiredSettings (requiredSettings pre v0.5.0)

Checks if the guild has the required settings defined. (based on {@link Command#requiredSettings})

**Source:**

[inhibitors/requiredSettings.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/requiredSettings.js)

## runIn

Checks if the command can be run in the channel type this is. (based on {@link Command#runIn})

**Source:**

[inhibitors/runIn.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/runIn.js)

## Further Reading:

- {@tutorial IncludedArguments}
- {@tutorial IncludedCommands}
- {@tutorial IncludedEvents}
- {@tutorial IncludedExtendables}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}
- {@tutorial IncludedSerializers}
- {@tutorial IncludedTasks}
