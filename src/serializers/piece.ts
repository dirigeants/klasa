import { Serializer, SerializerUpdateContext, SerializerStore } from 'klasa';
import { Piece } from '@klasa/core';

export default class CoreSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['command', 'language'] });
	}

	public deserialize(data: string | Piece, { language, entry }: SerializerUpdateContext): Piece {
		const store = this.client[`${entry.type}s` as 'languages' | 'commands'];
		const parsed = typeof data === 'string' ? store.get(data) : data;
		if (parsed && parsed instanceof store.holds) return parsed;
		throw language.get('RESOLVER_INVALID_PIECE', entry.key, entry.type);
	}

	public serialize(value: Piece): string {
		return value.name;
	}

	public stringify(value: Piece): string {
		return value.name;
	}

}
