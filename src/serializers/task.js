const { Serializer, ScheduledTask, Type, util: { isObject } } = require('klasa');

module.exports = class extends Serializer {

	constructor(...args) {
		super(...args, { aliases: ['scheduledtask'] });
	}

	deserialize(data) {
		if (data instanceof ScheduledTask) return data;
		if (isObject(data)) {
			return new ScheduledTask(this.client, data.taskName, data.repeat || data.time,
				{ id: data.id, catchUp: data.catchUp, data: data.data, time: data.time });
		}
		throw new TypeError(`Task#serialize expects an object as first argument. Received: ${new Type(data)}`);
	}

	serialize(value) {
		return value.toJSON();
	}

};
