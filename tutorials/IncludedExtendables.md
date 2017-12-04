## get attachable

A getter to check and see if you can attach files in the channel.

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/attachable.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/attachable.js)

## get embedable

A getter to check and see if you can embed links in the channel.

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/embedable.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/embedable.js)

## get guildSettings

A getter to check get either the guild settings if in a guild, or the default bot settings in dm/group dm.

**Applies to:**

- {@link external:Message}

**Source:**

[extendables/guildSettings.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/guildSettings.js)

## get postable

A getter to check and see if you can send messages in the channel.

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/postable.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/postable.js)

## get language

A getter to get the configured language.

**Applies to:**

- {@link external:Guild}
- {@link external:Message}

**Source:**

[extendables/language.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/language.js)

## get reactable

A getter to check and see if you can react in the channel.

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/reactable.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/reactable.js)

## get readable

A getter to check and see if you can read in the channel.

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/readable.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/readable.js)

## get settings

A getter to get the settings in a guild.

**Applies to:**

- {@link external:Guild}

**Source:**

[extendables/settings.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/settings.js)

## get usableCommands

A getter to return a collection of usable commands by the message author/member.

**Applies to:**

- {@link external:Message}

**Source:**

[extendables/usableCommands.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/usableCommands.js)

## hasAtLeastPermissionLevel(permission:number)

Checks to see if the author/member has atleast the Permission level passed.

**Applies to:**

- {@link external:Message}

**Source:**

[extendables/hasAtLeastPermissionLevel.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/hasAtLeastPermissionLevel.js)

## send(content:string, options:Object)

A shortcut to channel.send, but also makes the response an editable command.

**Applies to:**

- {@link external:Message}

**Source:**

[extendables/send.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/send.js)

## sendCode

A shortcut to channel.send, but also makes the response an editable command.

**Applies to:**

- {@link external:Message}
- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/sendCode.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/sendCode.js)

## sendEmbed

A shortcut to channel.send, but also makes the response an editable command.

**Applies to:**

- {@link external:Message}
- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/sendEmbed.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/sendEmbed.js)

## sendFile

A alias to channel.send({files:{file:....

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/sendFile.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/sendFile.js)

## sendFiles

A alias to channel.send({files:...

**Applies to:**

- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/sendFiles.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/sendFiles.js)

## sendMessage

A shortcut to channel.send, but also makes the response an editable command.

**Applies to:**

- {@link external:Message}
- {@link external:GroupDMChannel}
- {@link external:DMChannel}
- {@link external:TextChannel}

**Source:**

[extendables/sendMessage.js](https://github.com/dirigeants/klasa/blob/master/src/extendables/sendMessage.js)

## Further Reading:

- {@tutorial IncludedCommands}
- {@tutorial IncludedEvents}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedInhibitors}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}
