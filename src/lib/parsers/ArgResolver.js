const Resolver = require('./Resolver');

/**
 * The command argument resolver
 * @extends Resolver
 */
class ArgResolver extends Resolver {

	/**
	 * Resolves a piece
	 * @since 0.3.0
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Piece}
	 */
	async piece(arg, currentUsage, possible, repeat, msg) {
		for (const store of this.client.pieceStores.values()) {
			const piece = store.get(arg);
			if (piece) return piece;
		}
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.language).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'piece');
	}

	/**
	 * Resolves a store
	 * @since 0.3.0
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Store}
	 */
	async store(arg, currentUsage, possible, repeat, msg) {
		const store = this.client.pieceStores.get(arg);
		if (store) return store;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'store');
	}

	/**
	 * Resolves a command
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Command}
	 */
	async command(...args) {
		return this.cmd(...args);
	}

	/**
	 * Resolves a command
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Command}
	 */
	async cmd(arg, currentUsage, possible, repeat, msg) {
		const command = this.client.commands.get(arg);
		if (command) return command;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'command');
	}

	/**
	 * Resolves an event
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Event}
	 */
	async event(arg, currentUsage, possible, repeat, msg) {
		const event = this.client.events.get(arg);
		if (event) return event;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'event');
	}

	/**
	 * Resolves an extendable
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Extendable}
	 */
	async extendable(arg, currentUsage, possible, repeat, msg) {
		const extendable = this.client.extendables.get(arg);
		if (extendable) return extendable;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'extendable');
	}

	/**
	 * Resolves a finalizer
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Finalizer}
	 */
	async finalizer(arg, currentUsage, possible, repeat, msg) {
		const finalizer = this.client.finalizers.get(arg);
		if (finalizer) return finalizer;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'finalizer');
	}

	/**
	 * Resolves a inhibitor
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Inhibitor}
	 */
	async inhibitor(arg, currentUsage, possible, repeat, msg) {
		const inhibitor = this.client.inhibitors.get(arg);
		if (inhibitor) return inhibitor;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'inhibitor');
	}

	/**
	 * Resolves a monitor
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Monitor}
	 */
	async monitor(arg, currentUsage, possible, repeat, msg) {
		const monitor = this.client.monitors.get(arg);
		if (monitor) return monitor;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'monitor');
	}

	/**
	 * Resolves a language
	 * @since 0.2.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Language}
	 */
	async language(arg, currentUsage, possible, repeat, msg) {
		const language = this.client.languages.get(arg);
		if (language) return language;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'language');
	}
	/**
	 * Resolves a provider
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?Provider}
	 */
	async provider(arg, currentUsage, possible, repeat, msg) {
		const provider = this.client.providers.get(arg);
		if (provider) return provider;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, 'provider');
	}

	/**
	 * Resolves a message
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?KlasaMessage}
	 */
	message(...args) {
		return this.msg(...args);
	}

	/**
	 * Resolves a message
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?KlasaMessage}
	 */
	async msg(arg, currentUsage, possible, repeat, msg) {
		const message = await super.msg(arg, msg.channel);
		if (message) return message;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_MSG', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a user
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?KlasaUser}
	 */
	mention(...args) {
		return this.user(...args);
	}

	/**
	 * Resolves a user
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?KlasaUser}
	 */
	async user(arg, currentUsage, possible, repeat, msg) {
		const user = await super.user(arg);
		if (user) return user;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_USER', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a member
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?external:GuildMember}
	 */
	async member(arg, currentUsage, possible, repeat, msg) {
		const member = await super.member(arg, msg.guild);
		if (member) return member;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_MEMBER', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a channel
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?external:Channel}
	 */
	async channel(arg, currentUsage, possible, repeat, msg) {
		const channel = await super.channel(arg);
		if (channel) return channel;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves an emoji
	 * @since 0.5.0
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?external:Emoji}
	 */
	async emoji(arg, currentUsage, possible, repeat, msg) {
		const emoji = await super.emoji(arg);
		if (emoji) return emoji;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_EMOJI', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a guild
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?KlasaGuild}
	 */
	async guild(arg, currentUsage, possible, repeat, msg) {
		const guild = await super.guild(arg);
		if (guild) return guild;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_GUILD', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a role
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?external:Role}
	 */
	async role(arg, currentUsage, possible, repeat, msg) {
		const role = await super.role(arg, msg.guild);
		if (role) return role;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_ROLE', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a literal
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	async literal(arg, currentUsage, possible, repeat, msg) {
		if (arg.toLowerCase() === currentUsage.possibles[possible].name.toLowerCase()) return arg.toLowerCase();
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_LITERAL', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a boolean
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?boolean}
	 */
	boolean(...args) {
		return this.bool(...args);
	}

	/**
	 * Resolves a boolean
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?boolean}
	 */
	async bool(arg, currentUsage, possible, repeat, msg) {
		const boolean = await super.boolean(arg);
		if (boolean !== null) return boolean;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_BOOL', currentUsage.possibles[possible].name);
	}

	/**
	 * Resolves a string
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	string(...args) {
		return this.str(...args);
	}

	/**
	 * Resolves a string
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	async str(arg, currentUsage, possible, repeat, msg) {
		const { min, max } = currentUsage.possibles[possible];
		if (this.constructor.minOrMax(arg.length, min, max, currentUsage, possible, repeat, msg, (msg ? msg.language : this.client.languages.default).get('RESOLVER_STRING_SUFFIX'))) return arg;
		return null;
	}

	/**
	 * Resolves a integer
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?number}
	 */
	integer(...args) {
		return this.int(...args);
	}

	/**
	 * Resolves a integer
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?number}
	 */
	async int(arg, currentUsage, possible, repeat, msg) {
		const { min, max } = currentUsage.possibles[possible];
		arg = await super.integer(arg);
		if (arg === null) {
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_INT', currentUsage.possibles[possible].name);
		}
		if (this.constructor.minOrMax(arg, min, max, currentUsage, possible, repeat, msg)) return arg;
		return null;
	}

	/**
	 * Resolves a number
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?number}
	 */
	num(...args) {
		return this.float(...args);
	}

	/**
	 * Resolves a number
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?number}
	 */
	number(...args) {
		return this.float(...args);
	}

	/**
	 * Resolves a number
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?number}
	 */
	async float(arg, currentUsage, possible, repeat, msg) {
		const { min, max } = currentUsage.possibles[possible];
		arg = await super.float(arg);
		if (arg === null) {
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_FLOAT', currentUsage.possibles[possible].name);
		}
		if (this.constructor.minOrMax(arg, min, max, currentUsage, possible, repeat, msg)) return arg;
		return null;
	}

	/**
	 * Resolves an argument based on a regular expression
	 * @since 0.3.0
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	async reg(arg, currentUsage, possible, repeat, msg) {
		const results = currentUsage.possibles[possible].regex.exec(arg);
		if (results !== null) return results;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_REGEX_MATCH', currentUsage.possibles[possible].name, currentUsage.possibles[possible].regex.toString());
	}

	/**
	 * Resolves an argument based on a regular expression
	 * @since 0.3.0
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	regex(...args) {
		return this.reg(...args);
	}

	/**
	 * Resolves an argument based on a regular expression
	 * @since 0.3.0
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	regexp(...args) {
		return this.reg(...args);
	}

	/**
	 * Resolves a hyperlink
	 * @since 0.0.1
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {?string}
	 */
	async url(arg, currentUsage, possible, repeat, msg) {
		const hyperlink = await super.url(arg);
		if (hyperlink !== null) return hyperlink;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_URL', currentUsage.possibles[possible].name);
	}

	/**
	 * Checks min and max values
	 * @since 0.0.1
	 * @param {number} value The value to check against
	 * @param {?number} min The minimum value
	 * @param {?number} max The maximum value
	 * @param {Object} currentUsage The current usage
	 * @param {number} possible The id of the current possible usage
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @param {string} suffix An error suffix
	 * @returns {boolean}
	 * @private
	 */
	static minOrMax(value, min, max, currentUsage, possible, repeat, msg, suffix = '') {
		if (min && max) {
			if (value >= min && value <= max) return true;
			if (currentUsage.type === 'optional' && !repeat) return false;
			if (min === max) throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_MINMAX_EXACTLY', currentUsage.possibles[possible].name, min, suffix);
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_MINMAX_BOTH', currentUsage.possibles[possible].name, min, max, suffix);
		} else if (min) {
			if (value >= min) return true;
			if (currentUsage.type === 'optional' && !repeat) return false;
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_MINMAX_MIN', currentUsage.possibles[possible].name, min, suffix);
		} else if (max) {
			if (value <= max) return true;
			if (currentUsage.type === 'optional' && !repeat) return false;
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_MINMAX_MAX', currentUsage.possibles[possible].name, max, suffix);
		}
		return true;
	}

}

module.exports = ArgResolver;
