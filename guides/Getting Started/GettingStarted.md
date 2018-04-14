## Installing Klasa

Time to take the plunge! Klasa is on NPM and can be easily installed.

> I assume you know how to open a command prompt in a folder where you want to install this. Please don't prove me wrong.

```sh
npm install --save discordjs/discord.js klasa
```

optionally if you want to use the bleeding edge development version (not guaranteed to be stable):

```sh
npm install --save discordjs/discord.js dirigeants/klasa
```

### Using Klasa

Create a file called `app.js` (or whatever you prefer) which will initiate and configure Klasa.

```javascript
const { Client } = require('klasa');

new Client({
	fetchAllMembers: false,
	prefix: '+',
	cmdEditing: true,
	typing: true,
	readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
}).login('your-bot-token');
```

### Configuration Options: {@link KlasaClientOptions}

| Name                       | Default                   | Type               | Description                                                                         |
| -------------------------- | ------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| **cmdEditing**             | `false`                   | boolean            | Whether the bot should update responses if the command is edited                    |
| **cmdLogging**             | `false`                   | boolean            | Whether the bot should log command usage                                            |
| **commandMessageLifetime** | `1800`                    | number             | The threshold for when command messages should be sweeped in seconds since last edit |
| **ignoreBots**             | `true`                    | boolean            | Whether or not this bot should ignore other bots                                    |
| **ignoreSelf**             | `client.user.bot`         | boolean            | Whether or not this bot should ignore itself (true for bots, false for selfbots)    |
| **language**               | `en-US`                   | string             | The default language Klasa should opt-in for the commands                           |
| **ownerID**                | see below¹                | string             | The Discord ID for the user the bot should respect as the owner                     |
| **permissionLevels**       | `defaultPermissionLevels` | PermissionLevels   | The permission levels to use with this bot                                          |
| **prefix**                 | `undefined`               | string/array       | The default prefix(es) when the bot first boots up.²                                |
| **promptTime**             | `30000`                   | number             | The amount of time in milliseconds prompts should last                              |
| **providers.default**      | `json`                    | string             | The default provider to use in Klasa                                                |
| **quotedStringSupport**    | `false`                   | boolean            | Whether the bot should default to using quoted string support³                      |
| **readyMessage**           | see below⁴                | string/function    | readyMessage to be passed through to Klasa's ready event.                           |
| **regexPrefix**            | `null`                    | regex              | The regular expression prefix if one is provided                                    |
| **typing**                 | `false`                   | boolean            | Whether the bot should type while processing commands.                              |

>1. ID gotten from the Discord API if not provided: `client.application.owner.id`
>1. You can pass an array to accept multiple prefixes.
>1. quotedStringSupport is overridable per command
>1. `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`

> KlasaClientOptions are merged with discord.js' ClientOptions, see [ClientOptions in the discord.js docs](https://discord.js.org/#/docs/main/master/typedef/ClientOptions).

## Running the bot

Then, run the following in your folder:

```sh
npm install
node app.js
```

> **Requirements**: Requires Node 8.5.0 or higher to run. Depends on Discord.js v12.0.0-dev or higher (this is peer depended on, so you can choose a non-broken commit).

## What's next?

Klasa will create folders in your directory to make your own custom pieces in. Klasa will automatically check those folders on bootup, or if you reload all of a piece's type. `+reload commands` etc assuming your prefix is `+` like in the example app.js file above.
