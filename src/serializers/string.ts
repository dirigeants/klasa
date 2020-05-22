import { Serializer } from 'klasa';

export default class StringSerializer extends Serializer {

	deserialize(data) {
		return String(data);
	}

}
