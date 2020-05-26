import { Possible } from './Possible';
import { KlasaMessage } from '../extensions/KlasaMessage';
export declare const enum TagRequirement {
    Optional = 0,
    SemiRequired = 1,
    Required = 2
}
/**
 * Represents a Tag's response.
 * @since 0.5.0
 */
export interface TagResponse {
    /**
     * @since 0.5.0
     * @param message The message.
     * @param possible The possible.
     */
    (message: KlasaMessage, possible: Possible): string;
}
/**
 * Represents a usage Tag
 */
export declare class Tag {
    /**
     * The type of this tag
     * @since 0.5.0
     */
    required: number;
    /**
     * If this tag is repeating
     * @since 0.5.0
     */
    repeat: boolean;
    /**
     * The possibilities of this tag
     * @since 0.2.1
     */
    possibles: Possible[];
    /**
     * The custom response defined for this possible
     * @since 0.5.0
     */
    response: string | TagResponse | null;
    /**
     * @since 0.2.1
     * @param members The tag contents to parse
     * @param count The position of the tag in the usage string
     * @param required The type of tag
     */
    constructor(members: string, count: number, required: TagRequirement);
    /**
     * Registers a response
     * @since 0.5.0
     * @param name The argument name the response is for
     * @param response The custom response
     */
    register(name: string, response: string | TagResponse): boolean;
    /**
     * Parses members into usable possibles
     * @since 0.2.1
     * @param rawMembers The tag contents to parse
     * @param count The position of the tag in the usage string
     */
    private static parseMembers;
    /**
     * Parses raw members true members
     * @since 0.2.1
     * @param members The tag contents to parse
     */
    private static parseTrueMembers;
    /**
     * Standard regular expressions for matching usage tags
     * @since 0.5.0
     */
    private static pattern;
}
