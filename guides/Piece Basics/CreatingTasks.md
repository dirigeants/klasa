New tasks are created in the `./tasks/` folder, they are simple pieces that run from {@link Schedule} after a {@link ScheduledTask} end-of-life or recurrence time. The `data` field, also called *metadata*, is an option that can contain anything, even an object. Note that this gets [`JSON.stringify()`'ed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) in SQL so it gets parsed back on start-up.

Their structure is the following:

```javascript
const { Task } = require('klasa');

module.exports = class extends Task {

	constructor(...args) {
		super(...args, { name: 'yourTaskName', enabled: true });
	}

	async run(metadata) {
		// The code that will receive the metadata from the task
	}

	async init() {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 */
	}

};
```

Where `metadata` is what you passed to `ScheduledTaskOptions.data`, `null` if not passed.

## Creating a timed ScheduledTask

After you have created your {@link Task} piece, you'll be able to create the first scheduled tasks for it:

```javascript
this.client.schedule.create('reminder', Date.now() + (1000 * 60), {
	data: {
		// This is the metadata. In one minute after the creation of this scheduled
		// task, Schedule will call your new task with this object.
		user: msg.author.id,
		text: 'This is a reminder',
		channel: msg.channel.id
	},
	catchUp: true
	// This task will try to run again (catch up) if the bot was off when it was meant to fire
});
```

> **NOTE**: What the data field stores is up to the developer, it serves the purpose of storing tiny metadata for later usage in a Task piece. You can omit this if you don't want to pass specific data (such as a `backup` task), it can be anything that can be `JSON.stringify()`ed and `JSON.parse()`ed: `null`, `number`, `string`, `boolean`, `array`, (literal) `object`...).

Source code:

```javascript
const { Task } = require('klasa');

module.exports = class extends Task {

	async run({ channel, user, text }) {
		const _channel = this.client.channels.get(channel);
		return _channel.send(`<@${user}> You wanted me to remind you: ${text}`);
	}

};
```

Check the source of the piece above [here](https://github.com/dirigeants/klasa-pieces/blob/9ba1c48b08ad2b1ea55aeadc6d7e8e067346c0a2/tasks/reminder.js).

## Creating a recurring ScheduledTask

Recurring tasks, as opposed to timed tasks, never end unless told to do so. They simply reschedule the task for the next possible time whenever executed. The recurring format is heavily based on [Cron](https://en.wikipedia.org/wiki/Cron) and has support for many wildcards. It also supports predefined patterns such as `'@daily'`, `'@weekly'`, `'@monthly'` and `'@yearly'` to improve simplicity. You can also generate these patterns with this tool: [**Crontab Generator**](https://crontab-generator.org/) (put a random command such as `echo "test"` to get the pattern), which allows you to create them quickly and check the next 5 dates the crontab pattern will run.

```javascript
this.client.schedule.create('backup', '0 0 * * tue,fri');
```

The pattern above is a **Crontab pattern** that runs every Tuesday and Friday at 00:00 UTC, and will execute the task `backup` every time it ends.

## Configuration

| Name        | Default       | Type    | Description                        |
| ----------- | ------------- | ------- | ---------------------------------- |
| **name**    | `theFileName` | string  | The name of the task               |
| **enabled** | `true`        | boolean | Whether the task is enabled or not |

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
