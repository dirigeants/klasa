## Installing Klasa

Time to take the plunge! Klasa is on NPM and can be easily installed.

> I assume you know how to open a command prompt in a folder where you want to install this. Please don't prove me wrong.

```sh
npm install --save klasa
```

optionally if you want to use the bleeding edge development version (not guaranteed to be stable):

```sh
npm install --save dirigeants/klasa
```

### Using Klasa

Create a file called `app.js` (or whatever you prefer) which will initiate and configure Klasa.

```javascript
const { Client } = require('klasa');

new Client({
    clientOptions: {
        fetchAllMembers: false
    },
    prefix: '+',
    cmdEditing: true,
    typing: true,
    readyMessage: (client) => `${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users`
}).login('your-bot-token');
```

### Configuration Options: [KlasaClientConfig]{@link KlasaClient.KlasaClientConfig}

| Name                       | Default                   | Type               | Description                                                                         |
| -------------------------- | ------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| **clientOptions**          | `{}`                      | Object             | These are passed directly to the discord.js library. They are optional.¹            |
| **prefix**                 | `undefined`               | string/regex/array | The default prefix(es) when the bot first boots up.²                                |
| **permissionLevels**       | `defaultPermissionLevels` | PermissionLevels   | The permission levels to use with this bot                                          |
| **clientBaseDir**          | see below³                | string             | The directory where all piece folders can be found                                  |
| **commandMessageLifetime** | `1800`                    | number             | The threshold for when comand messages should be sweeped in seconds since last edit |
| **commandMessageSweep**    | `900`                     | number             | The interval duration for which command messages should be sweept in seconds        |
| **provider**               | `json`                    | string             | The provider to use in Klasa                                                        |
| **language**               | `en-US`                   | string             | The default language Klasa should opt-in for the commands                           |
| **promptTime**             | `30000`                   | number             | The amount of time in milliseconds prompts should last                              |
| **ignoreBots**             | `true`                    | boolean            | Whether or not this bot should ignore other bots                                    |
| **ignoreSelf**             | `client.user.bot`         | boolean            | Whether or not this bot should ignore itself (true for bots, false for selfbots)    |
| **cmdPrompt**              | `false`                   | boolean            | Whether the bot should prompt missing parameters                                    |
| **cmdEditing**             | `false`                   | boolean            | Whether the bot should update responses if the command is edited                    |
| **cmdLogging**             | `false`                   | boolean            | Whether the bot should log command usage                                            |
| **quotedStringSupport**    | `false`                   | boolean            | Whether the bot should default to using quoted string support⁴                      |
| **typing**                 | `false`                   | boolean            | Whether the bot should type while processing commands.                              |
| **readyMessage**           | see below⁵                | string/function    | readyMessage to be passed through to Klasa's ready event.                           |
| **ownerID**                | see below⁶                | string             | The discord id for the user the bot should respect as the owner                     |

>1: For more information on which D.JS options are available, see [ClientOptions in the discord.js docs](https://discord.js.org/#/docs/main/master/typedef/ClientOptions).  
>2: This option becomes useless after first boot, since the prefix is written to the default configuration system. Pass an array to accept multiple prefixes.  
>3: The directory of the main file. `path.dirname(require.main.filename)`  
>4: quotedStringSupport is overridable per command  
>5: `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`  
>6: ID gotten from teh Discord api if not provided: `client.application.owner.id`  

## Running the bot

Then, run the following in your folder:

```sh
npm install
node app.js
```

> **Requirements**: Requires Node 8.5.0 or higher to run. Depends on Discord.js v12.0.0-dev or higher (this is peer depended on, so you can choose a non-broken commit).

## What's next?

Klasa will create folders in your directory to make your own custom pieces in. Klasa will automatically check these folders on bootup, or if you reload all of a type of piece. `+reload commands` ect assuming your prefix is `+` like the example app.js file above.
