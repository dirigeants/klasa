import { Serializer } from 'klasa';
export default class CoreSerializer extends Serializer {
    validate(data: unknown): Promise<string>;
}
