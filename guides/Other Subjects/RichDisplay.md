{@link RichDisplay} allows you to create a paginated embed that users of your bot will be able to browse by using reaction-based navigation.

An extremely simple working example can achieved by this code:

```javascript
const { Command, RichDisplay } = require('klasa');
const { Embed } = require('@klasa/core');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Test RichDisplay' });
	}

	async run(message) {
		return new RichDisplay()
			.addPage(new Embed().setDescription('First page'))
			.addPage(new Embed().setDescription('Second page'))
			.run(await message.send('Loading...'));
	}

};
```

A more complex example with an actual usage is this:

```javascript
const images = [
	'https://i.imgur.com/gh3vYgj.jpg',
	'https://i.imgur.com/vBV81m4.jpg',
	'https://i.imgur.com/92hAsqe.jpg'
];

module.exports = class extends Command {

	async run(message) {
		const display = new RichDisplay(new Embed()
			.setColor(0x673AB7)
			.setAuthor(this.client.user.name, this.client.user.avatarURL())
			.setTitle('Norway Pictures Slideshow')
			.setDescription('Scroll between the images using the provided reaction emotes.')
		);

		for (let i = 0; i < images.length; i++) {
			display.addPage(template => template.setImage(images[i]));
		}

		return display.run(await message.send('Loading slideshow...'));
	}

};
```

> The code is contained in the block of the aforementioned command, inside the `async run(message)` method but the display or its pages can easily be reused by placing its initialization in the command's constructor method.

## Code Analysis

First we create a new {@link RichDisplay} instance, but this time we pass in a [`Embed`](https://discord.js.org/#/docs/main/master/class/Embed) instance, which will represent our template, from which we will be able to extend upon to create our pages later on:

```javascript
const display = new RichDisplay(new Embed()
	/* ... */
);
```

This [`Embed`](https://discord.js.org/#/docs/main/master/class/Embed) instance will be accessible to us by either calling the {@link RichDisplay.template} property of the {@link RichDisplay} instance, in a cloned manner, or directly through the {@link RichDisplay.addPage} method, if we pass in an arrow function or a callback.

```javascript
for (const image of images) {
	display.addPage(template => template.setImage(image));
}
```

From here we will be able to add content or edit properties of the template, and then, return the final embed to the {@link RichDisplay.addPage} method to be processed into a {@link RichDisplay} page.
In our example, we will simply add a static image from the array we defined before.

```javascript
display.addPage(template => {
	template
		.setImage(image)
		.setColor(0xF44336);
	// You can change everything of the template
});
```

Then, after the {@link RichDisplay} is setup, we return, executing it on a new message.

```javascript
module.exports = class extends Command {

	async run(message) {
		// ...
		return display.run(await message.send('Loading slideshow...'));
	}

};
```

The message will show the content we defined in {@link KlasaMessage#send} initially, then, when our {@link RichDisplay} will be ready it will replace the content with the first page we defined.

## Info Page

We can also define an Info page, which will be available through the appropriate reaction emote.
All we have to do is simply call the {@link RichDisplay.setInfoPage} instead than {@link RichDisplay.addPage}. The template will be available to us in the same ways as before.

> Note: only one info page can be set at once. Setting the info page more than once will override the previously defined info page.

## Personalization

Behavior managing can be handled through the second (optional) argument of the {@link RichDisplay.run} method.
The configuration must be defined as an [object literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer).
Please refer to the {@link RichDisplayRunOptions} documentation page for information about each specific option.

### Custom Behavior Handling

To handle whether or not a user should trigger an action when interacting with the reactions applied to the embed you can provide a `filter` function, which will be called every time a user reacts to the embed.

A simple example for this would be a filter that only allows the user who executes the command to interact with it:

```javascript
module.exports = class extends Command {

	async run(message) {
		// ...
		display.run(await message.send('Loading slideshow...'), { filter: (reaction, user) => user === message.author });
	}

};
```
