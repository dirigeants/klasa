This is an in-depth tutorial for the **Klasa's Usage**. Unlike many other frameworks, Klasa and Komada use a system called **usage string** to improve simplicity, in the next three pages, you will learn how to use it correctly.

## Command Arguments

What are command arguments and how do they differ from parameters? Arguments are raw strings based on the input by the user split based on {@link Command#usageDelim} or {@link Command#quotedStringSupport}. A resolver converts the arguments to parameters based on the possible usage type.

For example, let's say you want a command to take a user and a channel, then you just put a string to usage being: `'<selectedUser:user> <selectedChannel:channel>'`, that tells the __internal parser__ to take and parse them, if both validate correctly in the command output (i.e. `[p]command @user #channel`), the internal parser will pass an instance of {@link KlasaUser} and {@link external:Channel} inside an array, being **parameters**.

In short, usage is what defines the input that the command and internal parser should take, message arguments ({@link KlasaMessage#args}) are the raw arguments (array of string), and message parameters ({@link KlasaMessage#params}) are an array with the parsed arguments.

## Structure

The command usage is an option for {@link CommandOptions.usage} and **requires** a {@link CommandOptions.usageDelim} string when there are multiple arguments. Why? Because if there's no usageDelim, `undefined` is implied, and [String#split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) doesn't split the string but converts it to a __single value array__ (message arguments), you definitively don't want this behaviour when you have two command arguments because it'll require at least two message arguments.

The structure is rather simple, {@link CommandOptions.usage} is always a string and not an object, and is inspired by the [CLI format standard](http://docopt.org/), inheriting the meaning for the tokens `<>` (required arguments), `[]` (optional elements), `|` (mutually exclusive or multiple choice) and `...` (repeating arguments), but adds more elements.

Arguments can **only** have one requirement level and cannot be into another, neither can they have spaces inside. That is, everything must be enclosed by `<` with `>`, `[` with `]` or `(` with `)`. They have different meanings.

- The first one (`<>`) defines **required** arguments, the command will not run until these arguments are processed correctly, they can be anywhere.
- The second one (`[]`) defines **optional** arguments, they're ignored when the input is incorrect and said message argument may drift to the next. That is, if you have an optional argument taking `1` and the next argument is `2` (both literals) and you pass `2`, the first parameter will be ignored while the second will take it (do not confuse with arguments).
- The latter (`()`) defines **semi-required** arguments, they are an hybrid between both and they can turn into required arguments when a value is the argument resolver dictates they are required (resolves to undefined if not required).

> Semi-required arguments are implemented in Klasa since 0.5.0, check PR [here](https://github.com/dirigeants/klasa/pull/162).

But in difference to the CLI command format standard, we have **our own standard**, and we implement more things such the aforementioned **semi-required** arguments, and more.

A more in-depth vision of arguments is that they are *arrays* of "possibles", that is, even if we aren't using the `|` token which defines extra types/possibles, there's always one for each argument. So `<nameOne:typeOne|nameTwo:typeTwo>` is an argument with **two possibles**. Each possible has their own structure and options:

- They are grouped into a "Tag" or "argument", a Tag is a parsed argument that contains these multiple possibles, therefore, possibles inherit the required level from them. For example, if a Tag is required and has 3 possibles, the __internal parser__ will try to parse all three until it finds one that resolves, in the opposite case (no match), it'll ask for one of them.
- They have their own names, types, and options. You can have a Tag with multiple types, for example, `<target:member|userID:string>` is a Tag with two possibles, one that will try to resolve into a `GuildMember` instance, or a `string` if it did not match (be careful as the `string` type is "lazy": it always resolve, so they should put last).

## Repeating arguments

Unlike in CLI, repeating arguments are **only** written as `[...]` and goes at the end of usage, making the last argument repeating. What does this mean? Let's say you want to have a [**choice**](https://github.com/dirigeants/klasa-pieces/blob/master/commands/Fun/choice.js) command, then you may want the user to write in multiple arguments, more likely with `,` as **usageDelim** to separate them. They you may put `<choice:string> [...]`, which makes the command take one or more parameters of this type.

Unlike normal arguments, a repeating one can resolve into one or more parameters, all of the same type (or of the first one that resolves if using multiple possibles), that being said, it's advisable to use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) for arrays if you have multiple arguments.

> **Note**: A common mistake is to use `[...choices]` in the `Command#run`, as you may know, `[...choices]` is identical to `choices` by the simple fact you're creating an array with all the elements of choices, or said in another way: an identical array. You can check it in the MDN link for spread syntax.

## Possible Structure

As mentioned before, a `Tag` is a **parsed argument tag** (`<>`, `()` or `[]`) that contains an array of **multiple Possible**s. But what is their format? Generally, they're written as `name:type`, where `name` is the name of the argument, and `type` is the type. However, depending on the type you can use the options or not.

- **name** is the name of the argument, they're used to identify an argument by giving it a name, a good name should be self explanatory and easy to read for the end user.
- **type** is the name of the type, they're not arbitrary but depends on the methods {@link ArgResolver} has. By default, there are many of them, such as `string`, `integer`, `msg`, `user`, `member`. You can also extend ArgResolver to implement extra methods, check this tutorial: {@tutorial CreatingCustomArguments}, however, if no type is given, the parser will assume them as **literal**.
- **options** always have the format `{min,max}`, taking two integers, both optional (you can specify `{,max}` for an argument with no minimum, or `{min}` for an argument with a minimum but not a maximum), and they're used mostly in the `string`, `number` (float) and `integer`, being the string length and the number the variables to handle, respectively.

## Examples

- We want a required argument that takes a user, and an optional argument for a role: `<targetUser:user> [targetRole:role]`.
- We want to accept `set`, `add`, `remove` or `reset` as required argument: `<set|add|remove|reset>`. (Remember that if no type is given, Usage will imply they are literals).
- We want to get a GuildMember instance, or its user ID if the user is not in the guild: `<targetMember:member|userID:string{17,18}>`. (Either a GuildMember resolvable or a string with a length of 17-18, which matches with a Discord snowflake's length).

## The Usage Analogy

Let's make everything basic:

- usage -> **blueprints**.
- arguments -> **wood**.
- resolvers -> **contractors**.
- parameters -> **houses**.

First, you write your blueprints for your houses, later, you receive wood from the woodcutters. The contractors will receive that wood and will try to build the houses with them based on the blueprints.

If the contractors work in a union, they pass on the wood to the next contractor until they can either build a house, or complain that nobody can. However, if the contractors says it's cool to not build a house here, they pass the wood on to the next place.

Credits to [@bdistin](https://github.com/bdistin) for this analogy.

## Further Reading:

- {@tutorial CommandsSubcommands}
- {@tutorial CommandsCustomResponses}
- {@tutorial CommandsCustomResolvers}
