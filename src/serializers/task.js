const { Serializer, ScheduledTask, Type, util: { isObject } } = require('klasa');

module.exports = class extends Serializer {

	constructor(...args) {
		super(...args, { aliases: ['schelduledtask'] });
	}

	deserialize(data) {
		if (data instanceof ScheduledTask) return data;
		if (isObject(data)) return new ScheduledTask(this.client, data.taskName, data.time, data);
		throw new TypeError(`Task#serialize expects an object as first argument. Received: ${new Type(data)}`);
	}

	serialize(value) {
		return value.toJSON();
	}

};
