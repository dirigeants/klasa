Something that is often asked or requested, is a custom member-based gateway; that is per member configs, so you would have different {@link Configuration} values for different guilds.

This is simple to achieve with Klasa's advanced Gateway system. In this example, we will be make a per member gateway with a built in key for points. We will be remaking the {@tutorial CreatingPointsSystems} tutorial, for members instead of users.

> Note: I would not recommend using the default (JSON) provider for this, as you may end up reaching the limit of JSON files your OS can open.

## Creating The Gateway

Inside your entry point (Where you define `new Client()`, for example, `index.js`) add this:

```javascript
client.gateways.register('members', {
	experience: {
		type: 'Integer',
		default: 10
	},
	level: {
		type: 'Integer',
		default: 1
	}
}, { provider: 'rethinkdb' });
```

And that's it, we now have a built in members gateway, however we have no way of accessing them via the [GuildMember](https://discord.js.org/#/docs/main/master/class/GuildMember) class. We'll tackle that next.

> Note: Gateways must be created before the "Ready" event is emmited. (i.e. before the bot is ready). See [Creating Gateways](https://github.com/dirigeants/klasa/blob/master/guides/Getting%20Started/UnderstandingSettingsGateway.md#creating-gateways) for more details.

## Creating Our Own GuildMember Class

We have the Gateway, so we just need to use [Custom Structures](https://discord.js.org/#/docs/main/master/class/Structures) to use it properly. Make a new file, and add this:

```javascript
const { Structures } = require('discord.js');

Structures.extend('GuildMember', GuildMember => class MyMember extends GuildMember {

	constructor(...args) {
		super(...args);
		this.configs = this.client.gateways.members.get(`${this.guild.id}-${this.id}`, true);
	}

});

```

Then, you'll need to require it somewhere; I suggest in your entry point. 

```javascript
require('./path-to/extension');

client.gateways.register('members', {
	experience: {
		type: 'Integer',
		default: 10
	},
	level: {
		type: 'Integer',
		default: 1
	}
}, { provider: 'rethinkdb' });

```

Alright! Now you have a fully functioning member-gateway. Now, we can create a per-guild level system.

## Level Up!

We will be taking code from {@tutorial CreatingPointsSystems}, and modifying it a small bit to work with the newly created member-gateway.

Create a new monitor, and add the following code:

```javascript
const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	// Constructor

	async run(message) {
		// If the message was not sent in a TextChannel, ignore it.
		if (!message.guild) return;

		// Calculate the next value for experience.
		const nextValue = message.member.configs.experience + 1;

		// Cache the current level.
		const currentLevel = message.member.configs.level;

		// Calculate the next level.
		const nextLevel = Math.floor(0.1 * Math.sqrt(nextValue + 1));

		// Update the members' configuration entry by adding 1 to it, and update the level also.
		await message.member.configs.update(['experience', 'level'], [nextValue, nextLevel]);

		// If the current level and the next level are not the same, then it has increased, and you can send the message.
		if (currentLevel !== nextLevel) {
			// Send the message to the channel congratulating the user.
			await message.send(`Congratulations! You leveled up to level **${currentLevel}**!`);
		}
	}

	// Init

};
```

## Creating A Command To Check Level

If the member wants to check there own level or experience, we can do so with two simple commands:

### Points Command

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Check how many points you have in this guild.' });
	}

	async run(message) {
		return message.send(`You have a total of ${message.member.configs.experience} experience points!`);
	}

};

```

### Level Command

```javascript
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Check your current level in this guild.' });
	}

	async run(message) {
		return message.send(`You are currently level ${message.member.configs.level}!`);
	}

};

```

## Preserved Configs

Klasa has a {@link KlasaClientOptions} for preserving guild configs, in case your bot leaves a guild. This however, would not be reflected in the current member-gateway, although it is easily fixable with a guildRemove event.

>Beware! This will delete all member configuration entries if your bot is kicked, you accidentally leave, etc.

```javascript
const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name: 'guildRemove' });
	}

	async run(guild) {
		// just in case of an outage, check if the guild is available, and also check if we are preserving configs.
		if (!guild.available || this.client.options.preserveConfigs) return;

		// filter all the entries which start with the guild id (all of the guilds members, which we are storing)
		const guildMembers = this.client.gateways.members.cache.filter(config => config.id.startsWith(guild.id));
		if (guildMembers.size) guildMembers.forEach(config => config.destroy());
	}

};

```

## All Done!

And there we have it! Your own custom member gateway, which you can use like any other gateway.
