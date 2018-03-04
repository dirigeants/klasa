const Resolver = require('./Resolver');
const Duration = require('../util/Duration');

/**
 * The command argument resolver
 * @extends Resolver
 */
class ArgResolver extends Resolver {

	/**
	 * Resolves a one-off custom argument
	 * @since 0.5.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @param {Function} custom The custom resolver
	 * @returns {*}
	 */
	async custom(arg, possible, msg, custom) {
		try {
			const resolved = await custom(arg, possible, msg, msg.params);
			return resolved;
		} catch (err) {
			if (err) throw err;
			throw (msg ? msg.language : this.language).get('RESOLVER_INVALID_CUSTOM', possible.name, possible.type);
		}
	}

	/**
	 * Resolves a piece
	 * @since 0.3.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Piece}
	 */
	async piece(arg, possible, msg) {
		for (const store of this.client.pieceStores.values()) {
			const piece = store.get(arg);
			if (piece) return piece;
		}
		throw (msg ? msg.language : this.language).get('RESOLVER_INVALID_PIECE', possible.name, 'piece');
	}

	/**
	 * Resolves a store
	 * @since 0.3.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Store}
	 */
	async store(arg, possible, msg) {
		const store = this.client.pieceStores.get(arg);
		if (store) return store;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'store');
	}

	/**
	 * Resolves a command
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<Command>}
	 */
	command(...args) {
		return this.cmd(...args);
	}

	/**
	 * Resolves a command
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Command}
	 */
	async cmd(arg, possible, msg) {
		const command = this.client.commands.get(arg.toLowerCase());
		if (command) return command;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'command');
	}

	/**
	 * Resolves an event
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Event}
	 */
	async event(arg, possible, msg) {
		const event = this.client.events.get(arg);
		if (event) return event;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'event');
	}

	/**
	 * Resolves an extendable
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Extendable}
	 */
	async extendable(arg, possible, msg) {
		const extendable = this.client.extendables.get(arg);
		if (extendable) return extendable;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'extendable');
	}

	/**
	 * Resolves a finalizer
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Finalizer}
	 */
	async finalizer(arg, possible, msg) {
		const finalizer = this.client.finalizers.get(arg);
		if (finalizer) return finalizer;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'finalizer');
	}

	/**
	 * Resolves a inhibitor
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Inhibitor}
	 */
	async inhibitor(arg, possible, msg) {
		const inhibitor = this.client.inhibitors.get(arg);
		if (inhibitor) return inhibitor;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'inhibitor');
	}

	/**
	 * Resolves a monitor
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Monitor}
	 */
	async monitor(arg, possible, msg) {
		const monitor = this.client.monitors.get(arg);
		if (monitor) return monitor;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'monitor');
	}

	/**
	 * Resolves a language
	 * @since 0.2.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Language}
	 */
	async language(arg, possible, msg) {
		const language = this.client.languages.get(arg);
		if (language) return language;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'language');
	}

	/**
	 * Resolves a provider
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Provider}
	 */
	async provider(arg, possible, msg) {
		const provider = this.client.providers.get(arg);
		if (provider) return provider;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'provider');
	}

	/**
	 * Resolves a Task
	 * @since 0.5.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Task}
	 */
	async task(arg, possible, msg) {
		const task = this.client.tasks.get(arg);
		if (task) return task;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'task');
	}

	/**
	 * Resolves a message
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<KlasaMessage>}
	 */
	message(...args) {
		return this.msg(...args);
	}

	/**
	 * Resolves a message
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {KlasaMessage}
	 */
	async msg(arg, possible, msg) {
		const message = await super.msg(arg, msg.channel);
		if (message) return message;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_MSG', possible.name);
	}

	/**
	 * Resolves a user
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<KlasaUser>}
	 */
	mention(...args) {
		return this.user(...args);
	}

	/**
	 * Resolves a user
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {KlasaUser}
	 */
	async user(arg, possible, msg) {
		const user = await super.user(arg);
		if (user) return user;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_USER', possible.name);
	}

	/**
	 * Resolves a member
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {external:GuildMember}
	 */
	async member(arg, possible, msg) {
		const member = await super.member(arg, msg.guild);
		if (member) return member;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_MEMBER', possible.name);
	}

	/**
	 * Resolves a channel
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {external:Channel}
	 */
	async channel(arg, possible, msg) {
		const channel = await super.channel(arg);
		if (channel) return channel;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

	/**
	 * Resolves an emoji
	 * @since 0.5.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {external:Emoji}
	 */
	async emoji(arg, possible, msg) {
		const emoji = await super.emoji(arg);
		if (emoji) return emoji;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_EMOJI', possible.name);
	}

	/**
	 * Resolves a guild
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {KlasaGuild}
	 */
	async guild(arg, possible, msg) {
		const guild = await super.guild(arg);
		if (guild) return guild;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_GUILD', possible.name);
	}

	/**
	 * Resolves a role
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {external:Role}
	 */
	async role(arg, possible, msg) {
		const role = await super.role(arg, msg.guild);
		if (role) return role;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_ROLE', possible.name);
	}

	/**
	 * Resolves a literal
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {string}
	 */
	async literal(arg, possible, msg) {
		arg = arg.toLowerCase();
		if (arg === possible.name.toLowerCase()) return arg;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_LITERAL', possible.name);
	}

	/**
	 * Resolves a boolean
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<boolean>}
	 */
	boolean(...args) {
		return this.bool(...args);
	}

	/**
	 * Resolves a boolean
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {boolean}
	 */
	async bool(arg, possible, msg) {
		const boolean = await super.boolean(arg);
		if (boolean !== null) return boolean;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_BOOL', possible.name);
	}

	/**
	 * Resolves a string
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<string>}
	 */
	string(...args) {
		return this.str(...args);
	}

	/**
	 * Resolves a string
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {string}
	 */
	async str(arg, possible, msg) {
		const { min, max } = possible;
		return this.constructor.minOrMax(this.client, arg.length, min, max, possible, msg, 'RESOLVER_STRING_SUFFIX') ?
			arg :
			null;
	}

	/**
	 * Resolves a integer
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<number>}
	 */
	integer(...args) {
		return this.int(...args);
	}

	/**
	 * Resolves a integer
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {number}
	 */
	async int(arg, possible, msg) {
		const { min, max } = possible;
		arg = await super.integer(arg);
		if (arg === null) {
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_INT', possible.name);
		}
		return this.constructor.minOrMax(this.client, arg, min, max, possible, msg) ? arg : null;
	}

	/**
	 * Resolves a number
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<number>}
	 */
	num(...args) {
		return this.float(...args);
	}

	/**
	 * Resolves a number
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<number>}
	 */
	number(...args) {
		return this.float(...args);
	}

	/**
	 * Resolves a number
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {number}
	 */
	async float(arg, possible, msg) {
		const { min, max } = possible;
		arg = await super.float(arg);
		if (arg === null) {
			throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_FLOAT', possible.name);
		}
		if (this.constructor.minOrMax(this.client, arg, min, max, possible, msg)) return arg;
		return null;
	}

	/**
	 * Resolves an argument based on a regular expression
	 * @since 0.3.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {RegExpExecArray}
	 */
	async reg(arg, possible, msg) {
		const results = possible.regex.exec(arg);
		if (results !== null) return results;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_REGEX_MATCH', possible.name,
			possible.regex.toString());
	}

	/**
	 * Resolves an argument based on a regular expression
	 * @since 0.3.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<RegExpExecArray>}
	 */
	regex(...args) {
		return this.reg(...args);
	}

	/**
	 * Resolves an argument based on a regular expression
	 * @since 0.3.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Promise<RegExpExecArray>}
	 */
	regexp(...args) {
		return this.reg(...args);
	}

	/**
	 * Resolves a hyperlink
	 * @since 0.0.1
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {string}
	 */
	async url(arg, possible, msg) {
		const hyperlink = await super.url(arg);
		if (hyperlink !== null) return hyperlink;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_URL', possible.name);
	}

	/**
	 * Resolves a Date or Timestamp
	 * @since 0.5.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Date}
	 */
	async date(arg, possible, msg) {
		const date = new Date(arg);
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_DATE', possible.name);
	}

	/**
	 * Resolves a Date from a relative duration
	 * @since 0.5.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Date}
	 */
	async duration(arg, possible, msg) {
		const date = new Duration(arg).fromNow;
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_DURATION', possible.name);
	}

	/**
	 * Resolves a Date from a relative duration or timestamp
	 * @since 0.5.0
	 * @param {string} arg The argument to parse
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @returns {Date}
	 */
	async time(arg, possible, msg) {
		const date = await Promise.all([
			this.date(arg, possible, msg).catch(() => null),
			this.duration(arg, possible, msg).catch(() => null)
		]).then(ret => ret.find(Boolean));
		if (date && !isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw (msg ? msg.language : this.client.languages.default).get('RESOLVER_INVALID_TIME', possible.name);
	}

	/**
	 * Checks min and max values
	 * @since 0.0.1
	 * @param {KlasaClient} client The client of this bot
	 * @param {number} value The value to check against
	 * @param {?number} min The minimum value
	 * @param {?number} max The maximum value
	 * @param {number} possible The id of the current possible usage
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @param {string} suffix An error suffix
	 * @returns {boolean}
	 * @private
	 */
	static minOrMax(client, value, min, max, possible, msg, suffix) {
		suffix = suffix ? (msg ? msg.language : client.languages.default).get(suffix) : '';
		if (min && max) {
			if (value >= min && value <= max) return true;
			if (min === max) throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_EXACTLY', possible.name, min, suffix);
			throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_BOTH', possible.name, min, max, suffix);
		} else if (min) {
			if (value >= min) return true;
			throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_MIN', possible.name, min, suffix);
		} else if (max) {
			if (value <= max) return true;
			throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_MAX', possible.name, max, suffix);
		}
		return true;
	}

}

module.exports = ArgResolver;
