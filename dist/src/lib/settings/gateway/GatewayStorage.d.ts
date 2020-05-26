import { Schema, SchemaJson } from '../schema/Schema';
import type { Provider } from '../../structures/Provider';
import type { KlasaClient } from '../../Client';
export declare class GatewayStorage {
    /**
     * The client this gateway was created with.
     */
    readonly client: KlasaClient;
    /**
     * The name of this gateway.
     */
    readonly name: string;
    /**
     * The schema for this gateway.
     */
    readonly schema: Schema;
    /**
     * Whether or not this gateway has been initialized.
     */
    ready: boolean;
    /**
     * The provider's name that manages this gateway.
     */
    private readonly _provider;
    constructor(client: KlasaClient, name: string, options?: GatewayStorageOptions);
    /**
     * The provider that manages this gateway's persistent data.
     */
    get provider(): Provider | null;
    /**
     * Initializes the gateway.
     */
    init(): Promise<void>;
    /**
     * Runs a synchronization task for the gateway.
     */
    sync(): Promise<this>;
    /**
     * Get A JSON object containing the schema and the options.
     */
    toJSON(): GatewayStorageJson;
    private _checkSchemaFolder;
}
export interface GatewayStorageOptions {
    schema?: Schema;
    provider?: string;
}
export interface GatewayStorageJson {
    name: string;
    provider: string;
    schema: SchemaJson;
}
