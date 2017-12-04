const Possible = require('./Possible');

/**
 * Represents a usage Tag
 */
class Tag {

	/**
	 * @since 0.2.1
	 * @param {string} members The tag contents to parse
	 * @param {number} count The position of the tag in the usage string
	 * @param {boolean} required The type of tag (required or optional)
	 */
	constructor(members, count, required) {
		/**
		 * The type of this tag
		 * @since 0.2.1
		 * @type {string}
		 */
		this.type = required ? 'required' : 'optional';

		/**
		 * The possibilities of this tag
		 * @since 0.2.1
		 * @type {Possible[]}
		 */
		this.possibles = Tag.parseMembers(members, count);
	}

	/**
	 * Parses members into usable possibles
	 * @since 0.2.1
	 * @param {string} members The tag contents to parse
	 * @param {number} count The position of the tag in the usage string
	 * @returns {Possible[]}
	 * @private
	 */
	static parseMembers(members, count) {
		const literals = [];
		const types = [];
		members = Tag.parseTrueMembers(members);
		return members.map((member, i) => {
			const current = `${members}: at tag #${count} at bound #${i + 1}`;
			let possible;
			try {
				possible = new Possible(/^([^:]+)(?::([^{}/]+))?(?:{([^,]+)?(?:,(.+))?})?(?:\/(.+)\/(\w+)?)?$/i.exec(member));
			} catch (err) {
				if (typeof err === 'string') throw `${current}: ${err}`;
				throw `${current}: invalid syntax, non specific`;
			}
			if (possible.type === 'literal') {
				if (literals.includes(possible.name)) throw `${current}: there can't be two literals with the same text.`;
				literals.push(possible.name);
			} else if (members.length > 1) {
				if (['str', 'string'].includes(possible.type) && members.length - 1 !== i) throw `${current}: the String type is vague, you must specify it at the last bound`;
				if (types.includes(possible.type)) throw `${current}: there can't be two bounds with the same type (${possible.type})`;
				types.push(possible.type);
			}
			return possible;
		});
	}

	/**
	 * Parses raw members true members
	 * @since 0.2.1
	 * @param {string} members The tag contents to parse
	 * @returns {string[]}
	 * @private
	 */
	static parseTrueMembers(members) {
		const trueMembers = [];
		let regex = false;
		let current = '';
		for (const char of members) {
			if (char === '/') regex = !regex;
			if (char !== '|' || regex) {
				current += char;
			} else {
				trueMembers.push(current);
				current = '';
			}
		}
		trueMembers.push(current);
		return trueMembers;
	}

}

module.exports = Tag;
