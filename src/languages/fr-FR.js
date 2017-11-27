const { Language, util } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			DEFAULT: (key) => `${key} n'a pas encore été traduit en 'fr-FR'.`,
			DEFAULT_LANGUAGE: 'Langue par défaut',
			SETTING_GATEWAY_EXPECTS_GUILD: 'Le paramètre <Guild> attend soit un identifiant soit une instance de serveur.',
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `La valeur '${data}' pour la clef '${key}' n'existe pas.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `La valeur '${data}' pour la clef '${key}' existe déjà.`,
			SETTING_GATEWAY_SPECIFY_VALUE: 'Vous devez spécifier une clef pour ajouter ou filtrer.',
			SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `La clef '${key}' n'est pas une matrice.`,
			SETTING_GATEWAY_KEY_NOEXT: (key) => `La clef '${key}' n'existe pas dans le schema de données actuel.`,
			SETTING_GATEWAY_INVALID_TYPE: 'Le paramètre \'type\' doit être soit \'add\' ou \'remove\'.',
			RESOLVER_INVALID_PIECE: (name, piece) => `${name} doit être un nom de ${piece} valide.`,
			RESOLVER_INVALID_MSG: (name) => `${name} doit être un identifiant de message valide.`,
			RESOLVER_INVALID_USER: (name) => `${name} doit être une mention ou un identifiant d'utilisateur valide.`,
			RESOLVER_INVALID_MEMBER: (name) => `${name} doit être une mention ou un identifiant d'utilisateur valide.`,
			RESOLVER_INVALID_CHANNEL: (name) => `${name} doit être un tag ou un identifiant de salon valide.`,
			RESOLVER_INVALID_GUILD: (name) => `${name} doit être un identifiant de serveur valide.`,
			RESOLVER_INVALID_ROLE: (name) => `${name} doit être une mention ou un identifiant de rôle.`,
			RESOLVER_INVALID_LITERAL: (name) => `Votre option ne correspond pas à la seule possibilité : ${name}`,
			RESOLVER_INVALID_BOOL: (name) => `${name} doit être vrai ou faux.`,
			RESOLVER_INVALID_INT: (name) => `${name} doit être un entier.`,
			RESOLVER_INVALID_FLOAT: (name) => `${name} doit être un nombre valide.`,
			RESOLVER_INVALID_URL: (name) => `${name} doit être une url valide.`,
			RESOLVER_STRING_SUFFIX: ' caractères',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} doit être exactement ${min}${suffix}.`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} doit être entre ${min} et ${max}${suffix}.`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} doit être plus grand que ${min}${suffix}.`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} doit être plus petit que ${max}${suffix}.`,
			COMMANDMESSAGE_MISSING: 'Il manque au moins un argument à la fin de l\'entrée.',
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} est un argument requis.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Il manque une option requise : (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `Votre option ne correspond à aucune des possibilités : (${possibles})`,
			// eslint-disable-next-line max-len
			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time) => `${tag} | **${error}** | Vous avez **${time}** secondes pour répondre à ce message avec un argument valide. Tapez **"ABORT"** pour annuler ce message.`,
			MONITOR_COMMAND_HANDLER_ABORTED: 'Annulé',
			INHIBITOR_COOLDOWN: (remaining) => `Vous venez d'utiliser cette commande. Vous pourrez à nouveau utiliser cette commande dans ${remaining} secondes.`,
			INHIBITOR_DISABLED: 'Cette commande est actuellement désactivée',
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `Permissions insuffisantes, il manque : **${missing}**`,
			INHIBITOR_PERMISSIONS: 'Vous n\'avez pas la permission d\'utiliser cette commmande',
			// eslint-disable-next-line max-len
			INHIBITOR_REQUIRED_SETTINGS: (settings) => `Votre serveur n'a pas le${settings.length > 1 ? 's' : ''} paramètre${settings.length > 1 ? 's' : ''} **${settings.join(', ')}** et ne peux pas s'exécuter.`,
			INHIBITOR_RUNIN: (types) => `Cette commande est uniquement disponible dans les salons ${types}`,
			INHIBITOR_RUNIN_NONE: (name) => `La commande ${name} n'est pas configurée pour s'exécuter dans un salon.`,
			COMMAD_UNLOAD: (type, name) => `✅ ${type} déchargé : ${name}`,
			COMMAND_TRANSFER_ERROR: '❌ Ce fichier a déjà été transféré ou n\'a jamais existé.',
			COMMAND_TRANSFER_SUCCESS: (type, name) => `✅ ${type} transféré avec succès : ${name}`,
			COMMAND_TRANSFER_FAILED: (type, name) => `Le transfert de ${type} : ${name} au Client a échoué. Veuillez vérifier votre Console.`,
			COMMAND_RELOAD: (type, name) => `✅ ${type} rechargé : ${name}`,
			COMMAND_RELOAD_ALL: (type) => `✅ Tous les ${type} ont été rechargés.`,
			COMMAND_REBOOT: 'Redémarrage...',
			COMMAND_PING: 'Ping ?',
			COMMAND_PINGPONG: (diff, ping) => `Pong ! (L'aller-retour a pris : ${diff}ms. Pulsation : ${ping}ms.)`,
			COMMAND_INVITE_SELFBOT: 'Pourquoi auriez-vous besoin d\'un lien d\'invitation pour un selfbot...',
			COMMAND_INVITE: (client) => [
				`Pour ajouter ${client.user.username} à votre serveur discord :`,
				client.invite,
				util.codeBlock('', [
					'Le lien ci-dessus est généré de façon à demander le minimum de permissions requises pour utiliser toutes les commandes.',
					'Je sais que toutes les permissions ne sont pas désirées pour tous les serveurs, donc n\'ayez pas peur de décocher des cases.',
					'Si vous essayez d\'utiliser une commande nécéssitant plus de permissions que celles que vous avez accordées au bot, il vous le fera savoir'
				].join(' ')),
				'Veuillez soumettre un problème à <https://github.com/dirigeants/klasa> si vous trouvez un bug.'
			],
			COMMAND_INFO: [
				"Klasa est un framework 'plug-and-play' qui étend la librairie Discord.js.",
				'Une grande partie du code est modularisée, ce qui permet aux développeurs de modifier Klasa pour répondre à leurs besoins.',
				'',
				'Les fonctionnalités de Klasa comprennent :',
				'• Temps de chargement rapide avec le support de l\'ES7 (Async/Await)',
				'• Paramètres par serveur, qui peuvent être étendus avec votre propre code',
				'• Système de commandes personnalisable avec l\'analyse automatique de l\'usage ainsi qu\'un téléchargement et rechargement de modules faciles à utiliser',
				'• "Moniteurs" qui peuvent observer et agir sur les messages, comme un évenement message normal (Filtre à Injures, Spam Protection, etc)',
				'• "Inhibiteurs" qui peuvent empêcher l\'exécution d\'une commande en fonction de paramètres (Permissions, Blacklists, etc)',
				'• "Fournisseurs" qui vous permettent de vous connecter à une base de données externe de votre choix.',
				'• "Finaliseurs" qui s\'exécutent après une commande réussie.',
				'• "Extendables", code qui agit passivement. Ils ajoutent des propriétés et des méthodes aux classes existantes de Discord.js.',
				'• "Langages", qui vous permettent de localiser votre bot.',
				'',
				'Nous aspirons à être un framework personnalisable à 100% pour répondre à tous les publics. Nous faisons de fréquentes mises-à-jour et corrections de bugs.',
				'Si vous vous intéressez à nous, consultez notre site https://klasa.js.org'
			],
			COMMAND_HELP_DM: '📥 | Les commandes ont été envoyées dans vos MPs.',
			COMMAND_HELP_NODM: '❌ | Vous avez désactivé vos MPs, je ne peux pas vous envoyer les commandes.',
			COMMAND_ENABLE: (type, name) => `+ ${type} activé avec succès : ${name}`,
			COMMAND_DISABLE: (type, name) => `+ ${type} désactivé avec succès : ${name}`,
			COMMAND_DISABLE_WARN: 'Vous ne voulez probablement pas désactiver cela, car vous ne serez plus capable d\'exécuter une commande pour le réactiver',
			COMMAND_CONF_NOKEY: 'Vous devez fournir une clef',
			COMMAND_CONF_NOVALUE: 'Vous devez fournir une valeur',
			COMMAND_CONF_ADDED: (value, key) => `La valeur \`${value}\` a été ajoutée avec succès à la clef : **${key}**`,
			COMMAND_CONF_UPDATED: (key, response) => `La clef **${key}** a été mise à jour avec succès : \`${response}\``,
			COMMAND_CONF_KEY_NOT_ARRAY: 'Cette clef n\'est pas une matrice. Utilisez plutôt l\'action \'reset\'.',
			COMMAND_CONF_REMOVE: (value, key) => `La valeur \`${value}\` a été otée avec succès de la clef : **${key}**`,
			COMMAND_CONF_GET_NOEXT: (key) => `La clef **${key}** ne semble pas exister.`,
			COMMAND_CONF_GET: (key, value) => `La valeur pour la clef **${key}** est : \`${value}\``,
			COMMAND_CONF_RESET: (key, response) => `La clef **${key}** a été réinitialisée à : \`${response}\``
		};
	}

};
