## Installing Klasa

Time to take the plunge! Klasa is on NPM and can be easily installed.

> I assume you know how to open a command prompt in a folder where you want to install this. Please don't prove me wrong.

```
npm install --save klasa
```

Create a file called `app.js` (or whatever you prefer) which will initiate and configure Klasa.

```javascript
const klasa = require("klasa");

const client = new klasa.Client({
    clientOptions: {
        fetchAllMembers: false,
    },
    prefix: "+",
    cmdPrompt: true,
    cmdEditing: true
});

client.login("your-bot-token")
```

### Configuration Options

Out of date: see [KlasaClientConfig]{@link KlasaClient.KlasaClientConfig} for the current config options.

- **prefix**: The default prefix(es) when the bot first boots up. This option becomes useless after first boot, since the prefix is written to the default configuration system. Pass an array to accept multiple prefixes.
- **clientOptions**: These are passed directly to the discord.js library. They are optional. For more information on which options are available, see [ClientOptions in the discord.js docs](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions).

## Running the bot

Then, run the following in your folder:

```
npm install
node app.js
```

> **Requirements**: Requires Node 8.1.0 or higher to run. Depends on Discord.js v12.0.0-dev or higher (the appropriate version is automatically installed).

## What's next?

Klasa will create folders in your directory to make your own custom pieces in. Klasa will automatically check these folders on bootup, or if you reload all of a type of piece. `+reload commands` ect assuming your prefix is `+` like the example app.js file above.
