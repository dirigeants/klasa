import { Piece, PieceOptions } from '@klasa/core';
import { InhibitorStore } from './InhibitorStore';
import { Command } from './Command';
import { KlasaMessage } from '../extensions/KlasaMessage';
/**
 * Base class for all Klasa Inhibitors. See {@tutorial CreatingInhibitors} for more information how to use this class
 * to build custom inhibitors.
 * @tutorial CreatingInhibitors
 * @extends Piece
 */
export declare abstract class Inhibitor extends Piece {
    /**
     * If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
     * @since 0.0.1
     */
    spamProtection: boolean;
    /**
     * @since 0.0.1
     * @param store The Inhibitor Store
     * @param file The path from the pieces folder to the inhibitor file
     * @param directory The base directory to the pieces folder
     * @param options Optional Inhibitor settings
     */
    constructor(store: InhibitorStore, directory: string, files: readonly string[], options?: InhibitorOptions);
    /**
     * The async wrapper for running inhibitors
     * @since 0.5.0
     * @param message The message that triggered this inhibitor
     * @param command The command to run
     */
    protected _run(message: KlasaMessage, command: Command): Promise<boolean | string | void>;
    /**
     * The run method to be overwritten in actual inhibitors
     * @since 0.0.1
     * @param message The message that triggered this inhibitor
     * @param command The command to run
     */
    abstract run(message: KlasaMessage, command: Command): boolean | string | void | Promise<boolean | string | void>;
    /**
     * Defines the JSON.stringify behavior of this inhibitor.
     */
    toJSON(): Record<string, any>;
}
export interface InhibitorOptions extends PieceOptions {
    spamProtection?: boolean;
}
