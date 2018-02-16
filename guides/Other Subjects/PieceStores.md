Probably one of the most advanced and powerful tools in klasa is making your own stores and pieces, to do the things you want.

The most basic store:

```javascript
const { Store } = require('klasa');
const Something = require('./Something');

class SomethingStore extends Store {

	constructor(client) {
		super(client, 'somethings', Something);
	}

}

module.exports = SomethingStore;
```

The most basic Piece:

```javascript
const { Piece } = require('klasa');

class Something extends Piece {

	run() {
		// Defined in extension Classes
	}

}

module.exports = Something;
```

Now that probably doesn't give you much idea on what that means or why. But take the following idea: You are making a music bot *gasps* and you want to give it an auto-play feature. Problem is, not everyone likes the same kind of music, so lets make a GenreStore and a Genre piece for guild owners to set the genre of music they might want to listen to automatically.

```javascript
const { Store } = require('klasa');
const Something = require('./Something');

class GenreStore extends Store {

	constructor(client) {
		super(client, 'genres', Something);
	}

}

module.exports = GenreStore;
```

Tbh, not that different than a simple store. Although be sure to take a look at all of the core stores. Sometimes, like in the case of Providers, we want to run a shutdown method before we delete the collection entry. In that case we also want to overwrite the clear method, and loop over the collection doing this.delete() so that all entries are shutdown properly.

```javascript
const { Piece, util } = require('klasa');
const getInfoAsync = require('util').promisify(require('ytdl-core').getInfo);

class Genre extends Piece {

	/**
	 * @param {KlasaClient} client The Klasa Client
	 * @param {GenreStore} store The Genre store
	 * @param {Array} file The path from the pieces folder to the command file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {Object} [options={}] Optional Genre settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		// we should probably describe our auto play genres in the command,
		// we will make for guild owners to set their guild's genre setting.

		/**
		 * The genre's description
		 * @type {string}
		 */
		this.description = options.description || '';

		// Some example artists to include with the descriptions

		/**
		 * Examples of artists for this genre
		 * @type {string[]}
		 */
		this.examples = options.examples || [];
	}

	// We don't even need run for this, let's call it getNext
	async getNext(player) {
		// Let's define a default behavior here
		// If we aren't playing anything yet, get a link from this.seeds
		// (which is defined in each extension piece)
		if (!player.playingURL) return this.wrapLink(this.seeds[Math.floor(Math.random() * this.seeds.length)]);

		// If we do have a link, lets get youtube info about that link
		const info = await getInfoAsync(player.playingURL).catch((err) => {
			this.client.emit('log', err, 'error');
			throw `something happened with YouTube URL: ${player.playingURL}\n${util.codeBlock('', err)}`;
		});

		// Find the first video that we haven't recenly played on our player
		const next = info.related_videos.find(vid => vid.id && !player.recentlyPlayed.includes(this.wrapLink(vid.id)));
		// If their isn't a video, reseed a video we havn't played recently
		if (!next) {
			const seed = this.seeds.find(vid => !player.recentlyPlayed.includes(this.wrapLink(vid)));
			// If we have played all of the seeds, start over on reseeding
			if (!seed) {
				player.recentlyPlayed = [];
				return this.wrapLink(this.seeds[Math.floor(Math.random() * this.seeds.length)]);
			}

			// Else return the seed we haven't played recently
			return this.wrapLink(seed);
		}

		// Otherwise wrap the next song
		return this.wrapLink(next.id);
	}

	wrapLink(id) {
		return `https://youtu.be/${id}`;
	}

}

module.exports = Genre;
```

Here we see some heavy customization. Such as if you need to define special enable/disable behavior. But Genre extending Piece makes our piece very easy to actually make now:

```javascript
const Genre = require('../Genre');

module.exports = class extends Genre {

	constructor(...args) {
		super(...args, {
			description: 'Electronic Dance Music',
			examples: [
				'Skrillex',
				'deadmau5',
				'The Chainsmokers'
			]
		});
		this.seeds = [
			'QV1xUseG6Gg',
			'F0YYoo6oFoU',
			// ...
			'RhU9MZ98jxo'
		];
	}

};
```

This is great and all, but we need to register these pieces/store:

```javascript
const { Client } = require('klasa');
const GenreStore = require('./GenreStore');

class MySwankyMusicBot extends Client {

	constructor(...args) {
		super(...args);

		// Make a new GenreStore and attach it to client
		this.genres = new GenreStore();

		// Register the GenreStore to be loaded, init, and available
		// to be used as an arg to be looked up in commands
		this.registerStore(this.genres);

		// Registers genres themselves to be able to be used as an
		// arg to be looked up in commands,
		// for reload/enable/disable ect.
		this.registerPiece('genre', this.genres);

		// Optionally we can add more aliases for the piece
		this.registerPiece('musicgenre', this.genres);
	}

}

new MySwankyMusicBot().login('token-goes-here');
```

Then we use it in our player class I completely made up earlier like so:

```javascript
async () => {
	// Without going over setting up guild configs,
	// or actually writing a player class.
	const nextSong = await this.client.genres.get(this.guild.configs.genre)
		.getNext(this);

	// nextSong should now be a pseudo random song based on the
	// genre seeds and what has recently played.
};
```
