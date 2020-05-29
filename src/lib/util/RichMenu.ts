import { RichDisplay, RichDisplayEmojisObject, RichDisplayRunOptions } from './RichDisplay';

import type { Embed, EmojiResolvable, Message } from '@klasa/core';
import type { ReactionHandler } from './ReactionHandler';

export interface RichMenuEmojisObject extends RichDisplayEmojisObject {
	first: never;
	back: never;
	forward: never;
	last: never;
	jump: never;
	info: never;
	stop: never;
	zero: EmojiResolvable;
	one: EmojiResolvable;
	two: EmojiResolvable;
	three: EmojiResolvable;
	four: EmojiResolvable;
	five: EmojiResolvable;
	six: EmojiResolvable;
	seven: EmojiResolvable;
	eight: EmojiResolvable;
	nine: EmojiResolvable;
}

export interface MenuOptions {
	name: string;
	body: string;
	inline?: boolean;
}

export class RichMenu extends RichDisplay {

	public emojis!: RichMenuEmojisObject;

	public paginated: boolean;

	public options: MenuOptions[]

	public constructor(embed?: Embed) {
		super(embed);

		Object.assign(this.emojis, {
			zero: '0⃣',
			one: '1⃣',
			two: '2⃣',
			three: '3⃣',
			four: '4⃣',
			five: '5⃣',
			six: '6⃣',
			seven: '7⃣',
			eight: '8⃣',
			nine: '9⃣'
		});

		this.paginated = false;

		this.options = [];
	}

	public addPage(): never {
		throw new Error('You cannot directly add pages in a RichMenu');
	}

	public addOption(name: string, body: string, inline = false): this {
		this.options.push({ name, body, inline });
		return this;
	}

	public run(message: Message, options: RichDisplayRunOptions = {}): Promise<ReactionHandler> {
		if (!this.paginated) this._paginate();
		return super.run(message, options);
	}

	protected _determineEmojis(emojis: EmojiResolvable[], stop: boolean, jump: boolean, firstLast: boolean): EmojiResolvable[] {
		emojis.push(this.emojis.zero, this.emojis.one, this.emojis.two, this.emojis.three, this.emojis.four, this.emojis.five, this.emojis.six, this.emojis.seven, this.emojis.eight, this.emojis.nine);
		if (this.options.length < 10) emojis = emojis.slice(0, this.options.length);
		return super._determineEmojis(emojis, stop, jump, firstLast);
	}

	private _paginate(): null {
		const page = this.pages.length;
		if (this.paginated) return null;
		super.addPage((embed): Embed => {
			for (let i = 0, option = this.options[i + (page * 10)]; i + (page * 10) < this.options.length && i < 10; i++, option = this.options[i + (page * 10)]) {
				embed.addField(`(${i}) ${option.name}`, option.body, option.inline);
			}
			return embed;
		});
		if (this.options.length > (page + 1) * 10) return this._paginate();
		this.paginated = true;
		return null;
	}

}
