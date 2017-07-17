# Creating your own Commands

New commands are created in the `./commands/` folder, where subfolders are the categories offered in the help command. For instance adding `./commands/Misc/test.js` will create a command named `test` in the `Misc` category. Subcategories can also be created by adding a second folder level.

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'info', {
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: '',
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
		});
	}

	async run(msg, [...params]) {
        // This is where you place the code you want to run for your command
	}

	async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
```

> All commands are required to return an [Object Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) you can do that by adding the `async` keyword to the function, there's no need to change anything else.

`[...params]` represents a variable number of arguments give when the command is run. The name of the arguments in the array (and their count) is determined by the `usage` property and its given arguments.
