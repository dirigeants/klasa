const { Serializer } = require('klasa');

module.exports = class extends Serializer {

	constructor(...args) {
		super(...args, { aliases: ['command', 'language'] });
	}

	async deserialize(data, entry, language) {
		const store = this.client[`${entry.type}s`];
		const parsed = typeof data === 'string' ? store.get(data) : data;
		if (parsed && parsed instanceof store.holds) return parsed;
		throw language.get('RESOLVER_INVALID_PIECE', entry.key, entry.type);
	}

	serialize(value) {
		return value.name;
	}

};
