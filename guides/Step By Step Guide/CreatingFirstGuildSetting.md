Woah, you are already at learning about Settings! This is the most complex part of Klasa but don't worry just as before, we will take it step by step.

## Types of Settings

Klasa has already created 3 types of Settings for us.

- Guild Settings
- User Settings
- Client Settings

Guild admins can customize the Guild Settings for their own guilds.
Users can customize the User Settings for their own settings.
Only bot developers can customize client settings.

Klasa also creates some basic settings as well like a customizable `prefix` for each guild.

Don't worry too much about the User and Client settings for now. We will get back to them later in the guide. For now, our goal is to try and add the ability for guild admins to be able to choose which commands trigger messages should be deleted by our finalizer.

## Conf Command

If you haven't seen this in the `+help` menu yet, Klasa added a `+conf` command for us. This command allows guild admins to customize the guilds settings for their guilds.

Let's try this out. Go into a channel and type the following commands:

```shell
+conf show
+conf show prefix
```

> Note: The response message from the `conf` command is not very mobile friendly. You can transfer and customize the command if you wish to make this more user friendly for mobile users.

You should have seen all the settings that Klasa helped build for each guild and also you were able to see how server admins can check their settings. Now let's try editing the `prefix` to see how it works.

```shell
+conf set prefix !
```

Once you type this command, you can see that the bot will no longer respond to the `+` prefix but now requires the `!` prefix on this guild. If you went to another guild, the prefix would still be `+` because each guild has their own copy of settings. Cool right!

For the purposes of this guide, we are going to stick with the `+` prefix, but you can choose whatever prefix you like.

```shell
!conf reset prefix
```

## Creating The Guild Settings Schema

To make our first custom guild settings schema, let's organize it a little.

- Make a `lib` folder
- Make a `schemas` folder inside the lib folder
- Make a `guild.js` file inside the schemas folder

> Note: You can put the file in any place you like. For the purposes of this guide, we will keep it as described above.

Inside the `guild.js` file, go ahead and copy and paste this snippet below:

```js
const { KlasaClient } = require('klasa')

KlasaClient.defaultGuildSchema
```

Now we are ready to start adding our first key.

## Adding Our First Key

In order to add a key to our guild settings, all we have to do is use the `add` method as shown below.

```js
const { KlasaClient } = require('klasa')

KlasaClient.defaultGuildSchema
	.add(name, typeOrCallback, options);
```

The `name` parameter must always be given a `string`. This is a **REQUIRED** parameter.

```js
const { KlasaClient } = require('klasa');

KlasaClient.defaultGuildSchema
	.add('commandTriggersToDelete', typeOrCallback, options);
```

You can use whatever name you like, but for the purpose of this guide we want to try and help make it very clear what this setting will be used for.

> Note: Try and keep your key names as unique as possible so they don't conflict with other keys. If the path to the key is not unique, you will have errors when you start the bot.

The `typeOrCallback` parameter can take a `type` or a `callback`. For now, we don't need to worry about the callback. We will use callbacks later in this guide.

The `type` parameter must use one of the supported types. There is a list of supported types at {@tutorial SettingsGatewayKeyTypes}

> Note: Later in this guide, we will learn how to make our own types when we discuss `Serializers`.

For now we want to use the `command` type since we want to store command names.

```js
const { KlasaClient } = require('klasa');

KlasaClient.defaultGuildSchema
	.add('commandTriggersToDelete', 'command', options)
```

The last argument is an **optional** parameter that can accept a few different options.

If we omit this argument, we will only be able to save one command name. We want to allow guild admins to save a bunch of commands. To do this, we have to tell klasa that we want an array here.

```js
const { KlasaClient } = require('klasa');

KlasaClient.defaultGuildSchema
	.add('commandTriggersToDelete', 'command', { array: true })
```

## Updating The Schema

The schema is one of the few parts of Klasa that can not be reloaded. This means we have to use the `+reboot` command whenever we make changes to the schema.

Once you have rebooted the bot, go ahead and type the following commands:

```shell
+conf show
```

You should now be able to see the schema key that you added. Nice work! Now let's try and see if we can edit it.

```shell
+conf set commandTriggersToDelete ping
+conf show commandTriggersToDelete
```

Nice right! You can now create as many guild settings and Klasa will automatically allow guild admins to see, add, remove, reset them as they wish. There is no extra work for you to maintain this.

Now, let us go back and finish our finalizer we started with this guild setting.
