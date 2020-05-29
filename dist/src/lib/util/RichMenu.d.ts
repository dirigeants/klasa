import { RichDisplay, RichDisplayOptions } from './RichDisplay';
import { ReactionHandler, ReactionHandlerOptions } from './ReactionHandler';
import type { Message } from '@klasa/core';
export interface Choice {
    name: string;
    body: string;
    inline: boolean;
}
/**
 * Klasa's RichMenu, for helping paginated embeds with reaction buttons
 */
export declare class RichMenu extends RichDisplay {
    /**
     * The menu choices
     * @since 0.6.0
     */
    choices: Choice[];
    /**
     * If options have been paginated yet
     * @since 0.4.0
     */
    private paginated;
    /**
     * @param options The RichDisplay options
     */
    constructor(options: RichDisplayOptions);
    /**
     * You cannot directly add pages in a RichMenu
     * @since 0.4.0
     */
    addPage(): never;
    /**
     * Adds a menu choice
     * @since 0.6.0
     * @param name The name of the choice
     * @param body The description of the choice
     * @param inline Whether the choice should be inline
     */
    addChoice(name: string, body: string, inline?: boolean): this;
    /**
     * Runs this RichMenu
     * @since 0.4.0
     * @param KlasaMessage message A message to edit or use to send a new message with
     * @param options The options to use with this RichMenu
     */
    run(message: Message, options?: ReactionHandlerOptions): Promise<ReactionHandler>;
    /**
     * Converts MenuOptions into display pages
     * @since 0.4.0
     */
    private paginate;
}
