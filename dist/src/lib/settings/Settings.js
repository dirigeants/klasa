"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const SettingsFolder_1 = require("./SettingsFolder");
class Settings extends SettingsFolder_1.SettingsFolder {
    constructor(gateway, target, id) {
        super(gateway.schema);
        this.base = this;
        this.id = id;
        this.gateway = gateway;
        this.target = target;
        this.existenceStatus = 0 /* Unsynchronized */;
        this._init(this, this.schema);
    }
    /**
     * Creates a clone of this instance.
     */
    clone() {
        const clone = new Settings(this.gateway, this.target, this.id);
        clone._patch(this.toJSON());
        return clone;
    }
    /**
     * Sync the data from the database with the cache.
     * @param force Whether or not this should force a database synchronization
     */
    async sync(force = this.existenceStatus === 0 /* Unsynchronized */) {
        // If not force and the instance has already been synchronized with the database, return this
        if (!force && this.existenceStatus !== 0 /* Unsynchronized */)
            return this;
        // Push a synchronization task to the request handler queue
        const data = await this.gateway.requestHandler.push(this.id);
        if (data) {
            this.existenceStatus = 1 /* Exists */;
            this._patch(data);
            this.gateway.client.emit('settingsSync', this);
        }
        else {
            this.existenceStatus = 2 /* NotExists */;
        }
        return this;
    }
    /**
     * Delete this entry from the database and clean all the values to their defaults.
     */
    async destroy() {
        await this.sync();
        if (this.existenceStatus === 1 /* Exists */) {
            const { provider } = this.gateway;
            /* istanbul ignore if: Hard to coverage test the catch */
            if (provider === null)
                throw new Error('The provider was not available during the destroy operation.');
            await provider.delete(this.gateway.name, this.id);
            this.gateway.client.emit('settingsDelete', this);
            this._init(this, this.schema);
            this.existenceStatus = 2 /* NotExists */;
        }
        return this;
    }
}
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map