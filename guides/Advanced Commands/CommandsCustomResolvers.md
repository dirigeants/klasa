> This feature is implemented in Klasa **0.5.0**, check the PR that implemented it [here](https://github.com/dirigeants/klasa/pull/162).

## Custom Resolvers

Custom resolvers allow developers to set up custom types for each command, they are highly customizable and can hold its own logic and type name. This is possible thanks to the {@link Command.createCustomResolver} method.

## Creating a custom Command Resolver

A custom resolver is usually created in the command constructor and its usage is identical to {@link ArgResolver} methods:

```javascript
this.createCustomResolver('key', (arg, possible, msg, params) => {
	// Logic
});
```

Where the first parameter is the name of the custom type, and the second is a function that takes `arg` (string), `possible` ({@link Possible}), `msg` ({@link KlasaMessage}) and optionally, `params` (any[], remember parameters are parsed arguments).

Then in your usage, you can use the type `key`, it'll be recognized as a *local* resolver that your command is able to use. Check a live example [here](https://github.com/dirigeants/klasa/blob/c47891581806e64ebf53706231a69037d70dd077/src/commands/Admin/conf.js#L5-L25). You can also check the tutorial {@tutorial CreatingCustomArguments} for further information.

## Further Reading:

- {@tutorial CommandsArguments}
- {@tutorial CommandsCustomResponses}
- {@tutorial CommandsSubcommands}
