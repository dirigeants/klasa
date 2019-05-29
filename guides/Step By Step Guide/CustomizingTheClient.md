Congrats! If you reached this part of the guide, you have successfully created your very own Discord Bot! Now, its time to understand the options Klasa gives us so we can customize the bot.

> Note: This guide was intended for beginner developers so we will go step by step. However, if you wish to speed things up you can use this code snippet below so you don't have to keep restarting the bot. Otherwise, just follow along with the guide to understand how each of these options work.

```js
new Client({
	commandEditing: true,
	commandLogging: true,
	prefix: `+`,
	readyMessage: (client) => `${client.user.tag}, ready to serve ${client.guilds.size} guilds.`
})
```

## Adding Your Own Default Prefix

Remember how we used `@bot help` to get the bot to send us the help command. The reason `@bot` worked is because Klasa adds the bots @ as a default prefix.

> Note: If you don't like this behavior you can remove it, since Klasa is extremely customizable, but let's leave it in for now. You can review the Advanced section of the guide to learn how.

Suppose we want the bot to respond to `+` as the prefix instead of @. To do this, we go back into the `index` file we made before and add in the prefix we want. You can choose whichever prefix you wish, but for this guide we will be using `+`.

> Note: It is important to remember that this option here is a DEFAULT prefix. This means that this prefix can NOT be customized by servers. This is a prefix that you can have users use when they forget their own custom server prefix.

```js
new Client({
	prefix: `+`,
}).login(`your-bot-token`)
```

> IMPORTANT: We have to restart the bot to make this change since this index file is NOT a Klasa Piece. We will learn more about Klasa Pieces and how easy it is to edit them without restarting the bot when we create our first piece. For now, just remember editing this index file will always require the bot to be restarted.

Klasa made us an amazing `reboot` command so go ahead and type `@bot reboot`
<!-- Insert Image Here -->

> Note: If you are having trouble with the Reboot command, please see the FAQ.

Now that the bot has restarted, we can try to do `+ping`. Nice! You now know how to give your bot a default prefix!

> Note: Klasa has actually already created the ability to have custom prefixes in each server but we will learn how to use those when we get to the `settings` part of this guide.

## Customizing Our Ready Message

Something that you may have noticed already is that when the bot starts it sends a message in the console? Klasa gives us a really sweet option of customizing this message when the bot is ready.

```js
new Client({
	prefix: `+`,
	readyMessage: (client) => `${client.user.tag}, ready to serve ${client.guilds.size} guilds.`
})
```
> Note: If you are using Typescript, you should do `(client: Client)`

Now you can reboot the bot again, this time using `+reboot` and see how the bot will log a message in your console.

<!-- Insert Image Here -->

## Logging Commands Used

A really cooly built in feature that Klasa provides is the ability to log every command that is used.

> Note: This will only log commands that are successfully run. If an error occurs, this will not log it.

```js
new Client({
	commandLogging: true,
	prefix: `+`,
	readyMessage: (client) => `${client.user.tag}, ready to serve ${client.guilds.size} guilds.`
})
```

Once you have enabled the commandLogging, reboot the bot again and try using another command. This time, we can try using `+stats` command. This is another amazing command that Klasa gives us and we can see cool stats for the bot. Most importantly, we can see how the logging will look.

<!-- Insert Image Below -->

## Enabling Command Editing

One last thing we can cover in this guide is `Command Editing`. This feature allows users to simply edit their message to run the command again. The best way to understand it, is to see it in action. Let's start by enabling this option:

```js
new Client({
	commandEditing: true,
	commandLogging: true,
	prefix: `+`,
	readyMessage: (client) => `${client.user.tag}, ready to serve ${client.guilds.size} guilds.`
})
```

Now `+reboot` once more and make a **typo** on purpose. For example, let's try using the `invite` command that Klasa gives us. But we will type `+onvite` so we can test the command editing. You will notice nothing happens, because we don't have any command by the name of `onvite`. However, if you edit your message and change it to `+invite` you will see the command run successfully.

## Final Note On Client Options

There are a lot of client options that we will not cover all of them in this guide. To see all the options, please check XXX. If you need help with any of these options, you can join the discord server and ask for help there anytime.

> Advanced Tip: A really cool feature of `Client` options is that you can add your own **custom** options so you can use them in other parts of the bot. For example, you could do something like `botDeveloperIDs: []` as a option which holds the Discord IDs of all the bot developers. Then you can use this anywhere you have access to the Client.

---
For now, let's jump into understanding what Pieces and Stores are and editing our `+invite` command.
