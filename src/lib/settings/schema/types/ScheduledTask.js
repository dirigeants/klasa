const SchemaType = require('./base/SchemaType');
const ScheduledTask = require('../../../schedule/ScheduledTask');
const { isObject } = require('../../../util/util');
const Type = require('../../../util/Type');

/**
 * class that resolves roles
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class ScheduledTaskType extends SchemaType {

	/**
	 * Resolves our data into a role
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @param {external:Guild} guild The guild to use for this resolver
	 * @returns {*} The resolved data
	 */
	async resolve(data) {
		if (data instanceof ScheduledTask) return data;
		if (isObject(data)) return this.deserialize(data);
		// This Type does not use language because it's used for internals
		throw new TypeError(`ScheduledTask#resolve expects an object as first argument. Received: ${new Type(data)}`);
	}

	serialize(data) {
		return data.toJSON();
	}

	deserialize(data) {
		return Promise.resolve(new ScheduledTask(this.client, data.taskName, data.time, data));
	}

}

module.exports = ScheduledTaskType;
