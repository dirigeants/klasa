## MessageExtendable

| Name           | Description                                                        |
| :------------: | ------------------------------------------------------------------ |
| get attachable | A getter to check and see if you can attach files in the channel.  |
| get embedable  | A getter to check and see if you can embed links in the channel.   |
| get postable   | A getter to check and see if you can send messages in the channel. |
| get readable   | A getter to check and see if you can read in the channel.          |

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/MessageExtendable.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/MessageExtendable.js)

## SendAliases

| Name        | Description                                          |
| :---------: | ---------------------------------------------------- |
| sendCode    | A shortcut to `channel.send` for codeblocks.         |
| sendEmbed   | A shortcut to `channel.send` for embeds.             |
| sendFile    | A shortcut to `channel.send` for a single file.      |
| sendFiles   | A shortcut to `channel.send` for multiple files.     |
| sendLocale  | A shortcut to `channel.send` for localized messages. |
| sendMessage | Alias of `channel.send`                              |

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/SendAliases.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/SendAliases.js)

## Further Reading:

- {@tutorial IncludedArguments}
- {@tutorial IncludedCommands}
- {@tutorial IncludedEvents}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedInhibitors}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}
- {@tutorial IncludedSerializers}
- {@tutorial IncludedTasks}
