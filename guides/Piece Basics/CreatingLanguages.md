Languages provide localizations to your bot. The built in ones allow you full control over anything the core bot will say. Transferring them (disabling those you don't want to use), and adding on to them, allows you to have a completely multi-lingual bot.

Languages have the following syntax:

```javascript
const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args, {
			name: 'myLanguageName',
			enabled: true
		});

		this.language = {
			DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
			SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
			// ...
			COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``
		};
	}

	async init() {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 * please note, that as the Language is loaded before the client is loaded,
		 * using this.client in a literal sense may throw errors such as:
		 * this.client.user.username would throw "can't get property username of null"
		 */
	}

};
```

## Options

{@typedef PieceOptions}

## Using Languages:

There are some extendables to help use languages. message.language is a read-only property that gets a language instance depending on the configuration. At the same time. The method `message.language.get` is used to get an value from the language package, if it exists, that can accept one or more parameters, being the first one always the key's name, followed by parameters that are used by keys that may have variables. If a key is constant, they're optional.

```javascript
// message.language will fetch the settings for the guild if it's in a guild or the default if it's in DMs.

// Will skip the settings fetch and return the language which name is that one.
this.client.languages.get('en-US');

/*
 * returns 'Default Language' in this example,
 * but if the guild has fr-FR as the configured language it would respond 'Langue par défaut'
 * message.language.get('DEFAULT_LANGUAGE');
 */

/*
 * returns 'The key **prefix** has been reset to: \`%\`' in this example,
 * but if the guild has fr-FR as the configured language,
 * it would respond 'La clef **prefix** a été réinitialisée à : \`%\`'
 * message.language.get('COMMAND_CONF_RESET', 'prefix', '%');
 */
```

Additionally, if one language is lagging behind another, the bot will let the user know, and provide the string in the bot's default language as follows:

```javascript
message.language.get('SomeKeyThatExistsOnlyInEnglish');

// Assuming the bot is configured for fr-FR, the response would be:
/*
 * `SomeKeyThatExistsOnlyInEnglish n'a pas encore été traduit en 'fr-FR'.
 *
 * Langue par défaut:
 * Whatever that key would respond to normally in english.`
 */
```

Also, if a language is disabled, and a guild has it configured, the default language will be used exclusively until either that language is no-longer disabled, or the guild configures another enabled language.

## Examples

You can take a look at the [included core Languages](https://github.com/dirigeants/klasa/tree/{@branch}/src/languages), or see some [prebuilt Languages on klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/languages).

## Further Reading:

- {@tutorial CreatingArguments}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSerializers}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}
