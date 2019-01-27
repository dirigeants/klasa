Creating a points system (also known as a **Social Module**) in your bot is quite easy in Klasa, as we will use our configuration system: **SettingsGateway**. You do NOT need to rewrite any of your code to change the provider, but we also suggest to **NOT** use the JSON provider for this in production, as you may reach the limit of files you can open simultaneously in your [OS](https://en.wikipedia.org/wiki/Operating_system).

## Setting the schema

Before we work with the social module, we need to update the built-in {@link GatewayDriver#users users' gateway} to implement a new key:

```javascript
KlasaClient.defaultUserSchema.add('experience', 'Integer', {
	default: 0,
	configurable: false
});
```

In this function, we are checking if the schema has the key `experience`. If it doesn't, we add it as a new key, with type `integer` (doubtfully we'll use `float` on this) and make it unconfigurable for the built-in userconf command so the end users do not cheat by modifying their stats.

> **Note**: The name of the key can be anything, can be `xp`, `points`... but we will use this one for the guide.

## Setting the monitor

Now that we have set up the schema, we will want to create a monitor:

```javascript
const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
	}

	async run(message) {
		// If the message was not sent in a TextChannel, ignore it.
		if (!message.guild) return;

		// Update the user's configuration entry by adding 1 to it.
		await message.author.settings.update('experience', message.author.settings.experience + 1);
	}

};
```

## Level up!

Some social bots have level up messages. How do we set it up? There are two ways to achieve this:

1. We calculate the current level and the next level on the fly. However, this system is harder to implement and is more expensive to execute, but it's also RAM friendly for massive bots. We won't cover this in the guide.
1. We add a level field. This makes the configuration update slower by nature as it will need to update two values. First, we will create the key:

```javascript
KlasaClient.defaultUserSchema.add('level', 'Integer', {
	default: 0,
	configurable: false
});
```

Then we pick up a level calculation algorithm, the following as an example:

```javascript
Math.floor(0.1 * Math.sqrt(POINTS + 1));
```

Then inside our monitor's run method:

```javascript
const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	// Constructor

	async run(message) {
		// If the message was not sent in a TextChannel, ignore it.
		if (!message.guild) return;

		// Calculate the next value for experience.
		const nextValue = message.author.settings.experience + 1;

		// Cache the current level.
		const currentLevel = message.author.settings.level;

		// Calculate the next level.
		const nextLevel = Math.floor(0.1 * Math.sqrt(nextValue + 1));

		// Update the user's configuration entry by adding 1 to it, and update the level also.
		await message.author.settings.update([['experience', nextValue], ['level', nextLevel]]);

		// If the current level and the next level are not the same, then it has increased, and you can send the message.
		if (currentLevel !== nextLevel) {
			// Send the message to the channel congratulating the user.
			await message.send(`Congratulations! You leveled up to level **${currentLevel}**!`);
		}
	}

	// Init

};
```

Optionally, you can check if `nextLevel === message.author.settings.level` is true and update a single key instead, but the speed difference is negligible and since [SettingsGateway v2.1](https://github.com/dirigeants/klasa/pull/179), the key `level` will not be updated if it did not change. As well, this overload is much faster than the JSON object overload, previously used as the only way to update multiple values.

## Creating Our Commands

To allow users to know their current amount of points and level, we will create two commands:

### Points Command

Let's create a file in `commands/Social/points.js` with the following contents:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Check how many points you have.' });
	}

	run(message) {
		return message.send(`You have a total of ${message.author.settings.experience} experience points!`);
	}

};

```

### Level Command

Let's create a file in `commands/Social/level.js` with the following contents:

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Check your current level.' });
	}

	run(message) {
		return message.send(`You are currently level ${message.author.settings.level}!`);
	}

};

```
