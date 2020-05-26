"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayStorage = void 0;
const Schema_1 = require("../schema/Schema");
class GatewayStorage {
    constructor(client, name, options = {}) {
        /**
         * Whether or not this gateway has been initialized.
         */
        this.ready = false;
        this.client = client;
        this.name = name;
        this.schema = options.schema || new Schema_1.Schema();
        this._provider = options.provider || client.options.providers.default || '';
    }
    /**
     * The provider that manages this gateway's persistent data.
     */
    get provider() {
        var _a;
        return (_a = this.client.providers.get(this._provider)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Initializes the gateway.
     */
    async init() {
        // Gateways must not initialize twice.
        if (this.ready)
            throw new Error(`The gateway "${this.name}" has already been initialized.`);
        // Check the provider's existence.
        const { provider } = this;
        if (provider === null)
            throw new Error(`The gateway "${this.name}" could not find the provider "${this._provider}".`);
        this.ready = true;
        const errors = [...this._checkSchemaFolder(this.schema)];
        if (errors.length)
            throw new Error(`[SCHEMA] There is an error with your schema.\n${errors.join('\n')}`);
        // Initialize the defaults
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 2445
        this.schema.defaults._init(this.schema.defaults, this.schema);
        // Init the table
        const hasTable = await provider.hasTable(this.name);
        if (!hasTable)
            await provider.createTable(this.name);
        // Add any missing columns (NoSQL providers return empty array)
        const columns = await provider.getColumns(this.name);
        if (columns.length) {
            const promises = [];
            for (const entry of this.schema.values(true)) {
                if (!columns.includes(entry.path))
                    promises.push(provider.addColumn(this.name, entry));
            }
            await Promise.all(promises);
        }
        await this.sync();
    }
    /**
     * Runs a synchronization task for the gateway.
     */
    async sync() {
        return this;
    }
    /**
     * Get A JSON object containing the schema and the options.
     */
    toJSON() {
        return {
            name: this.name,
            provider: this._provider,
            schema: this.schema.toJSON()
        };
    }
    *_checkSchemaFolder(schema) {
        // Iterate over all the schema's values
        for (const value of schema.values()) {
            if (value instanceof Schema_1.Schema) {
                // Check the child's children values
                yield* this._checkSchemaFolder(value);
            }
            else {
                // Set the client and check if it is valid, afterwards freeze,
                // otherwise delete it from its parent and yield error message
                value.client = this.client;
                try {
                    value._check();
                    Object.freeze(value);
                }
                catch (error) {
                    // If errored, delete the key from its parent
                    value.parent.delete(value.key);
                    yield error.message;
                }
            }
        }
        // Set the schema as ready
        schema.ready = true;
    }
}
exports.GatewayStorage = GatewayStorage;
//# sourceMappingURL=GatewayStorage.js.map