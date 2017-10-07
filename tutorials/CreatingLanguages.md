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
        }
	}

	async init() {
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
        // please note, that as the Language is loaded before the client is loaded, using this.client in a literal sense may throw errors such as: this.client.user.username would throw "can't get property username of null"
	}

};
```

## Using Languages:

There are some extendables to help use languages. msg.fetchLanguage is a method that gets a language instance depending on the settings, it accepts an optional argument with type of string (the language name) that helps skipping extra work, allowing you to fetch the settings only once. At the same time, `msg.fetchLanguageCode` fetches the language and does `language.get` internally. The language is either default (if dms) or the guild's configured language. All languages have a get method, which is used for key lookup and function arg passing.

```javascript
await msg.fetchLanguage(); // Will fetch the settings for the guild if it's in a guild or the default if it's in DMs.
await msg.fetchLanguage('en-US'); // Will skip the settings fetch and return the language which name is that one.

await msg.fetchLanguageCode('DEFAULT_LANGUAGE'); // returns 'Default Language' in this example, but if the guild has fr-FR as the configured language it would respond 'Langue par défaut'
await msg.fetchLanguageCode('COMMAND_CONF_RESET', 'prefix', '%') // returns 'The key **prefix** has been reset to: \`%\`' in this example, but if the guild has fr-FR as the configured language it would respond 'La clef **prefix** a été réinitialisée à : \`%\`'
```

Previously, they were sync:

```javascript
msg.language; // Exactly the same as msg.fetchLanguage(); but sync.
msg.language.get('DEFAULT_LANGUAGE'); // Returns 'Default Language' in this example. Same as msg.fetchLanguageCode(); but sync.
```

Additionally, if one language is lagging behind another, the bot will let the user know, and provide the string in the bot's default language as follows:

```javascript
await msg.fetchLanguageCode('SomeKeyThatExistsOnlyInEnlgish');

// Assuming the bot is configured for fr-FR, the response would be:
/*
 *`SomeKeyThatExistsOnlyInEnlgish n'a pas encore été traduit en 'fr-FR'.
 *
 *Langue par défaut:
 *Whatever that key would respond to normally in english.`
 */
```

Also, if a language is disabled, and a guild has it configured, the default language will be used exclusivly until either that language is no-longer disabled, or the guild configures another enabled language.

## Further Reading:
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}