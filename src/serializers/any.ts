import { Serializer } from 'klasa';

export class AnySerializer extends Serializer {

	deserialize(data) {
		return data;
	}

}
