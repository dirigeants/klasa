# Welcome to the klasa#{@branch} documentation

## Installing Klasa

You can install this branch of klasa with the following command:

```sh
npm install --save discordjs/discord.js dirigeants/klasa#{@branch}
```

### Using Klasa

Create a file called `app.js` (or whatever you prefer) which will initiate and configure Klasa.

```javascript
const { Client } = require('klasa');

new Client({
	fetchAllMembers: false,
	prefix: '+',
	commandEditing: true,
	typing: true,
	readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
}).login('your-bot-token');
```

### Client Options: {@link KlasaClientOptions}

{@typedef KlasaClientOptions}

>1. ownerID is acquired from the Discord API if not provided: `client.application.owner.id`
>1. quotedStringSupport is can be overridden per command.

> KlasaClientOptions are merged with discord.js' ClientOptions, see [ClientOptions in the discord.js docs](https://discord.js.org/#/docs/main/master/typedef/ClientOptions).

## Running the bot

Then, run the following in your folder:

```sh
npm install
node app.js
```

> **Requirements**: Requires Node 10.1.0 or higher to run. Depends on Discord.js v12.0.0-dev or higher (this is peer depended on, so you can choose a non-broken commit).

## What's next?

Klasa will create folders in your directory to make your own custom pieces in. Klasa will automatically check those folders on bootup, or if you reload all of a piece's type. `+reload commands` etc assuming your prefix is `+` like in the example app.js file above.
