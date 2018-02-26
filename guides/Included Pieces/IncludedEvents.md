## commandError

Handles command errors.

**Source:**

[events/commandError.js](https://github.com/dirigeants/klasa/blob/master/src/events/commandError.js)

## commandInhibited

Replies with the reason why the command was inhibited.

**Source:**

[events/commandInhibited.js](https://github.com/dirigeants/klasa/blob/master/src/events/commandInhibited.js)

## configUpdateEntry

Synchronises the user configs between all shards, if the bot is sharded.

**Source:**

[events/configUpdateEntry.js](https://github.com/dirigeants/klasa/blob/master/src/events/configUpdateEntry.js)

## debug

Re-emits the Discord.js debug event as log event, if enabled. (disabled by default)

**Source:**

[events/debug.js](https://github.com/dirigeants/klasa/blob/master/src/events/debug.js)

## disconnect

Re-emits the disconnect error code and reason as log event.

**Source:**

[events/disconnect.js](https://github.com/dirigeants/klasa/blob/master/src/events/disconnect.js)

## error

Re-emits the Discord.js error event as log event, if enabled.

**Source:**

[events/error.js](https://github.com/dirigeants/klasa/blob/master/src/events/error.js)

## eventError

Handles the errors thrown by any of the events.

**Source:**

[events/eventError.js](https://github.com/dirigeants/klasa/blob/master/src/events/eventError.js)

## finalizerError

Handles the errors thrown by any of the finalizers.

**Source:**

[events/finalizerError.js](https://github.com/dirigeants/klasa/blob/master/src/events/finalizerError.js)

## guildCreate

Checks if the guild is blacklisted for automatic leaving.

**Source:**

[events/guildCreate.js](https://github.com/dirigeants/klasa/blob/master/src/events/guildCreate.js)

## guildDelete

If `KlasaClientOptions.preserveConfigs` is set to `false` (defaults to `true` if not set), this event deletes entries from the database to free up space.

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

## messageDelete

If the message ran a command with the property `deletable` set to `true`, this event will delete the response.

**Source:**

[events/messageDelete.js](https://github.com/dirigeants/klasa/blob/master/src/events/messageDelete.js)

## messageDeleteBulk

Re-emits all the messages deleted to the `messageDelete` event.

**Source:**

[events/messageDeleteBulk.js](https://github.com/dirigeants/klasa/blob/master/src/events/messageDeleteBulk.js)

## messageUpdate

Re-emits if command editing is enabled, and if the content is not the same, to check and see if the new message is a edited command.

**Source:**

[events/messageUpdate.js](https://github.com/dirigeants/klasa/blob/master/src/events/messageUpdate.js)

## monitorError

Handles the errors thrown by any of the monitors.

**Source:**

[events/monitorError.js](https://github.com/dirigeants/klasa/blob/master/src/events/monitorError.js)

## onceReady

The internal once ready handler.

**Source:**

[events/onceReady.js](https://github.com/dirigeants/klasa/blob/master/src/events/onceReady.js)

## taskError

Handles the errors thrown by any of the tasks.

**Source:**

[events/taskError.js](https://github.com/dirigeants/klasa/blob/master/src/events/taskError.js)

## verbose

Logs verbose messages to the console.

**Source:**

[events/verbose](https://github.com/dirigeants/klasa/blob/master/src/events/verbose.js)

## warn

Re-emits the Discord.js warn event as log event, if enabled.

**Source:**

[events/warn.js](https://github.com/dirigeants/klasa/blob/master/src/events/warn.js)

## wtf

Stands for '**W**hat a **T**errible **F**ailure'. Logs fatal errors.

**Source:**

[events/wtf](https://github.com/dirigeants/klasa/blob/master/src/events/wtf.js)

## Further Reading:

- {@tutorial IncludedCommands}
- {@tutorial IncludedExtendables}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedInhibitors}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}
- {@tutorial IncludedTasks}
