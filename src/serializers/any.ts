import { Serializer } from 'klasa';

export default class CoreSerializer extends Serializer {

	public deserialize(data: unknown): unknown {
		return data;
	}

}
