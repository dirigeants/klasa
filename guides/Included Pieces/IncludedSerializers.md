## any

The most elemental serializer, its serializer and deserializer simply returns the input itself without any checks, this is the most suitable type when you want to use objects.

**Source:**

[serializers/any.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/any.js)

## boolean

The boolean serializer, serializes to a boolean primitive, and the deserializer resolves `1`, `true`, `+`, `t`, `yes`, and `y`, into the boolean `true`, and `0`, `false`, `-`, `f`, `no`, and `n`, into the boolean `false`. Stringifies to `Enabled` or `Disabled`, respectively.

**Source:**

[serializers/boolean.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/boolean.js)

## channel / textchannel / voicechannel / categorychannel

The channel serializer, serializes to the channel's id, and the deserializer resolves a Channel instance, a channel tag, or a channel id, into its respective type. Stringifies to its name.

**Source:**

[serializers/channel.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/channel.js)

## guild

The guild serializer, serializes to the guild's id, and the deserializer resolves a Guild instance or a guild id, into a Guild. Stringifies to its name.

**Source:**

[serializers/guild.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/guild.js)

## number / integer / float

The number serializer, serializes to a number primitive, and the deserializer resolves either an integer (`integer` type) or a float (`number` or `float`).

**Source:**

[serializers/number.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/number.js)

## piece / command / language

The piece serializer, serializes to the piece's name, and the deserializer resolves a Piece instance or a name into a Piece. Stringifies to its name.

**Source:**

[serializers/piece.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/piece.js)

## role

The role serializer, serializes to the role's id, and the deserializer resolves a Role instance, a role mention, or a role id, into a Role instance. Stringifies to the role's name.

**Source:**

[serializers/role.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/role.js)

## string

The string serializer, serializes to a string primitive, and the deserializer coherces everything to string.

**Source:**

[serializers/string.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/string.js)

## url

The url serializer, serializes to a string primitive, and the deserializer checks whether the url is valid or not.

**Source:**

[serializers/url.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/url.js)

## user

The user serializer, serializes to the user's id, and the deserializer resolves a User instance, a user mention, or a user id, into a User instance. Stringifies to the user's username.

**Source:**

[serializers/user.js](https://github.com/dirigeants/klasa/blob/master/src/serializers/user.js)

## Further Reading:

- {@tutorial IncludedArguments}
- {@tutorial IncludedCommands}
- {@tutorial IncludedEvents}
- {@tutorial IncludedExtendables}
- {@tutorial IncludedFinalizers}
- {@tutorial IncludedInhibitors}
- {@tutorial IncludedLanguages}
- {@tutorial IncludedMonitors}
- {@tutorial IncludedProviders}
- {@tutorial IncludedTasks}
