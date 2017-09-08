## Installing Klasa

Time to take the plunge! Klasa is on NPM and can be easily installed.

> I assume you know how to open a command prompt in a folder where you want to install this. Please don't prove me wrong.

```
npm install --save klasa
```

optionally if you want to use the bleeding edge development version (not guaranteed to be stable):

```
npm install --save dirigeants/klasa
```

### Using Klasa

Create a file called `app.js` (or whatever you prefer) which will initiate and configure Klasa.

```javascript
const klasa = require('klasa');

const client = new klasa.Client({
    clientOptions: {
        fetchAllMembers: false
    },
    prefix: '+',
    cmdEditing: true,
    typing: true,
    readyMessage: (client) => `${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users`
});

client.login('your-bot-token');
```

### Configuration Options: [KlasaClientConfig]{@link KlasaClient.KlasaClientConfig}

- **clientOptions**: These are passed directly to the discord.js library. They are optional. For more information on which options are available, see [ClientOptions in the discord.js docs](https://discord.js.org/#/docs/main/master/typedef/ClientOptions).
- **prefix**: The default prefix(es) when the bot first boots up. This option becomes useless after first boot, since the prefix is written to the default configuration system. Pass an array to accept multiple prefixes.
- **permissionLevels**: `default: KlasaClient.defaultPermissionLevels` The permission levels to use with this bot
- **clientBaseDir**: `default: process.cwd()` The directory where all piece folders can be found
- **commandMessageLifetime**: `default: 1800` The threshold for how old command messages can be before sweeping since the last edit in seconds
- **commandMessageSweep**: `default: 900` The interval duration for which command messages should be sweept in seconds
- **provider**: `default: the included json provider` The provider to use in Klasa
- **disableLogTimestamps**: `default: false` Whether or not to disable the log timestamps
- **disableLogColor**: `default: false` Whether or not to disable the log colors
- **ignoreBots**: `default: true` Whether or not this bot should ignore other bots
- **ignoreSelf**: `default: client.user.bot` Whether or not this bot should ignore itself (true for bots, false for selfbots)
- **cmdPrompt**: `default: false` Whether the bot should prompt missing parameters
- **cmdEditing**: `default: false` Whether the bot should update responses if the command is edited
- **typing**: `default: false` Whether the bot should type while processing commands.
- **quotedStringSupport**: `default: false` Whether the bot should default to using quoted string support in arg parsing, or not (overridable per command)
- **readyMessage** ``default: `Successfully initialized. Ready to serve ${client.guilds.size} guilds.` `` readyMessage to be passed thru Klasa's ready event, ``Types: null for no msg, string for a static message, function accepting client for a dynamic message``
- **ownerID**: The discord user id for the user the bot should respect as the owner (gotten from Discord api if not provided)


## Running the bot

Then, run the following in your folder:

```
npm install
node app.js
```

> **Requirements**: Requires Node 8.1.0 or higher to run. Depends on Discord.js v12.0.0-dev or higher (the appropriate version is automatically installed).

## What's next?

Klasa will create folders in your directory to make your own custom pieces in. Klasa will automatically check these folders on bootup, or if you reload all of a type of piece. `+reload commands` ect assuming your prefix is `+` like the example app.js file above.
