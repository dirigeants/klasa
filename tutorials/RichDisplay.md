[`RichDisplay`](https://klasa.js.org/RichDisplay.html) allows you to create a paginated menu that users of your bot will be able to browse by using reaction-based navigation.

The most simple working example can achieved by this code:

```javascript
const { Command, RichDisplay } = require('klasa');

module.exports = class extends Command {
	constructor(...args) { super(...args, { description: 'Test RichDisplay' }); }

	async run(msg) {
		return new RichDisplay()
			.addPage(new Embed())
			.run(await msg.send('Loading...'));
	}
};
```

A more complex example with an actual usage is this:

```javascript
const display = new RichDisplay(new this.client.methods.Embed()
	.setColor(0x673AB7)
	.setAuthor(this.client.user.name, this.client.user.avatarURL)
	.setTitle('Random Image Slideshow')
	.setDescription('Scroll between the images using the provided reaction emotes.')
);

for (const i = 0; i < 10; i++)
	display.addPage(template => template.setImage('https://lorempixel.com/400/200/'));

return display.run(await msg.send('Loading slideshow...'));
```

> The code is contained in the block of the aforementioned command, inside the `async run(msg)` method.

## Code Analysis

First we create a new [`RichDisplay`](https://klasa.js.org/RichDisplay.html) instance, but this time we pass in an [`MessageEmbed`](https://discord.js.org/#/docs/main/master/class/MessageEmbed) instance, wich will represent our template, from which we will be able to extend upon to create our pages later on:

```javascript
const display = new RichDisplay(new this.client.methods.Embed()
	/* ... */
);
```

This [`MessageEmbed`](https://discord.js.org/#/docs/main/master/class/MessageEmbed) instance will then be then accessible to us by either calling the [`template`](https://klasa.js.org/RichDisplay.html#template__anchor) of the display object, in a cloned manner, or directly through the [`addPage`](https://klasa.js.org/RichDisplay.html#addPage__anchor) method, if we pass in an arrow function or a callback.

```javascript
for (/* ... */)
	display.addPage(template => /* ... */);
```

From here we will be able to add content or edit properties of the template and then return the final embed to the [`addPage`](https://klasa.js.org/RichDisplay.html#addPage__anchor) method to be processed into a [`RichDisplay`](https://klasa.js.org/RichDisplay.html) page.

```javascript
/* ... */
	display.addPage(template => {
		template.setImage('https://lorempixel.com/400/200/')
			.setColor(0xF44336) // You can change everything of the template
	);
```

Then, after the [`RichDisplay`](https://klasa.js.org/RichDisplay.html) is setup, we return, executing it on a new message.

```javascript
return display.run(await msg.send('Loading slideshow...'));
```

## Info Page

We can also define an Info page, which will be available through the appropriate reaction emote.
All we have to do is simply call the [`setInfoPage`](https://klasa.js.org/RichDisplay.html#setInfoPage__anchor) instead than [`addPage`](https://klasa.js.org/RichDisplay.html#addPage__anchor). The template will be available to us in the same ways as before.

> Note: only one info page can be set at once. Setting the info page more than once will override the previously defined info page.

## Personalization

Behavior managing can be handled through the second (optional) argument of the [`run`](https://klasa.js.org/RichDisplay.html#run__anchor) method.
The configuration must be defined as an object literal.
Please refer to the [`RichDisplay.run` arguments](https://klasa.js.org/RichDisplay.html#.RichDisplayEmojisObject__anchor) documentation page for information about each specific option.

### Custom Behavior Handling

To handle whether or not certain pages should be shown or skipped when browsing you can define the `filter` option with a function that returns `true` only when the page should be shown.

This method will be called every time a user is about to visit a new page.
