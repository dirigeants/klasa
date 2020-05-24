import { Serializer, SerializerUpdateContext } from 'klasa';
import { URL } from 'url';

export default class CoreSerializer extends Serializer {

	public deserialize(data: string | URL, { language, entry }: SerializerUpdateContext): string {
		const url = data instanceof URL ? data : new URL(data);
		if (url.protocol && url.hostname) return url.href;
		throw language.get('RESOLVER_INVALID_URL', entry.key);
	}

}
