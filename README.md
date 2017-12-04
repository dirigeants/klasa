# Klasa

[![Discord](https://discordapp.com/api/guilds/339942739275677727/embed.png)](https://discord.gg/FpEFSyY)
[![npm](https://img.shields.io/npm/v/klasa.svg?maxAge=3600)](https://www.npmjs.com/package/klasa)
[![npm](https://img.shields.io/npm/dt/klasa.svg?maxAge=3600)](https://www.npmjs.com/package/klasa)
[![Build Status](https://travis-ci.org/dirigeants/klasa.svg?branch=master)](https://travis-ci.org/dirigeants/klasa)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e7b37b1f57134a5b9e1f43127df64388)](https://www.codacy.com/app/dirigeants/klasa?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dirigeants/klasa&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/dirigeants/klasa.svg)](https://greenkeeper.io/)
[![David](https://img.shields.io/david/dirigeants/klasa.svg?maxAge=3600)](https://david-dm.org/dirigeants/klasa)

Klasa is a class remix on the Komada Bot Framework, built on top of [Discord.js](https://github.com/hydrabolt/dicord.js). It offers an extremely easy installation and framework to build your own commands, event handlers, and much more.

## What's with the name?

Following suit from Komada (the Croatian word for "pieces"), Klasa is the croation word for "class". Like Komada, Klasa is modular, meaning each "piece" is a standalone part that can be easily replaced, enhanced, reloaded, removed.

## Why Klasa?

Klasa offers a different interface than Komada, namly all pieces extend base classes. As such, it isn't as beginner friendly, but it packs the advantages of OOP you wouldn't get otherwise. (The simplicity of `<Command>.reload()` and `<Client>.inhibitors.run()` as opposed to `<Client>.funcs.reloadCommand(commandName)` and `<Client>.funcs.runCommandInhibitors()` in komada respectively.) Say you want to unload an event, it isn't very easy to do in komada, however you can simply `<Event>.unload()` in Klasa.

## What is different from Komada?

There are a number of differences currently:

- Client isn't passed to the `run` of pieces, it is built into the base pieces object and is accessable as `this.client`
- Inhibitors are async in klasa, requiring rejection of undefined or a message if you want to inhibit the command.
- The piece stores (caches) aren't just Discord.Collections like in komada, they are extensions of collections which includes all loading, getting, setting, deleting, ect built right in and abstracted away. `<EventStore>.delete(eventName)` not only removes the event from the collection, but unregisters the event as a listener. `<CommandStore>.get(name)` not only gets the command if it's the command name, but if it's a command alias as well. ect.
- No `<Client>.funcs`. All functions have been abstracted away into OOP paradigms, or moved to the util class (only functions which have no reason to ever change, such as `util.toTitleCase()` or `util.codeBlock()`). If you would like to add functions that are shared among multiple things, you can do so in the standard node.js way via `module.exports` and `require()`
- Events overwrite core pieces, like other pieces do, instead of offering a second event listener. *So it is important to use the transfer command to edit certain events, instead of simply replacing them so that certain Klasa framework operations continue to work*
- No installNPM function. Requiring pieces without installing the required packages wont install the missing dependancies like it does in komada. (If and when the download command is sorted with a Klasa-pieces repo, that download command will likely have installNPM added back)
- All pieces are flat, meaning no help or conf. `<Command>.description` instead of `<Command>.help.description` ect. As such, the cooldown map that stores users on cooldown, has been changed to `cooldowns` and the cached instance of your usage is `usageString` where as usage is your fully parsed usage.
- All pieces (except extendables) can now be used as types usage strings, to get klasa pieces for use in commands. The new types are cmd, command, event, inhibitor, finalizer, monitor, provider.

## Time to get started!

See the following [tutorial](https://klasa.js.org/tutorial-GettingStarted.html) on how to get started using Klasa.

## See also:

- [Documentation for klasa: https://klasa.js.org/](https://klasa.js.org/)
- [Example premade pieces: https://github.com/dirigeants/klasa-pieces](https://github.com/dirigeants/klasa-pieces)
- [VS Code extension for rapid development (available on the marketplace)](https://marketplace.visualstudio.com/items?itemName=bdistin.klasa-vscode)
