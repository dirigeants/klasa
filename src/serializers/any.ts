import { Serializer } from 'klasa';

export default class AnySerializer extends Serializer {

	deserialize(data) {
		return data;
	}

}
