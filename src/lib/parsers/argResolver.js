const Resolver = require('./Resolver');

/**
 * The command argument resolver
 * @extends Resolver
 */
class ArgResolver extends Resolver {

	/**
	 * Resolves a command
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Command}
	 */
	async command(...args) {
		return this.cmd(...args);
	}

	/**
	 * Resolves a command
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Command}
	 */
	async cmd(arg, currentUsage, possible, repeat) {
		const command = this.client.commands.get(arg);
		if (command) return command;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid command name.`;
	}

	/**
	 * Resolves an event
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Event}
	 */
	async event(arg, currentUsage, possible, repeat) {
		const event = this.client.events.get(arg);
		if (event) return event;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid event name.`;
	}

	/**
	 * Resolves a finalizer
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Finalizer}
	 */
	async finalizer(arg, currentUsage, possible, repeat) {
		const finalizer = this.client.finalizers.get(arg);
		if (finalizer) return finalizer;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid finalizer name.`;
	}

	/**
	 * Resolves a inhibitor
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Inhibitor}
	 */
	async inhibitor(arg, currentUsage, possible, repeat) {
		const inhibitor = this.client.inhibitors.get(arg);
		if (inhibitor) return inhibitor;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid inhibitor name.`;
	}

	/**
	 * Resolves a monitor
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Monitor}
	 */
	async monitor(arg, currentUsage, possible, repeat) {
		const monitor = this.client.monitors.get(arg);
		if (monitor) return monitor;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid monitor name.`;
	}

	/**
	 * Resolves a provider
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {Provider}
	 */
	async provider(arg, currentUsage, possible, repeat) {
		const provider = this.client.providers.get(arg);
		if (provider) return provider;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid provider name.`;
	}

	/**
	 * Resolves a message
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {Message} msg The message that triggered the command
	 * @returns {external:Message}
	 */
	message(...args) {
		return this.msg(...args);
	}

	/**
	 * Resolves a message
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {Message} msg The message that triggered the command
	 * @returns {external:Message}
	 */
	async msg(arg, currentUsage, possible, repeat, msg) {
		const message = await super.msg(arg, msg.channel);
		if (message) return message;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid message id.`;
	}

	/**
	 * Resolves a user
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {external:User}
	 */
	mention(...args) {
		return this.user(...args);
	}

	/**
	 * Resolves a user
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {external:User}
	 */
	async user(arg, currentUsage, possible, repeat) {
		const user = await super.user(arg);
		if (user) return user;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a mention or valid user id.`;
	}

	/**
	 * Resolves a member
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {Message} msg The message that triggered the command
	 * @returns {external:GuildMember}
	 */
	async member(arg, currentUsage, possible, repeat, msg) {
		const member = await super.member(arg, msg.guild);
		if (member) return member;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a mention or valid user id.`;
	}

	/**
	 * Resolves a channel
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {external:Channel}
	 */
	async channel(arg, currentUsage, possible, repeat) {
		const channel = await super.channel(arg);
		if (channel) return channel;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a channel tag or valid channel id.`;
	}

	/**
	 * Resolves a guild
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {external:Guild}
	 */
	async guild(arg, currentUsage, possible, repeat) {
		const guild = await super.guild(arg);
		if (guild) return guild;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid guild id.`;
	}

	/**
	 * Resolves a role
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {Message} msg The message that triggered the command
	 * @returns {external:Role}
	 */
	async role(arg, currentUsage, possible, repeat, msg) {
		const role = await super.role(arg, msg.guild);
		if (role) return role;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a role mention or role id.`;
	}

	/**
	 * Resolves a literal
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {string}
	 */
	async literal(arg, currentUsage, possible, repeat) {
		if (arg.toLowerCase() === currentUsage.possibles[possible].name.toLowerCase()) return arg.toLowerCase();
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw [
			`Your option did not literally match the only possibility: (${currentUsage.possibles.map(poss => poss.name).join(', ')})`,
			'This is likely caused by a mistake in the usage string.'
		].join('\n');
	}

	/**
	 * Resolves a boolean
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {boolean}
	 */
	boolean(...args) {
		return this.bool(...args);
	}

	/**
	 * Resolves a boolean
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {boolean}
	 */
	async bool(arg, currentUsage, possible, repeat) {
		const boolean = await super.boolean(arg);
		if (boolean !== null) return boolean;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be true or false.`;
	}

	/**
	 * Resolves a string
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {string}
	 */
	string(...args) {
		return this.str(...args);
	}

	/**
	 * Resolves a string
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {string}
	 */
	async str(arg, currentUsage, possible, repeat) {
		const { min, max } = currentUsage.possibles[possible];
		if (this.constructor.minOrMax(arg.length, min, max, currentUsage, possible, repeat, ' characters')) return arg;
		return null;
	}

	/**
	 * Resolves a integer
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {number}
	 */
	integer(...args) {
		return this.int(...args);
	}

	/**
	 * Resolves a integer
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {number}
	 */
	async int(arg, currentUsage, possible, repeat) {
		const { min, max } = currentUsage.possibles[possible];
		arg = await super.integer(arg);
		if (arg === null) {
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw `${currentUsage.possibles[possible].name} must be an integer.`;
		}
		if (this.constructor.minOrMax(arg, min, max, currentUsage, possible, repeat)) return arg;
		return null;
	}

	/**
	 * Resolves a number
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {number}
	 */
	num(...args) {
		return this.float(...args);
	}

	/**
	 * Resolves a number
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {number}
	 */
	number(...args) {
		return this.float(...args);
	}

	/**
	 * Resolves a number
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {number}
	 */
	async float(arg, currentUsage, possible, repeat) {
		const { min, max } = currentUsage.possibles[possible];
		arg = await super.float(arg);
		if (arg === null) {
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw `${currentUsage.possibles[possible].name} must be a valid number.`;
		}
		if (this.constructor.minOrMax(arg, min, max, currentUsage, possible, repeat)) return arg;
		return null;
	}

	/**
	 * Resolves a hyperlink
	 * @param {string} arg This arg
	 * @param {Object} currentUsage This current usage
	 * @param {number} possible This possible usage id
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @returns {string}
	 */
	async url(arg, currentUsage, possible, repeat) {
		const hyperlink = await super.url(arg);
		if (hyperlink !== null) return hyperlink;
		if (currentUsage.type === 'optional' && !repeat) return null;
		throw `${currentUsage.possibles[possible].name} must be a valid url.`;
	}

	/**
	 * Checks min and max values
	 * @param {number} value The value to check against
	 * @param {?number} min The minimum value
	 * @param {?number} max The maxiumum value
	 * @param {Object} currentUsage The current usage
	 * @param {number} possible The id of the current possible usage
	 * @param {boolean} repeat If it is a looping/repeating arg
	 * @param {string} suffix An error suffix
	 * @returns {boolean}
	 */
	static minOrMax(value, min, max, currentUsage, possible, repeat, suffix = '') {
		if (min && max) {
			if (value >= min && value <= max) return true;
			if (currentUsage.type === 'optional' && !repeat) return false;
			if (min === max) throw `${currentUsage.possibles[possible].name} must be exactly ${min}${suffix}.`;
			throw `${currentUsage.possibles[possible].name} must be between ${min} and ${max}${suffix}.`;
		} else if (min) {
			if (value >= min) return true;
			if (currentUsage.type === 'optional' && !repeat) return false;
			throw `${currentUsage.possibles[possible].name} must be greater than ${min}${suffix}.`;
		} else if (max) {
			if (value <= max) return true;
			if (currentUsage.type === 'optional' && !repeat) return false;
			throw `${currentUsage.possibles[possible].name} must be less than ${max}${suffix}.`;
		}
		return true;
	}

}

module.exports = ArgResolver;
