> This feature is implemented in Klasa **0.5.0**, check the PR that implemented it [here](https://github.com/dirigeants/klasa/pull/162).

It is called **subcommand** to the special behaviour when a command takes multiple **Possible**s of literals as the first parameter, and the command has {@link CommandOptions.subcommands} set to true. An example is the [built-in conf](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/conf.js) command, which unlike any other command, it does not have a `Command#run` method.

How do subcommands work? The concept may be quite hard to *understand*; however, it's also very powerful. We will take the conf command as an example:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			subcommands: true,
			usage: '<set|remove|reset|show> (key:key) (value:value) [...]',
			usageDelim: ' '
		});
	}

	async set(message, params) {}
	async remove(message, params) {}
	async reset(message, params) {}
	async show(message, params) {}

};
```

As you may notice it, the command does not have a `Command#run` method, but it has one method for each literal that is taken as the first parameter, all of them lowercased. That is, to simplify the following pattern used in many commands:

```javascript
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			usage: '<set|remove|reset|show> (key:key) (value:value) [...]',
			usageDelim: ' '
		});
	}

	run(message, [type, ...params]) {
		return this[type](message, params);
	}

	async set(message, params) {}
	async remove(message, params) {}
	async reset(message, params) {}
	async show(message, params) {}

};
```

Both commands are equal, one key difference is that with the subcommands feature you omit the **run** method and Klasa does not call it anymore, saving you from using a "dynamic" usage based on the first (which is problematic for [TypeScript](https://www.typescriptlang.org/) users), and also saves time whilst the command keeps being simple and readable.

## The default Subcommand

You can also define a default subcommand to be run in your usage, without the user having to pass that text (still works if they do though). So say we wanted show to be the default subcommand. We would just set the usage to `<set|remove|reset|show:default> (key:key) (value:value) [...]` and then we would be able to run `!conf language` to see the language of the guild that command is run in.

> Please note that the default argument should always be last in your usage. The argument handler will always accept the default argument, as it's gotten to, so say it's first the command would always be run as show and would screw up the key value if passing any other subcommand.

## The TypeScript issue

Dynamic object assessment has been an issue for TypeScript, you can use them in dynamic objects (object literals, for example) because they imply an explicit `{ [K: string]: V }` by default, and to do so, they *may* have more objects until the object is strongly typed (without dynamic keys). In fact, most objects in JavaScript are dynamic, you can add or remove properties to and from them (hence dynamic), but there are several exceptions, [`Object.seal()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) and [`Object.freeze()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) (which implies a seal) "seal" the parameters for the object, making its parameters not longer editable (in the case of freeze, you cannot edit any property, they become readonly).

However, classes primitives are also "readonly-like" for the TypeScript compiler, there's no explicit `{ [K: string]: V }` implied, therefore, `this[key]` fails. To counter this issue, some users had to do a workaround using a [switch-case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) and hardcode the object accessment.

Thanks to this feature, they're not longer required to use this hacky behaviour, so they have less hardcoded, and much cleaner code. *(This feature had this issue solved as a side-effect, it was not even intended)*.

## Further learning:

- {@tutorial CommandsArguments}
- {@tutorial CommandsCustomResponses}
- {@tutorial CommandsCustomResolvers}
