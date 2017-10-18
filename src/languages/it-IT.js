const { Language, util } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			DEFAULT: (key) => `${key} non ancora tradotta in italiano.`,
			DEFAULT_LANGUAGE: 'Linguaggio Predefinito',
			SETTING_GATEWAY_EXPECTS_GUILD: 'Il parametro <Guild> si aspetta un server o l\'istanza di un server.',
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `Il valore ${data} per la chiave ${key} non esiste.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `Il valore ${data} per la chiave ${key} è già esistente.`,
			SETTING_GATEWAY_SPECIFY_VALUE: 'Devi specificare il valore da aggiungere o filtrare.',
			SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `La chiave ${key} non è una lista.`,
			SETTING_GATEWAY_KEY_NOEXT: (key) => `La chiave ${key} non esiste nello schema dei dati corrente.`,
			SETTING_GATEWAY_INVALID_TYPE: 'Il parametro \'type\' può essere solo \'add\' o \'remove\'.',
			RESOLVER_INVALID_PIECE: (name, piece) => `${name} deve esserve il nome di un ${piece} valido.`,
			RESOLVER_INVALID_MSG: (name) => `${name} deve essere l'id di un messaggio valido.`,
			RESOLVER_INVALID_USER: (name) => `${name} deve essere una menzione o l'id di un utente valido.`,
			RESOLVER_INVALID_MEMBER: (name) => `${name} deve essere una menzione o l'id di un utente valido.`,
			RESOLVER_INVALID_CHANNEL: (name) => `${name} deve essere il tag di un canale o l'id di un canale valido.`,
			RESOLVER_INVALID_GUILD: (name) => `${name} deve essere l'id di un server valido.`,
			RESOLVER_INVALID_ROLE: (name) => `${name} deve essere una menzione o l'id di un ruolo.`,
			RESOLVER_INVALID_LITERAL: (name) => `La tua opzione non corrisponde all'unica possibilità: ${name}`,
			RESOLVER_INVALID_BOOL: (name) => `${name} deve essere 'true' o 'false'.`,
			RESOLVER_INVALID_INT: (name) => `${name} deve essere un intero.`,
			RESOLVER_INVALID_FLOAT: (name) => `${name} deve essere un numero valido.`,
			RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} deve combaciare con il seguente pattern in regex: \`${pattern}\`.`,
			RESOLVER_INVALID_URL: (name) => `${name} deve essere un url valido.`,
			RESOLVER_STRING_SUFFIX: ' caratteri',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} deve essere esattamente ${min}${suffix}.`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} deve essere compreso tra ${min} e ${max}${suffix}.`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} deve essere maggiore di ${min}${suffix}.`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} deve essere minore di ${max}${suffix}.`,
			COMMANDMESSAGE_MISSING: 'Uno o più argomenti mancanti dopo la fine dell\'inserimento.',
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} è un argomento richiesto.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Opzione richiesta mancante: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `La tua opzione non corrisponde a nessuna possibilità: (${possibles})`,
			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error) => `${tag} | **${error}** | Hai **30** secondi per rispondere a questo messaggio con un argomento calido. Scrivi **"ABORT"** per annullare.`,
			MONITOR_COMMAND_HANDLER_ABORTED: 'Annullato',
			INHIBITOR_COOLDOWN: (remaining) => `Hai appena usato questo comando. Potrai usare questo comando nuovamente in ${remaining} secondi.`,
			INHIBITOR_DISABLED: 'Questo comando è al momento disabilitato',
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `Permessi insufficienti, mancano: **${missing}**`,
			INHIBITOR_PERMISSIONS: 'Non hai il permesso di utilizzare questo comando',
			INHIBITOR_REQUIRED_SETTINGS: (settings) => `Il server manca ${settings.length > 1 ? 'del permesso' : 'dei permessi'} **${settings.join(', ')}** e quindi non è possibile continuare.`,
			INHIBITOR_RUNIN: (types) => `Questo comando è disponibile solo in canali di tipo ${types}`,
			INHIBITOR_RUNIN_NONE: (name) => `Il comando ${name} non è configurato per essere eseguito in alcun canale.`,
			COMMAD_UNLOAD: (type, name) => `✅ Scaricato ${type}: ${name}`,
			COMMAND_TRANSFER_ERROR: '❌ Il file è stato già trasferito o non è mai esistito.',
			COMMAND_TRANSFER_SUCCESS: (type, name) => `✅ Trasferito con successo il ${type}: ${name}`,
			COMMAND_TRANSFER_FAILED: (type, name) => `Trasferimento del ${type}: ${name} al Client è fallito, controlla la Console.`,
			COMMAND_RELOAD: (type, name) => `✅ Ricaricato il ${type}: ${name}`,
			COMMAND_RELOAD_ALL: (type) => `✅ Ricaricati tutti i ${type}.`,
			COMMAND_REBOOT: 'Riavvio...',
			COMMAND_PING: 'Ping?',
			COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip ha richiesto: ${diff}ms. Heartbeat: ${ping}ms.)`,
			COMMAND_INVITE_SELFBOT: 'Perchè dovrebbe servirti un invito per un bot personale...',
			COMMAND_INVITE: (client) => [
				`Per aggiungere ${client.user.username} al tuo server Discord:`,
				client.invite,
				util.codeBlock('', [
					'Il link sopra è generato richiedendo i permessi minimi per usare i comandi correnti.',
					'Sappiamo che non tutti i permessi sono richiesti per ogni server, non aver paura di modificare i permessi.',
					'Se proverai ad usare un comando che richieda più permessi di quelli garantiti, il bot te lo farà sapere.'
				].join(' ')),
				'Apri un problema su <https://github.com/dirigeants/klasa> se trovi qualsiasi bug.'
			]
		};
	}

};
