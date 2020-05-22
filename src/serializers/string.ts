import { Serializer } from 'klasa';

export class StringSerializer extends Serializer {

	deserialize(data) {
		return String(data);
	}

}
