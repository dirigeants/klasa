const { resolveGuild, arraysStrictEquals, mergeObjects, makeObject } = require('../../util/util');

const checkForIndex = (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number';

class SettingsArray {
    constructor(entry) {
        Object.defineProperty(this, 'base', { value: null, writable: true });
        
        // The Entry this SettingArray refers to
        Object.defineProperty(this, 'entry', { value: entry });

        // The Cached data
        Object.defineProperty(this, 'data', { value: entry.default, enumerable: true, writable: true });
    }

    get gateway() {
        return this.base.gateway;
    }

    get(index) {
        if (index !== undefined && index !== null) {

        }
        return this.data.slice();
    }

    includes(value) {
        return this.data.slice().includes(value);
    }

    async update(values, options) {
        if (!options) options = { throwOnError: false, indexing: false };
		options.guild = resolveGuild(this.base.gateway.client, 'guild' in options ? options.guild : this.base.target);
        const language = options.guild ? options.guild.language : this.base.gateway.client.languages.default;

        if (!Array.isArray(values)) values = [values];

        const errors = [];     
        let promise = null;
        const { entry } = this;
        
        const onError = options.throwOnError ? (error) => { throw error; } : (error) => errors.push(error);

        const previous = this.get();

        try {
            // Not sure of a better way to do this, come back at a later time
            if (values.some(checkForIndex)) {
                if (!(values.every(checkForIndex))) throw "Indexing found. You must only use straight indexing or no indexing, not a mixture of both.";
                options.indexing = true;
            }
            promise = this._parse(entry, previous, values, options)
                .catch(onError);
        } catch (error) {
            if (options.throwOnError) throw error;
            errors.push(error);
        }

        // Has to be run before to actually catch errors, future error handling will be shoved into _parse() to actually reflect the individual values that error,
        // rather then just throwing the first error to the top and disgarding the rest
        const current = await promise;

        if (errors.length) return { errors, updated: [] };

        // The arrays were already equal.
        if (arraysStrictEquals(current, previous)) return;

        const result = [{ key: entry.path, value: current, entry }];
        
        // Save to Cache and DB
        this._save(result);
        
        return { errors, updated: result };
    }

    async _parse(entry, previous, next, options) {
        if (options.indexing) {
            next = await Promise.all(next.map(async ([i, v]) => ([i, entry.serializer.serialize(await entry.parse(v, options.guild))])));
        } else if (!Array.isArray(next)) {
            next = entry.serializer.serialize(await entry.parse(next, options.guild));
        } else next = await Promise.all(next.map(async val => entry.serializer.serialize(await entry.parse(val, options.guild))));

        const { action = 'auto' } = options;
        
        // Need to change logic behind indexing for this to work properly.
        if (action === 'overwrite') return next;

        const clone = previous.slice();

        // This value has an index paired with it
        if (options.indexing) {
            for (const val of next) {
                let index = val[0];
                if (clone.length === 0 && index > 0) {
                    throw `The current array is empty. The index must start at 0.`
                } else if (index < 0 || index > clone.length + 1) {
                    throw `The index ${index} is bigger than the current array. It must be a value in the range of 0..${clone.length + 1}.`;
                }
                clone[index] = val[1];
            }
        } else if (action === 'auto') {
            for (const val of next) {
                const index = clone.indexOf(val);
                if (index === -1) clone.push(val);
                else clone.splice(index, 1)
            }
        } else if (action === 'add') {
            for (const val of next) {
                if (clone.includes(val)) throw `The value ${val} for the key ${entry.path} already exists.`;
                clone.push(val);
            }
        } else if (action === 'remove') {
			for (const val of next) {
				const index = clone.indexOf(val);
				if (index === -1) throw `The value ${val} for the key ${entry.path} does not exist.`;
				clone.splice(index, 1);
			}
		} else {
			throw `The ${action} array action is not a valid SettingsUpdateArrayAction.`;
        }

		return clone;
    }

    async _save(results) {
		const status = this.base.existenceStatus;
        if (status === null) throw new Error('Cannot update out of sync.');

        // Update DB

        this._patch(results[0].value);
    }

    _patch(data) {
        if (!Array.isArray(data)) return;

        // Our Array was completely removed, so reset to schema default
        if (data.length === 0) this.data = this.entry.default;

        // Will probably be removed for a better option of only patching indexes that are updated or if new values are added (which would be denoted by index === -1)
        // For now, this will suffice
        this.data = [...data];
    }
}

module.exports = SettingsArray;