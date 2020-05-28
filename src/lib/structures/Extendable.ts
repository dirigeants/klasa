import { Piece, PieceOptions } from '@klasa/core';

import type { ExtendableStore } from './ExtendableStore';

export type Constructor<T = unknown> = new (...args: readonly unknown[]) => T;

/**
 * Base class for all Klasa Extendables. See {@tutorial CreatingExtendables} for more information how to use this class
 * to build custom extendables.
 * @tutorial CreatingExtendables
 * @extends {Piece}
 */
export class Extendable extends Piece {

	/**
	 * The static property descriptors of this extendable
	 * @since 0.5.0
	 */
	private staticPropertyDescriptors: Record<string, PropertyDescriptor>;

	/**
	 * The instance property descriptors of this extendable
	 * @since 0.5.0
	 */
	private instancePropertyDescriptors: Record<string, PropertyDescriptor>;

	/**
	 * The original property descriptors for each of the original classes
	 * @since 0.5.0
	 */
	private originals: Map<any, OriginalPropertyDescriptors>;

	/**
	 * @since 0.0.1
	 * @param store The extendable store
	 * @param file The path from the pieces folder to the extendable file
	 * @param directory The base directory to the pieces folder
	 * @param options The options for this extendable
	 */
	public constructor(store: ExtendableStore, directory: string, files: readonly string[], options: ExtendableOptions = {}) {
		super(store, directory, files, options);

		const staticPropertyNames = Object.getOwnPropertyNames(this.constructor)
			.filter(name => !['length', 'prototype', 'name'].includes(name));
		const instancePropertyNames = Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(name => name !== 'constructor');

		this.staticPropertyDescriptors = Object.assign({}, ...staticPropertyNames
			.map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor, name) })));

		this.instancePropertyDescriptors = Object.assign({}, ...instancePropertyNames
			.map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor.prototype, name) })));

		this.originals = new Map(options.appliesTo?.map(structure => [structure, {
			staticPropertyDescriptors: Object.assign({}, ...staticPropertyNames
				.map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure, name) || { value: undefined } }))),
			instancePropertyDescriptors: Object.assign({}, ...instancePropertyNames
				.map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure.prototype, name) || { value: undefined } })))
		}]));
	}

	/**
	 * The discord classes this extendable applies to
	 * @since 0.0.1
	 */
	public get appliesTo(): any[] {
		return [...this.originals.keys()];
	}

	/**
	 * The init method to apply the extend method to the @klasa/core Class
	 * @since 0.0.1
	 */
	public async init(): Promise<void> {
		if (this.enabled) this.enable(true);
	}

	/**
	 * Disables this piece
	 * @since 0.0.1
	 */
	public disable(): this {
		if (this.client.listenerCount('pieceDisabled')) this.client.emit('pieceDisabled', this);
		this.enabled = false;
		for (const [structure, originals] of this.originals) {
			Object.defineProperties(structure, originals.staticPropertyDescriptors);
			Object.defineProperties(structure.prototype, originals.instancePropertyDescriptors);
		}
		return this;
	}

	/**
	 * Enables this piece
	 * @since 0.0.1
	 * @param [init=false] If the piece is being init or not
	 */
	public enable(init = false): this {
		if (!init && this.client.listenerCount('pieceEnabled')) this.client.emit('pieceEnabled', this);
		this.enabled = true;
		for (const structure of this.originals.keys()) {
			Object.defineProperties(structure, this.staticPropertyDescriptors);
			Object.defineProperties(structure.prototype, this.instancePropertyDescriptors);
		}
		return this;
	}

	/**
	 * Defines the JSON.stringify behavior of this extendable.
	 */
	public toJSON(): Record<string, unknown> {
		return {
			...super.toJSON(),
			appliesTo: this.appliesTo.map(fn => fn.name)
		};
	}

}

export interface ExtendableOptions extends PieceOptions {
	appliesTo?: readonly Constructor[];
}

export interface OriginalPropertyDescriptors {
	staticPropertyDescriptors: Record<string, PropertyDescriptor>;
	instancePropertyDescriptors: Record<string, PropertyDescriptor>;
}
