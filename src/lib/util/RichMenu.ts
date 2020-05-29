import { RichDisplay, RichDisplayOptions } from './RichDisplay';
import { ReactionMethods, ReactionHandler, ReactionHandlerOptions } from './ReactionHandler';
import { Message } from '@klasa/core';

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

	public constructor(options: RichDisplayOptions) {
		super(options);

		this._emojis
			.set(ReactionMethods.One, '1️⃣')
			.set(ReactionMethods.Two, '2️⃣')
			.set(ReactionMethods.Three, '3️⃣')
			.set(ReactionMethods.Four, '4️⃣')
			.set(ReactionMethods.Five, '5️⃣')
			.set(ReactionMethods.Six, '6️⃣')
			.set(ReactionMethods.Seven, '7️⃣')
			.set(ReactionMethods.Eight, '8️⃣')
			.set(ReactionMethods.Nine, '9️⃣')
			.set(ReactionMethods.Ten, '🔟');
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
				embed.addField(`(${i}) ${choice.name}`, choice.body, choice.inline);
			}
			return embed;
		});
		if (this.choices.length > (page + 1) * 10) return this.paginate();
		this.paginated = true;
		return null;
	}

}
