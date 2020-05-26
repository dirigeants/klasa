import { Schema } from './Schema';
export declare class SchemaFolder extends Schema {
    /**
     * The schema that manages this instance
     */
    readonly parent: Schema | SchemaFolder;
    /**
     * The key of this entry relative to its parent
     */
    readonly key: string;
    /**
     * Constructs a SchemaFolder instance.
     * @param parent The schema that manages this instance
     * @param key This folder's key name
     */
    constructor(parent: Schema, key: string);
}
