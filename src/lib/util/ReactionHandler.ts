import { ChannelType } from '@klasa/dapi-types';

import type { Message, ReactionIteratorOptions, User } from '@klasa/core';
import type { Cache } from '@klasa/cache';
import type { RichDisplay } from './RichDisplay';
import type { RichMenu } from './RichMenu';

export interface ReactionHandlerOptions extends ReactionIteratorOptions {
	startPage?: number;
	prompt?: string;
	jumpTimeout?: number;
}

export const enum ReactionMethods {
	First = 'first',
	Back = 'back',
	Forward = 'forward',
	Last = 'last',
	Jump = 'jump',
	Info = 'info',
	Stop = 'stop',
	One = 'one',
	Two = 'two',
	Three = 'three',
	Four = 'four',
	Five = 'five',
	Six = 'six',
	Seven = 'seven',
	Eight = 'eight',
	Nine = 'nine',
	Ten = 'ten'
}

export class ReactionHandler {

	public readonly selection: Promise<number | null>;

	private readonly message: Message;
	private readonly display: RichDisplay;
	private readonly methodMap: Map<string, ReactionMethods>;
	private readonly prompt: string;
	private readonly jumpTimeout: number;

	#ended = false;
	#awaiting = false;
	#currentPage: number;
	#resolve: ((value?: number | PromiseLike<number | null> | null | undefined) => void) | null = null;

	public constructor(message: Message, options: ReactionHandlerOptions, display: RichDisplay, emojis: Cache<ReactionMethods, string>) {
		if (message.channel.type === ChannelType.DM) throw new Error('RichDisplays and subclasses cannot be used in DMs, as they do not have enough permissions to perform in a UX friendly way.');
		this.message = message;
		this.display = display;
		this.methodMap = new Map(emojis.map((value, key) => [value, key]));
		this.prompt = options.prompt ?? message.language.get('REACTIONHANDLER_PROMPT');
		this.jumpTimeout = options.jumpTimeout ?? 30000;
		this.selection = emojis.has(ReactionMethods.One) ? new Promise(resolve => {
			this.#resolve = resolve;
		}) : Promise.resolve(null);
		this.#currentPage = options.startPage ?? 0;
		this.run([...emojis.values()], options);
	}

	public stop(): boolean {
		this.#ended = true;
		if (this.#resolve) this.#resolve(null);
		return true;
	}

	private choose(value: number): Promise<void | boolean> {
		if ((this.display as RichMenu).choices.length - 1 < value) return Promise.resolve();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.#resolve!(value);
		this.#ended = true;
		return Promise.resolve(true);
	}

	private async run(emojis: string[], options: ReactionIteratorOptions) {
		try {
			await this.setup(emojis);
			for await (const [reaction, user] of this.message.reactions.iterate(options)) {
				if (this.#ended) break;
				const method = this.methodMap.get((reaction.emoji.name ?? reaction.emoji.id) as string);
				if (!method) continue;
				const signals = await Promise.all([reaction.users.remove(user.id), (this.constructor as typeof ReactionHandler).methods.get(method)?.call(this, user)]);
				if (signals[1]) break;
			}
		} catch {
			// noop
		} finally {
			if (!this.message.deleted) {
				try {
					await this.message.reactions.remove();
				} catch (error) {
					this.message.client.emit('error', error);
				}
			}
		}
	}

	private async update(): Promise<void> {
		await this.message.edit(mb => mb.setEmbed(this.display.pages[this.#currentPage]));
	}

	private async setup(emojis: string[]): Promise<void> {
		if (this.message.deleted) throw new Error('Deleted');
		if (this.#ended) throw new Error('Ended');
		await this.message.reactions.add(emojis.shift() as string);
		if (emojis.length) return this.setup(emojis);
		return Promise.resolve();
	}

	/* eslint-disable no-invalid-this, func-names */
	private static methods: Map<ReactionMethods, (this: ReactionHandler, user: User) => Promise<void>> = new Map()
		.set(ReactionMethods.First, function (this: ReactionHandler): Promise<void> {
			this.#currentPage = 0;
			return this.update();
		})
		.set(ReactionMethods.Back, function (this: ReactionHandler): Promise<void> {
			if (this.#currentPage <= 0) return Promise.resolve();
			this.#currentPage--;
			return this.update();
		})
		.set(ReactionMethods.Forward, function (this: ReactionHandler): Promise<void> {
			if (this.#currentPage > this.display.pages.length - 1) return Promise.resolve();
			this.#currentPage++;
			return this.update();
		})
		.set(ReactionMethods.Last, function (this: ReactionHandler): Promise<void> {
			this.#currentPage = this.display.pages.length - 1;
			return this.update();
		})
		.set(ReactionMethods.Jump, async function (this: ReactionHandler, user: User): Promise<void> {
			if (this.#awaiting) return Promise.resolve();
			this.#awaiting = true;
			const [message] = await this.message.channel.send(mb => mb.setContent(this.prompt));
			const collected = await this.message.channel.awaitMessages({ filter: ([mess]) => mess.author === user, limit: 1, idle: this.jumpTimeout });
			this.#awaiting = false;
			await message.delete();
			const response = collected.firstValue;
			if (!response) return Promise.resolve();
			const newPage = parseInt(response.content);
			await response.delete();
			if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
				this.#currentPage = newPage - 1;
				return this.update();
			}
			return Promise.resolve();
		})
		.set(ReactionMethods.Info, async function (this: ReactionHandler): Promise<void> {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this.message.edit(mb => mb.setEmbed(this.display.infoPage!));
		})
		.set(ReactionMethods.Stop, function (this: ReactionHandler): Promise<boolean | void> {
			return Promise.resolve(this.stop());
		})
		.set(ReactionMethods.One, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(this.#currentPage * 10);
		})
		.set(ReactionMethods.Two, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(1 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Three, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(2 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Four, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(3 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Five, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(4 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Six, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(5 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Seven, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(6 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Eight, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(7 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Nine, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(8 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Ten, function (this: ReactionHandler): Promise<boolean | void> {
			return this.choose(9 + (this.#currentPage * 10));
		});
	/* eslint-enable no-invalid-this, func-names */

}
