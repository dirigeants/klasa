## debug

Re-emits the Discord.js debug event as log event, if enabled. (disabled by default)

**Source:**
[events/debug.js](https://github.com/dirigeants/klasa/blob/master/src/events/debug.js)

## disconnect

Re-emits the disconnect error code and reason as log event.

**Source:**
[events/disconnect.js](https://github.com/dirigeants/klasa/blob/master/src/events/disconnect.js)

## error

Re-emits the Discord.js debug event as log event, if enabled.

**Source:**
[events/error.js](https://github.com/dirigeants/klasa/blob/master/src/events/error.js)

## guildCreate

Creates neccisary SettingGateway entries for the new guild.

**Source:**
[events/guildCreate.js](https://github.com/dirigeants/klasa/blob/master/src/events/guildCreate.js)

## guildDelete

Removes SettingGateway entries for the guild.

**Source:**
[events/guildDelete.js](https://github.com/dirigeants/klasa/blob/master/src/events/guildDelete.js)

## log

Logs event details to your console, with timestamps and color coding.

**Source:**
[events/log.js](https://github.com/dirigeants/klasa/blob/master/src/events/log.js)

## message

Runs monitors.

**Source:**
[events/message.js](https://github.com/dirigeants/klasa/blob/master/src/events/message.js)

## messageBulkDelete

Re-emits each message as a messageDelete, so that any deleted messages which are also cached CommandMessages, will be uncached.

**Source:**
[events/messageBulkDelete.js](https://github.com/dirigeants/klasa/blob/master/src/events/messageBulkDelete.js)

## messageUpdate

Re-emits if command editing is enabled, and if the content is not the same, to check and see if the new message is a edited command.

**Source:**
[events/messageUpdate.js](https://github.com/dirigeants/klasa/blob/master/src/events/messageUpdate.js)

## warn

Re-emits the Discord.js debug event as log event, if enabled.

**Source:**
[events/warn.js](https://github.com/dirigeants/klasa/blob/master/src/events/warn.js)
