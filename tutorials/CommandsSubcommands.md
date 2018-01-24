> This feature is implemented in Klasa **0.5.0**, check the PR that implemented it [here](https://github.com/dirigeants/klasa/pull/162).

It is called **subcommand** to the special behaviour when a command takes multiple **Possible**s of literals as the first parameter, and the command has {@link CommandOptions.subcommands} set to true. An example is the [built-in conf](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/conf.js) command, which unlike any other command, it does not have a `Command#run` method.

How do subcommands work? The concept may be quite hard to *get* but it's very powerful. We will take the conf command as an example:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			subcommands: true,
			usage: '<get|set|remove|reset|list> (key:key) (value:value) [...]',
			usageDelim: ' '
		});
	}

	async get(msg, params) {}
	async set(msg, params) {}
	async remove(msg, params) {}
	async reset(msg, params) {}
	async list(msg, params) {}

};
```

As you may notice it, the command does not have a `Command#run` method, but it has one method for each literal that is taken as first parameter, all of them lowercased. That is, to simplify the following pattern used in many commands:

```javascript
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			usage: '<get|set|remove|reset|list> (key:key) (value:value) [...]',
			usageDelim: ' '
		});
	}

	run(msg, [type, ...params]) {
		return this[type](msg, params);
	}

	async get(msg, params) {}
	async set(msg, params) {}
	async remove(msg, params) {}
	async reset(msg, params) {}
	async list(msg, params) {}

};
```

Both commands are equal, one key difference is that with the subcommands feature you omit the **run** method and Klasa does not call it anymore, saving you from using a "dynamic" usage based on the first (which is problematic for [TypeScript](https://www.typescriptlang.org/) users), and also saves time whilst the command keeps being simple and readable.

## The TypeScript issue

Dynamic object assessment has been an issue for TypeScript, you can use them in dynamic objects (object literals, for example) because they imply an explicit `{ [K: string]: V }` by default, and to do so, they *may* have more objects until the object is strongly typed (without dynamic keys). In fact, most objects in JavaScript are dynamic, you can add or remove properties to and from them (hence dynamic), but there are several exceptions, [`Object.seal()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) and [`Object.freeze()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) (which implies a seal) "seal" the parameters for the object, making its parameters not longer editable (in the case of freeze, you cannot edit any property, they become readonly).

However, classes primitives are also "readonly-like" for the TypeScript compiler, there's no explicit `{ [K: string]: V }` implied, therefore, `this[key]` fails. To counter this issue, some users had to do a workaround using a [switch-case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) and hardcode the object accessment.

Thanks to this feature, they're not longer required to use this hacky behaviour, so they have less hardcoded, and much cleaner code. *(This feature had this issue solved as a side-effect, it was not even intended)*.

## Further learning:

- {@tutorial CommandsArguments}
- {@tutorial CommandsCustomResponses}
- {@tutorial CommandsCustomResolvers}
