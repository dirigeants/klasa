import { RichDisplay, RichDisplayOptions } from './RichDisplay';
import { ReactionMethods, ReactionHandler, ReactionHandlerOptions } from './ReactionHandler';

import type { Message } from '@klasa/core';
import { Cache } from '@klasa/cache';

const choiceMethods = [
	ReactionMethods.One,
	ReactionMethods.Two,
	ReactionMethods.Three,
	ReactionMethods.Four,
	ReactionMethods.Five,
	ReactionMethods.Six,
	ReactionMethods.Seven,
	ReactionMethods.Eight,
	ReactionMethods.Nine,
	ReactionMethods.Ten
];

export interface Choice {
	name: string;
	body: string;
	inline: boolean;
}

/**
 * Klasa's RichMenu, for helping paginated embeds with reaction buttons
 */
export class RichMenu extends RichDisplay {

	/**
	 * The menu choices
	 * @since 0.6.0
	 */
	public choices: Choice[] = [];

	/**
	 * If options have been paginated yet
	 * @since 0.4.0
	 */
	private paginated = false;

	/**
	 * @param options The RichDisplay options
	 */
	public constructor(options: RichDisplayOptions) {
		super(options);

		this._emojis = new Cache([
			[ReactionMethods.One, '1️⃣'],
			[ReactionMethods.Two, '2️⃣'],
			[ReactionMethods.Three, '3️⃣'],
			[ReactionMethods.Four, '4️⃣'],
			[ReactionMethods.Five, '5️⃣'],
			[ReactionMethods.Six, '6️⃣'],
			[ReactionMethods.Seven, '7️⃣'],
			[ReactionMethods.Eight, '8️⃣'],
			[ReactionMethods.Nine, '9️⃣'],
			[ReactionMethods.Ten, '🔟'],
			...this._emojis
		]);
	}

	/**
	 * You cannot directly add pages in a RichMenu
	 * @since 0.4.0
	 */
	public addPage(): never {
		throw new Error('You cannot directly add pages in a RichMenu');
	}

	/**
	 * Adds a menu choice
	 * @since 0.6.0
	 * @param name The name of the choice
	 * @param body The description of the choice
	 * @param inline Whether the choice should be inline
	 */
	public addChoice(name: string, body: string, inline = false): this {
		this.choices.push({ name, body, inline });
		return this;
	}

	/**
	 * Runs this RichMenu
	 * @since 0.4.0
	 * @param KlasaMessage message A message to edit or use to send a new message with
	 * @param options The options to use with this RichMenu
	 */
	public async run(message: Message, options: ReactionHandlerOptions = {}): Promise<ReactionHandler> {
		if (this.choices.length < choiceMethods.length) {
			for (let i = this.choices.length; i < choiceMethods.length; i++) this._emojis.delete(choiceMethods[i]);
		}
		if (!this.paginated) this.paginate();
		return super.run(message, options);
	}

	/**
	 * Converts MenuOptions into display pages
	 * @since 0.4.0
	 */
	private paginate(): null {
		const page = this.pages.length;
		if (this.paginated) return null;
		super.addPage(embed => {
			for (let i = 0, choice = this.choices[i + (page * 10)]; i + (page * 10) < this.choices.length && i < 10; i++, choice = this.choices[i + (page * 10)]) {
				embed.addField(`(${i + 1}) ${choice.name}`, choice.body, choice.inline);
			}
			return embed;
		});
		if (this.choices.length > (page + 1) * 10) return this.paginate();
		this.paginated = true;
		return null;
	}

}
