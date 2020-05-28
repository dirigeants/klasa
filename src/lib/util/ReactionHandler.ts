import { ReactionIterator, Message, MessageReaction, EmojiResolvable, User, Embed } from '@klasa/core';

import type { EventIteratorOptions } from '@klasa/event-iterator';
import type { RichMenu } from './RichMenu';
import type { RichDisplay } from './RichDisplay';

export interface ReactionHandlerOptions extends EventIteratorOptions<MessageReaction> {
	stop?: boolean;
	prompt?: string;
	startPage?: number;
	max?: number;
	maxEmojis?: number;
	maxUsers?: number;
	time?: number;
}

export class ReactionHandler extends ReactionIterator {

	public readonly display: RichMenu | RichDisplay;
	public readonly message: Message;
	public methodMap: Map<string, string>;
	public options: ReactionHandlerOptions;
	public currentPage: number;
	public prompt: string;
	public time: number;
	public selection: Promise<number | null>;
	public resolve?: (value: number | null) => void;
	public reject?: (error?: any) => void;
	public reactionsDone: boolean;
	public awaiting: boolean;

	public constructor(message: Message, display: RichMenu | RichDisplay, emojis: EmojiResolvable[], options: ReactionHandlerOptions = {}) {
		super(message, options);
		this.message = message;
		this.options = options;
		this.display = display;
		this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]): [string, string] => [value, key]));
		this.currentPage = this.options.startPage ?? 0;
		this.prompt = this.options.prompt ?? message.language.get('REACTIONHANDLER_PROMPT');
		this.time = typeof this.options.time === 'number' ? this.options.time : 30000;
		this.awaiting = false;
		this.selection = (this.display as RichMenu).emojis.zero ? new Promise((resolve, reject): void => {
			this.reject = reject;
			this.resolve = resolve;
		}) : Promise.resolve(null);
		this.reactionsDone = false;

		if (emojis.length) { this._queueEmojisReactions(emojis); } else {
			this.end();
			return;
		}
	}

	public end(): void {
        this.resolve?.(null);
        super.end();
	}

	public first(): void {
		this.currentPage = 0;
		this.update();
	}

	public back(): void {
		this.currentPage--;
		this.update();
	}

	public forward(): void {
		this.currentPage++;
		this.update();
	}

	public last(): void {
		this.currentPage = this.display.pages.length - 1;
		this.update();
	}

	public async jump(user: User): Promise<void> {
		if (this.awaiting) return;
		this.awaiting = true;
		const [message] = await this.message.channel.send({ data: { content: this.prompt } });
		const collected = await this.message.channel.awaitMessages({
			filter: (mess): boolean => mess.author === user,
			limit: 1,
			idle: this.time
		});
		this.awaiting = false;
		await message.delete();
		if (!collected.size) return;
		const newPage = parseInt((collected.firstValue as Message).content);
		(collected.firstValue as Message).delete();
		if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
			this.currentPage = newPage - 1;
			this.update();
		}
	}

	public info(): void {
		this.message.edit({ data: { embed: this.display.infoPage as Embed } });
	}

	public update(): void {
		this.message.edit({ data: { embed: this.display.pages[this.currentPage] } });
	}

	public async *[Symbol.asyncIterator](): AsyncIterableIterator<MessageReaction> {
		for await (const reaction of super[Symbol.asyncIterator]()) {

		}
	}

	private async _queueEmojisReactions(emojis: EmojiResolvable[]): Promise<unknown> {
		if (this.message.deleted) return this.end();
		if (this.ended) return this.message.reactions.remove();
		await this.message.reactions.add(emojis.shift() as EmojiResolvable);
		if (emojis.length) return this._queueEmojisReactions(emojis);
		this.reactionsDone = true;
		return null;
	}

}
