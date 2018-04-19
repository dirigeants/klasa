const { Argument } = require('klasa');

module.exports = class extends Argument {

	get date() {
		return this.store.get('date');
	}

	get duration() {
		return this.store.get('duration');
	}

	run(arg, possible, msg) {
		let date;
		try {
			date = this.date.run(arg, possible, msg);
		} catch (err) {
			try {
				date = this.duration.run(arg, possible, msg);
			} catch (error) {
				// noop
			}
		}
		if (date && !isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_TIME', possible.name);
	}

};
