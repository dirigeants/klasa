import { RichDisplay, RichDisplayOptions } from './RichDisplay';
import { ReactionMethods } from './ReactionHandler';

export class RichMenu extends RichDisplay {

	public choices: string[] = [];

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

}
