import { Piece, PieceOptions } from '@klasa/core';
import { ExtendableStore } from './ExtendableStore';
export declare type Constructor<T = unknown> = new (...args: readonly unknown[]) => T;
/**
 * Base class for all Klasa Extendables. See {@tutorial CreatingExtendables} for more information how to use this class
 * to build custom extendables.
 * @tutorial CreatingExtendables
 * @extends {Piece}
 */
export declare class Extendable extends Piece {
    /**
     * The static property descriptors of this extendable
     * @since 0.5.0
     */
    private staticPropertyDescriptors;
    /**
     * The instance property descriptors of this extendable
     * @since 0.5.0
     */
    private instancePropertyDescriptors;
    /**
     * The original property descriptors for each of the original classes
     * @since 0.5.0
     */
    private originals;
    /**
     * @since 0.0.1
     * @param store The extendable store
     * @param file The path from the pieces folder to the extendable file
     * @param directory The base directory to the pieces folder
     * @param options The options for this extendable
     */
    constructor(store: ExtendableStore, directory: string, files: readonly string[], options?: ExtendableOptions);
    /**
     * The discord classes this extendable applies to
     * @since 0.0.1
     */
    get appliesTo(): any[];
    /**
     * The init method to apply the extend method to the @klasa/core Class
     * @since 0.0.1
     */
    init(): Promise<void>;
    /**
     * Disables this piece
     * @since 0.0.1
     */
    disable(): this;
    /**
     * Enables this piece
     * @since 0.0.1
     * @param [init=false] If the piece is being init or not
     */
    enable(init?: boolean): this;
    /**
     * Defines the JSON.stringify behavior of this extendable.
     */
    toJSON(): Record<string, unknown>;
}
export interface ExtendableOptions extends PieceOptions {
    appliesTo?: readonly Constructor[];
}
export interface OriginalPropertyDescriptors {
    staticPropertyDescriptors: Record<string, PropertyDescriptor>;
    instancePropertyDescriptors: Record<string, PropertyDescriptor>;
}
