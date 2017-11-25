## cooldown

Checks if a user is on cooldown for the command run.

**Source:**

[inhibitors/cooldown.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/cooldown.js)

## disable

Checks if the command is globally or locally disabled.

**Source:**

[inhibitors/disable.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/disable.js)

## missingBotPermissions

Checks to make sure the bot has all permissions needed (based on {@link Command#botPerms}) in the channel to run the command.

**Source:**

[inhibitors/missingBotPermissions.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/missingBotPermissions.js)

## permissions

Checks if the author/member has permission to use the command. (based on {@link Command#permLevel})

**Source:**

[inhibitors/permissions.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/permissions.js)

## requiredSettings

Checks if the guild has the required settings defined. (based on {@link Command#requiredSettings})

**Source:**

[inhibitors/requiredSettings.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/requiredSettings.js)

## runIn

Checks if the command can be run in the channel type this is. (based on {@link Command#runIn})

**Source:**

[inhibitors/runIn.js](https://github.com/dirigeants/klasa/blob/master/src/inhibitors/runIn.js)

## Further Reading:

- {@tutorial IncludedCommands}
- {@tutorial IncludedEvents}
- {@tutorial IncludedExtendables}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}