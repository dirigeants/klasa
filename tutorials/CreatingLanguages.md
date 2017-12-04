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

## Configuration

| Name        | Default       | Type    | Description                            |
| ----------- | ------------- | ------- | -------------------------------------- |
| **name**    | `theFileName` | string  | The name of the language               |
| **enabled** | `true`        | boolean | Whether the language is enabled or not |

## Using Languages:

There are some extendables to help use languages. msg.language will return the language that is either default (if dms) or the guild's configured language. All languages have a get method, which is used for key lookup and function arg passing.

```javascript
msg.language.get('DEFAULT_LANGUAGE'); // returns 'Default Language' in this example, but if the guild has fr-FR as the configured language it would respond 'Langue par défaut'
msg.language.get('COMMAND_CONF_RESET', 'prefix', '%') // returns 'The key **prefix** has been reset to: \`%\`' in this example, but if the guild has fr-FR as the configured language it would respond 'La clef **prefix** a été réinitialisée à : \`%\`'
```

Additionally, if one language is lagging behind another, the bot will let the user know, and provide the string in the bot's default language as follows:

```javascript
msg.language.get('SomeKeyThatExistsOnlyInEnlgish');

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