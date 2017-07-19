## Usage Structure

`<>` required argument, `[]` optional argument `<Name:Type{min,max}>`

- **Name** Mostly used for debugging message, unless the type is Literal in which it compares the argument to the name.
- **Type** The type of variable you are expecting.
- **Min, Max** Minimum or Maximum for a giving variable (works on strings in terms of length, and on all types of numbers in terms of value) You are allowed to define any combination of min and max. Omit for none, `{min}` for min, `{,max}` for max. If you set `min` and `max` with the same integer, then the provided string must have equal length.
- **Special Repeat Tag** `[...]` will repeat the last usage optionally until you run out of arguments. Useful for doing something like `<SearchTerm:str> [...]` which will allow you to take as many search terms as you want, per your Usage Delimiter.

> Note: You can set multiple options in an argument by writting `|`. For example: `<Message:msg|Content:string{4,16}>` will work when you provide a message ID or a string with a length between 4 and 16 (including both limits).

### Usage Types

|                         Type | Description
| ---------------------------: | -----------
|                    `literal` | Literally equal to the Name. This is the default type if none is defined.
|             `str` , `string` | A [String](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String).
|            `int` , `integer` | An [Integer](https://en.wikipedia.org/wiki/Integer).
|   `num` , `number` , `float` | A [Floating Point Number](https://en.wikipedia.org/wiki/Floating-point_arithmetic).
|                    `boolean` | A [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean).
|                        `url` | A [URL](https://en.wikipedia.org/wiki/URL).
|            `msg` , `message` | A [Message](https://discord.js.org/#/docs/main/master/class/Message) instance returned from the message ID.
|                       `role` | A [Role](https://discord.js.org/#/docs/main/master/class/Role) instance returned from the role ID or mention.
|                    `channel` | A [TextChannel](https://discord.js.org/#/docs/main/master/class/TextChannel) instance returned from the channel ID or channel tag.
|                      `guild` | A [Guild](https://discord.js.org/#/docs/main/master/class/Guild) instance returned from the guild ID.
|           `user` , `mention` | A [User](https://discord.js.org/#/docs/main/master/class/User) instance returned from the user ID or mention.
|                     `member` | A [GuildMember](https://discord.js.org/#/docs/main/master/class/GuildMember) instance returned from the member ID or mention.
|            `cmd` , `command` | A {@link Command} instance returned from the command name or alias.
|                      `event` | An {@link Event} instance returned from the event name.
|                  `inhibitor` | An {@link Inhibitor} instance returned from the inhibitor name.
|                  `finalizer` | A {@link Finalizer} instance returned from the finalizer name.
|                    `monitor` | A {@link Monitor} instance returned from the monitor name.
|                   `provider` | A {@link Provider} instance returned from the provider name.

> Note: `Literal` is very useful in arguments with multiple options.

___

# Using arguments in your command.

Now, after we understand how to configurate the command, we'll start writting it:

```javascript
async run(msg, [...params]) {
	// This is where you place the code you want to run for your command
}
```

`[...params]` represents a variable number of parameters given when the command is run. The name of the parameters in the array (and their count) is determined by the `usage` property and its given arguments.

> Note that the commands' parameters are an array. This is a trick called [Destructuring assignment](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

For example, when you have: `"<Message:msg> <delete|edit> [newContent:string]"` as your usage, and `"|"` as your usageDelim, then the following code block is an example of how it would look like, and how we would work with them.

```javascript
async run(msg, [message, action, newContent]) {
  // code
};
```

In which `message` is the argument assigned to the message object as provided in `<Message:msg>` argument from usage. Same does `action` for `<delete|edit>` and respectively.

> Keep in mind that we declared `newContent` as an optional argument, if it's not provided, it'll return undefined.

Keep in mind that arguments are delimited by the character or combination of characters written in *usageDelim*. In this case, we have assigned the character `|` for it. How do we use this command? Easy:

`+messager 293107496191655936|delete`

The line above will execute the command with the name `messager` (or a command with `messager` as an alias), it'll use [Channel.fetchMessages](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=fetchMessage) (or [Channel.fetchMessages](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=fetchMessages) if the bot is a userbot). If the message is not found (you mistyped it or the message is in another channel) it'll warn you that the message hasn't been found. The next argument is a literal, in which must be either `delete` or `edit`.

> If you need something created before the command is ever ran, you can specify `init() {...}` to make Klasa run that portion of code beforehand.
