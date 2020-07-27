import type { Message, ReactionIteratorOptions, User } from '@klasa/core';
import type { Cache } from '@klasa/cache';
import type { RichDisplay } from './RichDisplay';
import type { RichMenu } from './RichMenu';

export interface ReactionHandlerOptions extends ReactionIteratorOptions {
	/**
	 * The page to start on
	 * @default 0
	 */
	startPage?: number;
	/**
	 * The text for the jump prompt
	 * @default this.message.language.get('REACTIONHANDLER_PROMPT')
	 */
	prompt?: string;
	/**
	 * The timeout for the jump prompt
	 * @default 30000
	 */
	jumpTimeout?: number;
	/**
	 * A callback to handle cleanup once this has ended
	 * @default () => {}
	 */
	onceDone?: () => void;
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

/**
 * Klasa's ReactionHandler, for handling RichDisplay and RichMenu reaction input
 */
export class ReactionHandler {

	/**
	 * The selection of a RichMenu (useless in a RichDisplay scenario)
	 * @since 0.4.0
	 */
	public readonly selection: Promise<number | null>;

	/**
	 * The message of the RichDisplay/RichMenu
	 * @since 0.6.0
	 */
	private readonly message: Message;

	/**
	 * The RichDisplay/RichMenu this Handler is for
	 * @since 0.4.0
	 */
	private readonly display: RichDisplay;

	/**
	 * An emoji to method map, to map custom emojis to static method names
	 * @since 0.4.0
	 */
	private readonly methodMap: Map<string, ReactionMethods>;

	/**
	 * The prompt to use when jumping pages
	 * @since 0.4.0
	 */
	private readonly prompt: string;

	/**
	 * The amount of time before the jump menu should close
	 * @since 0.4.0
	 */
	private readonly jumpTimeout: number;

	/**
	 * If this ReactionHandler has ended
	 * @since 0.6.0
	 */
	#ended = false;

	/**
	 * If we are awaiting a jump response
	 */
	#awaiting = false;

	/**
	 * The current page the display is on
	 * @since 0.4.0
	 */
	#currentPage: number;

	/**
	 * Causes this.selection to resolve
	 * @since 0.4.0
	 */
	#resolve: ((value?: number | PromiseLike<number | null> | null | undefined) => void) | null = null;

	/**
	 * @param message The message to track reactions from
	 * @param options The options for this reaction handler
	 * @param display The display this reaction handler is for
	 * @param emojis The emojis to manage this reaction handler
	 */
	public constructor(message: Message, options: ReactionHandlerOptions, display: RichDisplay, emojis: Cache<ReactionMethods, string>) {
		if (!message.guild) throw new Error('RichDisplays and subclasses cannot be used in DMs, as they do not have enough permissions to perform in a UX friendly way.');
		this.message = message;
		this.display = display;
		this.methodMap = new Map(emojis.map((value, key) => [value, key]));
		this.prompt = options.prompt ?? message.language.get('REACTIONHANDLER_PROMPT');
		this.jumpTimeout = options.jumpTimeout ?? 30000;
		this.selection = emojis.has(ReactionMethods.One) ? new Promise(resolve => {
			this.#resolve = resolve;
		}) : Promise.resolve(null);
		this.#currentPage = options.startPage ?? 0;
		this.run([...emojis.values()], options).then(options.onceDone);
	}

	/**
	 * Stops this ReactionHandler
	 * @since 0.6.0
	 */
	public stop(): boolean {
		this.#ended = true;
		if (this.#resolve) this.#resolve(null);
		return true;
	}

	/**
	 * Attempts to choose a value
	 * @param value The id of the choice made
	 */
	private choose(value: number): Promise<boolean> {
		if ((this.display as RichMenu).choices.length - 1 < value) return Promise.resolve(false);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.#resolve!(value);
		this.#ended = true;
		return Promise.resolve(true);
	}

	/**
	 * Runs this ReactionHandler
	 * @param emojis The emojis to react
	 * @param options The options for the Iterator
	 */
	private async run(emojis: string[], options: ReactionIteratorOptions): Promise<void> {
		try {
			this.setup(emojis);
			for await (const [reaction, user] of this.message.reactions.iterate(options)) {
				if (this.#ended) break;
				if (user === reaction.client.user) continue;
				const method = this.methodMap.get((reaction.emoji.name ?? reaction.emoji.id) as string);
				if (!method) continue;
				const signals = await Promise.all([reaction.users.remove(user.id), (this.constructor as typeof ReactionHandler).methods.get(method)?.call(this, user)]);
				if (signals[1]) break;
			}
		} catch {
			// noop
		} finally {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (!this.message.deleted && this.message.client.guilds.has(this.message.guild!.id)) {
				try {
					await this.message.reactions.remove();
				} catch (error) {
					this.message.client.emit('error', error);
				}
			}
		}
	}

	/**
	 * Updates the message.
	 * @since 0.4.0
	 */
	private async update(): Promise<boolean> {
		if (this.message.deleted) return true;
		await this.message.edit(mb => mb.setEmbed(this.display.pages[this.#currentPage]));
		return false;
	}

	/**
	 * Reacts the initial Emojis
	 * @param emojis The initial emojis left to react
	 */
	private async setup(emojis: string[]): Promise<boolean> {
		if (this.message.deleted) return this.stop();
		if (this.#ended) return true;
		try {
			await this.message.reactions.add(emojis.shift() as string);
		} catch {
			return this.stop();
		}
		if (emojis.length) return this.setup(emojis);
		return false;
	}

	/* eslint-disable no-invalid-this, func-names */

	/**
	 * The reaction methods
	 * @since 0.6.0
	 */
	private static methods: Map<ReactionMethods, (this: ReactionHandler, user: User) => Promise<boolean>> = new Map()
		.set(ReactionMethods.First, function (this: ReactionHandler): Promise<boolean> {
			this.#currentPage = 0;
			return this.update();
		})
		.set(ReactionMethods.Back, function (this: ReactionHandler): Promise<boolean> {
			if (this.#currentPage <= 0) return Promise.resolve(false);
			this.#currentPage--;
			return this.update();
		})
		.set(ReactionMethods.Forward, function (this: ReactionHandler): Promise<boolean> {
			if (this.#currentPage >= this.display.pages.length - 1) return Promise.resolve(false);
			this.#currentPage++;
			return this.update();
		})
		.set(ReactionMethods.Last, function (this: ReactionHandler): Promise<boolean> {
			this.#currentPage = this.display.pages.length - 1;
			return this.update();
		})
		.set(ReactionMethods.Jump, async function (this: ReactionHandler, user: User): Promise<boolean> {
			if (this.#awaiting) return Promise.resolve(false);
			this.#awaiting = true;
			const [message] = await this.message.channel.send(mb => mb.setContent(this.prompt));
			const collected = await this.message.channel.awaitMessages({ filter: ([mess]) => mess.author === user, limit: 1, idle: this.jumpTimeout });
			this.#awaiting = false;
			await message.delete();
			const response = collected.firstValue;
			if (!response) return Promise.resolve(false);
			const newPage = parseInt(response.content);
			await response.delete();
			if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
				this.#currentPage = newPage - 1;
				return this.update();
			}
			return Promise.resolve(false);
		})
		.set(ReactionMethods.Info, async function (this: ReactionHandler): Promise<boolean> {
			if (this.message.deleted) return true;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this.message.edit(mb => mb.setEmbed(this.display.infoPage!));
			return false;
		})
		.set(ReactionMethods.Stop, function (this: ReactionHandler): Promise<boolean> {
			return Promise.resolve(this.stop());
		})
		.set(ReactionMethods.One, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(this.#currentPage * 10);
		})
		.set(ReactionMethods.Two, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(1 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Three, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(2 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Four, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(3 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Five, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(4 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Six, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(5 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Seven, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(6 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Eight, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(7 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Nine, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(8 + (this.#currentPage * 10));
		})
		.set(ReactionMethods.Ten, function (this: ReactionHandler): Promise<boolean> {
			return this.choose(9 + (this.#currentPage * 10));
		});
	/* eslint-enable no-invalid-this, func-names */

}
