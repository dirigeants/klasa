import { AliasPiece, Guild } from '@klasa/core';
import type { Language } from './Language';
import type { SchemaEntry } from '../settings/schema/SchemaEntry';
export declare abstract class Serializer extends AliasPiece {
    /**
     * Resolve a value given directly from the {@link Settings#update} call.
     * @param data The data to resolve
     * @param context The context in which this serializer is called
     */
    validate(data: unknown, _context: SerializerUpdateContext): unknown;
    /**
     * Resolve a value given directly from the {@link Settings#resolve} call.
     * @param data The data to resolve
     * @param context The context in which this serializer is called
     */
    resolve(data: unknown, _context: SerializerUpdateContext): unknown;
    /**
     * The deserialize method to be overwritten in actual Serializers.
     * @param data The data to deserialize
     * @param context The context in which this serializer is called
     */
    deserialize(data: unknown, _context: SerializerUpdateContext): unknown;
    /**
     * The serialize method to be overwritten in actual Serializers.
     * @param data The data to serialize
     */
    serialize(data: unknown): unknown;
    /**
     * The stringify method to be overwritten in actual Serializers
     * @param data The data to stringify
     * @param guild The guild given for context in this call
     */
    stringify(data: unknown, _guild?: Guild | null): string;
    /**
     * Check the boundaries of a key's minimum or maximum.
     * @param value The value to check
     * @param entry The schema entry that manages the key
     * @param language The language that is used for this context
     */
    protected static minOrMax(value: number, { minimum, maximum, inclusive, key }: SchemaEntry, language: Language): boolean;
    /**
    * Standard regular expressions for matching mentions and snowflake ids
    */
    static regex: {
        userOrMember: RegExp;
        channel: RegExp;
        emoji: RegExp;
        role: RegExp;
        snowflake: RegExp;
    };
}
export interface SerializerUpdateContext {
    entry: SchemaEntry;
    language: Language;
    guild: Guild | null;
    extraContext: unknown;
}
