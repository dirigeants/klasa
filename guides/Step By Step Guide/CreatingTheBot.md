Klasa is a framework for Discord.js, a wrapper for the Discord API, that helps make Discord bot development much easier. Don't worry if this doesn't make much sense right now, as you go through this guide it will make a lot more sense. Just remember, that Klasa is going to make adding features to your bot much easier and faster.

## Who Made Klasa?

The Dirigeants organization create and maintain Klasa. Join the discord server to meet and learn more about the wonderful team!

## Why You Should Use Klasa?

Klasa provides you all the tools that you need to make bot development really easy. As soon as you initialize your bot, it will instantly build and prepare all the tools for you. We will go through each and every tool in other sections of this guide.

As the old saying goes, the best way to learn to ride a bicycle is to actually try riding a bicycle. So let's try out Klasa.

## Creating The Bot!

> This guide is going to assume you already have the basic requirements to make a bot ready. This includes: Node.js, npm, and a code editor like Visual Studio Code. If you don't have these yet please install them first before going forward.

1. Create a folder for your bot. In this case, we will call the folder: `KBot`
2. Create a file inside called `index.js` or `index.ts` if you are using Typescript.
3. Paste the following code in your `index` file.

```js
const { Client } = require('klasa');

new Client().login(`your-bot-token`);
```

If you are using Typescript, copy and paste the code below instead.

```ts
import { Client } from 'klasa'

new Client().login(`your-bot-token`)
```

> Note: You will actually need to replace the `your-bot-token` with a valid bot token first. Please read xxx to get your bot token.

Now we have to do one more thing before our bot is ready. Open the terminal and make sure you are in the folder for the bot. If you are using Visual Studio Code and open the Integrated Terminal it should automatically have you in the right folder.

```shell
npm init
```

You can just skip all the questions it asks you by pressing the `Enter` key for each question.

Notice, that this command made a
`package.json` file. This is important because it will now let you install other packages like Klasa. Now let us install Klasa to our bot. To save time, we will install both Klasa and Discord.js.

> Reminder: Klasa is a framework for Discord.js so we need to have Discord.js as well.

```sh
npm install klasa discord.js
```

---
Oh my god! You now have a bot with a bunch of features already! You don't believe me? Well, seeing is believing, so start the bot.

```shell
node index.js
```

> If you are using Typescript, please make sure to compile it first and run that compiled file.

Invite your bot to a discord server and try to @ the bot.
<!-- Insert image here -->

You can even try to do `@bot help`
<!-- Insert Image Here -->

# Understanding What Klasa Did

Remember how we said Klasa is going to help you make building your bot faster? Klasa created these commands/folders as they are essential for any discord bot to have in order to meet the Discord Bot Best Practices. It also adds a few things that will help make some things easier to build a bot.

<!-- Insert image here -->
<!-- Insert image of help commands here -->

We will dive into these deeper in this guide. Let's take it step by step.

Let's start customizing our bot with a few options like a unique prefix so we don't have to keep @ the bot.
