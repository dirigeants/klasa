class Schedule {

	constructor(client) {
		/**
		 * @since 0.5.0
		 * @type {KlasaClient}
		 */
		this.client = client;
	}

	get _tasks() {
		return this.client.configs.schedule;
	}

	next() {
		return this._tasks[0];
	}

	set(type, data) {
		this._tasks.push(Object.assign(data, { type }));
		return this;
	}

	delete(id) {
		const index = this._tasks.findIndex(task => task.id === id);
		if (index !== -1) this._tasks.splice(index, 1);
		return this;
	}

}

module.exports = Schedule;
