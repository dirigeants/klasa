import { Serializer } from 'klasa';

export default class CoreSerializer extends Serializer {

	public async validate(data: unknown): Promise<string> {
		return String(data);
	}

}
