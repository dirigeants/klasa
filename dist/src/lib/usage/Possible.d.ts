/**
 * Represents a possibility in a usage Tag
 */
export declare class Possible {
    /**
     * The name of this possible
     * @since 0.2.1
     */
    name: string;
    /**
     * The type of this possible
     * @since 0.2.1
     */
    type: string;
    /**
     * The min of this possible
     * @since 0.2.1
     */
    min: number | null;
    /**
     * The max of this possible
     * @since 0.2.1
     */
    max: number | null;
    /**
     * The regex of this possible
     * @since 0.3.0
     */
    regex: RegExp | null;
    /**
     * @param regexResults The regex results from parsing the tag member
     * @since 0.2.1
     */
    constructor([, name, type, min, max, regex, flags]: readonly string[]);
    /**
     * Resolves a limit
     * @since 0.2.1
     * @param limit The limit to evaluate
     * @param limitType The type of limit
     */
    private static resolveLimit;
}
