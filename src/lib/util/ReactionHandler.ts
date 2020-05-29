import { EmojiResolvable, Message, MessageReaction, ReactionIterator, User, Embed } from '@klasa/core';

import type { RichDisplay, RichDisplayEmojisObject } from './RichDisplay';
import type { RichMenu, RichMenuEmojisObject } from './RichMenu';
import type { EventIteratorFilter } from '@klasa/event-iterator';

export interface ReactionHandlerOptions {
	filter?: (reaction: MessageReaction, user: User) => boolean;
	stop?: boolean;
	prompt?: string;
	startPage?: number;
	max?: number;
	time?: number;
}

export type ReactionHandlerFilter = (reaction: MessageReaction, user: User) => boolean;

type ReactionKeys = keyof RichMenuEmojisObject | keyof RichDisplayEmojisObject;

export class ReactionHandler {

	public message: Message;

	public display: RichMenu | RichDisplay;

	public methodMap: Map<EmojiResolvable, ReactionKeys>;

	public options: ReactionHandlerOptions;

	public currentPage: number;

	public filter: ReactionHandlerFilter;

	public prompt: string;

	public time: number;

	public ended: boolean;

	public awaiting: boolean;

	public selection: Promise<null | number>;

	public resolve?: (value: null | number) => void;

	public reject?: (err?: unknown) => void;

	public reactionsDone: boolean;

	#iterator: ReactionIterator | null;

	#emojis: EmojiResolvable[];

	public constructor(message: Message, filter: ReactionHandlerFilter, display: RichMenu | RichDisplay, options: ReactionHandlerOptions = {}, emojis: EmojiResolvable[] = []) {
		this.message = message;

		this.display = display;

		this.options = options;

		this.filter = filter;

		this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]): [EmojiResolvable, ReactionKeys] => [value, key as ReactionKeys]));

		this.#iterator = null;

		this.ended = false;

		this.currentPage = this.options.startPage ?? 0;

		this.prompt = this.options.prompt ?? message.language.get('REACTIONHANDLER_PROMPT');

		this.time = this.options.time ?? 30000;

		this.awaiting = false;

		this.selection = (this.display as RichMenu).emojis.zero ? new Promise((resolve, reject): void => {
			this.resolve = resolve;
			this.reject = reject;
		}) : Promise.resolve(null);

		this.reactionsDone = false;

		this.#emojis = emojis;
	}

	public first(): void {
		this.currentPage = 0;
		this.update();
	}

	public back(): void {
		if (this.currentPage <= 0) return;
		this.currentPage--;
		this.update();
	}

	public forward(): void {
		if (this.currentPage > this.display.pages.length - 1) return;
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
			filter: ([mess]): boolean => mess.author === user,
			limit: 1,
			idle: this.time
		});
		this.awaiting = false;
		await message.delete();
		if (!collected.size) return;
		const collectedMessage = collected.firstValue as Message;
		const newPage = parseInt(collectedMessage.content);
		collectedMessage.delete();
		if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
			this.currentPage = newPage - 1;
			this.update();
		}
	}

	public info(): void {
		this.message.edit({ data: { embed: this.display.infoPage as Embed } });
	}

	public stop(): void {
		/* eslint-disable no-unused-expressions */
		this.#iterator?.end();
		this.resolve?.(null);
		this.ended = true;
	}

	public zero(): void {
		if ((this.display as RichMenu).options.length - 1 < this.currentPage * 10) return;
		this.resolve?.(this.currentPage * 10);
		this.stop();
	}

	public one(): void {
		if ((this.display as RichMenu).options.length - 1 < 1 + (this.currentPage * 10)) return;
		this.resolve?.(1 + (this.currentPage * 10));
		this.stop();
	}

	public two(): void {
		if ((this.display as RichMenu).options.length - 1 < 2 + (this.currentPage * 10)) return;
		this.resolve?.(2 + (this.currentPage * 10));
		this.stop();
	}

	public three(): void {
		if ((this.display as RichMenu).options.length - 1 < 3 + (this.currentPage * 10)) return;
		this.resolve?.(3 + (this.currentPage * 10));
		this.stop();
	}

	public four(): void {
		if ((this.display as RichMenu).options.length - 1 < 4 + (this.currentPage * 10)) return;
		this.resolve?.(4 + (this.currentPage * 10));
		this.stop();
	}

	public five(): void {
		if ((this.display as RichMenu).options.length - 1 < 5 + (this.currentPage * 10)) return;
		this.resolve?.(5 + (this.currentPage * 10));
		this.stop();
	}

	public six(): void {
		if ((this.display as RichMenu).options.length - 1 < 6 + (this.currentPage * 10)) return;
		this.resolve?.(6 + (this.currentPage * 10));
		this.stop();
	}

	public seven(): void {
		if ((this.display as RichMenu).options.length - 1 < 7 + (this.currentPage * 10)) return;
		this.resolve?.(7 + (this.currentPage * 10));
		this.stop();
	}

	public eight(): void {
		if ((this.display as RichMenu).options.length - 1 < 8 + (this.currentPage * 10)) return;
		this.resolve?.(8 + (this.currentPage * 10));
		this.stop();
	}

	public nine(): void {
		if ((this.display as RichMenu).options.length - 1 < 9 + (this.currentPage * 10)) return;
		this.resolve?.(9 + (this.currentPage * 10));
		this.stop();
		/* eslint-enable no-unused-expressions */
	}

	public async run(): Promise<void> {
		if (!this.reactionsDone && this.#emojis.length) await this._queueEmojiReactions();
		const iterator = this.#iterator = new ReactionIterator(this.message, { filter: this.filter as unknown as EventIteratorFilter<[MessageReaction, User]>, limit: this.options.max, idle: this.time });
		for await (const [reaction, user] of iterator) {
			// TODO(Pyro): ask ao if I should check if the handler has ended, and if so, break.
			reaction.users.remove(user);
			this[this.methodMap.get((reaction.emoji.id ?? reaction.emoji.name) as string) as ReactionKeys](user);
		}

		if (this.reactionsDone && !this.message.deleted) this.message.reactions.remove();
	}

	private update(): void {
		this.message.edit({ data: { embed: this.display.pages[this.currentPage] } });
	}

	private async _queueEmojiReactions(emojis: EmojiResolvable[] = this.#emojis): Promise<unknown> {
		if (this.message.deleted) return this.stop();
		if (this.ended) return this.message.reactions.remove();
		await this.message.reactions.add(emojis.shift() as EmojiResolvable);
		if (emojis.length) return this._queueEmojiReactions(emojis);
		this.reactionsDone = true;
		return null;
	}

}
