## Admin / blacklist

Allows bot owners to blacklist users and guilds from the bot.

**Source:**

[commands/Admin/blacklist.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/blacklist.js)

## Admin / conf

Allows authorized members to set per guild configuration.

**Source:**

[commands/Admin/conf.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/conf.js)

## Admin / disable

Temporarily global disable any piece except for extendables. (reverts to the in file settings upon reboot.)

**Source:**

[commands/Admin/disable.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/disable.js)

## Admin / enable

Temporarily global enable any piece except for extendables. (reverts to the in file settings upon reboot.)

**Source:**

[commands/Admin/enable.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/enable.js)

## Admin / eval

Evaluates arbitrary javascript code. Useful for debugging.

**Source:**

[commands/Admin/eval.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/eval.js)

## General / Chat Bot Info / help

The default help command, compiles the help details for all commands and sends them to the user's dm, or the channel if a selfbot.

**Source:**

[commands/General/Chat Bot Info/help.js](https://github.com/dirigeants/klasa/blob/master/src/commands/General/Chat%20Bot%20Info/help.js)

## General / Chat Bot Info / info

Standard info about klasa. Feel free to personalize, or provide bot statistics.

**Source:**

[commands/General/Chat Bot Info/info.js](https://github.com/dirigeants/klasa/blob/master/src/commands/General/Chat%20Bot%20Info/info.js)

## General / Chat Bot Info / invite

Provides an up to date invite link, taking into consideration all of the bot permissions all of your commands take to function.

**Source:**

[commands/General/Chat Bot Info/invite.js](https://github.com/dirigeants/klasa/blob/master/src/commands/General/Chat%20Bot%20Info/invite.js)

## General / Chat Bot Info / ping

Simple ping pong, measure the time between the two commands.

**Source:**

[commands/General/Chat Bot Info/ping.js](https://github.com/dirigeants/klasa/blob/master/src/commands/General/Chat%20Bot%20Info/ping.js)

## Admin / reboot

Reboots the bot, requires something like Forever or PM2 to actually restart the bot application.

**Source:**

[commands/Admin/reboot.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/reboot.js)

## Admin / reload

Reloads any piece, or all pieces of a specific category.

**Source:**

[commands/Admin/reload.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/reload.js)

## General / Chat Bot Info / stats

Info about the resources this bot is using.

**Source:**

[commands/General/Chat Bot Info/stats.js](https://github.com/dirigeants/klasa/blob/master/src/commands/General/Chat%20Bot%20Info/stats.js)

## Admin / Transfer

Transfers a core piece to your user directories, so you can edit them to your preferences.

**Source:**

[commands/Admin/transfer.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/transfer.js)

## Admin / unload

Unloads any piece except extendables.

**Source:**

[commands/Admin/unload.js](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/unload.js)

## General / User Configs / userconf

Allows users to change their configurations.

**Source:**

[commands/General/User Configs/userconf.js](https://github.com/dirigeants/klasa/blob/master/src/commands/General/User%20Configs/userconf.js)

## Further Reading:

- {@tutorial IncludedEvents}
- {@tutorial IncludedExtendables}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedInhibitors}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}
- {@tutorial IncludedTasks}
