# Frequently Asked Questions

## Why doesn't my [reboot](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/reboot.js) command work?

The reboot command calls [process.exit()](https://nodejs.org/api/process.html#process_process_exit_code), which terminates the process of your bot. For it to automatically turn back on, you need to install a process manager.

A commonly used process manager is [PM2](http://pm2.keymetrics.io/), to set it up for to use for your bot, follow these two steps:

1. Run `npm install pm2 -g`
1. Start your bot using `pm2 start app.js`, where `app.js` is your main bot file.

For more information on PM2, check out their [documentation](http://pm2.keymetrics.io/docs/usage/quick-start/) or for a very quick summary, the [Cheat Sheet](http://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet)

## How do I remove or change a command that's included in Klasa?

If you want to disable or modify a piece (commands included) which is built into Klasa, you can use the [transfer](https://github.com/dirigeants/klasa/blob/master/src/commands/Admin/transfer.js) command.

Run `+transfer <piece>`, where `<piece>` is the name of the command/piece that you want to modify.

This will create a copy of the piece into your directory which will override the built-in one, and you can now modify it however you like.

To disable it, you can set the [enabled option](https://klasa.js.org/#/docs/klasa/master/search?q=enabled) to `false`.

## How do I hide my token from Github?

You should never expose your token to anyone for any reason. To hide it from Github, you can set it as an [environment variable](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html), or place it in a JSON file.

### JSON File

1. Create a `config.json` file next to your `app.js` file, and paste the following JSON into it:

 ```json
{
    "token": ""
}
 ```

 Then, copy your token into the field.

1. In your `.gitignore` file (create one if you don't have it), add `config.json` to it. For information on what the `.gitignore` file is and what it does, visit: <https://git-scm.com/docs/gitignore>.

1. At the top of your `app.js` file, import the token from the `config.json` like so:

```js
const { token } = require('./config.json');
```

1. Finally, **remove your token** from your `app.js` file, and replace it with the `token` variable.

### Environment Variable

For a tutorial

1. Set `process.env.DISCORD_TOKEN` equal to your bot's token, you can do this by either

    * using the console to set the environment variable every time you run the bot, by doing `set DISCORD_TOKEN=token` 

    * using the [dotenv](https://www.npmjs.com/package/dotenv) package. Run `npm install dotenv --save`

1. Put this code at the top of your `app.js` file:

    ```js
    require('dotenv').config();
    ```

1. Create a file called `.env` next  to your `app.js`, and put this in it:

    ```toml
    DISCORD_TOKEN = ""
    ```

    > Place your token after the `=`.

1. Finally, **remove your token** from your `app.js` file, so nothing is passed to the login method, discord.js will [automatically use](https://github.com/discordjs/discord.js/blob/249673de6ef8da4585e375ba3f0ea6a5800e7055/src/client/Client.js#L129) the token in the environment variable.

    ```js
    client.login();
    ```
