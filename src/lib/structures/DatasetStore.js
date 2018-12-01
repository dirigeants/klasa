const Dataset = require('./Dataset');
const Store = require('./base/Store');

/**
 * Stores all the datasets
 * @extends Store
 */
class DatasetStore extends Store {

	/**
	 * Constructs our DatasetStore for use in Klasa
	 * @since 0.5.0
	 * @param {KlasaClient} client The klasa client initializing this store
	 */
	constructor(client) {
		super(client, 'datasets', Dataset);
	}

}

module.exports = DatasetStore;
