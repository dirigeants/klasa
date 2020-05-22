import { Serializer } from 'klasa';
import { URL } from 'url';

export class URLSerializer extends Serializer {

	deserialize(data, piece, language) {
		const url = URL.parse(data);
		if (url.protocol && url.hostname) return data;
		throw language.get('RESOLVER_INVALID_URL', piece.key);
	}

}
